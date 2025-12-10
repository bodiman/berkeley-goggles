#!/usr/bin/env node

/**
 * Upload Sample Images to R2 Script
 * 
 * This script uploads all sample images from the local directory to R2
 * with their original filenames (AF1.jpg, CM123.jpg, etc.)
 * 
 * Usage:
 *   node scripts/upload-samples-to-r2.js
 */

// Load environment variables
require('dotenv').config();

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

async function uploadSamplesToR2() {
  console.log('🚀 Starting sample images upload to R2...');
  
  // Check environment variables
  const requiredEnvVars = [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_ENDPOINT'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }
  
  // Configure R2 client
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
  
  // Determine sample images directory path
  const getSampleImagesPath = () => {
    if (process.env.NODE_ENV === 'production') {
      return path.join(process.cwd(), 'sample_images');
    } else {
      return path.join(process.cwd(), '../sample_images');
    }
  };
  
  const sampleImagesPath = getSampleImagesPath();
  console.log(`📁 Sample images directory: ${sampleImagesPath}`);
  
  // Check if directory exists
  if (!fs.existsSync(sampleImagesPath)) {
    console.error(`❌ Sample images directory not found: ${sampleImagesPath}`);
    process.exit(1);
  }
  
  // Get all image files
  const files = fs.readdirSync(sampleImagesPath);
  const imageFiles = files.filter(file => {
    if (file.startsWith('.') || !file.toLowerCase().endsWith('.jpg')) {
      return false;
    }
    // Only include files that match our naming pattern
    const match = file.match(/^(AF|AM|CF|CM)\d+\.jpg$/i);
    return match !== null;
  });
  
  if (imageFiles.length === 0) {
    console.error('❌ No valid sample images found in directory');
    process.exit(1);
  }
  
  console.log(`📸 Found ${imageFiles.length} sample images to upload`);
  
  // Count by category for reporting
  let counts = { AF: 0, AM: 0, CF: 0, CM: 0 };
  imageFiles.forEach(file => {
    const prefix = file.substring(0, 2).toUpperCase();
    if (prefix in counts) counts[prefix]++;
  });
  
  console.log(`📊 Distribution: AF=${counts.AF}, AM=${counts.AM}, CF=${counts.CF}, CM=${counts.CM}`);
  
  // Upload files in batches
  const BATCH_SIZE = 10;
  let uploadedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);
    const uploadPromises = batch.map(async (filename) => {
      try {
        const filePath = path.join(sampleImagesPath, filename);
        const fileContent = fs.readFileSync(filePath);
        
        const uploadParams = {
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: `sample-images/${filename}`,
          Body: fileContent,
          ContentType: 'image/jpeg',
        };
        
        await r2Client.send(new PutObjectCommand(uploadParams));
        uploadedCount++;
        return { success: true, filename };
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed to upload ${filename}:`, error.message);
        return { success: false, filename, error: error.message };
      }
    });
    
    await Promise.all(uploadPromises);
    
    if ((uploadedCount + failedCount) % 100 === 0 || i + BATCH_SIZE >= imageFiles.length) {
      console.log(`📤 Progress: ${uploadedCount} uploaded, ${failedCount} failed (${Math.round(((uploadedCount + failedCount) / imageFiles.length) * 100)}%)`);
    }
  }
  
  console.log(`\n✅ Upload complete!`);
  console.log(`📤 Successfully uploaded: ${uploadedCount} files`);
  if (failedCount > 0) {
    console.log(`❌ Failed uploads: ${failedCount} files`);
  }
  
  // Test a few uploaded files
  const r2Domain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'pub-348e171b4d40413abdb8c2b075b6de0d.r2.dev';
  console.log(`\n🌐 Sample uploaded files will be available at:`);
  const testFiles = imageFiles.slice(0, 3);
  testFiles.forEach(filename => {
    console.log(`   https://${r2Domain}/sample-images/${filename}`);
  });
}

// Allow running as script
if (require.main === module) {
  uploadSamplesToR2().catch(error => {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  });
}

module.exports = { uploadSamplesToR2 };