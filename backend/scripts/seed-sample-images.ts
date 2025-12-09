import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Path to the sample images directory
const SAMPLE_IMAGES_PATH = path.join(process.cwd(), '../sample_images');

// Generate random age between 18 and 29
const generateRandomAge = (): number => Math.floor(Math.random() * 12) + 18;

// Parse filename to extract gender information
const parseGenderFromFilename = (filename: string): string | null => {
  const match = filename.match(/^(AF|AM|CF|CM)\d+\.jpg$/i);
  if (!match) return null;
  
  const prefix = match[1].toUpperCase();
  return (prefix === 'AF' || prefix === 'CF') ? 'female' : 'male';
};

async function seedSampleImages() {
  console.log('🔍 Scanning sample images directory...');
  
  try {
    // Check if sample images already exist
    const existingCount = await prisma.sampleImage.count();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing sample images. Skipping seed.`);
      return;
    }

    // Read all files from sample images directory
    const files = await fs.readdir(SAMPLE_IMAGES_PATH);
    const imageFiles = files.filter(file => {
      const gender = parseGenderFromFilename(file);
      return gender !== null; // Only include files that match our naming pattern
    });

    if (imageFiles.length === 0) {
      throw new Error('No valid sample images found in directory');
    }

    console.log(`📸 Found ${imageFiles.length} sample images`);

    // Count by category
    let counts = { AF: 0, AM: 0, CF: 0, CM: 0 };
    imageFiles.forEach(file => {
      const prefix = file.substring(0, 2).toUpperCase();
      if (prefix in counts) counts[prefix as keyof typeof counts]++;
    });
    
    console.log(`📊 Distribution: AF=${counts.AF}, AM=${counts.AM}, CF=${counts.CF}, CM=${counts.CM}`);

    // Process images in batches for better performance
    const BATCH_SIZE = 100;
    let processed = 0;
    
    for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
      const batch = imageFiles.slice(i, i + BATCH_SIZE);
      const sampleImageData = [];
      const rankingData = [];

      for (const filename of batch) {
        const gender = parseGenderFromFilename(filename);
        if (!gender) continue;

        // Check if R2 is configured and prioritize R2 URLs for new samples
        const useR2 = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN && 
                      process.env.CLOUDFLARE_R2_BUCKET_NAME;
        
        const imageData = {
          url: useR2 
            ? `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/samples/local/${filename}` // R2 path for new images
            : `/sample-images/${filename}`, // Fallback to local path
          thumbnailUrl: useR2
            ? `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/samples/local/${filename}` 
            : `/sample-images/${filename}`,
          gender,
          estimatedAge: generateRandomAge(),
          source: 'curated',
          isActive: true,
        };

        // Create the sample image first
        const sampleImage = await prisma.sampleImage.create({
          data: imageData,
        });

        // Prepare ranking data for this image
        rankingData.push({
          sampleImageId: sampleImage.id,
          currentPercentile: 50.0, // Start at median
          totalComparisons: 0,
          wins: 0,
          losses: 0,
          bradleyTerryScore: 0.5, // Initial neutral score
          confidence: 0.0,
        });
      }

      // Create rankings for this batch
      await prisma.sampleImageRanking.createMany({
        data: rankingData,
      });

      processed += batch.length;
      console.log(`✅ Processed ${processed}/${imageFiles.length} sample images...`);
    }

    console.log(`🎉 Successfully seeded ${imageFiles.length} sample images with rankings!`);
    
    // Final count verification
    const finalCount = await prisma.sampleImage.count();
    console.log(`🔢 Database contains ${finalCount} sample images total`);
    
  } catch (error) {
    console.error('❌ Error seeding sample images:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSampleImages();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { seedSampleImages };