// Script to show ranked sample images using public database URL
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:XnJTnaclueXIUTSwjyLoYcdrvwfhCdPa@shuttle.proxy.rlwy.net:48574/railway"
    },
  },
});

async function showRankings() {
  try {
    console.log('🏆 Connecting to database and getting ranked sample images...');

    // Get sample image rankings with their associated image data
    const sampleRankings = await prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'desc' },
      include: {
        sampleImage: {
          select: { 
            url: true, 
            gender: true, 
            estimatedAge: true
          }
        }
      }
    });

    console.log(`\n📊 Found ${sampleRankings.length} ranked sample images`);
    
    if (sampleRankings.length === 0) {
      console.log('No ranked sample images found.');
      return;
    }

    // Create ranked list
    const rankedImages = sampleRankings.map((ranking, index) => ({
      rank: index + 1,
      id: ranking.sampleImageId,
      score: ranking.bradleyTerryScore,
      percentile: ranking.currentPercentile,
      wins: ranking.wins,
      losses: ranking.losses,
      totalComparisons: ranking.totalComparisons,
      winRate: ranking.totalComparisons > 0 ? (ranking.wins / ranking.totalComparisons * 100).toFixed(1) : '0',
      url: ranking.sampleImage?.url || 'No URL',
      gender: ranking.sampleImage?.gender || 'Unknown',
      estimatedAge: ranking.sampleImage?.estimatedAge || null
    }));

    // Display complete rankings
    console.log('\n🏆 COMPLETE BRADLEY-TERRY SAMPLE IMAGE RANKINGS 🏆');
    console.log('=' .repeat(100));
    console.log('Rank | Score | %ile | W-L-Total | Win% | Gender | Age | URL');
    console.log('-----|-------|------|-----------|------|--------|-----|' + '-'.repeat(50));

    rankedImages.forEach(img => {
      const record = `${img.wins}-${img.losses}-${img.totalComparisons}`;
      const shortUrl = img.url.length > 45 ? img.url.substring(0, 42) + '...' : img.url;
      
      console.log(
        `${img.rank.toString().padStart(4)} | ` +
        `${img.score.toFixed(3)} | ` +
        `${img.percentile.toFixed(1).padStart(4)} | ` +
        `${record.padEnd(9)} | ` +
        `${img.winRate.padStart(4)}% | ` +
        `${img.gender.padEnd(6)} | ` +
        `${(img.estimatedAge?.toString() || 'N/A').padStart(3)} | ` +
        `${shortUrl}`
      );
    });

    console.log('=' .repeat(100));

    // Statistics
    const scores = rankedImages.map(img => img.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const meanScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    console.log(`\n📊 Statistics:`);
    console.log(`   Total Images: ${rankedImages.length}`);
    console.log(`   Score Range: ${minScore.toFixed(3)} - ${maxScore.toFixed(3)}`);
    console.log(`   Mean Score: ${meanScore.toFixed(3)}`);
    console.log(`   Total Comparisons: ${rankedImages.reduce((sum, img) => sum + img.totalComparisons, 0)}`);

    // Show full URLs for top 10 and bottom 10
    console.log('\n🥇 TOP 10 IMAGES (Full URLs):');
    rankedImages.slice(0, 10).forEach(img => {
      console.log(`   ${img.rank.toString().padStart(2)}. Score: ${img.score.toFixed(3)} | ${img.url}`);
    });

    console.log('\n🥉 BOTTOM 10 IMAGES (Full URLs):');
    rankedImages.slice(-10).forEach(img => {
      console.log(`   ${img.rank.toString().padStart(2)}. Score: ${img.score.toFixed(3)} | ${img.url}`);
    });

    // Create simple HTML file
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Bradley-Terry Ranked Sample Images</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .image-card { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            gap: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .rank { 
            font-size: 18px; 
            font-weight: bold; 
            color: #0066cc;
            min-width: 50px;
        }
        .image-container {
            width: 120px;
            height: 120px;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
        }
        .details { flex-grow: 1; }
        .score { font-size: 18px; font-weight: bold; color: #d63384; }
        .stats { color: #666; margin: 5px 0; }
        .url { 
            font-family: monospace; 
            background: #f8f9fa; 
            padding: 4px 6px; 
            border-radius: 3px;
            font-size: 11px;
            word-break: break-all;
        }
        .top3 { background: linear-gradient(45deg, #fff3cd, #ffeaa7); }
        .bottom3 { background: linear-gradient(45deg, #f8d7da, #fdcae1); }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏆 Bradley-Terry Ranked Sample Images</h1>
        <p><strong>${rankedImages.length}</strong> images ranked by corrected Bradley-Terry algorithm</p>
        <p>Score range: ${minScore.toFixed(3)} - ${maxScore.toFixed(3)} | Mean: ${meanScore.toFixed(3)}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    ${rankedImages.map(img => {
      let cardClass = 'image-card';
      if (img.rank <= 3) cardClass += ' top3';
      if (img.rank > rankedImages.length - 3) cardClass += ' bottom3';
      
      return `
        <div class="${cardClass}">
            <div class="rank">#${img.rank}</div>
            <div class="image-container">
                <img src="${img.url}" 
                     alt="Rank ${img.rank}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; color: #999; font-size: 11px; text-align: center;">
                    Image<br>not available
                </div>
            </div>
            <div class="details">
                <div class="score">Score: ${img.score.toFixed(3)}</div>
                <div class="stats">
                    <strong>Percentile:</strong> ${img.percentile.toFixed(1)}% | 
                    <strong>Record:</strong> ${img.wins}-${img.losses} (${img.winRate}% win rate)
                </div>
                <div class="stats">
                    <strong>Total Comparisons:</strong> ${img.totalComparisons} | 
                    <strong>Gender:</strong> ${img.gender} | 
                    <strong>Age:</strong> ${img.estimatedAge || 'Unknown'}
                </div>
                <div class="url">${img.url}</div>
            </div>
        </div>`;
    }).join('')}
</body>
</html>`;

    // Save HTML file
    const fs = require('fs');
    const htmlPath = './ranked_sample_images.html';
    fs.writeFileSync(htmlPath, html);
    
    // Save JSON data
    const jsonPath = './ranked_sample_images.json';
    fs.writeFileSync(jsonPath, JSON.stringify(rankedImages, null, 2));

    console.log(`\n📁 Files saved:`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`\n🌐 Open ${htmlPath} in your browser to see all images with thumbnails!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showRankings();