import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface FileMapping {
  originalFilename: string;
  imageId: string;
  r2Key?: string;
  thumbnailKey?: string;
  mapped: boolean;
}

interface ProgressState {
  phase: 'metadata' | 'images' | 'database' | 'complete';
  processedMetadata: number;
  totalMetadata: number;
  processedImages: number;
  totalImages: number;
  updatedDatabase: number;
  filenameMap: Record<string, FileMapping>;
  errors: Array<{ type: string; message: string; timestamp: string }>;
  startTime: string;
  lastSaved: string;
}

class RobustR2Mapper {
  private config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicDomain: string;
  };
  private s3Client: S3Client;
  private progressFile: string;
  private state: ProgressState;

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

    this.progressFile = path.join(process.cwd(), 'r2-mapping-progress.json');
    this.state = this.loadProgress();
  }

  private loadProgress(): ProgressState {
    if (existsSync(this.progressFile)) {
      try {
        const saved = JSON.parse(readFileSync(this.progressFile, 'utf8'));
        console.log(`📂 Resuming from saved progress (Phase: ${saved.phase})`);
        return saved;
      } catch (error) {
        console.warn('⚠️  Could not load saved progress, starting fresh');
      }
    }

    return {
      phase: 'metadata',
      processedMetadata: 0,
      totalMetadata: 0,
      processedImages: 0,
      totalImages: 0,
      updatedDatabase: 0,
      filenameMap: {},
      errors: [],
      startTime: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
    };
  }

  private saveProgress(): void {
    this.state.lastSaved = new Date().toISOString();
    writeFileSync(this.progressFile, JSON.stringify(this.state, null, 2));
  }

  private addError(type: string, message: string): void {
    this.state.errors.push({
      type,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          this.addError('retry_failed', `Failed after ${maxRetries} attempts: ${errorMsg}`);
          return null;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`  ⚠️  Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null;
  }

  async processMetadataFiles(): Promise<void> {
    if (this.state.phase !== 'metadata') {
      console.log(`⏭️  Skipping metadata phase (already completed)`);
      return;
    }

    console.log('📋 Phase 1: Processing metadata files...');
    
    let continuationToken: string | undefined;
    let totalProcessed = this.state.processedMetadata;

    do {
      const result = await this.withRetry(async () => {
        const command = new ListObjectsV2Command({
          Bucket: this.config.bucketName,
          Prefix: 'samples/metadata/',
          MaxKeys: 500, // Smaller batches
          ContinuationToken: continuationToken,
        });
        return await this.s3Client.send(command);
      });

      if (!result) {
        console.error('❌ Failed to list metadata files');
        return;
      }

      if (result.Contents) {
        const metadataFiles = result.Contents.filter(obj => obj.Key?.endsWith('.json'));
        this.state.totalMetadata += metadataFiles.length;
        
        console.log(`  Processing ${metadataFiles.length} metadata files...`);

        // Process in very small batches to avoid timeouts
        const batchSize = 3;
        for (let i = 0; i < metadataFiles.length; i += batchSize) {
          const batch = metadataFiles.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (obj, index) => {
            const metadata = await this.withRetry(async () => {
              const getCmd = new GetObjectCommand({
                Bucket: this.config.bucketName,
                Key: obj.Key!,
              });
              
              const response = await this.s3Client.send(getCmd);
              const content = await response.Body?.transformToString();
              return content ? JSON.parse(content) : null;
            });

            if (metadata && metadata.originalFilename && metadata.imageId) {
              this.state.filenameMap[metadata.originalFilename] = {
                originalFilename: metadata.originalFilename,
                imageId: metadata.imageId,
                mapped: false,
              };
            }

            totalProcessed++;
            this.state.processedMetadata = totalProcessed;

            // Save progress every 50 files
            if (totalProcessed % 50 === 0) {
              this.saveProgress();
              console.log(`    📊 Processed ${totalProcessed} metadata files...`);
            }
          }));

          // Small delay between batches to avoid overwhelming R2
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    const mappedCount = Object.keys(this.state.filenameMap).length;
    console.log(`✅ Metadata phase complete: ${mappedCount} filename mappings created`);
    
    this.state.phase = 'images';
    this.saveProgress();
  }

  async processImageFiles(): Promise<void> {
    if (this.state.phase !== 'images') {
      console.log(`⏭️  Skipping image processing phase (already completed)`);
      return;
    }

    console.log('🖼️  Phase 2: Processing image files...');
    
    let continuationToken: string | undefined;
    let totalProcessed = this.state.processedImages;
    let mappedCount = 0;

    do {
      const result = await this.withRetry(async () => {
        const command = new ListObjectsV2Command({
          Bucket: this.config.bucketName,
          Prefix: 'samples/',
          MaxKeys: 500,
          ContinuationToken: continuationToken,
        });
        return await this.s3Client.send(command);
      });

      if (!result) {
        console.error('❌ Failed to list image files');
        return;
      }

      if (result.Contents) {
        const imageFiles = result.Contents.filter(obj => 
          obj.Key && 
          obj.Key.endsWith('.jpg') && 
          !obj.Key.includes('/metadata/')
        );

        this.state.totalImages += imageFiles.length;
        console.log(`  Processing ${imageFiles.length} image files...`);

        // Process images in tiny batches
        const batchSize = 2;
        for (let i = 0; i < imageFiles.length; i += batchSize) {
          const batch = imageFiles.slice(i, i + batchSize);
          
          await Promise.all(batch.map(async (obj) => {
            const imageId = await this.withRetry(async () => {
              const getCmd = new GetObjectCommand({
                Bucket: this.config.bucketName,
                Key: obj.Key!,
              });
              
              const response = await this.s3Client.send(getCmd);
              return response.Metadata?.imageid; // lowercase from R2
            });

            if (imageId) {
              // Find matching filename mapping
              for (const mapping of Object.values(this.state.filenameMap)) {
                if (mapping.imageId === imageId) {
                  if (obj.Key!.includes('/thumbnails/')) {
                    mapping.thumbnailKey = obj.Key!;
                  } else {
                    mapping.r2Key = obj.Key!;
                  }
                  
                  // Mark as mapped if we have main image
                  if (mapping.r2Key) {
                    mapping.mapped = true;
                    mappedCount++;
                  }
                  break;
                }
              }
            }

            totalProcessed++;
            this.state.processedImages = totalProcessed;

            // Save progress every 20 images
            if (totalProcessed % 20 === 0) {
              this.saveProgress();
              console.log(`    📊 Processed ${totalProcessed} images, mapped ${mappedCount}...`);
            }
          }));

          // Delay between batches
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    const completeMappings = Object.values(this.state.filenameMap).filter(m => m.mapped).length;
    console.log(`✅ Image processing complete: ${completeMappings} complete mappings`);
    
    this.state.phase = 'database';
    this.saveProgress();
  }

  async updateDatabase(dryRun: boolean = false): Promise<void> {
    if (this.state.phase !== 'database') {
      console.log(`⏭️  Skipping database phase (already completed)`);
      return;
    }

    console.log(`💾 Phase 3: Updating database ${dryRun ? '(DRY RUN)' : ''}...`);
    
    const completeMappings = Object.values(this.state.filenameMap).filter(m => m.mapped);
    console.log(`Found ${completeMappings.length} complete mappings to update`);

    let updated = 0;
    let failed = 0;

    for (const mapping of completeMappings) {
      try {
        const mainUrl = `https://${this.config.publicDomain}/${mapping.r2Key}`;
        const thumbnailUrl = mapping.thumbnailKey 
          ? `https://${this.config.publicDomain}/${mapping.thumbnailKey}`
          : mainUrl;

        if (dryRun) {
          console.log(`  Would update: ${mapping.originalFilename} -> ${mainUrl}`);
        } else {
          const updateResult = await prisma.sampleImage.updateMany({
            where: {
              url: `/sample-images/${mapping.originalFilename}`,
              isActive: true,
            },
            data: {
              url: mainUrl,
              thumbnailUrl: thumbnailUrl,
            }
          });

          if (updateResult.count > 0) {
            updated++;
          } else {
            failed++;
            this.addError('database_update', `No records found for ${mapping.originalFilename}`);
          }
        }

        this.state.updatedDatabase++;

        // Progress logging
        if (this.state.updatedDatabase % 25 === 0) {
          this.saveProgress();
          console.log(`    📊 Updated ${updated} records...`);
        }

      } catch (error) {
        failed++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        this.addError('database_update', `Failed to update ${mapping.originalFilename}: ${errorMsg}`);
      }
    }

    console.log(`✅ Database update complete: ${updated} updated, ${failed} failed`);
    
    this.state.phase = 'complete';
    this.saveProgress();
  }

  async printSummary(): Promise<void> {
    const duration = Date.now() - new Date(this.state.startTime).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    console.log('\n' + '='.repeat(60));
    console.log('ROBUST R2 MAPPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Phase: ${this.state.phase}`);
    console.log(`Duration: ${minutes}m ${seconds}s`);
    console.log(`Metadata files processed: ${this.state.processedMetadata}`);
    console.log(`Image files processed: ${this.state.processedImages}`);
    console.log(`Database records updated: ${this.state.updatedDatabase}`);
    console.log(`Total errors: ${this.state.errors.length}`);

    const completeMappings = Object.values(this.state.filenameMap).filter(m => m.mapped).length;
    console.log(`Complete mappings: ${completeMappings}`);

    if (this.state.errors.length > 0) {
      console.log('\nRecent errors (last 5):');
      this.state.errors.slice(-5).forEach(error => {
        console.log(`  ${error.type}: ${error.message}`);
      });
    }

    console.log('='.repeat(60));
  }

  async run(dryRun: boolean = false): Promise<void> {
    try {
      console.log(`🚀 Starting robust R2 mapping ${dryRun ? '(DRY RUN)' : ''}...\n`);
      
      await this.processMetadataFiles();
      await this.processImageFiles();
      await this.updateDatabase(dryRun);
      
      await this.printSummary();
      
      if (this.state.phase === 'complete') {
        console.log('\n🎉 R2 mapping completed successfully!');
      }

    } catch (error) {
      console.error('❌ R2 mapping failed:', error);
      this.addError('script_failure', error instanceof Error ? error.message : 'Unknown error');
      this.saveProgress();
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  // Utility method to clean up and start fresh
  static cleanStart(): void {
    const progressFile = path.join(process.cwd(), 'r2-mapping-progress.json');
    if (existsSync(progressFile)) {
      writeFileSync(progressFile + '.backup', readFileSync(progressFile));
      console.log('🧹 Backed up previous progress and starting fresh');
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const cleanStart = args.includes('--clean');

  if (cleanStart) {
    RobustR2Mapper.cleanStart();
  }

  const mapper = new RobustR2Mapper();
  await mapper.run(dryRun);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { RobustR2Mapper };