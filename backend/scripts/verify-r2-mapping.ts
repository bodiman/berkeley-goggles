import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

interface VerificationResults {
  totalSampleImages: number;
  activeImages: number;
  r2Images: number;
  localImages: number;
  genderBreakdown: Record<string, { r2: number; local: number; total: number }>;
  sampleR2Urls: string[];
  sampleLocalUrls: string[];
  urlTest: {
    validR2Format: number;
    invalidUrls: number;
  };
}

async function verifyR2Mapping(): Promise<void> {
  console.log('🔍 Verifying R2 mapping results...\n');

  try {
    const results: VerificationResults = {
      totalSampleImages: 0,
      activeImages: 0,
      r2Images: 0,
      localImages: 0,
      genderBreakdown: {},
      sampleR2Urls: [],
      sampleLocalUrls: [],
      urlTest: {
        validR2Format: 0,
        invalidUrls: 0,
      },
    };

    // Basic counts
    results.totalSampleImages = await prisma.sampleImage.count();
    results.activeImages = await prisma.sampleImage.count({
      where: { isActive: true }
    });

    results.r2Images = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: 'https://' }
      }
    });

    results.localImages = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: '/sample-images/' }
      }
    });

    console.log('📊 Overall Statistics:');
    console.log(`  Total sample images: ${results.totalSampleImages}`);
    console.log(`  Active images: ${results.activeImages}`);
    console.log(`  With R2 URLs: ${results.r2Images}`);
    console.log(`  With local URLs: ${results.localImages}`);
    console.log(`  Mapping success rate: ${((results.r2Images / results.activeImages) * 100).toFixed(1)}%\n`);

    // Gender breakdown
    const genders = ['male', 'female'];
    for (const gender of genders) {
      const total = await prisma.sampleImage.count({
        where: { isActive: true, gender }
      });

      const r2Count = await prisma.sampleImage.count({
        where: {
          isActive: true,
          gender,
          url: { startsWith: 'https://' }
        }
      });

      const localCount = await prisma.sampleImage.count({
        where: {
          isActive: true,
          gender,
          url: { startsWith: '/sample-images/' }
        }
      });

      results.genderBreakdown[gender] = {
        total,
        r2: r2Count,
        local: localCount,
      };

      console.log(`👤 ${gender.toUpperCase()} Images:`);
      console.log(`  Total: ${total}`);
      console.log(`  R2 URLs: ${r2Count} (${((r2Count / total) * 100).toFixed(1)}%)`);
      console.log(`  Local URLs: ${localCount} (${((localCount / total) * 100).toFixed(1)}%)`);
    }

    console.log();

    // Sample URLs for inspection
    const r2Samples = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        url: { startsWith: 'https://' }
      },
      select: { url: true, thumbnailUrl: true, gender: true },
      take: 5,
    });

    const localSamples = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        url: { startsWith: '/sample-images/' }
      },
      select: { url: true, thumbnailUrl: true, gender: true },
      take: 3,
    });

    console.log('🔗 Sample R2 URLs:');
    r2Samples.forEach((img, i) => {
      console.log(`  ${i + 1}. [${img.gender}] ${img.url}`);
      if (img.thumbnailUrl !== img.url) {
        console.log(`     Thumbnail: ${img.thumbnailUrl}`);
      }
    });

    console.log('\n📁 Remaining Local URLs:');
    if (localSamples.length === 0) {
      console.log('  🎉 No local URLs remaining!');
    } else {
      localSamples.forEach((img, i) => {
        console.log(`  ${i + 1}. [${img.gender}] ${img.url}`);
      });
    }

    // URL format validation
    const allR2Images = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        url: { startsWith: 'https://' }
      },
      select: { url: true },
    });

    const expectedDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;
    results.urlTest.validR2Format = allR2Images.filter(img => 
      img.url.includes(expectedDomain || '') && 
      img.url.includes('/samples/')
    ).length;

    results.urlTest.invalidUrls = allR2Images.length - results.urlTest.validR2Format;

    console.log('\n🔍 URL Format Validation:');
    console.log(`  Valid R2 format: ${results.urlTest.validR2Format}`);
    console.log(`  Invalid format: ${results.urlTest.invalidUrls}`);
    console.log(`  Expected domain: ${expectedDomain}`);

    // Check if ranking system would work
    console.log('\n🎯 Ranking System Readiness:');
    
    // Test each gender has sufficient images
    for (const gender of genders) {
      const availableForRanking = results.genderBreakdown[gender].r2;
      if (availableForRanking >= 2) {
        console.log(`  ✅ ${gender}: ${availableForRanking} images ready for ranking`);
      } else {
        console.log(`  ⚠️  ${gender}: Only ${availableForRanking} images ready (need at least 2)`);
      }
    }

    // Final assessment
    console.log('\n🎉 Final Assessment:');
    const successRate = (results.r2Images / results.activeImages) * 100;
    
    if (successRate >= 95) {
      console.log('  🎉 EXCELLENT: Mapping is nearly complete!');
    } else if (successRate >= 80) {
      console.log('  ✅ GOOD: Most images mapped successfully');
    } else if (successRate >= 50) {
      console.log('  ⚠️  PARTIAL: Significant progress made, but more work needed');
    } else {
      console.log('  ❌ NEEDS WORK: Low success rate, investigate issues');
    }

    console.log(`     Success rate: ${successRate.toFixed(1)}%`);
    console.log(`     Remaining local URLs: ${results.localImages}`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (results.localImages > 0) {
      console.log(`  - Run mapping script again to process remaining ${results.localImages} images`);
    }
    if (results.urlTest.invalidUrls > 0) {
      console.log(`  - Investigate ${results.urlTest.invalidUrls} images with invalid URL format`);
    }
    if (results.r2Images > 0) {
      console.log('  - Test ranking system with updated R2 URLs');
      console.log('  - Deploy updated comparison endpoint to production');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  verifyR2Mapping().catch(error => {
    console.error('Verification script failed:', error);
    process.exit(1);
  });
}

export { verifyR2Mapping };