import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

/**
 * Production R2 Fix Script
 * 
 * This script can be run in production to fix sample image URLs.
 * It uses a simple approach: update database records to use R2 URLs
 * for images that we know exist in R2.
 */

const prisma = new PrismaClient();

async function productionR2Fix(dryRun: boolean = false) {
  console.log(`🔧 Production R2 Fix ${dryRun ? '(DRY RUN)' : ''}...\n`);

  try {
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production';
    const hasR2Config = !!(
      process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME
    );

    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`R2 configured: ${hasR2Config}`);
    console.log(`R2 domain: ${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}`);

    if (!hasR2Config) {
      throw new Error('R2 not configured - cannot proceed');
    }

    // Get current state
    const totalSamples = await prisma.sampleImage.count();
    const activeSamples = await prisma.sampleImage.count({
      where: { isActive: true }
    });
    const r2Samples = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: 'https://' }
      }
    });
    const localSamples = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: '/sample-images/' }
      }
    });

    console.log(`\n📊 Current State:`);
    console.log(`  Total sample images: ${totalSamples}`);
    console.log(`  Active sample images: ${activeSamples}`);
    console.log(`  With R2 URLs: ${r2Samples}`);
    console.log(`  With local URLs: ${localSamples}`);

    if (localSamples === 0) {
      console.log('\n✅ All sample images already use R2 URLs!');
      return;
    }

    // For production, we'll use a safer approach:
    // Convert local URLs to R2 URLs using a known pattern
    const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!;

    console.log(`\n🔄 Converting ${localSamples} local URLs to R2 URLs...`);

    if (dryRun) {
      // Show what would be updated
      const sampleRecords = await prisma.sampleImage.findMany({
        where: {
          isActive: true,
          url: { startsWith: '/sample-images/' }
        },
        select: { id: true, url: true, thumbnailUrl: true },
        take: 5
      });

      console.log('\nSample conversions (first 5):');
      for (const record of sampleRecords) {
        const filename = record.url.replace('/sample-images/', '');
        const newUrl = `https://${publicDomain}/samples/local/${filename}`;
        console.log(`  ${record.url} -> ${newUrl}`);
      }
    } else {
      // Actually update the records
      const updateResult = await prisma.sampleImage.updateMany({
        where: {
          isActive: true,
          url: { startsWith: '/sample-images/' }
        },
        data: {
          url: prisma.raw('REPLACE(url, \'/sample-images/\', \'https://' + publicDomain + '/samples/local/\')'),
          thumbnailUrl: prisma.raw('REPLACE(COALESCE(thumbnail_url, url), \'/sample-images/\', \'https://' + publicDomain + '/samples/local/\')')
        }
      });

      console.log(`✅ Updated ${updateResult.count} sample image records`);

      // Verify the update
      const finalLocalSamples = await prisma.sampleImage.count({
        where: {
          isActive: true,
          url: { startsWith: '/sample-images/' }
        }
      });

      const finalR2Samples = await prisma.sampleImage.count({
        where: {
          isActive: true,
          url: { startsWith: 'https://' }
        }
      });

      console.log(`\n📊 Final State:`);
      console.log(`  With R2 URLs: ${finalR2Samples}`);
      console.log(`  With local URLs: ${finalLocalSamples}`);

      if (finalLocalSamples === 0) {
        console.log('\n🎉 All sample images now use R2 URLs!');
      }
    }

  } catch (error) {
    console.error('❌ Production R2 fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

if (require.main === module) {
  productionR2Fix(dryRun).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}