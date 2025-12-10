const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Getting ranked sample images...');

    // Get sample rankings
    const rankings = await prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'desc' }
    });

    console.log(`Found ${rankings.length} ranked sample images`);

    // Get sample image details
    const sampleImages = await prisma.sampleImage.findMany();
    const imageMap = new Map();
    sampleImages.forEach(img => {
      imageMap.set(img.id, img);
    });

    // Create ranked list
    const rankedImages = rankings.map((ranking, index) => {
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
        gender: image?.gender || 'Unknown',
        estimatedAge: image?.estimatedAge || null
      };
    });

    // Display results
    console.log('\\n🏆 All Ranked Sample Images:');
    console.log('Rank | Score | %ile | W-L   | URL');
    console.log('-----|-------|------|-------|' + '-'.repeat(50));

    rankedImages.forEach(img => {
      const winLoss = `${img.wins}-${img.losses}`;
      const shortUrl = img.url.length > 45 ? img.url.substring(0, 42) + '...' : img.url;
      console.log(
        `${img.rank.toString().padStart(4)} | ` +
        `${img.score.toFixed(3)} | ` +
        `${img.percentile.toFixed(1).padStart(4)} | ` +
        `${winLoss.padEnd(5)} | ` +
        `${shortUrl}`
      );
    });

    // Create output directory
    const outputDir = path.join(__dirname, '..', 'analysis_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save JSON data
    const jsonPath = path.join(outputDir, 'ranked_sample_images.json');
    fs.writeFileSync(jsonPath, JSON.stringify(rankedImages, null, 2));

    // Create simple HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Ranked Sample Images</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .image { margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        .rank { font-weight: bold; color: #0066cc; }
        .score { color: #d63384; font-weight: bold; }
        img { max-width: 200px; max-height: 200px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🏆 Bradley-Terry Ranked Sample Images</h1>
    <p>Total: ${rankedImages.length} images</p>
    ${rankedImages.map(img => `
        <div class="image">
            <div class="rank">#${img.rank}</div>
            <div class="score">Score: ${img.score.toFixed(3)} (${img.percentile.toFixed(1)}th percentile)</div>
            <div>Record: ${img.wins}-${img.losses} (${img.totalComparisons} comparisons)</div>
            <div>Gender: ${img.gender}, Age: ${img.estimatedAge || 'Unknown'}</div>
            <img src="${img.url}" alt="Rank ${img.rank}" onerror="this.style.display='none'">
            <div style="font-family: monospace; font-size: 12px; color: #666;">${img.url}</div>
        </div>
    `).join('')}
</body>
</html>`;

    const htmlPath = path.join(outputDir, 'ranked_sample_images.html');
    fs.writeFileSync(htmlPath, html);

    console.log(`\\n📁 Files saved:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`\\n🌐 Open the HTML file to see the images!`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();