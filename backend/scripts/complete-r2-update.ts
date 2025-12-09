import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface FileMapping {
  originalFilename: string;
  imageId: string;
  r2Key?: string;
  thumbnailKey?: string;
}

async function completeR2Update(dryRun: boolean = false) {
  console.log(`Complete R2 Update ${dryRun ? '(DRY RUN)' : ''}...\n`);

  const config = {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    publicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!,
  };

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  let updated = 0;
  let failed = 0;
  let skipped = 0;

  try {
    console.log('Step 1: Getting ALL metadata files from R2...');
    
    // Build mapping from metadata - handle pagination properly
    const filenameMap = new Map<string, FileMapping>();
    
    let continuationToken: string | undefined;
    let totalMetadataFiles = 0;
    
    do {
      const metadataCommand = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: 'samples/metadata/',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const metadataResponse = await s3Client.send(metadataCommand);
      
      if (metadataResponse.Contents) {
        const metadataFiles = metadataResponse.Contents.filter(obj => obj.Key?.endsWith('.json'));
        totalMetadataFiles += metadataFiles.length;
        
        console.log(`  Processing ${metadataFiles.length} metadata files (total: ${totalMetadataFiles})...`);

        // Process metadata files in smaller batches to avoid timeouts
        const batchSize = 25;
        for (let i = 0; i < metadataFiles.length; i += batchSize) {
          const batch = metadataFiles.slice(i, i + batchSize);
          
          const promises = batch.map(async obj => {
            try {
              const getObjCommand = new GetObjectCommand({
                Bucket: config.bucketName,
                Key: obj.Key!,
              });
              
              const objResponse = await s3Client.send(getObjCommand);
              const metadataStr = await objResponse.Body?.transformToString();
              
              if (metadataStr) {
                const metadata = JSON.parse(metadataStr);
                if (metadata.originalFilename && metadata.imageId) {
                  filenameMap.set(metadata.originalFilename, {
                    originalFilename: metadata.originalFilename,
                    imageId: metadata.imageId
                  });
                }
              }
            } catch (error) {
              console.warn(`    Failed to read ${obj.Key}: ${error}`);
            }
          });

          await Promise.all(promises);
        }
      }

      continuationToken = metadataResponse.NextContinuationToken;
    } while (continuationToken);

    console.log(`Found ${filenameMap.size} total filename mappings from ${totalMetadataFiles} metadata files\n`);

    console.log('Step 2: Finding ALL R2 image keys...');
    
    // Get all image files with proper pagination
    continuationToken = undefined;
    let totalImageFiles = 0;
    let mappedFiles = 0;

    do {
      const imageCommand = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: 'samples/',
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const imageResponse = await s3Client.send(imageCommand);
      
      if (imageResponse.Contents) {
        const imageFiles = imageResponse.Contents.filter(obj => 
          obj.Key && 
          obj.Key.endsWith('.jpg') && 
          !obj.Key.includes('/metadata/')
        );

        totalImageFiles += imageFiles.length;
        console.log(`  Processing ${imageFiles.length} image files (total: ${totalImageFiles})...`);

        // Process image files in smaller batches
        const imageBatchSize = 10; // Smaller batch for API calls
        for (let i = 0; i < imageFiles.length; i += imageBatchSize) {
          const batch = imageFiles.slice(i, i + imageBatchSize);
          
          const promises = batch.map(async obj => {
            try {
              const getImgCommand = new GetObjectCommand({
                Bucket: config.bucketName,
                Key: obj.Key!,
              });
              
              const imgObjResponse = await s3Client.send(getImgCommand);
              const imageId = imgObjResponse.Metadata?.imageid; // Note: lowercase
              
              if (imageId) {
                // Find the filename mapping for this imageId
                for (const [filename, mapping] of filenameMap.entries()) {
                  if (mapping.imageId === imageId) {
                    if (obj.Key!.includes('/thumbnails/')) {
                      mapping.thumbnailKey = obj.Key!;
                    } else {
                      mapping.r2Key = obj.Key!;
                    }
                    mappedFiles++;
                    break;
                  }
                }
              }
            } catch (error) {
              // Skip this image - too many to log all errors
            }
          });

          await Promise.all(promises);
          
          if (i % 100 === 0) {
            console.log(`    Mapped ${mappedFiles} files so far...`);
          }
        }
      }

      continuationToken = imageResponse.NextContinuationToken;
    } while (continuationToken);

    // Count complete mappings
    const completeMappings = Array.from(filenameMap.values()).filter(m => m.r2Key);
    console.log(`\nFound ${completeMappings.length} complete mappings out of ${filenameMap.size} total files\n`);

    console.log('Step 3: Updating database records...');
    
    // Get current state first
    const currentLocalUrls = await prisma.sampleImage.count({
      where: {
        url: { startsWith: '/sample-images/' }
      }
    });

    console.log(`Found ${currentLocalUrls} sample images with local URLs in database`);

    for (const mapping of completeMappings) {
      try {
        // Check if this record still needs updating
        const existingRecord = await prisma.sampleImage.findFirst({
          where: {
            url: `/sample-images/${mapping.originalFilename}`
          },
          select: { id: true, url: true }
        });

        if (!existingRecord) {
          skipped++;
          continue; // Already updated or doesn't exist
        }

        const mainUrl = `https://${config.publicDomain}/${mapping.r2Key}`;
        const thumbnailUrl = mapping.thumbnailKey 
          ? `https://${config.publicDomain}/${mapping.thumbnailKey}`
          : mainUrl;

        if (!dryRun) {
          await prisma.sampleImage.update({
            where: { id: existingRecord.id },
            data: {
              url: mainUrl,
              thumbnailUrl: thumbnailUrl,
            }
          });
        }

        updated++;
        
        if (updated <= 5 || updated % 50 === 0) {
          console.log(`  ${mapping.originalFilename}: ${existingRecord.url} -> ${mainUrl}`);
        }

      } catch (error) {
        failed++;
        if (failed <= 5) {
          console.error(`  Failed to update ${mapping.originalFilename}:`, error);
        }
      }
    }

    console.log(`\n✅ Update Complete!`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped (already updated): ${skipped}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Success rate: ${updated > 0 ? ((updated / (updated + failed)) * 100).toFixed(1) : 0}%`);

    // Final verification
    if (!dryRun) {
      const remainingLocalUrls = await prisma.sampleImage.count({
        where: {
          url: { startsWith: '/sample-images/' }
        }
      });

      const r2Urls = await prisma.sampleImage.count({
        where: {
          url: { startsWith: 'https://' }
        }
      });

      console.log(`\n📊 Final Database State:`);
      console.log(`  Sample images with R2 URLs: ${r2Urls}`);
      console.log(`  Sample images with local URLs: ${remainingLocalUrls}`);
    }

  } catch (error) {
    console.error('Error in complete R2 update:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

completeR2Update(dryRun).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});