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

async function finalR2Update(dryRun: boolean = false) {
  console.log(`Final R2 Update ${dryRun ? '(DRY RUN)' : ''}...\n`);

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

  try {
    console.log('Step 1: Building filename to imageId mapping from R2 metadata...');
    
    // Build mapping from metadata
    const filenameMap = new Map<string, FileMapping>();
    
    const metadataCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/metadata/',
      MaxKeys: 10000,
    });

    const metadataResponse = await s3Client.send(metadataCommand);
    
    if (metadataResponse.Contents) {
      let processed = 0;
      
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < metadataResponse.Contents.length; i += batchSize) {
        batches.push(metadataResponse.Contents.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const promises = batch
          .filter(obj => obj.Key?.endsWith('.json'))
          .map(async obj => {
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
              // Skip this metadata file
            }
          });

        await Promise.all(promises);
        processed += batch.length;
        if (processed % 500 === 0) {
          console.log(`  Processed ${processed}/${metadataResponse.Contents.length} metadata files`);
        }
      }
    }

    console.log(`Built mapping for ${filenameMap.size} files\n`);

    console.log('Step 2: Finding R2 image keys by imageId...');
    
    // Now get all image files and match them by imageId
    const imageCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/',
      MaxKeys: 20000,
    });

    const imageResponse = await s3Client.send(imageCommand);
    
    if (imageResponse.Contents) {
      const imageFiles = imageResponse.Contents.filter(obj => 
        obj.Key && 
        obj.Key.endsWith('.jpg') && 
        !obj.Key.includes('/metadata/')
      );

      console.log(`Found ${imageFiles.length} image files in R2`);

      // Process image files in batches to get their imageId metadata
      const imageBatches = [];
      const imageBatchSize = 20; // Smaller batch for API calls
      for (let i = 0; i < imageFiles.length; i += imageBatchSize) {
        imageBatches.push(imageFiles.slice(i, i + imageBatchSize));
      }

      let processedImages = 0;
      
      for (const batch of imageBatches) {
        const promises = batch.map(async obj => {
          try {
            const getImgCommand = new GetObjectCommand({
              Bucket: config.bucketName,
              Key: obj.Key!,
            });
            
            const imgObjResponse = await s3Client.send(getImgCommand);
            const imageId = imgObjResponse.Metadata?.imageid; // Note: lowercase in R2 metadata
            
            if (imageId) {
              // Find the filename mapping for this imageId
              for (const [filename, mapping] of filenameMap.entries()) {
                if (mapping.imageId === imageId) {
                  if (obj.Key!.includes('/thumbnails/')) {
                    mapping.thumbnailKey = obj.Key!;
                  } else {
                    mapping.r2Key = obj.Key!;
                  }
                  break;
                }
              }
            }
          } catch (error) {
            // Skip this image
          }
        });

        await Promise.all(promises);
        processedImages += batch.length;
        if (processedImages % 200 === 0) {
          console.log(`  Processed ${processedImages}/${imageFiles.length} image files`);
        }
      }
    }

    // Count how many files have complete mappings
    const completeMappings = Array.from(filenameMap.values()).filter(m => m.r2Key);
    console.log(`Found complete mappings for ${completeMappings.length} files\n`);

    console.log('Step 3: Updating database records...');
    
    for (const mapping of completeMappings) {
      try {
        const mainUrl = `https://${config.publicDomain}/${mapping.r2Key}`;
        const thumbnailUrl = mapping.thumbnailKey 
          ? `https://${config.publicDomain}/${mapping.thumbnailKey}`
          : mainUrl;

        if (!dryRun) {
          await prisma.sampleImage.updateMany({
            where: {
              url: `/sample-images/${mapping.originalFilename}`
            },
            data: {
              url: mainUrl,
              thumbnailUrl: thumbnailUrl,
            }
          });
        }

        updated++;
        
        if (updated <= 5 || updated % 100 === 0) {
          console.log(`  ${mapping.originalFilename}: /sample-images/${mapping.originalFilename} -> ${mainUrl}`);
        }

      } catch (error) {
        failed++;
        console.error(`  Failed to update ${mapping.originalFilename}:`, error);
      }
    }

    console.log(`\n✅ Complete! Updated: ${updated}, Failed: ${failed}`);
    console.log(`Success rate: ${((updated / (updated + failed)) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('Error in final update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

finalR2Update(dryRun).catch(console.error);