const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseImageFilename(filename) {
  const match = filename.match(/^(AF|AM|CF|CM)(\d+)\.jpg$/);
  if (!match) return null;
  
  const [, prefix, number] = match;
  
  let gender, ageGroup, estimatedAge;
  
  switch (prefix) {
    case 'AF':
      gender = 'female';
      ageGroup = 'adult';
      estimatedAge = 25;
      break;
    case 'AM':
      gender = 'male';
      ageGroup = 'adult';
      estimatedAge = 25;
      break;
    case 'CF':
      gender = 'female';
      ageGroup = 'child';
      estimatedAge = 16;
      break;
    case 'CM':
      gender = 'male';
      ageGroup = 'child';
      estimatedAge = 16;
      break;
    default:
      return null;
  }
  
  return { filename, gender, ageGroup, estimatedAge };
}

async function simpleSeed() {
  try {
    console.log('🌱 Simple database seeding...');
    
    // 1. Clean up and start fresh
    console.log('🧹 Cleaning existing data...');
    await prisma.combinedRanking.deleteMany({ where: { sampleImageId: { not: null } } });
    await prisma.sampleImageRanking.deleteMany({});
    await prisma.sampleImage.deleteMany({});
    
    // 2. Create trophy config
    await prisma.trophyConfig.upsert({
      where: { configName: 'default' },
      update: {},
      create: {
        configName: 'default',
        winGain: 35,
        lossPenalty: 25,
        targetMean: 1500,
        targetStd: 430,
        fadeWidth: 300,
        learningRate: 0.05
      }
    });
    
    console.log('✅ Trophy config ready');
    
    // 3. Read sample images
    const sampleImagesDir = path.join(__dirname, '..', 'sample_images');
    const files = fs.readdirSync(sampleImagesDir)
      .filter(file => file.endsWith('.jpg'))
      .sort();
    
    console.log(`📸 Found ${files.length} sample images`);
    
    // 4. Process in smaller chunks
    const CHUNK_SIZE = 25;
    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunk = files.slice(i, i + CHUNK_SIZE);
      const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(files.length / CHUNK_SIZE);
      
      console.log(`Processing chunk ${chunkNum}/${totalChunks}...`);
      
      // Create sample images
      const imageData = [];
      for (const filename of chunk) {
        const info = parseImageFilename(filename);
        if (info) {
          imageData.push({
            url: `/sample-images/${filename}`,
            thumbnailUrl: `/sample-images/${filename}`,
            gender: info.gender,
            estimatedAge: info.estimatedAge,
            source: 'generated',
            description: `${info.ageGroup} ${info.gender}`,
            isActive: true
          });
        }
      }
      
      if (imageData.length === 0) continue;
      
      await prisma.sampleImage.createMany({ data: imageData });
      
      // Get the IDs of created images
      const createdImages = await prisma.sampleImage.findMany({
        where: { url: { in: imageData.map(img => img.url) } },
        select: { id: true, gender: true }
      });
      
      // Create rankings
      const rankingData = createdImages.map(img => ({
        sampleImageId: img.id,
        trophyScore: 0,
        hiddenBradleyTerryScore: 0,
        targetTrophyScore: null
      }));
      
      await prisma.sampleImageRanking.createMany({ data: rankingData });
      
      // Create combined rankings
      const combinedData = createdImages.map(img => ({
        sampleImageId: img.id,
        gender: img.gender,
        trophyScore: 0,
        hiddenBradleyTerryScore: 0,
        targetTrophyScore: null
      }));
      
      await prisma.combinedRanking.createMany({ data: combinedData });
      
      console.log(`✅ Processed ${imageData.length} images in chunk ${chunkNum}`);
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // 5. Final summary
    const counts = await Promise.all([
      prisma.sampleImage.count(),
      prisma.sampleImageRanking.count(),
      prisma.combinedRanking.count({ where: { sampleImageId: { not: null } } }),
      prisma.sampleImage.groupBy({ by: ['gender'], _count: { id: true } })
    ]);
    
    console.log('\n🎉 Seeding complete!');
    console.log(`Sample images: ${counts[0]}`);
    console.log(`Sample rankings: ${counts[1]}`);
    console.log(`Combined rankings: ${counts[2]}`);
    console.log('Gender breakdown:');
    counts[3].forEach(g => console.log(`  ${g.gender}: ${g._count.id}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleSeed();