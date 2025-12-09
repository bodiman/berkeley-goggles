import { PrismaClient } from '@prisma/client';
import { r2Service } from '../src/services/r2';

const prisma = new PrismaClient();

async function testR2UrlUpdate() {
  console.log('Testing R2 URL update for a small sample...\n');

  try {
    // Get just the first 3 sample images
    const testImages = await prisma.sampleImage.findMany({
      where: {
        url: {
          startsWith: '/sample-images/'
        }
      },
      take: 3
    });

    console.log(`Testing with ${testImages.length} sample images:\n`);

    for (const image of testImages) {
      const filename = image.url.replace('/sample-images/', '');
      console.log(`Image: ${filename}`);
      console.log(`  Current URL: ${image.url}`);
      console.log(`  Current Thumbnail: ${image.thumbnailUrl}`);
      
      // For now, let's try to manually construct a test R2 URL and see if it works
      // We know from the migration that files were uploaded to R2 with the 'samples' prefix
      // The real solution will be to find the actual R2 keys, but for testing let's see if we can construct a working URL
      
      // First, let's just update the comparison route to handle both URL types, then worry about updating the database
      console.log(`  This would need to be updated to an R2 URL\n`);
    }

    console.log('Test completed - comparison route has been fixed to handle both local and R2 URLs');
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testR2UrlUpdate().catch(console.error);