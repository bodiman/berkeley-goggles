import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Environment-aware paths for sample images
const getSampleImagesPath = (): string => {
  if (process.env.NODE_ENV === 'production') {
    // In Railway, sample images should be in the build directory
    return path.join(process.cwd(), 'sample_images');
  } else {
    // In development, they're in the parent directory
    return path.join(process.cwd(), '../sample_images');
  }
};

// Generate random age between 18 and 29
const generateRandomAge = (): number => Math.floor(Math.random() * 12) + 18;

// Parse filename to extract gender information
const parseGenderFromFilename = (filename: string): string | null => {
  const match = filename.match(/^(AF|AM|CF|CM)\d+\.jpg$/i);
  if (!match) return null;
  
  const prefix = match[1].toUpperCase();
  const secondLetter = prefix[1]; // Get the second character (F or M)
  
  // Second letter determines gender: F = female, M = male
  return secondLetter === 'F' ? 'female' : 'male';
};

async function runDatabaseMigrations() {
  try {
    logger.info('🔄 Running database migrations...');
    
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    if (process.env.NODE_ENV === 'production') {
      // In production (Railway), deploy migrations
      await execPromise('npx prisma migrate deploy');
      logger.info('✅ Database migrations deployed successfully');
    } else {
      // In development, run migrations normally
      try {
        await execPromise('npx prisma migrate dev --name init-dev');
        logger.info('✅ Development database migrations applied');
      } catch (error) {
        // If migrations already exist, just push schema
        await execPromise('npx prisma db push');
        logger.info('✅ Development database schema synchronized');
      }
    }
  } catch (error) {
    logger.error('❌ Failed to run database migrations:', error);
    throw new Error('Database migration failed');
  }
}

async function seedSampleImages(): Promise<void> {
  try {
    logger.info('🔍 Starting sample images seeding process...');
    
    // Check if sample images already exist
    const existingCount = await prisma.sampleImage.count();
    if (existingCount > 0) {
      logger.info(`Found ${existingCount} existing sample images. Skipping seed.`);
      return;
    }

    const sampleImagesPath = getSampleImagesPath();
    logger.info(`📁 Checking sample images directory: ${sampleImagesPath}`);

    // Check if directory exists
    try {
      await fs.access(sampleImagesPath);
    } catch (error) {
      logger.warn(`⚠️  Sample images directory not found: ${sampleImagesPath}`);
      logger.info('🔄 Skipping sample images seeding - directory not available');
      return; // Exit gracefully instead of throwing
    }

    // Read all files from sample images directory
    const files = await fs.readdir(sampleImagesPath);
    const imageFiles = files.filter(file => {
      // Filter out .DS_Store and other non-image files
      if (file.startsWith('.') || !file.toLowerCase().endsWith('.jpg')) {
        return false;
      }
      const gender = parseGenderFromFilename(file);
      return gender !== null; // Only include files that match our naming pattern
    });

    if (imageFiles.length === 0) {
      throw new Error('No valid sample images found in directory');
    }

    logger.info(`📸 Found ${imageFiles.length} sample images`);

    // Count by category for reporting
    let counts = { AF: 0, AM: 0, CF: 0, CM: 0 };
    imageFiles.forEach(file => {
      const prefix = file.substring(0, 2).toUpperCase();
      if (prefix in counts) counts[prefix as keyof typeof counts]++;
    });
    
    logger.info(`📊 Distribution: AF=${counts.AF}, AM=${counts.AM}, CF=${counts.CF}, CM=${counts.CM}`);

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

        // Use R2 URLs for production deployment
        const r2Domain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'pub-348e171b4d40413abdb8c2b075b6de0d.r2.dev';
        const r2BaseUrl = `https://${r2Domain}`;
        
        const imageData = {
          url: `${r2BaseUrl}/sample-images/${filename}`,
          thumbnailUrl: `${r2BaseUrl}/sample-images/${filename}`, // Using same image for thumbnail
          gender,
          estimatedAge: generateRandomAge(),
          source: 'curated',
          isActive: true,
        };

        // Create the sample image first
        try {
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
        } catch (error) {
          logger.error(`Failed to create sample image ${filename}:`, error);
          // Continue with other images
        }
      }

      // Create rankings for this batch
      if (rankingData.length > 0) {
        try {
          await prisma.sampleImageRanking.createMany({
            data: rankingData,
          });
        } catch (error) {
          logger.error('Failed to create sample image rankings:', error);
          // Continue with processing
        }
      }

      processed += batch.length;
      logger.info(`✅ Processed ${processed}/${imageFiles.length} sample images...`);
    }

    // Final count verification
    const finalCount = await prisma.sampleImage.count();
    logger.info(`🎉 Successfully seeded ${finalCount} sample images with rankings!`);
    
  } catch (error) {
    logger.error('❌ Error seeding sample images:', error);
    throw error;
  }
}

async function verifyDatabaseSetup(): Promise<void> {
  try {
    logger.info('🔍 Verifying database setup...');
    
    // Test basic database connection and count records
    const userCount = await prisma.user.count();
    const photoCount = await prisma.photo.count();
    const sampleImageCount = await prisma.sampleImage.count();
    const comparisonCount = await prisma.comparison.count();
    
    logger.info('📊 Database status:');
    logger.info(`  - Users: ${userCount}`);
    logger.info(`  - Photos: ${photoCount}`);
    logger.info(`  - Sample Images: ${sampleImageCount}`);
    logger.info(`  - Comparisons: ${comparisonCount}`);
    
    logger.info('✅ Database verification completed successfully');
    
  } catch (error) {
    logger.error('❌ Database verification failed:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting database seeding process...');
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Step 1: Ensure database migrations are applied
    await runDatabaseMigrations();
    
    // Step 2: Seed sample images (only if none exist)
    await seedSampleImages();
    
    // Step 3: Verify everything is working
    await verifyDatabaseSetup();
    
    logger.info('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Allow the script to be run directly or imported
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error during seeding:', error);
    process.exit(1);
  });
}

// Export functions for potential use in other scripts
export { main as seedDatabase, seedSampleImages, runDatabaseMigrations, verifyDatabaseSetup };