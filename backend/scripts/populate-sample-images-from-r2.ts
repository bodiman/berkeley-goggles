import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface R2ImageInfo {
  originalFilename: string;
  imageId: string;
  gender: string;
  estimatedAge: number;
  mainUrl: string;
  thumbnailUrl?: string;
  r2Key?: string;
  thumbnailKey?: string;
}

interface PopulationStats {
  metadataProcessed: number;
  imagesFound: number;
  recordsCreated: number;
  recordsSkipped: number;
  errors: string[];
}

class SampleImagePopulator {
  private config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicDomain: string;
  };
  private s3Client: S3Client;
  private stats: PopulationStats = {
    metadataProcessed: 0,
    imagesFound: 0,
    recordsCreated: 0,
    recordsSkipped: 0,
    errors: [],
  };

  constructor() {
    this.config = {
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      publicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!,
    };

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  private parseGenderFromFilename(filename: string): string {
    // Parse gender from filename patterns like AF1.jpg, AM123.jpg, etc.
    const match = filename.match(/^(AF|AM|CF|CM)\d+\.jpg$/i);
    if (!match) return 'female'; // default fallback
    
    const prefix = match[1].toUpperCase();
    return (prefix === 'AF' || prefix === 'CF') ? 'female' : 'male';
  }

  private generateRandomAge(): number {
    // Generate random age between 18 and 29
    return Math.floor(Math.random() * 12) + 18;
  }

  async gatherR2ImageInfo(debugLimit?: number): Promise<R2ImageInfo[]> {
    console.log(`🔍 Gathering image information from R2${debugLimit ? ` (DEBUG: first ${debugLimit} images)` : ''}...\n`);

    const imageMap = new Map<string, R2ImageInfo>();

    // Step 1: Process metadata files to get base info
    console.log('📋 Step 1: Processing metadata files...');
    
    let continuationToken: string | undefined;
    let totalMetadata = 0;
    let processedCount = 0;

    do {
      const metadataCommand = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: 'samples/metadata/',
        MaxKeys: debugLimit ? Math.min(200, debugLimit * 2) : 1000,
        ContinuationToken: continuationToken,
      });

      const metadataResponse = await this.s3Client.send(metadataCommand);
      
      if (metadataResponse.Contents) {
        const metadataFiles = metadataResponse.Contents.filter(obj => obj.Key?.endsWith('.json'));
        totalMetadata += metadataFiles.length;
        
        console.log(`  Processing ${metadataFiles.length} metadata files (total: ${totalMetadata})...`);

        // Process in small batches
        const batchSize = 10;
        for (let i = 0; i < metadataFiles.length; i += batchSize) {
          const batch = metadataFiles.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (obj) => {
            try {
              const getObjCommand = new GetObjectCommand({
                Bucket: this.config.bucketName,
                Key: obj.Key!,
              });
              
              const objResponse = await this.s3Client.send(getObjCommand);
              const metadataStr = await objResponse.Body?.transformToString();
              
              if (metadataStr) {
                const metadata = JSON.parse(metadataStr);
                
                if (metadata.originalFilename && metadata.imageId) {
                  const filename = metadata.originalFilename;
                  const gender = this.parseGenderFromFilename(filename);
                  const estimatedAge = metadata.age || this.generateRandomAge();
                  
                  imageMap.set(metadata.imageId, {
                    originalFilename: filename,
                    imageId: metadata.imageId,
                    gender,
                    estimatedAge,
                    mainUrl: '', // Will be populated in step 2
                    thumbnailUrl: '',
                  });
                  
                  this.stats.metadataProcessed++;
                  processedCount++;
                  
                  // Break if we hit debug limit
                  if (debugLimit && processedCount >= debugLimit) {
                    break;
                  }
                }
              }
            } catch (error) {
              this.stats.errors.push(`Failed to read metadata ${obj.Key}: ${error}`);
            }
          }));
          
          // Break outer loop if we hit debug limit
          if (debugLimit && processedCount >= debugLimit) {
            break;
          }

          // Progress update
          if (this.stats.metadataProcessed % 500 === 0) {
            console.log(`    📊 Processed ${this.stats.metadataProcessed} metadata records...`);
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      continuationToken = metadataResponse.NextContinuationToken;
    } while (continuationToken && (!debugLimit || processedCount < debugLimit));

    console.log(`✅ Metadata processing complete: ${this.stats.metadataProcessed} records found`);

    // Step 2: Find actual image files and build URLs
    console.log('\n🖼️  Step 2: Finding image files and building URLs...');
    
    continuationToken = undefined;
    let totalImages = 0;

    do {
      const imageCommand = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: 'samples/',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const imageResponse = await this.s3Client.send(imageCommand);
      
      if (imageResponse.Contents) {
        const imageFiles = imageResponse.Contents.filter(obj => 
          obj.Key && 
          obj.Key.endsWith('.jpg') && 
          !obj.Key.includes('/metadata/')
        );

        totalImages += imageFiles.length;
        console.log(`  Processing ${imageFiles.length} image files (total: ${totalImages})...`);

        // Process in very small batches due to metadata calls
        const batchSize = 5;
        for (let i = 0; i < imageFiles.length; i += batchSize) {
          const batch = imageFiles.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (obj) => {
            try {
              const getImgCommand = new GetObjectCommand({
                Bucket: this.config.bucketName,
                Key: obj.Key!,
              });
              
              const imgObjResponse = await this.s3Client.send(getImgCommand);
              const imageId = imgObjResponse.Metadata?.imageid; // lowercase from R2
              
              if (imageId && imageMap.has(imageId)) {
                const imageInfo = imageMap.get(imageId)!;
                const publicUrl = `https://${this.config.publicDomain}/${obj.Key}`;
                
                if (obj.Key!.includes('/thumbnails/')) {
                  imageInfo.thumbnailUrl = publicUrl;
                  imageInfo.thumbnailKey = obj.Key!;
                } else {
                  imageInfo.mainUrl = publicUrl;
                  imageInfo.r2Key = obj.Key!;
                }
                
                // Count as found when we have main image
                if (imageInfo.mainUrl && !imageInfo.thumbnailUrl) {
                  this.stats.imagesFound++;
                }
              }
            } catch (error) {
              // Skip this image - too many to log all errors
            }
          }));

          // Progress update
          if (this.stats.imagesFound % 200 === 0) {
            console.log(`    📊 Found ${this.stats.imagesFound} complete images...`);
          }

          // Small delay
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      continuationToken = imageResponse.NextContinuationToken;
    } while (continuationToken);

    // Filter to only complete records with main URLs
    const completeImages = Array.from(imageMap.values())
      .filter(img => img.mainUrl)
      .map(img => ({
        ...img,
        thumbnailUrl: img.thumbnailUrl || img.mainUrl, // Use main image if no thumbnail
      }));

    console.log(`✅ Image processing complete: ${completeImages.length} complete records ready`);
    
    return completeImages;
  }

  async populateDatabase(imageInfos: R2ImageInfo[], dryRun: boolean = false): Promise<void> {
    console.log(`\n💾 Step 3: Populating database ${dryRun ? '(DRY RUN)' : ''}...`);

    // Check if table already has records
    const existingCount = await prisma.sampleImage.count();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} sample images`);
      
      if (!dryRun) {
        console.log('Skipping population - table not empty. Use --force to override.');
        return;
      }
    }

    console.log(`Creating ${imageInfos.length} sample image records...`);

    // Create records in batches
    const batchSize = 50;
    for (let i = 0; i < imageInfos.length; i += batchSize) {
      const batch = imageInfos.slice(i, i + batchSize);
      
      try {
        if (dryRun) {
          // Show what would be created
          if (i < 5 || (i + batchSize) >= imageInfos.length) {
            console.log(`  Batch ${Math.floor(i / batchSize) + 1}: Would create ${batch.length} records`);
            if (i < 5) {
              batch.slice(0, 2).forEach(img => {
                console.log(`    ${img.originalFilename} (${img.gender}) -> ${img.mainUrl}`);
              });
            }
          }
          this.stats.recordsCreated += batch.length;
        } else {
          // Actually create records
          const recordsToCreate = batch.map(img => ({
            url: img.mainUrl,
            thumbnailUrl: img.thumbnailUrl,
            gender: img.gender,
            estimatedAge: img.estimatedAge,
            source: 'curated' as const,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastUsed: null,
          }));

          const result = await prisma.sampleImage.createMany({
            data: recordsToCreate,
          });

          this.stats.recordsCreated += result.count;
        }

        // Progress logging
        if ((i + batchSize) % 500 === 0 || (i + batchSize) >= imageInfos.length) {
          console.log(`  📊 ${dryRun ? 'Would create' : 'Created'} ${this.stats.recordsCreated} records...`);
        }

      } catch (error) {
        this.stats.errors.push(`Failed to create batch starting at ${i}: ${error}`);
        this.stats.recordsSkipped += batch.length;
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  async createRankings(dryRun: boolean = false): Promise<void> {
    if (dryRun) {
      console.log('\n🏆 Would create sample image rankings for all new records');
      return;
    }

    console.log('\n🏆 Creating sample image rankings...');

    // Get all sample images that don't have rankings
    const imagesWithoutRankings = await prisma.sampleImage.findMany({
      where: {
        ranking: null,
      },
      select: { id: true },
    });

    if (imagesWithoutRankings.length === 0) {
      console.log('✅ All sample images already have rankings');
      return;
    }

    console.log(`Creating rankings for ${imagesWithoutRankings.length} sample images...`);

    // Create rankings in batches
    const rankingData = imagesWithoutRankings.map(img => ({
      sampleImageId: img.id,
      currentPercentile: 50.0, // Start at median
      totalComparisons: 0,
      wins: 0,
      losses: 0,
      bradleyTerryScore: 0.5, // Initial neutral score
      confidence: 0.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const batchSize = 100;
    let created = 0;
    
    for (let i = 0; i < rankingData.length; i += batchSize) {
      const batch = rankingData.slice(i, i + batchSize);
      
      try {
        const result = await prisma.sampleImageRanking.createMany({
          data: batch,
        });
        created += result.count;
        
        if (created % 500 === 0) {
          console.log(`  📊 Created ${created} rankings...`);
        }
      } catch (error) {
        this.stats.errors.push(`Failed to create ranking batch: ${error}`);
      }
    }

    console.log(`✅ Created ${created} sample image rankings`);
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('SAMPLE IMAGE POPULATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Metadata processed: ${this.stats.metadataProcessed}`);
    console.log(`Images found: ${this.stats.imagesFound}`);
    console.log(`Records created: ${this.stats.recordsCreated}`);
    console.log(`Records skipped: ${this.stats.recordsSkipped}`);
    console.log(`Errors: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\nRecent errors (last 5):');
      this.stats.errors.slice(-5).forEach(error => {
        console.log(`  ${error}`);
      });
    }

    console.log('='.repeat(60));
  }

  async run(dryRun: boolean = false, debugLimit?: number): Promise<void> {
    try {
      console.log(`🚀 Starting sample image population ${dryRun ? '(DRY RUN)' : ''}${debugLimit ? ` (DEBUG: ${debugLimit} images)` : ''}...\n`);
      
      // Gather all image information from R2
      const imageInfos = await this.gatherR2ImageInfo(debugLimit);
      
      if (imageInfos.length === 0) {
        throw new Error('No complete image records found in R2');
      }

      // Populate database
      await this.populateDatabase(imageInfos, dryRun);
      
      // Create rankings
      await this.createRankings(dryRun);
      
      this.printSummary();
      
      console.log('\n🎉 Sample image population completed successfully!');

    } catch (error) {
      console.error('❌ Population failed:', error);
      this.stats.errors.push(`Script failure: ${error}`);
      this.printSummary();
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  
  // Check for debug limit
  const debugFlag = args.find(arg => arg.startsWith('--debug='));
  const debugLimit = debugFlag ? parseInt(debugFlag.split('=')[1]) : undefined;

  const populator = new SampleImagePopulator();
  await populator.run(dryRun, debugLimit);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { SampleImagePopulator };