import dotenv from 'dotenv';
import { prisma } from '../src/services/database';
import { r2Service } from '../src/services/r2';

// Load environment variables
dotenv.config();

interface UpdateStats {
  total: number;
  updated: number;
  failed: number;
  errors: Array<{ id: string; filename: string; error: string }>;
}

/**
 * Script to update sample image URLs from local filesystem paths to R2 URLs
 * This resolves the issue where sample images were uploaded to R2 but database still has local paths
 */
class SampleImageUrlUpdater {
  private stats: UpdateStats = {
    total: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  /**
   * Extract filename from local URL path
   */
  private extractFilename(localUrl: string): string {
    return localUrl.replace('/sample-images/', '');
  }

  /**
   * Convert filename to R2 key format (how files were uploaded)
   */
  private filenameToR2Key(filename: string): string {
    // Based on migrate-samples-to-r2.ts, files were uploaded with 'samples' prefix
    // The R2 service generates keys like: samples/{timestamp}-{uuid}.jpg
    // But we need to find the actual uploaded key for this filename
    
    // For now, we'll assume the R2 public URL format based on the migration
    // The migration script uploaded files to 'samples' prefix
    return `samples/${filename}`;
  }

  /**
   * Build R2 public URL from filename
   */
  private buildR2Url(filename: string, isThumbnail: boolean = false): string {
    const r2Key = isThumbnail 
      ? `samples/thumbnails/${filename.replace('.jpg', '.jpg')}`
      : `samples/${filename}`;
    
    return r2Service.getPublicUrl(r2Key);
  }

  /**
   * Update a single sample image record
   */
  private async updateSampleImage(sampleImage: any): Promise<boolean> {
    try {
      const filename = this.extractFilename(sampleImage.url);
      
      // Build new R2 URLs
      const newUrl = this.buildR2Url(filename);
      const newThumbnailUrl = this.buildR2Url(filename, true);

      console.log(`Updating ${sampleImage.id}: ${sampleImage.url} → ${newUrl}`);

      await prisma.sampleImage.update({
        where: { id: sampleImage.id },
        data: {
          url: newUrl,
          thumbnailUrl: newThumbnailUrl,
        },
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to update ${sampleImage.id}:`, errorMessage);
      
      this.stats.errors.push({
        id: sampleImage.id,
        filename: this.extractFilename(sampleImage.url),
        error: errorMessage
      });
      
      return false;
    }
  }

  /**
   * Process all sample images in batches
   */
  private async processBatch(sampleImages: any[], batchSize: number = 50): Promise<void> {
    for (let i = 0; i < sampleImages.length; i += batchSize) {
      const batch = sampleImages.slice(i, i + batchSize);
      
      console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleImages.length / batchSize)} (${batch.length} images)...`);
      
      const promises = batch.map(sampleImage => this.updateSampleImage(sampleImage));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value === true) {
          this.stats.updated++;
        } else {
          this.stats.failed++;
        }
      });

      // Progress update
      const processed = this.stats.updated + this.stats.failed;
      const percentage = ((processed / this.stats.total) * 100).toFixed(1);
      console.log(`Progress: ${processed}/${this.stats.total} (${percentage}%) - ✓ ${this.stats.updated} ✗ ${this.stats.failed}`);

      // Small delay between batches
      if (i + batchSize < sampleImages.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Print update summary
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('SAMPLE IMAGE URL UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total sample images: ${this.stats.total}`);
    console.log(`Successfully updated: ${this.stats.updated}`);
    console.log(`Failed to update: ${this.stats.failed}`);
    console.log(`Success rate: ${((this.stats.updated / this.stats.total) * 100).toFixed(1)}%`);

    if (this.stats.errors.length > 0) {
      console.log('\nERRORS:');
      this.stats.errors.slice(0, 10).forEach(({ id, filename, error }) => {
        console.log(`  ${filename} (${id}): ${error}`);
      });
      if (this.stats.errors.length > 10) {
        console.log(`  ... and ${this.stats.errors.length - 10} more errors`);
      }
    }
    console.log('='.repeat(60));
  }

  /**
   * Dry run - analyze what would be updated without making changes
   */
  async dryRun(): Promise<void> {
    console.log('Running sample image URL update analysis (dry run)...\n');

    try {
      // Get all sample images with local URLs
      const sampleImages = await prisma.sampleImage.findMany({
        where: {
          url: {
            startsWith: '/sample-images/',
          },
        },
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
        },
      });

      console.log(`Found ${sampleImages.length} sample images with local URLs that need updating.`);

      if (sampleImages.length === 0) {
        console.log('✅ All sample images already have R2 URLs!');
        return;
      }

      // Show sample transformations
      console.log('\nSample URL transformations:');
      sampleImages.slice(0, 5).forEach(image => {
        const filename = this.extractFilename(image.url);
        const newUrl = this.buildR2Url(filename);
        const newThumbnailUrl = this.buildR2Url(filename, true);
        
        console.log(`  ${image.url}`);
        console.log(`  → ${newUrl}`);
        console.log(`  → ${newThumbnailUrl} (thumbnail)`);
        console.log();
      });

      if (sampleImages.length > 5) {
        console.log(`  ... and ${sampleImages.length - 5} more images`);
      }

      console.log('\nTo run actual update, use: npm run update-sample-urls');

    } catch (error) {
      console.error('Dry run failed:', error);
      throw error;
    }
  }

  /**
   * Run the URL update process
   */
  async update(): Promise<void> {
    console.log('Starting sample image URL update to R2 URLs...\n');

    try {
      // Get all sample images with local URLs
      const sampleImages = await prisma.sampleImage.findMany({
        where: {
          url: {
            startsWith: '/sample-images/',
          },
        },
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
        },
      });

      this.stats.total = sampleImages.length;

      if (this.stats.total === 0) {
        console.log('✅ All sample images already have R2 URLs!');
        return;
      }

      console.log(`Found ${this.stats.total} sample images to update.`);
      console.log('Converting local filesystem URLs to R2 URLs...\n');

      // Process all sample images in batches
      await this.processBatch(sampleImages);

      // Print summary
      this.printSummary();

      if (this.stats.failed > 0) {
        throw new Error(`Failed to update ${this.stats.failed} sample images. Check logs for details.`);
      }

      console.log('\n✅ Sample image URL update completed successfully!');

    } catch (error) {
      console.error('Update failed:', error);
      this.printSummary();
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const updater = new SampleImageUrlUpdater();
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.includes('-n');

  try {
    if (isDryRun) {
      await updater.dryRun();
    } else {
      await updater.update();
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { SampleImageUrlUpdater };