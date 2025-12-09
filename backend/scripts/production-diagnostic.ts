import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

interface ProductionDiagnostic {
  environment: string;
  sampleImageStats: {
    total: number;
    active: number;
    byGender: Record<string, number>;
    urlTypes: {
      r2Urls: number;
      localUrls: number;
      otherUrls: number;
    };
    sampleUrls: string[];
  };
  userStats: {
    total: number;
    byGender: Record<string, number>;
    withPhotos: number;
    approvedPhotos: number;
  };
  r2Configuration: {
    isConfigured: boolean;
    publicDomain: string | null;
    bucketName: string | null;
  };
  recentActivity: {
    recentComparisons: number;
    recentUsers: number;
    lastComparisonDate: Date | null;
  };
}

async function runProductionDiagnostic(): Promise<void> {
  console.log('🔍 Running Production Diagnostic...\n');

  try {
    const diagnostic: ProductionDiagnostic = {
      environment: process.env.NODE_ENV || 'unknown',
      sampleImageStats: {
        total: 0,
        active: 0,
        byGender: {},
        urlTypes: {
          r2Urls: 0,
          localUrls: 0,
          otherUrls: 0,
        },
        sampleUrls: [],
      },
      userStats: {
        total: 0,
        byGender: {},
        withPhotos: 0,
        approvedPhotos: 0,
      },
      r2Configuration: {
        isConfigured: false,
        publicDomain: null,
        bucketName: null,
      },
      recentActivity: {
        recentComparisons: 0,
        recentUsers: 0,
        lastComparisonDate: null,
      },
    };

    // Check R2 Configuration
    diagnostic.r2Configuration = {
      isConfigured: !!(
        process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
        process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN &&
        process.env.CLOUDFLARE_R2_BUCKET_NAME
      ),
      publicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || null,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || null,
    };

    console.log('🌍 Environment Info:');
    console.log(`  NODE_ENV: ${diagnostic.environment}`);
    console.log(`  R2 Configured: ${diagnostic.r2Configuration.isConfigured}`);
    console.log(`  R2 Domain: ${diagnostic.r2Configuration.publicDomain}`);
    console.log(`  R2 Bucket: ${diagnostic.r2Configuration.bucketName}\n`);

    // Get sample image statistics
    console.log('📸 Sample Image Analysis:');
    
    diagnostic.sampleImageStats.total = await prisma.sampleImage.count();
    diagnostic.sampleImageStats.active = await prisma.sampleImage.count({
      where: { isActive: true }
    });

    console.log(`  Total sample images: ${diagnostic.sampleImageStats.total}`);
    console.log(`  Active sample images: ${diagnostic.sampleImageStats.active}`);

    // Count by gender
    const genderCounts = await prisma.sampleImage.groupBy({
      by: ['gender'],
      where: { isActive: true },
      _count: { gender: true },
    });

    for (const count of genderCounts) {
      diagnostic.sampleImageStats.byGender[count.gender] = count._count.gender;
      console.log(`  Active ${count.gender} images: ${count._count.gender}`);
    }

    // Analyze URL types
    diagnostic.sampleImageStats.urlTypes.r2Urls = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: 'https://' }
      }
    });

    diagnostic.sampleImageStats.urlTypes.localUrls = await prisma.sampleImage.count({
      where: {
        isActive: true,
        url: { startsWith: '/sample-images/' }
      }
    });

    diagnostic.sampleImageStats.urlTypes.otherUrls = diagnostic.sampleImageStats.active - 
      diagnostic.sampleImageStats.urlTypes.r2Urls - 
      diagnostic.sampleImageStats.urlTypes.localUrls;

    console.log(`  With R2 URLs: ${diagnostic.sampleImageStats.urlTypes.r2Urls}`);
    console.log(`  With local URLs: ${diagnostic.sampleImageStats.urlTypes.localUrls}`);
    console.log(`  With other URLs: ${diagnostic.sampleImageStats.urlTypes.otherUrls}`);

    // Get sample URLs for inspection
    const sampleImages = await prisma.sampleImage.findMany({
      where: { isActive: true },
      select: { url: true, gender: true },
      take: 10,
    });

    diagnostic.sampleImageStats.sampleUrls = sampleImages.map(img => `${img.gender}: ${img.url}`);
    
    console.log('\n  Sample URLs:');
    for (const url of diagnostic.sampleImageStats.sampleUrls) {
      console.log(`    ${url}`);
    }

    // Get user statistics
    console.log('\n👤 User Statistics:');
    
    diagnostic.userStats.total = await prisma.user.count();
    console.log(`  Total users: ${diagnostic.userStats.total}`);

    const userGenderCounts = await prisma.user.groupBy({
      by: ['gender'],
      _count: { gender: true },
    });

    for (const count of userGenderCounts) {
      diagnostic.userStats.byGender[count.gender] = count._count.gender;
      console.log(`  ${count.gender} users: ${count._count.gender}`);
    }

    diagnostic.userStats.withPhotos = await prisma.user.count({
      where: {
        photos: { some: {} }
      }
    });

    diagnostic.userStats.approvedPhotos = await prisma.photo.count({
      where: { status: 'approved' }
    });

    console.log(`  Users with photos: ${diagnostic.userStats.withPhotos}`);
    console.log(`  Approved photos: ${diagnostic.userStats.approvedPhotos}`);

    // Get recent activity
    console.log('\n📊 Recent Activity:');
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    diagnostic.recentActivity.recentComparisons = await prisma.comparison.count({
      where: {
        timestamp: { gte: oneDayAgo }
      }
    });

    diagnostic.recentActivity.recentUsers = await prisma.user.count({
      where: {
        createdAt: { gte: oneWeekAgo }
      }
    });

    const lastComparison = await prisma.comparison.findFirst({
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    });

    diagnostic.recentActivity.lastComparisonDate = lastComparison?.timestamp || null;

    console.log(`  Comparisons in last 24h: ${diagnostic.recentActivity.recentComparisons}`);
    console.log(`  New users in last week: ${diagnostic.recentActivity.recentUsers}`);
    console.log(`  Last comparison: ${diagnostic.recentActivity.lastComparisonDate || 'Never'}`);

    // Generate recommendations
    console.log('\n💡 Recommendations:');
    
    if (diagnostic.sampleImageStats.urlTypes.localUrls > 0) {
      console.log(`  ⚠️  ${diagnostic.sampleImageStats.urlTypes.localUrls} sample images still use local URLs - run R2 update script`);
    }

    if (diagnostic.sampleImageStats.active === 0) {
      console.log('  ❌ No active sample images found - seed sample images');
    }

    if (diagnostic.sampleImageStats.byGender['female'] === 0 || diagnostic.sampleImageStats.byGender['male'] === 0) {
      console.log('  ⚠️  Missing sample images for one or both genders');
    }

    if (!diagnostic.r2Configuration.isConfigured) {
      console.log('  ⚠️  R2 is not properly configured');
    }

    if (diagnostic.userStats.approvedPhotos === 0) {
      console.log('  ℹ️  No approved user photos - system will rely on sample images only');
    }

    if (diagnostic.recentActivity.recentComparisons === 0) {
      console.log('  ℹ️  No recent comparisons - may indicate a ranking issue');
    }

    console.log('\n✅ Diagnostic complete!');

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  runProductionDiagnostic().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { runProductionDiagnostic };