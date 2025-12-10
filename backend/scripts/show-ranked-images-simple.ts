#!/usr/bin/env ts-node

/**
 * Simple ranked images display
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('🏆 Getting ranked sample images...');

    // Get sample images with rankings
    const sampleRankings = await prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'desc' },
    });

    console.log(`Found ${sampleRankings.length} ranked sample images`);

    // Get the actual sample image details
    const sampleImages = await prisma.sampleImage.findMany({
      where: {
        id: { in: sampleRankings.map(r => r.sampleImageId) }
      },
    });

    // Create a map for easy lookup
    const imageMap = new Map(sampleImages.map(img => [img.id, img]));

    // Combine ranking and image data
    const rankedImages = sampleRankings.map((ranking, index) => {
      const image = imageMap.get(ranking.sampleImageId);
      return {
        rank: index + 1,
        id: ranking.sampleImageId,
        score: ranking.bradleyTerryScore,
        percentile: ranking.currentPercentile,
        wins: ranking.wins,
        losses: ranking.losses,
        totalComparisons: ranking.totalComparisons,
        url: image?.url || 'Unknown',
        filename: image?.filename || 'Unknown',
        gender: image?.gender || 'Unknown',
      };
    });

    // Display results
    console.log(`\n📊 Top 10 Ranked Images:`);
    console.log('Rank | Score | %ile | W-L   | URL');
    console.log('-----|-------|------|-------|' + '-'.repeat(50));

    for (let i = 0; i < Math.min(10, rankedImages.length); i++) {
      const img = rankedImages[i];
      const winLoss = `${img.wins}-${img.losses}`;
      const shortUrl = img.url.length > 40 ? img.url.substring(0, 37) + '...' : img.url;
      
      console.log(
        `${img.rank.toString().padStart(4)} | ` +
        `${img.score.toFixed(3)} | ` +
        `${img.percentile.toFixed(1).padStart(4)} | ` +
        `${winLoss.padEnd(5)} | ` +
        `${shortUrl}`
      );
    }

    // Generate simple JSON output
    const outputDir = path.join(process.cwd(), '..', 'analysis_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonPath = path.join(outputDir, 'ranked_images.json');
    fs.writeFileSync(jsonPath, JSON.stringify(rankedImages, null, 2));

    console.log(`\n📁 JSON data saved to: ${jsonPath}`);
    console.log(`\n✅ Complete ranking data for ${rankedImages.length} images saved`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();