import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
}

interface R2ImageInfo {
  originalFilename: string;
  imageId: string;
  mainUrl: string;
  thumbnailUrl?: string;
}

interface UpdateStats {
  total: number;
  updated: number;
  failed: number;
  errors: Array<{ id: string; filename: string; error: string }>;
}

class SampleImageUrlUpdater {
  private prisma: PrismaClient;
  private s3Client: S3Client;
  private config: R2Config;
  private stats: UpdateStats = {
    total: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  constructor() {
    this.validateEnvironment();
    this.config = {
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      publicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!,
    };

    this.prisma = new PrismaClient();
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  private validateEnvironment(): void {
    const required = [
      'CLOUDFLARE_R2_ACCOUNT_ID',
      'CLOUDFLARE_R2_ACCESS_KEY_ID', 
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'CLOUDFLARE_R2_PUBLIC_DOMAIN'
    ];

    for (const env of required) {
      if (!process.env[env]) {
        throw new Error(`Missing required environment variable: ${env}`);
      }
    }
  }

  /**
   * Extract original filename from local path
   */
  private extractFilename(url: string): string {
    // Convert /sample-images/AF1.jpg to AF1.jpg
    return url.replace(/^\/sample-images\//, '');
  }

  /**
   * Get all R2 image information by reading metadata files and correlating with actual files
   */
  private async getR2ImageMappings(): Promise<Map<string, R2ImageInfo>> {
    const mapping = new Map<string, R2ImageInfo>();
    
    console.log('Scanning R2 bucket for sample images...');
    
    try {
      // First, collect all image files and metadata files
      const imageFiles = new Map<string, string>(); // imageId -> key
      const thumbnailFiles = new Map<string, string>(); // imageId -> key
      const metadataMap = new Map<string, any>(); // imageId -> metadata
      
      // List all objects in samples directory
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: 'samples/',
        MaxKeys: 10000,
      });

      let isTruncated = true;
      let continuationToken: string | undefined;
      let totalObjects = 0;

      console.log('Reading R2 objects...');
      while (isTruncated) {
        if (continuationToken) {
          command.input.ContinuationToken = continuationToken;
        }

        const response = await this.s3Client.send(command);
        
        if (response.Contents) {
          totalObjects += response.Contents.length;
          
          for (const obj of response.Contents) {
            if (!obj.Key) continue;

            if (obj.Key.endsWith('.json') && obj.Key.includes('/metadata/')) {
              // This is a metadata file
              try {
                const getObjCommand = new GetObjectCommand({
                  Bucket: this.config.bucketName,
                  Key: obj.Key,
                });
                
                const objResponse = await this.s3Client.send(getObjCommand);
                const metadataStr = await objResponse.Body?.transformToString();
                
                if (metadataStr) {
                  const metadata = JSON.parse(metadataStr);
                  if (metadata.imageId) {
                    metadataMap.set(metadata.imageId, metadata);
                  }
                }
              } catch (error) {
                console.warn(`Failed to read metadata ${obj.Key}:`, error);
              }
            } else if (obj.Key.endsWith('.jpg') || obj.Key.endsWith('.jpeg')) {
              // This is an image file - try to get its imageId from object metadata
              try {
                const getObjCommand = new GetObjectCommand({
                  Bucket: this.config.bucketName,
                  Key: obj.Key,
                });
                
                const objResponse = await this.s3Client.send(getObjCommand);
                const imageId = objResponse.Metadata?.imageId;
                
                if (imageId) {
                  if (obj.Key.includes('/thumbnails/')) {
                    thumbnailFiles.set(imageId, obj.Key);
                  } else {
                    imageFiles.set(imageId, obj.Key);
                  }
                }
              } catch (error) {
                console.warn(`Failed to get metadata for ${obj.Key}:`, error);
              }
            }
          }
          
          if (totalObjects % 1000 === 0) {
            console.log(`Processed ${totalObjects} objects...`);
          }
        }

        isTruncated = response.IsTruncated || false;
        continuationToken = response.NextContinuationToken;
      }

      console.log(`Found ${totalObjects} total objects`);
      console.log(`Found ${metadataMap.size} metadata files`);
      console.log(`Found ${imageFiles.size} main images`);
      console.log(`Found ${thumbnailFiles.size} thumbnails`);

      // Now correlate metadata with image files
      let mappedCount = 0;
      for (const [imageId, metadata] of metadataMap.entries()) {
        const mainImageKey = imageFiles.get(imageId);
        const thumbnailKey = thumbnailFiles.get(imageId);
        
        if (mainImageKey && metadata.originalFilename) {
          const info: R2ImageInfo = {
            originalFilename: metadata.originalFilename,
            imageId,
            mainUrl: `https://${this.config.publicDomain}/${mainImageKey}`,
            thumbnailUrl: thumbnailKey ? `https://${this.config.publicDomain}/${thumbnailKey}` : undefined
          };
          
          mapping.set(metadata.originalFilename, info);
          mappedCount++;
        }
      }

      console.log(`Successfully mapped ${mappedCount} sample images\n`);
      return mapping;

    } catch (error) {
      console.error('Failed to scan R2 bucket:', error);
      throw error;
    }
  }

  /**
   * Update database records with R2 URLs
   */
  async updateDatabase(dryRun: boolean = false): Promise<void> {
    try {
      console.log(`Starting sample image URL update ${dryRun ? '(DRY RUN)' : ''}...\n`);

      // Get R2 image mappings
      const r2Mappings = await this.getR2ImageMappings();

      // Get all sample images that have local URLs
      const sampleImages = await this.prisma.sampleImage.findMany({
        where: {
          url: {
            startsWith: '/sample-images/'
          }
        },
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
        }
      });

      this.stats.total = sampleImages.length;
      console.log(`Found ${this.stats.total} sample images with local URLs to update\n`);

      if (this.stats.total === 0) {
        console.log('No sample images need updating.');
        return;
      }

      // Process each sample image
      for (const image of sampleImages) {
        try {
          const filename = this.extractFilename(image.url);
          const r2Info = r2Mappings.get(filename);

          if (!r2Info) {
            this.stats.failed++;
            this.stats.errors.push({
              id: image.id,
              filename,
              error: `No R2 mapping found for filename: ${filename}`
            });
            continue;
          }

          console.log(`${filename}:`);
          console.log(`  ${image.url} -> ${r2Info.mainUrl}`);
          if (r2Info.thumbnailUrl) {
            console.log(`  ${image.thumbnailUrl || 'none'} -> ${r2Info.thumbnailUrl}`);
          }

          if (!dryRun) {
            await this.prisma.sampleImage.update({
              where: { id: image.id },
              data: {
                url: r2Info.mainUrl,
                thumbnailUrl: r2Info.thumbnailUrl || null,
              }
            });
          }

          this.stats.updated++;

          // Progress logging
          if (this.stats.updated % 100 === 0) {
            console.log(`Progress: ${this.stats.updated}/${this.stats.total} updated\n`);
          }

        } catch (error) {
          this.stats.failed++;
          const filename = this.extractFilename(image.url);
          this.stats.errors.push({
            id: image.id,
            filename,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      this.printSummary(dryRun);

    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private printSummary(dryRun: boolean): void {
    console.log('\n' + '='.repeat(60));
    console.log(`SAMPLE IMAGE URL UPDATE SUMMARY ${dryRun ? '(DRY RUN)' : ''}`);
    console.log('='.repeat(60));
    console.log(`Total sample images: ${this.stats.total}`);
    console.log(`Successfully ${dryRun ? 'would be ' : ''}updated: ${this.stats.updated}`);
    console.log(`Failed: ${this.stats.failed}`);
    
    if (this.stats.failed > 0) {
      console.log(`Success rate: ${((this.stats.updated / this.stats.total) * 100).toFixed(1)}%`);
    } else {
      console.log('Success rate: 100%');
    }

    if (this.stats.errors.length > 0) {
      console.log('\nErrors:');
      this.stats.errors.slice(0, 10).forEach(({ id, filename, error }) => {
        console.log(`  ${filename} (${id}): ${error}`);
      });
      
      if (this.stats.errors.length > 10) {
        console.log(`  ... and ${this.stats.errors.length - 10} more errors`);
      }
    }

    console.log('='.repeat(60));
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const updater = new SampleImageUrlUpdater();
  
  try {
    await updater.updateDatabase(dryRun);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}

export { SampleImageUrlUpdater };