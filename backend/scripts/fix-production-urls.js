#!/usr/bin/env node

/**
 * Production URL Fix Script
 * 
 * This script fixes localhost URLs in the production database by:
 * 1. Converting existing localhost sample image URLs to R2 URLs
 * 2. Optionally re-seeding if needed
 * 
 * Usage:
 *   NODE_ENV=production node scripts/fix-production-urls.js
 */

const { PrismaClient } = require('@prisma/client');

async function fixProductionUrls() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking production environment...');
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ This script must be run with NODE_ENV=production');
      process.exit(1);
    }
    
    const r2Domain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'pub-348e171b4d40413abdb8c2b075b6de0d.r2.dev';
    console.log(`🌐 Using R2 domain: ${r2Domain}`);
    
    // Find sample images with localhost URLs
    const localhostImages = await prisma.sampleImage.findMany({
      where: {
        url: {
          contains: 'localhost'
        }
      }
    });
    
    console.log(`🔍 Found ${localhostImages.length} sample images with localhost URLs`);
    
    if (localhostImages.length === 0) {
      console.log('✅ No localhost URLs found. Database is already correct.');
      return;
    }
    
    // Update each image URL
    let updatedCount = 0;
    for (const image of localhostImages) {
      try {
        // Extract filename from localhost URL
        const filename = image.url.split('/').pop();
        const newUrl = `https://${r2Domain}/sample-images/${filename}`;
        
        await prisma.sampleImage.update({
          where: { id: image.id },
          data: {
            url: newUrl,
            thumbnailUrl: newUrl // Update thumbnail too
          }
        });
        
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`📝 Updated ${updatedCount}/${localhostImages.length} URLs...`);
        }
      } catch (error) {
        console.error(`❌ Failed to update image ${image.id}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} sample image URLs to R2`);
    
    // Verify the fix
    const remainingLocalhost = await prisma.sampleImage.count({
      where: {
        url: {
          contains: 'localhost'
        }
      }
    });
    
    if (remainingLocalhost > 0) {
      console.warn(`⚠️  Warning: ${remainingLocalhost} localhost URLs still remain`);
    } else {
      console.log('🎉 All localhost URLs successfully converted to R2 URLs!');
    }
    
  } catch (error) {
    console.error('❌ Error fixing production URLs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running as script or importing as module
if (require.main === module) {
  fixProductionUrls().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { fixProductionUrls };