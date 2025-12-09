import dotenv from 'dotenv';
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

async function checkR2Structure() {
  console.log('Checking R2 bucket structure...\n');

  // Validate environment
  const config: R2Config = {
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

  try {
    // List actual image files in the samples directory
    console.log('Listing sample image files...\n');
    
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/',
      MaxKeys: 20,
    });

    const response = await s3Client.send(listCommand);
    
    if (response.Contents) {
      let mainImages = 0;
      let thumbnails = 0;
      let metadataFiles = 0;
      
      console.log('Sample R2 objects:');
      for (const obj of response.Contents.slice(0, 10)) {
        if (!obj.Key) continue;
        
        console.log(`  ${obj.Key}`);
        
        if (obj.Key.includes('/metadata/')) {
          metadataFiles++;
        } else if (obj.Key.includes('/thumbnails/')) {
          thumbnails++;
        } else if (obj.Key.endsWith('.jpg')) {
          mainImages++;
          
          // Try to get metadata for this image
          try {
            const getObjCommand = new GetObjectCommand({
              Bucket: config.bucketName,
              Key: obj.Key,
            });
            
            const objResponse = await s3Client.send(getObjCommand);
            const imageId = objResponse.Metadata?.imageId;
            
            if (imageId) {
              console.log(`    -> ImageID: ${imageId}`);
              
              // Construct public URL
              const publicUrl = `https://${config.publicDomain}/${obj.Key}`;
              console.log(`    -> Public URL: ${publicUrl}`);
            }
          } catch (error) {
            console.log(`    -> Error getting metadata`);
          }
        }
      }
      
      console.log(`\nSummary from first 20 objects:`);
      console.log(`  Main images: ${mainImages}`);
      console.log(`  Thumbnails: ${thumbnails}`);
      console.log(`  Metadata files: ${metadataFiles}`);
      console.log(`  Total objects: ${response.Contents.length}`);
      
      // Try to get a complete count
      const countCommand = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: 'samples/',
        MaxKeys: 10000,
      });
      
      const countResponse = await s3Client.send(countCommand);
      console.log(`  Total objects in samples/: ${countResponse.Contents?.length || 0}`);
      
    } else {
      console.log('No objects found in samples directory');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkR2Structure().catch(console.error);