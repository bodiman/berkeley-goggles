import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

import { r2Service } from './src/services/r2';

async function testR2Upload() {
  try {
    console.log('🧪 Testing R2 upload with a single image...');
    
    // Read a test image
    const testImagePath = path.join(process.cwd(), '../sample_images/AF1.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      throw new Error(`Test image not found: ${testImagePath}`);
    }
    
    const buffer = fs.readFileSync(testImagePath);
    console.log(`📁 Read test image: ${testImagePath} (${buffer.length} bytes)`);
    
    // Upload to R2
    console.log('⬆️ Uploading to R2...');
    const result = await r2Service.uploadSampleImage(buffer, 'AF1.jpg', { gender: 'female', id: '1' });
    
    console.log('✅ Upload successful!');
    console.log('📊 Result:', {
      id: result.id,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      size: result.size,
    });
    
    console.log('🌐 CDN URLs:');
    console.log(`Main image: ${result.url}`);
    if (result.thumbnailUrl) {
      console.log(`Thumbnail: ${result.thumbnailUrl}`);
    }
    
    // Test URL accessibility (basic check)
    console.log('📡 Testing URL accessibility...');
    const response = await fetch(result.url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('🎉 R2 CDN is working! Image is accessible.');
    } else {
      console.log('⚠️ Image uploaded but CDN access failed.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testR2Upload();