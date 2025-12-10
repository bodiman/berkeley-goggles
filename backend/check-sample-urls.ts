#!/usr/bin/env ts-node

/**
 * Check what URLs are currently stored for sample images
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSampleUrls(): Promise<void> {
  try {
    console.log('🔍 Checking sample image URLs in database...\n');
    
    // Get a few sample URLs to see what format they're in
    const sampleUrls = await prisma.sampleImage.findMany({
      select: { 
        id: true, 
        url: true, 
        thumbnailUrl: true 
      },
      take: 10
    });
    
    console.log('📊 Sample URLs in database:');
    sampleUrls.forEach((sample, i) => {
      console.log(`   ${i + 1}. ${sample.url}`);
    });
    
    // Count by URL type
    const localUrlCount = await prisma.sampleImage.count({
      where: { url: { startsWith: '/sample-images/' } }
    });
    
    const r2UrlCount = await prisma.sampleImage.count({
      where: { url: { startsWith: 'https://' } }
    });
    
    const totalCount = await prisma.sampleImage.count();
    
    console.log(`\n📈 URL Distribution:`);
    console.log(`   Local paths (/sample-images/): ${localUrlCount}`);
    console.log(`   R2 URLs (https://): ${r2UrlCount}`);
    console.log(`   Total: ${totalCount}`);
    
    if (localUrlCount > 0) {
      console.log(`\n❌ Found ${localUrlCount} local file paths that need to be updated to R2 URLs!`);
    } else {
      console.log(`\n✅ All URLs are using R2 paths!`);
    }
    
  } catch (error) {
    console.error('❌ Error checking URLs:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    await checkSampleUrls();
  } catch (error) {
    console.error('Failed to check sample URLs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}