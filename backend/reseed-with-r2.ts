#!/usr/bin/env ts-node

/**
 * Clear existing sample images and re-seed with R2 URLs
 */

import { PrismaClient } from '@prisma/client';
import { seedSampleImages } from './src/scripts/seed';

const prisma = new PrismaClient();

async function clearAndReseed(): Promise<void> {
  try {
    console.log('🧹 Clearing existing sample images with local URLs...');
    
    // Get counts for reporting
    const sampleImageCount = await prisma.sampleImage.count();
    const sampleRankingCount = await prisma.sampleImageRanking.count();
    
    console.log(`📊 Found:`);
    console.log(`   - Sample images: ${sampleImageCount}`);
    console.log(`   - Sample rankings: ${sampleRankingCount}`);
    
    if (sampleImageCount === 0) {
      console.log('✅ No sample images to clear.');
    } else {
      // Clear in the correct order
      console.log('🧹 Deleting ALL comparisons (URLs will change)...');
      await prisma.comparison.deleteMany({});
      
      console.log('🧹 Deleting comparison sessions...');
      await prisma.comparisonSession.deleteMany({});
      
      console.log('🧹 Deleting combined rankings...');
      await prisma.combinedRanking.deleteMany({});
      
      console.log('🧹 Deleting sample image rankings...');
      await prisma.sampleImageRanking.deleteMany({});
      
      console.log('🧹 Resetting photo rankings...');
      await prisma.photoRanking.updateMany({
        data: {
          currentPercentile: 50.0,
          totalComparisons: 0,
          wins: 0,
          losses: 0,
          bradleyTerryScore: 1.0,
          confidence: 0.0,
        }
      });
      
      console.log('🧹 Deleting sample images...');
      await prisma.sampleImage.deleteMany({});
      
      console.log('✅ Cleanup completed!');
    }
    
    console.log('\n🌱 Re-seeding with R2 URLs...');
    await seedSampleImages();
    
    // Verify the URLs are now correct
    console.log('\n🔍 Verifying URLs...');
    const sampleUrls = await prisma.sampleImage.findMany({
      select: { url: true },
      take: 3
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
    console.error('❌ Error during clear and reseed:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    await clearAndReseed();
  } catch (error) {
    console.error('Failed to clear and reseed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}