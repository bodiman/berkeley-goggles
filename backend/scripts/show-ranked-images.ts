#!/usr/bin/env ts-node

/**
 * Show images ranked by Bradley-Terry scores
 * 
 * This script displays all images (photos and samples) ordered by their
 * Bradley-Terry scores, showing the actual image URLs and scores.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

interface RankedImage {
  id: string;
  type: 'photo' | 'sample';
  score: number;
  rank: number;
  percentile: number;
  wins: number;
  losses: number;
  totalComparisons: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: any;
}

async function generateImageRanking(): Promise<void> {
  console.log('🏆 Generating image ranking by Bradley-Terry scores...');

  // Get photos with rankings
  const photoRankings = await prisma.photoRanking.findMany({
    where: { totalComparisons: { gt: 0 } },
    select: {
      photoId: true,
      bradleyTerryScore: true,
      currentPercentile: true,
      wins: true,
      losses: true,
      totalComparisons: true,
    },
    orderBy: { bradleyTerryScore: 'desc' },
  });

  // Get photo details separately
  const photoDetails = await prisma.photo.findMany({
    where: {
      id: { in: photoRankings.map(r => r.photoId) }
    },
    select: {
      id: true,
      url: true,
      thumbnailUrl: true,
      userId: true,
      user: {
        select: {
          id: true,
          age: true,
          gender: true,
        },
      },
    },
  });

  // Get sample images with rankings
  const sampleRankings = await prisma.sampleImageRanking.findMany({
    where: { totalComparisons: { gt: 0 } },
    select: {
      sampleImageId: true,
      bradleyTerryScore: true,
      currentPercentile: true,
      wins: true,
      losses: true,
      totalComparisons: true,
    },
    orderBy: { bradleyTerryScore: 'desc' },
  });

  // Get sample image details separately
  const sampleDetails = await prisma.sampleImage.findMany({
    where: {
      id: { in: sampleRankings.map(r => r.sampleImageId) }
    },
    select: {
      id: true,
      url: true,
      thumbnailUrl: true,
      filename: true,
      gender: true,
      estimatedAge: true,
      isActive: true,
    },
  });

  // Combine and create ranked list
  const allRankedImages: RankedImage[] = [];

  // Create lookup maps for details
  const photoDetailMap = new Map(photoDetails.map(p => [p.id, p]));
  const sampleDetailMap = new Map(sampleDetails.map(s => [s.id, s]));

  // Add photos
  for (const ranking of photoRankings) {
    const photo = photoDetailMap.get(ranking.photoId);
    if (photo) {
      allRankedImages.push({
        id: ranking.photoId,
        type: 'photo',
        score: ranking.bradleyTerryScore,
        rank: 0, // Will be set below
        percentile: ranking.currentPercentile,
        wins: ranking.wins,
        losses: ranking.losses,
        totalComparisons: ranking.totalComparisons,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        metadata: {
          userId: photo.userId,
          userAge: photo.user?.age,
          userGender: photo.user?.gender,
        },
      });
    }
  }

  // Add sample images
  for (const ranking of sampleRankings) {
    const sample = sampleDetailMap.get(ranking.sampleImageId);
    if (sample) {
      allRankedImages.push({
        id: ranking.sampleImageId,
        type: 'sample',
        score: ranking.bradleyTerryScore,
        rank: 0, // Will be set below
        percentile: ranking.currentPercentile,
        wins: ranking.wins,
        losses: ranking.losses,
        totalComparisons: ranking.totalComparisons,
        url: sample.url,
        thumbnailUrl: sample.thumbnailUrl,
        metadata: {
          filename: sample.filename,
          gender: sample.gender,
          estimatedAge: sample.estimatedAge,
          isActive: sample.isActive,
        },
      });
    }
  }

  // Sort by score (descending) and assign ranks
  allRankedImages.sort((a, b) => b.score - a.score);
  allRankedImages.forEach((image, index) => {
    image.rank = index + 1;
  });

  console.log(`\n📊 Found ${allRankedImages.length} ranked images:`);
  console.log(`   Photos: ${photoRankings.length}`);
  console.log(`   Sample images: ${sampleRankings.length}`);

  // Print top rankings
  console.log(`\n🥇 Top 10 Ranked Images:`);
  console.log('='.repeat(100));
  console.log('Rank | Type   | Score | %ile | W-L-T | Image URL');
  console.log('-----|--------|-------|------|-------|' + '-'.repeat(50));

  for (let i = 0; i < Math.min(10, allRankedImages.length); i++) {
    const img = allRankedImages[i];
    const winLoss = `${img.wins}-${img.losses}-${img.totalComparisons}`;
    const shortUrl = img.url.length > 45 ? img.url.substring(0, 42) + '...' : img.url;
    
    console.log(
      `${img.rank.toString().padStart(4)} | ` +
      `${img.type.padEnd(6)} | ` +
      `${img.score.toFixed(3)} | ` +
      `${img.percentile.toFixed(1).padStart(4)} | ` +
      `${winLoss.padEnd(5)} | ` +
      `${shortUrl}`
    );
  }

  // Print bottom rankings
  console.log(`\n🥉 Bottom 10 Ranked Images:`);
  console.log('='.repeat(100));
  console.log('Rank | Type   | Score | %ile | W-L-T | Image URL');
  console.log('-----|--------|-------|------|-------|' + '-'.repeat(50));

  const bottomStart = Math.max(0, allRankedImages.length - 10);
  for (let i = bottomStart; i < allRankedImages.length; i++) {
    const img = allRankedImages[i];
    const winLoss = `${img.wins}-${img.losses}-${img.totalComparisons}`;
    const shortUrl = img.url.length > 45 ? img.url.substring(0, 42) + '...' : img.url;
    
    console.log(
      `${img.rank.toString().padStart(4)} | ` +
      `${img.type.padEnd(6)} | ` +
      `${img.score.toFixed(3)} | ` +
      `${img.percentile.toFixed(1).padStart(4)} | ` +
      `${winLoss.padEnd(5)} | ` +
      `${shortUrl}`
    );
  }

  // Generate detailed HTML report
  const htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bradley-Terry Image Rankings</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            line-height: 1.6;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .image-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .image-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .rank-badge {
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }
        .top3 {
            background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
        }
        .type-badge {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .type-photo {
            background: #e3f2fd;
            color: #1565c0;
        }
        .type-sample {
            background: #f3e5f5;
            color: #6a1b9a;
        }
        .image-container {
            width: 100%;
            height: 200px;
            background: #f0f0f0;
            border-radius: 6px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            border-radius: 6px;
        }
        .image-placeholder {
            color: #666;
            font-style: italic;
        }
        .score-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
            font-size: 14px;
        }
        .score-item {
            text-align: center;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .score-value {
            font-weight: bold;
            font-size: 16px;
            color: #495057;
        }
        .win-rate {
            font-size: 12px;
            color: #28a745;
            font-weight: bold;
        }
        .metadata {
            margin-top: 10px;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
            padding-top: 8px;
        }
        .search-box {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 16px;
        }
        .filter-buttons {
            margin-bottom: 20px;
        }
        .filter-btn {
            padding: 8px 16px;
            margin-right: 10px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
        }
        .filter-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏆 Bradley-Terry Image Rankings</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${allRankedImages.length}</div>
                <div>Total Images</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${photoRankings.length}</div>
                <div>User Photos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${sampleRankings.length}</div>
                <div>Sample Images</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${allRankedImages.reduce((sum, img) => sum + img.totalComparisons, 0)}</div>
                <div>Total Comparisons</div>
            </div>
        </div>

        <input type="text" id="searchBox" class="search-box" placeholder="Search by rank, score, or type...">
        
        <div class="filter-buttons">
            <button class="filter-btn active" onclick="filterImages('all')">All Images</button>
            <button class="filter-btn" onclick="filterImages('photo')">Photos Only</button>
            <button class="filter-btn" onclick="filterImages('sample')">Samples Only</button>
            <button class="filter-btn" onclick="filterImages('top10')">Top 10</button>
            <button class="filter-btn" onclick="filterImages('bottom10')">Bottom 10</button>
        </div>
    </div>

    <div class="image-grid" id="imageGrid">
        ${allRankedImages.map(img => {
          const isTop3 = img.rank <= 3;
          const winRate = img.totalComparisons > 0 ? (img.wins / img.totalComparisons * 100).toFixed(1) : '0';
          
          // Handle different URL formats
          let imageUrl = img.url;
          if (img.type === 'sample' && !imageUrl.startsWith('http')) {
            // For local sample images, construct proper URL
            imageUrl = imageUrl.startsWith('/') ? `http://localhost:3001${imageUrl}` : `http://localhost:3001/${imageUrl}`;
          }
          
          return `
            <div class="image-card" data-type="${img.type}" data-rank="${img.rank}" data-score="${img.score}">
                <div class="rank-badge ${isTop3 ? 'top3' : ''}">
                    #${img.rank}
                </div>
                <span class="type-badge type-${img.type}">${img.type}</span>
                
                <div class="image-container">
                    <img src="${imageUrl}" 
                         alt="Rank ${img.rank}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="image-placeholder" style="display: none;">
                        Image not available<br>
                        <small>${img.url}</small>
                    </div>
                </div>
                
                <div class="score-info">
                    <div class="score-item">
                        <div class="score-value">${img.score.toFixed(3)}</div>
                        <div>Bradley-Terry Score</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${img.percentile.toFixed(1)}%</div>
                        <div>Percentile</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${img.wins}-${img.losses}</div>
                        <div>Win-Loss</div>
                        <div class="win-rate">${winRate}% win rate</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${img.totalComparisons}</div>
                        <div>Total Comparisons</div>
                    </div>
                </div>
                
                <div class="metadata">
                    <strong>ID:</strong> ${img.id}<br>
                    ${img.type === 'photo' ? `
                        <strong>User:</strong> ${img.metadata?.userId || 'Unknown'}<br>
                        <strong>Age:</strong> ${img.metadata?.userAge || 'Unknown'}<br>
                        <strong>Gender:</strong> ${img.metadata?.userGender || 'Unknown'}
                    ` : `
                        <strong>Filename:</strong> ${img.metadata?.filename || 'Unknown'}<br>
                        <strong>Gender:</strong> ${img.metadata?.gender || 'Unknown'}<br>
                        <strong>Est. Age:</strong> ${img.metadata?.estimatedAge || 'Unknown'}
                    `}
                </div>
            </div>
          `;
        }).join('')}
    </div>

    <script>
        // Search functionality
        document.getElementById('searchBox').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.image-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const rank = card.dataset.rank;
                const type = card.dataset.type;
                const score = card.dataset.score;
                
                const matches = text.includes(searchTerm) || 
                               rank.includes(searchTerm) || 
                               type.includes(searchTerm) || 
                               score.includes(searchTerm);
                
                card.style.display = matches ? 'block' : 'none';
            });
        });

        // Filter functionality
        function filterImages(filter) {
            const cards = document.querySelectorAll('.image-card');
            const buttons = document.querySelectorAll('.filter-btn');
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            cards.forEach((card, index) => {
                const type = card.dataset.type;
                const rank = parseInt(card.dataset.rank);
                
                let show = false;
                switch(filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'photo':
                        show = type === 'photo';
                        break;
                    case 'sample':
                        show = type === 'sample';
                        break;
                    case 'top10':
                        show = rank <= 10;
                        break;
                    case 'bottom10':
                        show = rank > ${allRankedImages.length - 10};
                        break;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        }
    </script>
</body>
</html>`;

  // Write HTML report
  const outputDir = path.join(process.cwd(), '..', 'analysis_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const htmlPath = path.join(outputDir, `bradley_terry_rankings_${timestamp}.html`);
  fs.writeFileSync(htmlPath, htmlReport);

  // Write JSON data
  const jsonPath = path.join(outputDir, `bradley_terry_rankings_${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(allRankedImages, null, 2));

  console.log(`\n📁 Files created:`);
  console.log(`   HTML Report: ${htmlPath}`);
  console.log(`   JSON Data: ${jsonPath}`);
  console.log(`\n🌐 To view the rankings:`);
  console.log(`   open ${htmlPath}`);
  console.log(`\n📊 The HTML report includes:`);
  console.log(`   • Interactive image grid with thumbnails`);
  console.log(`   • Search and filter functionality`);
  console.log(`   • Detailed statistics for each image`);
  console.log(`   • Win rates, scores, and percentiles`);
  console.log(`   • Responsive design for different screen sizes`);
}

async function main(): Promise<void> {
  try {
    await generateImageRanking();
  } catch (error) {
    console.error('❌ Error generating image ranking:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generateImageRanking };