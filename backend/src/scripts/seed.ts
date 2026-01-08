import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Command line argument parsing
interface SeedConfig {
  mode: 'force' | 'merge' | 'r2-only';
  debug: boolean;
  batchSize: number;
}

function parseArgs(): SeedConfig {
  const args = process.argv.slice(2);
  const config: SeedConfig = {
    mode: 'merge',
    debug: false,
    batchSize: 50
  };

  for (const arg of args) {
    if (arg === '--force') {
      config.mode = 'force';
    } else if (arg === '--merge') {
      config.mode = 'merge';
    } else if (arg === '--r2-only') {
      config.mode = 'r2-only';
    } else if (arg === '--debug') {
      config.debug = true;
    } else if (arg.startsWith('--batch-size=')) {
      config.batchSize = parseInt(arg.split('=')[1]) || 50;
    }
  }

  return config;
}

// R2 Configuration
interface R2Config {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  publicDomain?: string;
  enabled: boolean;
}

function getR2Config(): R2Config {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;

  const enabled = !!(accountId && accessKeyId && secretAccessKey && bucketName && publicDomain);

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain,
    enabled
  };
}

const config = parseArgs();
const r2Config = getR2Config();

interface ImageFile {
  filename: string;
  gender: 'male' | 'female';
  ageGroup: 'adult' | 'child';
  estimatedAge: number;
  url: string;
  thumbnailUrl: string;
  source: 'local' | 'r2';
}

interface SeedStats {
  existingImages: number;
  existingRankings: number;
  processedFiles: number;
  createdImages: number;
  createdRankings: number;
  skippedImages: number;
  errors: string[];
}

// Parse filename to extract metadata and generate URLs
function parseImageFilename(filename: string, r2Images?: Map<string, string>): ImageFile | null {
  const match = filename.match(/^(AF|AM|CF|CM)(\d+)\.jpg$/);
  if (!match) return null;
  
  const [, prefix] = match;
  
  let gender: 'male' | 'female';
  let ageGroup: 'adult' | 'child';
  let estimatedAge: number;
  
  switch (prefix) {
    case 'AF':
      gender = 'female';
      ageGroup = 'adult';
      estimatedAge = 25; // Average adult age
      break;
    case 'AM':
      gender = 'male';
      ageGroup = 'adult';
      estimatedAge = 25;
      break;
    case 'CF':
      gender = 'female';
      ageGroup = 'child';
      estimatedAge = 16; // Teen age
      break;
    case 'CM':
      gender = 'male';
      ageGroup = 'child';
      estimatedAge = 16;
      break;
    default:
      return null;
  }
  
  // Determine URL based on whether image exists in R2
  let url: string;
  let thumbnailUrl: string;
  let source: 'local' | 'r2';
  
  if (r2Images && r2Images.has(filename)) {
    // Use R2 URL
    url = r2Images.get(filename)!;
    thumbnailUrl = url; // Use same URL for thumbnail
    source = 'r2';
  } else {
    // Use local URL
    url = `/sample-images/${filename}`;
    thumbnailUrl = `/sample-images/${filename}`;
    source = 'local';
  }
  
  return {
    filename,
    gender,
    ageGroup,
    estimatedAge,
    url,
    thumbnailUrl,
    source
  };
}

// R2 Client for checking uploaded images
class R2ImageChecker {
  private s3Client?: S3Client;
  private enabled: boolean;
  
  constructor(r2Config: R2Config) {
    this.enabled = r2Config.enabled;
    
    if (this.enabled) {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: r2Config.accessKeyId!,
          secretAccessKey: r2Config.secretAccessKey!,
        },
      });
    }
  }
  
  async getUploadedImages(): Promise<Map<string, string> | undefined> {
    if (!this.enabled || !this.s3Client || !r2Config.bucketName || !r2Config.publicDomain) {
      return undefined;
    }
    
    try {
      console.log('🔍 Checking Cloudflare R2 for uploaded images...');
      
      const imageMap = new Map<string, string>();
      let continuationToken: string | undefined;
      let totalFound = 0;
      
      do {
        const command = new ListObjectsV2Command({
          Bucket: r2Config.bucketName,
          Prefix: 'sample-images/',
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        });
        
        const response = await this.s3Client.send(command);
        
        if (response.Contents) {
          for (const obj of response.Contents) {
            if (obj.Key && obj.Key.endsWith('.jpg')) {
              const filename = path.basename(obj.Key);
              const publicUrl = `https://${r2Config.publicDomain}/${obj.Key}`;
              imageMap.set(filename, publicUrl);
              totalFound++;
            }
          }
        }
        
        continuationToken = response.NextContinuationToken;
      } while (continuationToken);
      
      console.log(`✅ Found ${totalFound} images in Cloudflare R2`);
      return imageMap;
      
    } catch (error) {
      console.warn(`⚠️  Failed to check R2 images: ${error}`);
      console.warn('Continuing with local URLs...');
      return undefined;
    }
  }
}

async function seedSampleImages() {
  console.log('🌱 Starting database seeding...\n');
  console.log(`Mode: ${config.mode}`);
  console.log(`R2 enabled: ${r2Config.enabled}`);
  console.log(`Batch size: ${config.batchSize}`);
  
  const stats: SeedStats = {
    existingImages: 0,
    existingRankings: 0,
    processedFiles: 0,
    createdImages: 0,
    createdRankings: 0,
    skippedImages: 0,
    errors: []
  };
  
  try {
    // 1. Create default trophy config
    console.log('📊 Creating default trophy configuration...');
    await prisma.trophyConfig.upsert({
      where: { configName: 'default' },
      update: {},
      create: {
        configName: 'default',
        winGain: 35,
        lossPenalty: 25,
        targetMean: 1500,
        targetStd: 430,
        fadeWidth: 300,
        learningRate: 0.05
      }
    });
    console.log('✅ Trophy config created');

    // 2. Handle existing data based on mode
    if (config.mode === 'force') {
      console.log('🧹 Clearing existing sample images (--force mode)...');
      await prisma.combinedRanking.deleteMany({
        where: { sampleImageId: { not: null } }
      });
      await prisma.sampleImageRanking.deleteMany({});
      await prisma.sampleImage.deleteMany({});
      console.log('✅ Existing sample images cleared');
    } else {
      // Check existing data
      const [existingImageCount, existingRankingCount] = await Promise.all([
        prisma.sampleImage.count(),
        prisma.sampleImageRanking.count()
      ]);
      stats.existingImages = existingImageCount;
      stats.existingRankings = existingRankingCount;
      console.log(`📊 Found ${existingImageCount} existing images, ${existingRankingCount} existing rankings`);
    }

    // 3. Initialize R2 checker and get uploaded images
    const r2Checker = new R2ImageChecker(r2Config);
    let r2Images: Map<string, string> | undefined;
    
    if (config.mode !== 'force' && r2Config.enabled) {
      r2Images = await r2Checker.getUploadedImages();
    }

    // 4. Get image sources based on mode
    let files: string[] = [];
    
    if (config.mode === 'r2-only') {
      if (!r2Images) {
        throw new Error('R2 not available but --r2-only mode specified');
      }
      files = Array.from(r2Images.keys()).sort();
      console.log(`📸 Using ${files.length} images from R2 only`);
    } else {
      // Read local directory
      const sampleImagesDir = process.env.NODE_ENV === 'production' 
        ? path.join(process.cwd(), 'sample_images')
        : path.join(process.cwd(), '../sample_images');
      console.log(`📁 Reading sample images from: ${sampleImagesDir}`);
      
      if (!fs.existsSync(sampleImagesDir)) {
        if (config.mode === 'merge' && r2Images && r2Images.size > 0) {
          console.log(`⚠️  Local directory not found, using ${r2Images.size} R2 images only`);
          files = Array.from(r2Images.keys()).sort();
        } else {
          throw new Error(`Sample images directory not found: ${sampleImagesDir}`);
        }
      } else {
        files = fs.readdirSync(sampleImagesDir)
          .filter(file => file.endsWith('.jpg'))
          .sort(); // Sort for consistent ordering
        
        console.log(`📸 Found ${files.length} sample images locally`);
        if (r2Images) {
          console.log(`🔗 ${r2Images.size} images available in R2`);
        }
      }
    }
    
    // 5. Get existing images from database for duplicate checking
    const existingImages = await prisma.sampleImage.findMany({
      select: { url: true, id: true }
    });
    const existingUrls = new Set(existingImages.map(img => img.url));
    
    // 6. Process images in batches to avoid overwhelming the database
    const totalBatches = Math.ceil(files.length / config.batchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * config.batchSize;
      const end = Math.min(start + config.batchSize, files.length);
      const batch = files.slice(start, end);
      
      console.log(`\n🔄 Processing batch ${batchIndex + 1}/${totalBatches} (${start + 1}-${end})...`);
      
      const sampleImageData: any[] = [];
      
      for (const filename of batch) {
        try {
          stats.processedFiles++;
          
          const imageInfo = parseImageFilename(filename, r2Images);
          if (!imageInfo) {
            console.warn(`⚠️  Skipping invalid filename: ${filename}`);
            stats.skippedImages++;
            continue;
          }
          
          // Check for duplicates
          if (existingUrls.has(imageInfo.url)) {
            if (config.debug) {
              console.log(`⏭️  Skipping existing image: ${filename}`);
            }
            stats.skippedImages++;
            continue;
          }
          
          sampleImageData.push({
            url: imageInfo.url,
            thumbnailUrl: imageInfo.thumbnailUrl,
            gender: imageInfo.gender,
            estimatedAge: imageInfo.estimatedAge,
            source: imageInfo.source === 'r2' ? 'curated' : 'generated',
            description: `${imageInfo.ageGroup} ${imageInfo.gender}`,
            isActive: true
          });
          
          // Add to existing URLs to prevent duplicates within this batch
          existingUrls.add(imageInfo.url);
          
        } catch (error) {
          const errorMsg = `Failed to process ${filename}: ${error}`;
          console.error(`❌ ${errorMsg}`);
          stats.errors.push(errorMsg);
        }
      }
      
      if (sampleImageData.length === 0) {
        console.log(`⏭️  No new images to create in batch ${batchIndex + 1}`);
        continue;
      }
      
      // Insert sample images
      try {
        const createdImages = await prisma.sampleImage.createMany({
          data: sampleImageData,
          skipDuplicates: true
        });
        
        stats.createdImages += createdImages.count;
        console.log(`✅ Created ${createdImages.count} sample images in batch ${batchIndex + 1}`);
        
        // Create rankings for the images we just inserted
        const imageIds = await prisma.sampleImage.findMany({
          where: {
            url: {
              in: sampleImageData.map(img => img.url)
            }
          },
          select: { id: true }
        });
        
        if (imageIds.length > 0) {
          const rankingData = imageIds.map(image => ({
            sampleImageId: image.id,
            currentPercentile: 50.0,
            totalComparisons: 0,
            wins: 0,
            losses: 0,
            bradleyTerryScore: 0.5,
            trophyScore: 0,
            hiddenBradleyTerryScore: 0,
            targetTrophyScore: null,
            confidence: 0.0
          }));
          
          const createdRankings = await prisma.sampleImageRanking.createMany({
            data: rankingData,
            skipDuplicates: true
          });
          
          stats.createdRankings += createdRankings.count;
          console.log(`✅ Created ${createdRankings.count} sample image rankings in batch ${batchIndex + 1}`);
        }
        
      } catch (error) {
        const errorMsg = `Failed to create images in batch ${batchIndex + 1}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        stats.errors.push(errorMsg);
      }
      
      // Add a small delay between batches to prevent connection overload
      if (batchIndex < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // 7. Summary and final statistics
    const finalCounts = await Promise.all([
      prisma.sampleImage.count(),
      prisma.sampleImageRanking.count(),
      prisma.sampleImage.groupBy({
        by: ['gender'],
        _count: { id: true }
      })
    ]);
    
    const [totalImages, totalRankings, genderBreakdown] = finalCounts;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETED');
    console.log('='.repeat(60));
    console.log('📊 Final Statistics:');
    console.log(`   Processed files: ${stats.processedFiles}`);
    console.log(`   Created images: ${stats.createdImages}`);
    console.log(`   Created rankings: ${stats.createdRankings}`);
    console.log(`   Skipped images: ${stats.skippedImages}`);
    console.log(`   Errors: ${stats.errors.length}`);
    console.log('');
    console.log(`   Total images in database: ${totalImages}`);
    console.log(`   Total rankings in database: ${totalRankings}`);
    console.log('   Gender breakdown:');
    genderBreakdown.forEach(group => {
      console.log(`     ${group.gender}: ${group._count.id} images`);
    });
    
    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      stats.errors.slice(0, 10).forEach(error => {
        console.log(`   ${error}`);
      });
      if (stats.errors.length > 10) {
        console.log(`   ... and ${stats.errors.length - 10} more errors`);
      }
    }
    
    // 8. Create combined rankings for sample images (if we created new ones)
    if (stats.createdImages > 0) {
      console.log('\n🔄 Creating combined rankings for new sample images...');
      
      // Get all sample images for combined rankings
      const sampleImages = await prisma.sampleImage.findMany({
        include: { ranking: true }
      });
      
      // Check which ones already have combined rankings
      const existingCombinedRankings = await prisma.combinedRanking.findMany({
        where: { sampleImageId: { not: null } },
        select: { sampleImageId: true }
      });
      const existingCombinedIds = new Set(existingCombinedRankings.map(cr => cr.sampleImageId));
      
      const sampleImagesNeedingRankings = sampleImages.filter(img => !existingCombinedIds.has(img.id));
      
      if (sampleImagesNeedingRankings.length > 0) {
        const combinedRankingData = sampleImagesNeedingRankings.map(sampleImage => ({
          sampleImageId: sampleImage.id,
          photoId: null,
          userId: null,
          gender: sampleImage.gender,
          currentPercentile: 50.0,
          totalComparisons: 0,
          wins: 0,
          losses: 0,
          bradleyTerryScore: 0.5,
          trophyScore: 0,
          hiddenBradleyTerryScore: 0,
          targetTrophyScore: null,
          confidence: 0.0
        }));
        
        // Process combined rankings in batches
        const combinedBatches = Math.ceil(combinedRankingData.length / config.batchSize);
        for (let i = 0; i < combinedBatches; i++) {
          const start = i * config.batchSize;
          const end = Math.min(start + config.batchSize, combinedRankingData.length);
          const batch = combinedRankingData.slice(start, end);
          
          try {
            await prisma.combinedRanking.createMany({
              data: batch,
              skipDuplicates: true
            });
            
            console.log(`✅ Created combined rankings batch ${i + 1}/${combinedBatches}`);
          } catch (error) {
            const errorMsg = `Failed to create combined rankings batch ${i + 1}: ${error}`;
            console.error(`❌ ${errorMsg}`);
            stats.errors.push(errorMsg);
          }
        }
        
        const totalCombined = await prisma.combinedRanking.count({
          where: { sampleImageId: { not: null } }
        });
        console.log(`✅ Total combined rankings for sample images: ${totalCombined}`);
      } else {
        console.log('⏭️  All sample images already have combined rankings');
      }
    }
    
    console.log('\n🏆 Trophy system is ready!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    console.log('\n📊 Partial Statistics:');
    console.log(`   Processed files: ${stats.processedFiles}`);
    console.log(`   Created images: ${stats.createdImages}`);
    console.log(`   Created rankings: ${stats.createdRankings}`);
    console.log(`   Skipped images: ${stats.skippedImages}`);
    console.log(`   Errors: ${stats.errors.length}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Help text function
function showHelp() {
  console.log('🌱 Sample Image Seeding Script');
  console.log('');
  console.log('Usage: npm run db:seed [options]');
  console.log('');
  console.log('Options:');
  console.log('  --force        Clear all existing data before seeding (destructive)');
  console.log('  --merge        Only add missing images, preserve existing ones (default)');
  console.log('  --r2-only      Only populate from Cloudflare R2, ignore local files');
  console.log('  --debug        Show detailed progress information');
  console.log('  --batch-size=N Set batch size for processing (default: 50)');
  console.log('  --help         Show this help message');
  console.log('');
  console.log('Environment variables (for R2 integration):');
  console.log('  CLOUDFLARE_R2_ACCOUNT_ID       Your Cloudflare account ID');
  console.log('  CLOUDFLARE_R2_ACCESS_KEY_ID    R2 access key ID');
  console.log('  CLOUDFLARE_R2_SECRET_ACCESS_KEY R2 secret access key');
  console.log('  CLOUDFLARE_R2_BUCKET_NAME      R2 bucket name');
  console.log('  CLOUDFLARE_R2_PUBLIC_DOMAIN    R2 public domain for URLs');
  console.log('');
  console.log('Examples:');
  console.log('  npm run db:seed                # Merge mode (safe)');
  console.log('  npm run db:seed -- --force     # Clear and reseed everything');
  console.log('  npm run db:seed -- --r2-only   # Only use R2 images');
  console.log('  npm run db:seed -- --debug     # Show detailed progress');
}

// Check for help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Run the seed function
seedSampleImages()
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    console.log('\nFor help, run: npm run db:seed -- --help');
    process.exit(1);
  });