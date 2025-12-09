import { promises as fs } from 'fs';
import path from 'path';

/**
 * Setup script for copying sample images to Railway-accessible location
 * This script should be run during Railway deployment to ensure sample images 
 * are available in the correct location for static serving.
 */

const SOURCE_DIR = path.join(__dirname, '../../sample_images');
const TARGET_DIR = path.join(__dirname, '../sample_images');

async function copyDirectory(src: string, dest: string): Promise<void> {
  try {
    // Create destination directory if it doesn't exist
    await fs.mkdir(dest, { recursive: true });
    
    // Read source directory
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    // Copy each file
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyDirectory(srcPath, destPath);
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        // Copy file (skip hidden files like .DS_Store)
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy directory from ${src} to ${dest}: ${error}`);
  }
}

async function setupSampleImages(): Promise<void> {
  console.log('🚀 Setting up sample images for Railway deployment...');
  
  try {
    // Check if source directory exists
    try {
      await fs.access(SOURCE_DIR);
      console.log(`✅ Found source directory: ${SOURCE_DIR}`);
    } catch (error) {
      console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
      throw new Error('Sample images source directory not found');
    }

    // Check if target directory already exists with content
    try {
      await fs.access(TARGET_DIR);
      const existingFiles = await fs.readdir(TARGET_DIR);
      const imageFiles = existingFiles.filter(file => 
        file.toLowerCase().endsWith('.jpg') && !file.startsWith('.')
      );
      
      if (imageFiles.length > 0) {
        console.log(`✅ Target directory already contains ${imageFiles.length} images. Skipping copy.`);
        return;
      }
    } catch (error) {
      // Target directory doesn't exist, which is fine
      console.log('📁 Target directory does not exist, will create it.');
    }

    // Count source files
    const sourceFiles = await fs.readdir(SOURCE_DIR);
    const sourceImageFiles = sourceFiles.filter(file => 
      file.toLowerCase().endsWith('.jpg') && !file.startsWith('.')
    );
    
    console.log(`📸 Found ${sourceImageFiles.length} images to copy...`);

    // Copy the directory
    await copyDirectory(SOURCE_DIR, TARGET_DIR);

    // Verify the copy
    const copiedFiles = await fs.readdir(TARGET_DIR);
    const copiedImageFiles = copiedFiles.filter(file => 
      file.toLowerCase().endsWith('.jpg') && !file.startsWith('.')
    );

    if (copiedImageFiles.length !== sourceImageFiles.length) {
      throw new Error(`Copy verification failed: expected ${sourceImageFiles.length} files, got ${copiedImageFiles.length}`);
    }

    console.log(`🎉 Successfully copied ${copiedImageFiles.length} sample images to ${TARGET_DIR}`);
    
  } catch (error) {
    console.error('❌ Failed to setup sample images:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    await setupSampleImages();
  } catch (error) {
    console.error('Error setting up sample images:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { setupSampleImages };