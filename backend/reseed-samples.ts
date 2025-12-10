#!/usr/bin/env ts-node

/**
 * Re-seed sample images with R2 URLs
 */

import { seedSampleImages } from './src/scripts/seed';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('🌱 Re-seeding sample images with R2 URLs...');
    
    await seedSampleImages();
    
    // Verify the URLs are correct
    console.log('\n🔍 Verifying URLs...');
    const sampleUrls = await prisma.sampleImage.findMany({
      select: { url: true },
      take: 5
    });
    
    console.log('📊 Sample URLs after re-seeding:');
    sampleUrls.forEach((sample, i) => {
      console.log(`   ${i + 1}. ${sample.url}`);
    });
    
    const r2UrlCount = await prisma.sampleImage.count({
      where: { url: { startsWith: 'https://' } }
    });
    
    const totalCount = await prisma.sampleImage.count();
    
    console.log(`\n📈 Final counts:`);
    console.log(`   R2 URLs: ${r2UrlCount}`);
    console.log(`   Total: ${totalCount}`);
    
    if (r2UrlCount === totalCount) {
      console.log(`\n🎉 SUCCESS! All sample images now use R2 URLs!`);
    } else {
      console.log(`\n❌ Some URLs are still not R2 paths.`);
    }
    
  } catch (error) {
    console.error('❌ Re-seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}