#!/usr/bin/env ts-node

/**
 * PostgreSQL-based ranked images display
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main(): Promise<void> {
  try {
    console.log('🏆 Getting ranked sample images from PostgreSQL...');

    // First, let's see what we have
    const sampleImageCount = await prisma.sampleImageRanking.count({
      where: { totalComparisons: { gt: 0 } }
    });

    console.log(`Found ${sampleImageCount} sample images with comparisons`);

    if (sampleImageCount === 0) {
      console.log('No sample images with comparisons found.');
      return;
    }

    // Get the ranked sample images
    const rankedImages = await prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'desc' },
      include: {
        sampleImage: true
      }
    });

    console.log(`\n📊 All ${rankedImages.length} Ranked Sample Images:`);
    console.log('Rank | Score | %ile | W-L-T | URL');
    console.log('-----|-------|------|-------|' + '-'.repeat(60));

    const results = rankedImages.map((ranking, index) => {
      const rank = index + 1;
      const winLoss = `${ranking.wins}-${ranking.losses}-${ranking.totalComparisons}`;
      const url = ranking.sampleImage?.url || 'No URL';
      const shortUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
      
      console.log(
        `${rank.toString().padStart(4)} | ` +
        `${ranking.bradleyTerryScore.toFixed(3)} | ` +
        `${ranking.currentPercentile.toFixed(1).padStart(4)} | ` +
        `${winLoss.padEnd(5)} | ` +
        `${shortUrl}`
      );

      return {
        rank,
        id: ranking.sampleImageId,
        score: ranking.bradleyTerryScore,
        percentile: ranking.currentPercentile,
        wins: ranking.wins,
        losses: ranking.losses,
        totalComparisons: ranking.totalComparisons,
        url: ranking.sampleImage?.url || 'Unknown',
        filename: ranking.sampleImage?.filename || 'Unknown',
        gender: ranking.sampleImage?.gender || 'Unknown',
        estimatedAge: ranking.sampleImage?.estimatedAge || null,
        thumbnailUrl: ranking.sampleImage?.thumbnailUrl,
      };
    });

    // Create simple HTML page
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Ranked Sample Images</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .image-card { 
            border: 1px solid #ddd; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .rank { 
            font-size: 18px; 
            font-weight: bold; 
            color: #0066cc;
            min-width: 40px;
        }
        .image-container {
            width: 150px;
            height: 150px;
            border: 1px solid #ccc;
            border-radius: 4px;
            overflow: hidden;
            flex-shrink: 0;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
        }
        .image-placeholder {
            color: #666;
            font-size: 12px;
            text-align: center;
        }
        .details { flex-grow: 1; }
        .score { font-size: 20px; font-weight: bold; color: #d63384; }
        .stats { color: #666; margin-top: 5px; }
        .url { 
            font-family: monospace; 
            background: #f8f9fa; 
            padding: 4px 8px; 
            border-radius: 3px;
            word-break: break-all;
            margin-top: 8px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <h1>🏆 Bradley-Terry Ranked Sample Images</h1>
    <p>Total: ${results.length} images with comparisons</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    ${results.map(img => `
        <div class="image-card">
            <div class="rank">#${img.rank}</div>
            <div class="image-container">
                <img src="${img.url}" 
                     alt="Rank ${img.rank}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="image-placeholder" style="display: none;">
                    Image not available<br>
                    ${img.filename}
                </div>
            </div>
            <div class="details">
                <div class="score">Score: ${img.score.toFixed(3)}</div>
                <div class="stats">
                    Percentile: ${img.percentile.toFixed(1)}% | 
                    Record: ${img.wins}-${img.losses} (${img.totalComparisons} total) |
                    Win Rate: ${((img.wins / img.totalComparisons) * 100).toFixed(1)}%
                </div>
                <div class="stats">
                    Gender: ${img.gender} | 
                    Age: ${img.estimatedAge || 'Unknown'} |
                    ID: ${img.id}
                </div>
                <div class="url">${img.url}</div>
            </div>
        </div>
    `).join('')}
</body>
</html>
    `;

    // Save files
    const outputDir = path.join(process.cwd(), '..', 'analysis_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const htmlPath = path.join(outputDir, 'ranked_sample_images.html');
    const jsonPath = path.join(outputDir, 'ranked_sample_images.json');

    fs.writeFileSync(htmlPath, htmlContent);
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

    console.log(`\n📁 Files saved:`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`\n🌐 Open the HTML file to see images with thumbnails!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();