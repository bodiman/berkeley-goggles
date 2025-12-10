#!/usr/bin/env ts-node

/**
 * Clear existing sample images with local URLs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearOldSamples(): Promise<void> {
  try {
    console.log('🧹 Clearing existing sample images with local URLs...');
    
    const sampleImageCount = await prisma.sampleImage.count();
    console.log(`📊 Found ${sampleImageCount} sample images to clear`);
    
    if (sampleImageCount === 0) {
      console.log('✅ No sample images to clear.');
      return;
    }
    
    // Clear in correct order to avoid foreign key constraints
    console.log('🧹 Deleting comparisons...');
    await prisma.comparison.deleteMany({});
    
    console.log('🧹 Deleting comparison sessions...');
    await prisma.comparisonSession.deleteMany({});
    
    console.log('🧹 Deleting combined rankings...');
    await prisma.combinedRanking.deleteMany({});
    
    console.log('🧹 Deleting sample rankings...');
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
    
    const remainingCount = await prisma.sampleImage.count();
    console.log(`✅ Cleanup completed! Remaining sample images: ${remainingCount}`);
    
  } catch (error) {
    console.error('❌ Error clearing sample images:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    await clearOldSamples();
  } catch (error) {
    console.error('Failed to clear sample images:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}