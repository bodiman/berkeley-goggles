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
   * Get all R2 image information by only reading metadata files and constructing URLs
   */
  private async getR2ImageMappings(): Promise<Map<string, R2ImageInfo>> {
    const mapping = new Map<string, R2ImageInfo>();
    
    console.log('Reading R2 metadata files...');
    
    try {
      // Only list metadata files - this is much faster
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucketName,
        Prefix: 'samples/metadata/',
        MaxKeys: 10000,
      });

      let isTruncated = true;
      let continuationToken: string | undefined;
      let processedMetadata = 0;

      while (isTruncated) {
        if (continuationToken) {
          command.input.ContinuationToken = continuationToken;
        }

        const response = await this.s3Client.send(command);
        
        if (response.Contents) {
          // Read metadata files in batches
          const metadataPromises = response.Contents
            .filter(obj => obj.Key && obj.Key.endsWith('.json'))
            .map(async obj => {
              try {
                const getObjCommand = new GetObjectCommand({
                  Bucket: this.config.bucketName,
                  Key: obj.Key!,
                });
                
                const objResponse = await this.s3Client.send(getObjCommand);
                const metadataStr = await objResponse.Body?.transformToString();
                
                if (metadataStr) {
                  return JSON.parse(metadataStr);
                }
              } catch (error) {
                console.warn(`Failed to read metadata ${obj.Key}:`, error);
              }
              return null;
            });

          const metadataResults = await Promise.all(metadataPromises);
          
          for (const metadata of metadataResults) {
            if (metadata && metadata.originalFilename && metadata.imageId) {
              // We need to find the actual R2 keys since they contain timestamps
              // Store metadata for now, we'll find the actual keys later
              mapping.set(metadata.originalFilename, {
                originalFilename: metadata.originalFilename,
                imageId: metadata.imageId,
                mainUrl: '', // Will be found later
                thumbnailUrl: '' // Will be found later
              });
              
              processedMetadata++;
              
              if (processedMetadata % 100 === 0) {
                console.log(`Processed ${processedMetadata} metadata files...`);
              }
            }
          }
        }

        isTruncated = response.IsTruncated || false;
        continuationToken = response.NextContinuationToken;
      }

      console.log(`Successfully processed ${processedMetadata} metadata files`);
      console.log(`Found ${mapping.size} sample image metadata records`);
      
      // Now find the actual R2 keys for main images and thumbnails
      console.log('Finding actual R2 image keys...');
      await this.populateR2Keys(mapping);
      
      const completeMappings = Array.from(mapping.values()).filter(info => info.mainUrl);
      console.log(`Successfully mapped ${completeMappings.length} sample images with R2 URLs\n`);
      return mapping;

    } catch (error) {
      console.error('Failed to read R2 metadata:', error);
      throw error;
    }
  }

  /**
   * Find actual R2 keys for images by imageId
   */
  private async populateR2Keys(mapping: Map<string, R2ImageInfo>): Promise<void> {
    // Create a reverse mapping from imageId to filenames
    const imageIdToFilenames = new Map<string, string>();
    for (const [filename, info] of mapping.entries()) {
      imageIdToFilenames.set(info.imageId, filename);
    }

    // List all actual image files in samples directory
    const imageListCommand = new ListObjectsV2Command({
      Bucket: this.config.bucketName,
      Prefix: 'samples/',
      MaxKeys: 20000,
    });

    let isTruncated = true;
    let continuationToken: string | undefined;
    let foundImages = 0;

    while (isTruncated) {
      if (continuationToken) {
        imageListCommand.input.ContinuationToken = continuationToken;
      }

      const response = await this.s3Client.send(imageListCommand);
      
      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key || !obj.Key.endsWith('.jpg')) continue;
          if (obj.Key.includes('/metadata/')) continue;

          try {
            // Get the imageId from object metadata
            const getObjCommand = new GetObjectCommand({
              Bucket: this.config.bucketName,
              Key: obj.Key,
            });
            
            const objResponse = await this.s3Client.send(getObjCommand);
            const imageId = objResponse.Metadata?.imageId;
            
            if (imageId) {
              const filename = imageIdToFilenames.get(imageId);
              if (filename) {
                const info = mapping.get(filename);
                if (info) {
                  const publicUrl = `https://${this.config.publicDomain}/${obj.Key}`;
                  
                  if (obj.Key.includes('/thumbnails/')) {
                    info.thumbnailUrl = publicUrl;
                  } else {
                    info.mainUrl = publicUrl;
                  }
                  
                  foundImages++;
                  
                  if (foundImages % 200 === 0) {
                    console.log(`Found ${foundImages} image keys...`);
                  }
                }
              }
            }
          } catch (error) {
            // Skip this object if we can't read its metadata
            continue;
          }
        }
      }

      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    console.log(`Found ${foundImages} total image keys`);
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