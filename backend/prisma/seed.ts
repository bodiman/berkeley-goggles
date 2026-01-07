import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ImageFile {
  filename: string;
  gender: 'male' | 'female';
  ageGroup: 'adult' | 'child';
  estimatedAge: number;
}

// Parse filename to extract metadata
function parseImageFilename(filename: string): ImageFile | null {
  const match = filename.match(/^(AF|AM|CF|CM)(\d+)\.jpg$/);
  if (!match) return null;
  
  const [, prefix, number] = match;
  
  let gender: 'male' | 'female';
  let ageGroup: 'adult' | 'child';
  let estimatedAge: number;
  
  switch (prefix) {
    case 'AF':
      gender = 'female';
      ageGroup = 'adult';
      estimatedAge = 25; // Average adult age
      break;
    case 'AM':
      gender = 'male';
      ageGroup = 'adult';
      estimatedAge = 25;
      break;
    case 'CF':
      gender = 'female';
      ageGroup = 'child';
      estimatedAge = 16; // Teen age
      break;
    case 'CM':
      gender = 'male';
      ageGroup = 'child';
      estimatedAge = 16;
      break;
    default:
      return null;
  }
  
  return {
    filename,
    gender,
    ageGroup,
    estimatedAge
  };
}

async function seedSampleImages() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // 1. Create default trophy config
    console.log('📊 Creating default trophy configuration...');
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
    console.log('✅ Trophy config created');

    // 2. Clear existing sample images
    console.log('🧹 Clearing existing sample images...');
    await prisma.sampleImageRanking.deleteMany({});
    await prisma.sampleImage.deleteMany({});
    console.log('✅ Existing sample images cleared');

    // 3. Read sample images directory
    const sampleImagesDir = path.join(process.cwd(), '..', 'sample_images');
    console.log(`📁 Reading sample images from: ${sampleImagesDir}`);
    
    if (!fs.existsSync(sampleImagesDir)) {
      console.error(`❌ Sample images directory not found: ${sampleImagesDir}`);
      return;
    }
    
    const files = fs.readdirSync(sampleImagesDir)
      .filter(file => file.endsWith('.jpg'))
      .sort(); // Sort for consistent ordering
    
    console.log(`📸 Found ${files.length} sample images`);
    
    // 4. Process images in batches to avoid overwhelming the database
    const BATCH_SIZE = 50; // Smaller batches to avoid connection issues
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, files.length);
      const batch = files.slice(start, end);
      
      console.log(`\n🔄 Processing batch ${batchIndex + 1}/${totalBatches} (${start + 1}-${end})...`);
      
      const sampleImageData = batch.map(filename => {
        const imageInfo = parseImageFilename(filename);
        if (!imageInfo) {
          console.warn(`⚠️  Skipping invalid filename: ${filename}`);
          return null;
        }
        
        return {
          url: `/sample-images/${filename}`,
          thumbnailUrl: `/sample-images/${filename}`, // Same as URL for now
          gender: imageInfo.gender,
          estimatedAge: imageInfo.estimatedAge,
          source: 'generated',
          description: `${imageInfo.ageGroup} ${imageInfo.gender}`,
          isActive: true
        };
      }).filter(Boolean); // Remove null entries
      
      // Insert sample images
      const createdImages = await prisma.sampleImage.createMany({
        data: sampleImageData,
        skipDuplicates: true
      });
      
      console.log(`✅ Created ${sampleImageData.length} sample images in batch ${batchIndex + 1}`);
      
      // Create rankings for the images we just inserted
      const imageIds = await prisma.sampleImage.findMany({
        where: {
          url: {
            in: sampleImageData.map(img => img.url)
          }
        },
        select: { id: true }
      });
      
      const rankingData = imageIds.map(image => ({
        sampleImageId: image.id,
        currentPercentile: 50.0,
        totalComparisons: 0,
        wins: 0,
        losses: 0,
        bradleyTerryScore: 0.5,
        trophyScore: 0,
        hiddenBradleyTerryScore: 0,
        targetTrophyScore: null,
        confidence: 0.0
      }));
      
      await prisma.sampleImageRanking.createMany({
        data: rankingData,
        skipDuplicates: true
      });
      
      console.log(`✅ Created ${rankingData.length} sample image rankings in batch ${batchIndex + 1}`);
      
      // Add a small delay between batches to prevent connection overload
      if (batchIndex < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // 5. Summary
    const finalCounts = await Promise.all([
      prisma.sampleImage.count(),
      prisma.sampleImageRanking.count(),
      prisma.sampleImage.groupBy({
        by: ['gender'],
        _count: { id: true }
      })
    ]);
    
    const [totalImages, totalRankings, genderBreakdown] = finalCounts;
    
    console.log('\n🎉 Database seeding completed!');
    console.log('📊 Summary:');
    console.log(`   Total sample images: ${totalImages}`);
    console.log(`   Total rankings: ${totalRankings}`);
    console.log('   Gender breakdown:');
    genderBreakdown.forEach(group => {
      console.log(`     ${group.gender}: ${group._count.id} images`);
    });
    
    // 6. Create combined rankings for sample images
    console.log('\n🔄 Creating combined rankings for sample images...');
    
    const sampleImages = await prisma.sampleImage.findMany({
      include: { ranking: true }
    });
    
    const combinedRankingData = sampleImages.map(sampleImage => ({
      sampleImageId: sampleImage.id,
      photoId: null,
      userId: null,
      gender: sampleImage.gender,
      currentPercentile: 50.0,
      totalComparisons: 0,
      wins: 0,
      losses: 0,
      bradleyTerryScore: 0.5,
      trophyScore: 0,
      hiddenBradleyTerryScore: 0,
      targetTrophyScore: null,
      confidence: 0.0
    }));
    
    // Process combined rankings in batches
    const combinedBatches = Math.ceil(combinedRankingData.length / BATCH_SIZE);
    for (let i = 0; i < combinedBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, combinedRankingData.length);
      const batch = combinedRankingData.slice(start, end);
      
      await prisma.combinedRanking.createMany({
        data: batch,
        skipDuplicates: true
      });
      
      console.log(`✅ Created combined rankings batch ${i + 1}/${combinedBatches}`);
    }
    
    const totalCombined = await prisma.combinedRanking.count();
    console.log(`✅ Created ${totalCombined} combined rankings`);
    
    console.log('\n🏆 Trophy system is ready with sample images!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSampleImages()
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });