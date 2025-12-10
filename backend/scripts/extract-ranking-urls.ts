#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

async function main() {
  try {
    console.log('🔍 Extracting ranked sample image data...');

    // Use same approach as diagnostic script
    const sampleRankings = await prisma.sampleImageRanking.findMany();
    console.log(`Found ${sampleRankings.length} sample rankings`);

    // Get rankings with comparisons
    const rankedItems = sampleRankings.filter(r => r.totalComparisons > 0);
    console.log(`Found ${rankedItems.length} with comparisons`);

    // Sort by score
    rankedItems.sort((a, b) => b.bradleyTerryScore - a.bradleyTerryScore);

    // Get sample image URLs
    const sampleImages = await prisma.sampleImage.findMany();
    console.log(`Found ${sampleImages.length} sample images`);

    const urlMap = new Map();
    sampleImages.forEach(img => {
      urlMap.set(img.id, img.url);
    });

    console.log('\n🏆 Top Ranked Sample Images:');
    console.log('Rank | Score | URL');
    console.log('-----|-------|' + '-'.repeat(60));

    rankedItems.forEach((item, index) => {
      const rank = index + 1;
      const url = urlMap.get(item.sampleImageId) || 'Unknown';
      console.log(`${rank.toString().padStart(4)} | ${item.bradleyTerryScore.toFixed(3)} | ${url}`);
    });

    // Save to file
    const outputData = rankedItems.map((item, index) => ({
      rank: index + 1,
      id: item.sampleImageId,
      score: item.bradleyTerryScore,
      percentile: item.currentPercentile,
      wins: item.wins,
      losses: item.losses,
      totalComparisons: item.totalComparisons,
      url: urlMap.get(item.sampleImageId) || 'Unknown'
    }));

    fs.writeFileSync('../analysis_output/ranked_images.json', JSON.stringify(outputData, null, 2));
    console.log('\n📁 Data saved to ../analysis_output/ranked_images.json');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();