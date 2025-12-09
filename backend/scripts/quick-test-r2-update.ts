import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickTest() {
  console.log('Quick R2 update test...\n');

  // Check how many sample images have local URLs
  const sampleImagesWithLocalUrls = await prisma.sampleImage.findMany({
    where: {
      url: {
        startsWith: '/sample-images/'
      }
    },
    select: {
      id: true,
      url: true,
      thumbnailUrl: true,
    },
    take: 10 // Just get a few for testing
  });

  console.log(`Found ${sampleImagesWithLocalUrls.length} sample images with local URLs (showing first 10):`);
  
  for (const img of sampleImagesWithLocalUrls) {
    console.log(`  ID: ${img.id}, URL: ${img.url}, ThumbnailURL: ${img.thumbnailUrl}`);
  }

  // Count total
  const totalLocalUrls = await prisma.sampleImage.count({
    where: {
      url: {
        startsWith: '/sample-images/'
      }
    }
  });

  console.log(`\nTotal sample images with local URLs: ${totalLocalUrls}`);

  // Check if any already have R2 URLs
  const sampleImagesWithR2Urls = await prisma.sampleImage.count({
    where: {
      url: {
        startsWith: 'https://'
      }
    }
  });

  console.log(`Sample images with R2 URLs: ${sampleImagesWithR2Urls}`);
  
  await prisma.$disconnect();
}

quickTest().catch(console.error);