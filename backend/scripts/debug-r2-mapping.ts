import dotenv from 'dotenv';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

async function debugR2Mapping() {
  console.log('Debugging R2 mapping...\n');

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
    // Get a sample metadata file
    console.log('Sample metadata file:');
    const metadataCommand = new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: 'samples/metadata/',
      MaxKeys: 1,
    });

    const metadataResponse = await s3Client.send(metadataCommand);
    
    if (metadataResponse.Contents && metadataResponse.Contents[0]) {
      const metadataObj = metadataResponse.Contents[0];
      console.log(`  Key: ${metadataObj.Key}`);
      
      const getMetadataCommand = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: metadataObj.Key!,
      });
      
      const metadataObjResponse = await s3Client.send(getMetadataCommand);
      const metadataStr = await metadataObjResponse.Body?.transformToString();
      
      if (metadataStr) {
        const metadata = JSON.parse(metadataStr);
        console.log(`  Content:`, metadata);
        
        const testImageId = metadata.imageId;
        console.log(`\nLooking for image files with imageId: ${testImageId}`);
        
        // Now check a few actual image files for their metadata
        console.log('\nSample image files and their metadata:');
        const imageCommand = new ListObjectsV2Command({
          Bucket: config.bucketName,
          Prefix: 'samples/',
          MaxKeys: 5,
        });

        const imageResponse = await s3Client.send(imageCommand);
        
        if (imageResponse.Contents) {
          for (const imgObj of imageResponse.Contents) {
            if (!imgObj.Key?.endsWith('.jpg')) continue;
            
            try {
              const getImgCommand = new GetObjectCommand({
                Bucket: config.bucketName,
                Key: imgObj.Key,
              });
              
              const imgObjResponse = await s3Client.send(getImgCommand);
              console.log(`  ${imgObj.Key}:`);
              console.log(`    Metadata:`, imgObjResponse.Metadata);
              
              if (imgObjResponse.Metadata?.imageId === testImageId) {
                console.log(`    ✅ MATCH! This is the image for ${metadata.originalFilename}`);
                const publicUrl = `https://${config.publicDomain}/${imgObj.Key}`;
                console.log(`    Public URL: ${publicUrl}`);
              }
            } catch (error) {
              console.log(`    Error: ${error}`);
            }
          }
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugR2Mapping().catch(console.error);