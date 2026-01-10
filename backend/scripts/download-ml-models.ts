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

// Files to download from CDN
const DOWNLOAD_FILES = [
  // SSD MobileNet V1 - Face detection
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  // Age & Gender model
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1',
];

// Mapping of shard files to final .bin files expected by the manifests
const SHARD_TO_BIN_MAPPINGS: { shards: string[]; output: string }[] = [
  {
    shards: ['ssd_mobilenetv1_model-shard1', 'ssd_mobilenetv1_model-shard2'],
    output: 'ssd_mobilenetv1_model.bin',
  },
  {
    shards: ['age_gender_model-shard1'],
    output: 'age_gender_model.bin',
  },
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

/**
 * Concatenate multiple shard files into a single .bin file
 */
function concatenateShards(shards: string[], output: string): void {
  const outputPath = path.join(ML_MODELS_PATH, output);
  const buffers: Buffer[] = [];

  for (const shard of shards) {
    const shardPath = path.join(ML_MODELS_PATH, shard);
    buffers.push(fs.readFileSync(shardPath));
  }

  fs.writeFileSync(outputPath, Buffer.concat(buffers));
}

/**
 * Clean up temporary shard files after concatenation
 */
function cleanupShards(shards: string[]): void {
  for (const shard of shards) {
    const shardPath = path.join(ML_MODELS_PATH, shard);
    if (fs.existsSync(shardPath)) {
      fs.unlinkSync(shardPath);
    }
  }
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

  // Check if final .bin files already exist
  const allBinFilesExist = SHARD_TO_BIN_MAPPINGS.every(({ output }) =>
    fs.existsSync(path.join(ML_MODELS_PATH, output))
  );
  const manifestsExist = DOWNLOAD_FILES.filter(f => f.endsWith('.json')).every(f =>
    fs.existsSync(path.join(ML_MODELS_PATH, f))
  );

  if (allBinFilesExist && manifestsExist) {
    console.log('\n✓ All model files already exist. Skipping download.');
    console.log('==============================================');
    return;
  }

  console.log('\nDownloading models...\n');

  for (const modelFile of DOWNLOAD_FILES) {
    const url = `${BASE_URL}/${modelFile}`;
    const destPath = path.join(ML_MODELS_PATH, modelFile);

    // Skip manifest files if they already exist
    if (modelFile.endsWith('.json') && fs.existsSync(destPath)) {
      console.log(`  ✓ ${modelFile} (already exists)`);
      continue;
    }

    // For shard files, always download (they're temporary)
    try {
      console.log(`  ↓ Downloading ${modelFile}...`);
      await downloadFile(url, destPath);
      console.log(`  ✓ ${modelFile}`);
    } catch (error) {
      console.error(`  ✗ Failed to download ${modelFile}:`, error);
      process.exit(1);
    }
  }

  // Concatenate shards into .bin files
  console.log('\nProcessing model shards...\n');

  for (const { shards, output } of SHARD_TO_BIN_MAPPINGS) {
    // Check if all shards exist
    const allShardsExist = shards.every(shard =>
      fs.existsSync(path.join(ML_MODELS_PATH, shard))
    );

    if (!allShardsExist) {
      console.error(`  ✗ Missing shard files for ${output}`);
      process.exit(1);
    }

    console.log(`  → Concatenating ${shards.join(' + ')} → ${output}`);
    concatenateShards(shards, output);
    console.log(`  ✓ Created ${output}`);

    // Clean up shard files
    cleanupShards(shards);
    console.log(`  🗑 Cleaned up temporary shard files`);
  }

  console.log('\n==============================================');
  console.log('All models downloaded and processed successfully!');
  console.log('==============================================');
}

main();
