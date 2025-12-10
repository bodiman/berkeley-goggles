#!/usr/bin/env ts-node

/**
 * Simple SQL-based ranked images display
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  try {
    console.log('🏆 Getting ranked sample images with SQL...');

    // Use raw SQL to get ranked sample images
    const rankedImages = await prisma.$queryRaw<any[]>`
      SELECT 
        sir.sampleImageId,
        sir.bradleyTerryScore,
        sir.currentPercentile,
        sir.wins,
        sir.losses,
        sir.totalComparisons,
        si.url,
        si.filename,
        si.gender,
        si.estimatedAge
      FROM SampleImageRanking sir
      JOIN SampleImage si ON sir.sampleImageId = si.id
      WHERE sir.totalComparisons > 0
      ORDER BY sir.bradleyTerryScore DESC
    `;

    console.log(`Found ${rankedImages.length} ranked sample images`);

    if (rankedImages.length === 0) {
      console.log('No ranked images found. Let\'s check what tables exist...');
      
      const tables = await prisma.$queryRaw<any[]>`
        SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
      `;
      
      console.log('Available tables:');
      tables.forEach(table => console.log(`  - ${table.name}`));
      return;
    }

    // Display results
    console.log(`\n📊 Top 10 Ranked Images:`);
    console.log('Rank | Score | %ile | W-L   | Filename');
    console.log('-----|-------|------|-------|' + '-'.repeat(40));

    for (let i = 0; i < Math.min(10, rankedImages.length); i++) {
      const img = rankedImages[i];
      const rank = i + 1;
      const winLoss = `${img.wins}-${img.losses}`;
      const filename = img.filename || 'Unknown';
      
      console.log(
        `${rank.toString().padStart(4)} | ` +
        `${Number(img.bradleyTerryScore).toFixed(3)} | ` +
        `${Number(img.currentPercentile).toFixed(1).padStart(4)} | ` +
        `${winLoss.padEnd(5)} | ` +
        `${filename.substring(0, 35)}`
      );
    }

    // Show all image URLs
    console.log(`\n🖼️ All ${rankedImages.length} Images by Rank:`);
    console.log('='.repeat(80));
    
    rankedImages.forEach((img, index) => {
      const rank = index + 1;
      console.log(`${rank.toString().padStart(3)}. Score: ${Number(img.bradleyTerryScore).toFixed(3)} | URL: ${img.url}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();