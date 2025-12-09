import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function testSingleR2Image() {
  console.log('Testing single R2 image update...\n');

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

  try {
    // Get one specific database record
    const testImage = await prisma.sampleImage.findFirst({
      where: {
        url: '/sample-images/AF1.jpg'
      }
    });

    if (!testImage) {
      console.log('Test image AF1.jpg not found in database');
      return;
    }

    console.log('Database record:');
    console.log(`  ID: ${testImage.id}`);
    console.log(`  URL: ${testImage.url}`);
    console.log(`  Filename: AF1.jpg`);
    console.log();

    // Now search R2 metadata for this filename
    console.log('Searching R2 metadata for AF1.jpg...');
    
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/metadata/',
      MaxKeys: 10000, // Get all metadata files
    });

    const response = await s3Client.send(listCommand);
    
    if (response.Contents) {
      let found = false;
      
      for (const obj of response.Contents) {
        if (!obj.Key?.endsWith('.json')) continue;

        try {
          const getObjCommand = new GetObjectCommand({
            Bucket: config.bucketName,
            Key: obj.Key,
          });
          
          const objResponse = await s3Client.send(getObjCommand);
          const metadataStr = await objResponse.Body?.transformToString();
          
          if (metadataStr) {
            const metadata = JSON.parse(metadataStr);
            
            if (metadata.originalFilename === 'AF1.jpg') {
              console.log(`Found metadata for AF1.jpg!`);
              console.log(`  Image ID: ${metadata.imageId}`);
              console.log(`  Uploaded at: ${metadata.uploadedAt}`);
              
              // Now find the actual image file(s) with this imageId
              const imageListCommand = new ListObjectsV2Command({
                Bucket: config.bucketName,
                Prefix: 'samples/',
                MaxKeys: 20000,
              });

              const imageResponse = await s3Client.send(imageListCommand);
              if (imageResponse.Contents) {
                for (const imgObj of imageResponse.Contents) {
                  if (!imgObj.Key?.endsWith('.jpg')) continue;
                  
                  try {
                    const getImgCommand = new GetObjectCommand({
                      Bucket: config.bucketName,
                      Key: imgObj.Key,
                    });
                    
                    const imgObjResponse = await s3Client.send(getImgCommand);
                    const imageId = imgObjResponse.Metadata?.imageId;
                    
                    if (imageId === metadata.imageId) {
                      const publicUrl = `https://${config.publicDomain}/${imgObj.Key}`;
                      console.log(`  Found image file: ${imgObj.Key}`);
                      console.log(`  Public URL: ${publicUrl}`);
                      
                      // Test if we can update the database record
                      console.log(`\nUpdating database record...`);
                      await prisma.sampleImage.update({
                        where: { id: testImage.id },
                        data: {
                          url: publicUrl,
                          thumbnailUrl: publicUrl, // Use same for thumbnail for now
                        }
                      });
                      
                      console.log(`✅ Successfully updated database record for AF1.jpg`);
                      console.log(`  New URL: ${publicUrl}`);
                    }
                  } catch (imgError) {
                    // Skip this image
                  }
                }
              }
              
              found = true;
              break;
            }
          }
        } catch (metadataError) {
          // Skip this metadata file
        }
      }
      
      if (!found) {
        console.log('❌ Could not find metadata for AF1.jpg in R2');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSingleR2Image().catch(console.error);