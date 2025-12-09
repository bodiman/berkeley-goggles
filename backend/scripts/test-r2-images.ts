import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testR2Images() {
  console.log('Testing R2 image URLs...\n');

  try {
    // Check how many records now have R2 URLs
    const r2Count = await prisma.sampleImage.count({
      where: {
        url: {
          startsWith: 'https://'
        }
      }
    });

    const localCount = await prisma.sampleImage.count({
      where: {
        url: {
          startsWith: '/sample-images/'
        }
      }
    });

    console.log(`Sample images with R2 URLs: ${r2Count}`);
    console.log(`Sample images with local URLs: ${localCount}`);
    console.log(`Total sample images: ${r2Count + localCount}\n`);

    // Get a few examples of updated records
    const updatedImages = await prisma.sampleImage.findMany({
      where: {
        url: {
          startsWith: 'https://'
        }
      },
      take: 5,
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        gender: true,
        isActive: true,
      }
    });

    console.log('Sample R2 image records:');
    for (const img of updatedImages) {
      console.log(`  ${img.id}: ${img.gender}, active: ${img.isActive}`);
      console.log(`    URL: ${img.url}`);
      console.log(`    Thumbnail: ${img.thumbnailUrl}\n`);
    }

    // Test comparison endpoint logic 
    console.log('Testing comparison endpoint URL logic...');
    
    const testImage = updatedImages[0];
    if (testImage) {
      // Simulate the buildPhotoObject logic
      const baseUrl = 'http://localhost:3001'; // Test environment
      
      const result = {
        id: testImage.id,
        url: testImage.url.startsWith('http') ? testImage.url : `${baseUrl}${testImage.url}`,
        thumbnailUrl: testImage.thumbnailUrl 
          ? (testImage.thumbnailUrl.startsWith('http') ? testImage.thumbnailUrl : `${baseUrl}${testImage.thumbnailUrl}`)
          : (testImage.url.startsWith('http') ? testImage.url : `${baseUrl}${testImage.url}`),
        userId: 'sample',
        userAge: 25, // mock
        userGender: testImage.gender,
        type: 'sample',
      };
      
      console.log('Simulated comparison endpoint result:');
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('Error testing R2 images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testR2Images().catch(console.error);