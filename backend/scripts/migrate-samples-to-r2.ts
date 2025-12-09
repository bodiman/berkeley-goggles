import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { r2Service, isR2Configured } from '../src/services/r2';

interface MigrationStats {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
  startTime: Date;
  endTime?: Date;
}

class SampleImageMigrator {
  private sampleImagesPath: string;
  private stats: MigrationStats;
  private batchSize: number = 10; // Process 10 images at a time

  constructor() {
    this.sampleImagesPath = path.join(process.cwd(), 'sample_images');
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [],
      startTime: new Date(),
    };
  }

  /**
   * Parse gender and ID from filename
   * Expected format: AF1234.jpg (Asian Female 1234) or AM5678.jpg (Asian Male 5678)
   */
  private parseFilename(filename: string): { gender?: string; age?: number; id?: string } {
    const match = filename.match(/^([A-Z]{2})(\d+)\.jpg$/i);
    if (!match) return {};

    const [, prefix, idStr] = match;
    const id = idStr;
    
    // Parse gender from second character
    const genderChar = prefix[1]?.toLowerCase();
    const gender = genderChar === 'f' ? 'female' : genderChar === 'm' ? 'male' : undefined;

    return { gender, id };
  }

  /**
   * Get all sample image files
   */
  private async getSampleImageFiles(): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(this.sampleImagesPath);
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png'].includes(ext) && !file.startsWith('.');
      });
    } catch (error) {
      console.error('Error reading sample images directory:', error);
      throw error;
    }
  }

  /**
   * Process a single image file
   */
  private async processSingleImage(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.sampleImagesPath, filename);
      const buffer = await fs.promises.readFile(filePath);
      
      // Parse metadata from filename
      const metadata = this.parseFilename(filename);
      
      // Upload to R2
      await r2Service.uploadSampleImage(buffer, filename, metadata);
      
      console.log(`✓ Uploaded: ${filename}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`✗ Failed to upload ${filename}:`, errorMessage);
      this.stats.errors.push({ file: filename, error: errorMessage });
      return false;
    }
  }

  /**
   * Process images in batches
   */
  private async processBatch(files: string[]): Promise<void> {
    const batches = this.chunkArray(files, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\nProcessing batch ${i + 1}/${batches.length} (${batch.length} files)...`);
      
      const promises = batch.map(file => this.processSingleImage(file));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value === true) {
          this.stats.successful++;
        } else {
          this.stats.failed++;
        }
      });

      // Progress update
      const processed = this.stats.successful + this.stats.failed;
      const percentage = ((processed / this.stats.total) * 100).toFixed(1);
      console.log(`Progress: ${processed}/${this.stats.total} (${percentage}%) - ✓ ${this.stats.successful} ✗ ${this.stats.failed}`);
      
      // Small delay between batches to avoid overwhelming R2
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Utility function to chunk array into batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Print migration summary
   */
  private printSummary(): void {
    this.stats.endTime = new Date();
    const duration = this.stats.endTime.getTime() - this.stats.startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);

    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files: ${this.stats.total}`);
    console.log(`Successful uploads: ${this.stats.successful}`);
    console.log(`Failed uploads: ${this.stats.failed}`);
    console.log(`Duration: ${minutes}m ${seconds}s`);
    console.log(`Success rate: ${((this.stats.successful / this.stats.total) * 100).toFixed(1)}%`);

    if (this.stats.errors.length > 0) {
      console.log('\nERRORS:');
      this.stats.errors.forEach(({ file, error }) => {
        console.log(`  ${file}: ${error}`);
      });
    }

    console.log('='.repeat(60));
  }

  /**
   * Save migration report to file
   */
  private async saveMigrationReport(): Promise<void> {
    const reportPath = path.join(process.cwd(), 'migration-report.json');
    const report = {
      ...this.stats,
      migrationDate: new Date().toISOString(),
      sampleImagesPath: this.sampleImagesPath,
    };

    try {
      await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
      console.log(`\nMigration report saved to: ${reportPath}`);
    } catch (error) {
      console.error('Failed to save migration report:', error);
    }
  }

  /**
   * Run the migration
   */
  async migrate(): Promise<void> {
    console.log('Starting sample images migration to Cloudflare R2...\n');

    // Check if R2 is configured
    if (!isR2Configured()) {
      throw new Error('Cloudflare R2 is not properly configured. Please check your environment variables.');
    }

    // Check if sample images directory exists
    if (!fs.existsSync(this.sampleImagesPath)) {
      throw new Error(`Sample images directory not found: ${this.sampleImagesPath}`);
    }

    try {
      // Get all image files
      const files = await this.getSampleImageFiles();
      this.stats.total = files.length;

      if (this.stats.total === 0) {
        console.log('No sample images found to migrate.');
        return;
      }

      console.log(`Found ${this.stats.total} sample images to migrate.`);
      console.log(`Batch size: ${this.batchSize}`);
      console.log(`Sample images path: ${this.sampleImagesPath}\n`);

      // Process all files in batches
      await this.processBatch(files);

      // Print summary and save report
      this.printSummary();
      await this.saveMigrationReport();

    } catch (error) {
      console.error('Migration failed:', error);
      this.stats.endTime = new Date();
      await this.saveMigrationReport();
      throw error;
    }
  }

  /**
   * Dry run - just analyze files without uploading
   */
  async dryRun(): Promise<void> {
    console.log('Running sample images migration analysis (dry run)...\n');

    try {
      const files = await this.getSampleImageFiles();
      console.log(`Total sample images found: ${files.length}`);

      if (files.length === 0) {
        console.log('No sample images found.');
        return;
      }

      // Analyze first 10 files as examples
      console.log('\nSample file analysis:');
      const sampleFiles = files.slice(0, 10);
      
      sampleFiles.forEach(filename => {
        const filePath = path.join(this.sampleImagesPath, filename);
        const stats = fs.statSync(filePath);
        const metadata = this.parseFilename(filename);
        
        console.log(`  ${filename}:`);
        console.log(`    Size: ${(stats.size / 1024).toFixed(1)} KB`);
        console.log(`    Gender: ${metadata.gender || 'unknown'}`);
        console.log(`    ID: ${metadata.id || 'unknown'}`);
      });

      if (files.length > 10) {
        console.log(`  ... and ${files.length - 10} more files`);
      }

      const totalSizeMB = files.reduce((total, filename) => {
        const filePath = path.join(this.sampleImagesPath, filename);
        const stats = fs.statSync(filePath);
        return total + stats.size;
      }, 0) / (1024 * 1024);

      console.log(`\nTotal size: ${totalSizeMB.toFixed(1)} MB`);
      console.log(`Estimated migration time: ${Math.ceil(files.length / this.batchSize)} minutes`);
      console.log('\nTo run actual migration, use: npm run migrate:samples');

    } catch (error) {
      console.error('Dry run failed:', error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const migrator = new SampleImageMigrator();
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.includes('-n');

  try {
    if (isDryRun) {
      await migrator.dryRun();
    } else {
      await migrator.migrate();
    }
  } catch (error) {
    console.error('Migration script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { SampleImageMigrator };