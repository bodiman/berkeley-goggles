#!/usr/bin/env ts-node

/**
 * Very simple ranking display
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('🏆 Getting sample image rankings...');

    // Get just the rankings first
    const rankings = await prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'desc' },
      take: 20, // Limit to top 20
    });

    console.log(`\n📊 Top ${rankings.length} Sample Images by Bradley-Terry Score:`);
    console.log('Rank | Sample ID                      | Score | Percentile | W-L');
    console.log('-----|-------------------------------|-------|------------|------');

    rankings.forEach((ranking, index) => {
      const rank = index + 1;
      console.log(
        `${rank.toString().padStart(4)} | ` +
        `${ranking.sampleImageId.padEnd(29)} | ` +
        `${ranking.bradleyTerryScore.toFixed(3)} | ` +
        `${ranking.currentPercentile.toFixed(1).padStart(9)} | ` +
        `${ranking.wins}-${ranking.losses}`
      );
    });

    console.log(`\n✅ Listed top ${rankings.length} ranked sample images`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();