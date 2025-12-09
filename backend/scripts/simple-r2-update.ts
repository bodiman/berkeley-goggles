import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
}

async function simpleR2Update() {
  console.log('Simple R2 Update - Finding and updating a few sample records...\n');

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
    // Get just the first few sample images to test
    const testImages = await prisma.sampleImage.findMany({
      where: {
        url: {
          startsWith: '/sample-images/'
        }
      },
      take: 5
    });

    console.log(`Testing with ${testImages.length} sample images\n`);

    // Let's find just a few metadata files to see the format
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/metadata/',
      MaxKeys: 10,
    });

    const response = await s3Client.send(listCommand);
    
    if (response.Contents && response.Contents.length > 0) {
      console.log('Sample metadata files found in R2:');
      
      for (let i = 0; i < Math.min(3, response.Contents.length); i++) {
        const obj = response.Contents[i];
        if (!obj.Key) continue;

        console.log(`\nMetadata file: ${obj.Key}`);
        
        try {
          // Read the metadata
          const getObjCommand = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: obj.Key,
          });
          
          const objResponse = await s3Client.send(getObjCommand);
          const metadataStr = await objResponse.Body?.transformToString();
          
          if (metadataStr) {
            const metadata = JSON.parse(metadataStr);
            console.log(`  Original filename: ${metadata.originalFilename}`);
            console.log(`  Image ID: ${metadata.imageId}`);
            
            // Try to find the corresponding image files
            const imageListCommand = new ListObjectsV2Command({
              Bucket: config.bucketName,
              Prefix: `samples/${metadata.imageId}`,
              MaxKeys: 5,
            });
            
            const imageResponse = await s3Client.send(imageListCommand);
            if (imageResponse.Contents) {
              console.log(`  Found ${imageResponse.Contents.length} related files:`);
              for (const imgObj of imageResponse.Contents) {
                if (imgObj.Key) {
                  const url = `https://${config.publicDomain}/${imgObj.Key}`;
                  console.log(`    ${imgObj.Key} -> ${url}`);
                }
              }
            }
          }
        } catch (error) {
          console.log(`  Error reading metadata: ${error}`);
        }
      }
    } else {
      console.log('No metadata files found in R2');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleR2Update().catch(console.error);