// Simple script to show ranked sample images
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

async function showRankings() {
  try {
    console.log('🏆 Getting ranked sample images...');

    // Get ranked sample images (using same approach as diagnostic script)
    const sampleRankings = await prisma.sampleImageRanking.findMany({
      include: {
        sampleImage: {
          select: { 
            url: true, 
            gender: true, 
            estimatedAge: true,
            id: true
          }
        }
      },
      orderBy: { bradleyTerryScore: 'desc' }
    });

    // Filter to only those with comparisons
    const rankedImages = sampleRankings
      .filter(r => r.totalComparisons > 0)
      .map((ranking, index) => ({
        rank: index + 1,
        id: ranking.sampleImageId,
        score: ranking.bradleyTerryScore,
        percentile: ranking.currentPercentile,
        wins: ranking.wins,
        losses: ranking.losses,
        totalComparisons: ranking.totalComparisons,
        url: ranking.sampleImage?.url || 'No URL',
        gender: ranking.sampleImage?.gender || 'Unknown',
        estimatedAge: ranking.sampleImage?.estimatedAge || null
      }));

    console.log(`\n📊 Found ${rankedImages.length} ranked sample images\n`);
    
    // Display all rankings
    console.log('🏆 COMPLETE BRADLEY-TERRY RANKINGS 🏆');
    console.log('=' .repeat(80));
    console.log('Rank | Score | %ile | Record    | Gender | Age | URL');
    console.log('-----|-------|------|-----------|--------|-----|' + '-'.repeat(40));

    rankedImages.forEach(img => {
      const record = `${img.wins}-${img.losses}`;
      const winRate = img.totalComparisons > 0 ? ((img.wins / img.totalComparisons) * 100).toFixed(1) : '0';
      const shortUrl = img.url.length > 35 ? img.url.substring(0, 32) + '...' : img.url;
      
      console.log(
        `${img.rank.toString().padStart(4)} | ` +
        `${img.score.toFixed(3)} | ` +
        `${img.percentile.toFixed(1).padStart(4)} | ` +
        `${record.padEnd(9)} | ` +
        `${img.gender.padEnd(6)} | ` +
        `${(img.estimatedAge?.toString() || 'N/A').padStart(3)} | ` +
        `${shortUrl}`
      );
    });

    console.log('=' .repeat(80));
    console.log(`\nTotal Images: ${rankedImages.length}`);
    console.log(`Score Range: ${Math.min(...rankedImages.map(i => i.score)).toFixed(3)} - ${Math.max(...rankedImages.map(i => i.score)).toFixed(3)}`);
    console.log(`Mean Score: ${(rankedImages.reduce((sum, img) => sum + img.score, 0) / rankedImages.length).toFixed(3)}`);

    // Show top 5 and bottom 5
    console.log('\n🥇 TOP 5 IMAGES:');
    rankedImages.slice(0, 5).forEach(img => {
      console.log(`   ${img.rank}. Score: ${img.score.toFixed(3)} | ${img.url}`);
    });

    console.log('\n🥉 BOTTOM 5 IMAGES:');
    rankedImages.slice(-5).forEach(img => {
      console.log(`   ${img.rank}. Score: ${img.score.toFixed(3)} | ${img.url}`);
    });

    console.log(`\n✅ Complete ranking data displayed for ${rankedImages.length} images`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showRankings();