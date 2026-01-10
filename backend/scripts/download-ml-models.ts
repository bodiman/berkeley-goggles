/**
 * Download face-api.js models for face detection and gender classification
 *
 * Usage: npx tsx scripts/download-ml-models.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const ML_MODELS_PATH = path.join(__dirname, '../ml-models/face-api');

// face-api.js model URLs from vladmandic CDN
const BASE_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

const MODELS = [
  // SSD MobileNet V1 - Face detection
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  // Age & Gender model
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1',
];

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(destPath);
          return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });
  });
}

async function main() {
  console.log('==============================================');
  console.log('face-api.js Model Download Script');
  console.log('==============================================');
  console.log(`\nModels directory: ${ML_MODELS_PATH}`);

  // Ensure directory exists
  if (!fs.existsSync(ML_MODELS_PATH)) {
    fs.mkdirSync(ML_MODELS_PATH, { recursive: true });
  }

  console.log('\nDownloading models...\n');

  for (const modelFile of MODELS) {
    const url = `${BASE_URL}/${modelFile}`;
    const destPath = path.join(ML_MODELS_PATH, modelFile);

    // Skip if file already exists
    if (fs.existsSync(destPath)) {
      console.log(`  ✓ ${modelFile} (already exists)`);
      continue;
    }

    try {
      console.log(`  ↓ Downloading ${modelFile}...`);
      await downloadFile(url, destPath);
      console.log(`  ✓ ${modelFile}`);
    } catch (error) {
      console.error(`  ✗ Failed to download ${modelFile}:`, error);
      process.exit(1);
    }
  }

  console.log('\n==============================================');
  console.log('All models downloaded successfully!');
  console.log('==============================================');
}

main();
