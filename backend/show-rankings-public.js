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

    // Show full URLs for all images
    console.log('\n📋 ALL IMAGE URLs BY RANK:');
    console.log('=' .repeat(80));
    rankedImages.forEach(img => {
      console.log(`${img.rank.toString().padStart(2)}. Score: ${img.score.toFixed(3)} | ${img.url}`);
    });

    // Save JSON data
    const fs = require('fs');
    const jsonPath = '../analysis_output/ranked_sample_images.json';
    
    // Create directory if it doesn't exist
    const path = require('path');
    const outputDir = path.dirname(jsonPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(jsonPath, JSON.stringify(rankedImages, null, 2));

    console.log(`\n📁 JSON data saved: ${jsonPath}`);
    console.log(`✅ Complete ranking data for ${rankedImages.length} images displayed and saved!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showRankings();