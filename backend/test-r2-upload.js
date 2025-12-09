const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function testR2Upload() {
  try {
    // Import the R2 service using tsx
    const { execSync } = require('child_process');
    
    // Test using a simple curl to verify the endpoint works
    console.log('🧪 Testing R2 connection...');
    
    const testData = JSON.stringify({
      message: 'test'
    });
    
    // Try to make a simple request to verify auth works
    console.log('📡 Testing R2 service instantiation...');
    
    console.log('🧪 Testing R2 upload with a single image...');
    
    // Read a test image
    const testImagePath = path.join(process.cwd(), '../sample_images/AF1.jpg');
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
    
    console.log('🌐 Testing CDN access...');
    console.log(`Main image: ${result.url}`);
    if (result.thumbnailUrl) {
      console.log(`Thumbnail: ${result.thumbnailUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testR2Upload();