import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

dotenv.config();

const prisma = new PrismaClient();

interface SimpleImageInfo {
  url: string;
  thumbnailUrl: string;
  gender: string;
  estimatedAge: number;
}

class SimplePopulator {
  private config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicDomain: string;
  };
  private s3Client: S3Client;

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

  private generateRandomAge(): number {
    return Math.floor(Math.random() * 12) + 18; // 18-29
  }

  private parseGenderFromFilename(filename: string): string {
    // Try to parse from filename patterns like AF1.jpg, AM123.jpg
    const match = filename.match(/^(AF|AM|CF|CM)\d+\.jpg$/i);
    if (match) {
      const prefix = match[1].toUpperCase();
      return (prefix === 'AF' || prefix === 'CF') ? 'female' : 'male';
    }
    return 'female'; // default
  }

  async getR2Images(debugLimit?: number): Promise<SimpleImageInfo[]> {
    console.log(`📋 Getting images from R2${debugLimit ? ` (first ${debugLimit})` : ''}...`);
    
    const images: SimpleImageInfo[] = [];
    let continuationToken: string | undefined;
    let processedCount = 0;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: 'samples/',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const response = await this.s3Client.send(command);
      
      if (response.Contents) {
        // Filter for main images (not thumbnails, not metadata)
        const mainImages = response.Contents.filter(obj => 
          obj.Key && 
          obj.Key.endsWith('.jpg') && 
          !obj.Key.includes('/thumbnails/') && 
          !obj.Key.includes('/metadata/')
        );

        console.log(`  Found ${mainImages.length} main images...`);

        for (const obj of mainImages) {
          if (debugLimit && processedCount >= debugLimit) break;
          
          const filename = obj.Key!.split('/').pop() || '';
          const mainUrl = `https://${this.config.publicDomain}/${obj.Key}`;
          
          // Check if thumbnail exists (assume same name in thumbnails folder)
          const thumbnailKey = obj.Key!.replace('samples/', 'samples/thumbnails/');
          const thumbnailUrl = mainUrl; // Use main image as thumbnail for now
          
          images.push({
            url: mainUrl,
            thumbnailUrl: thumbnailUrl,
            gender: this.parseGenderFromFilename(filename),
            estimatedAge: this.generateRandomAge(),
          });

          processedCount++;
          
          if (processedCount % 100 === 0) {
            console.log(`    📊 Processed ${processedCount} images...`);
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken && (!debugLimit || processedCount < debugLimit));

    console.log(`✅ Found ${images.length} images to populate`);
    return images;
  }

  async populateDatabase(images: SimpleImageInfo[], dryRun: boolean = false, force: boolean = false): Promise<void> {
    console.log(`💾 Populating database ${dryRun ? '(DRY RUN)' : ''}...`);

    if (dryRun) {
      // Show first few records without database access
      console.log('Sample records that would be created:');
      images.slice(0, 3).forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url} (${img.gender}, age ${img.estimatedAge})`);
      });
      console.log(`... and ${images.length - 3} more`);
      return;
    }

    // Check if table already has records
    const existingCount = await prisma.sampleImage.count();
    if (existingCount > 0 && !force) {
      console.log(`⚠️  Database already has ${existingCount} sample images`);
      console.log('Skipping population - table not empty. Use --force to clear first.');
      return;
    }
    
    if (force && existingCount > 0) {
      console.log(`🗑️  Force mode: Clearing existing ${existingCount} sample images...`);
      await prisma.sampleImageRanking.deleteMany();
      await prisma.sampleImage.deleteMany();
    }

    console.log(`Creating ${images.length} sample image records...`);

    // Create records in batches
    const batchSize = 100;
    let created = 0;

    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      
      const recordsToCreate = batch.map(img => ({
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        gender: img.gender,
        estimatedAge: img.estimatedAge,
        source: 'curated' as const,
        isActive: true,
      }));

      const result = await prisma.sampleImage.createMany({
        data: recordsToCreate,
      });

      created += result.count;
      console.log(`  📊 Created ${created}/${images.length} records...`);
    }

    console.log(`✅ Successfully created ${created} sample image records`);
  }

  async createRankings(): Promise<void> {
    console.log('🏆 Creating sample image rankings...');

    const imagesWithoutRankings = await prisma.sampleImage.findMany({
      where: { ranking: null },
      select: { id: true },
    });

    if (imagesWithoutRankings.length === 0) {
      console.log('✅ All sample images already have rankings');
      return;
    }

    console.log(`Creating rankings for ${imagesWithoutRankings.length} sample images...`);

    const rankingData = imagesWithoutRankings.map(img => ({
      sampleImageId: img.id,
      currentPercentile: 50.0,
      totalComparisons: 0,
      wins: 0,
      losses: 0,
      bradleyTerryScore: 0.5,
      confidence: 0.0,
    }));

    await prisma.sampleImageRanking.createMany({
      data: rankingData,
    });

    console.log(`✅ Created rankings for ${imagesWithoutRankings.length} images`);
  }

  async run(dryRun: boolean = false, debugLimit?: number, force: boolean = false): Promise<void> {
    try {
      console.log(`🚀 Starting simple sample population ${dryRun ? '(DRY RUN)' : ''}${debugLimit ? ` (${debugLimit} images)` : ''}...\n`);
      
      const images = await this.getR2Images(debugLimit);
      
      if (images.length === 0) {
        throw new Error('No images found in R2');
      }

      await this.populateDatabase(images, dryRun, force);
      
      if (!dryRun) {
        await this.createRankings();
      }
      
      console.log('\n🎉 Population completed successfully!');

    } catch (error) {
      console.error('❌ Population failed:', error);
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
  const debugFlag = args.find(arg => arg.startsWith('--debug='));
  const debugLimit = debugFlag ? parseInt(debugFlag.split('=')[1]) : undefined;

  const populator = new SimplePopulator();
  await populator.run(dryRun, debugLimit, force);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { SimplePopulator };