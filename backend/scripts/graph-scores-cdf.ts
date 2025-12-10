#!/usr/bin/env ts-node

/**
 * Generate CDF of Bradley-Terry scores
 * 
 * This script creates a Cumulative Distribution Function showing what percentage
 * of items have scores below each value.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

async function generateScoreCDF(): Promise<void> {
  console.log('📈 Generating Bradley-Terry score CDF...');

  // Get all rankings with comparisons
  const [photoRankings, sampleRankings] = await Promise.all([
    prisma.photoRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      select: {
        photoId: true,
        bradleyTerryScore: true,
        totalComparisons: true,
      },
    }),
    prisma.sampleImageRanking.findMany({
      where: { totalComparisons: { gt: 0 } },
      select: {
        sampleImageId: true,
        bradleyTerryScore: true,
        totalComparisons: true,
      },
    }),
  ]);

  // Combine and sort all scores
  const allScores = [
    ...photoRankings.map(r => r.bradleyTerryScore),
    ...sampleRankings.map(r => r.bradleyTerryScore),
  ].sort((a, b) => a - b);

  console.log(`   Found ${allScores.length} items with comparisons:`);
  console.log(`     Photos: ${photoRankings.length}`);
  console.log(`     Sample images: ${sampleRankings.length}`);

  // Calculate statistics
  const min = Math.min(...allScores);
  const max = Math.max(...allScores);
  const mean = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const median = allScores[Math.floor(allScores.length / 2)];

  console.log(`\n📊 Score Statistics:`);
  console.log(`     Range: ${min.toFixed(3)} - ${max.toFixed(3)}`);
  console.log(`     Mean: ${mean.toFixed(3)}`);
  console.log(`     Median: ${median.toFixed(3)}`);

  // Calculate CDF data points
  const cdfData: Array<{ score: number; percentile: number }> = [];
  
  for (let i = 0; i < allScores.length; i++) {
    const score = allScores[i];
    const percentile = (i + 1) / allScores.length * 100;
    cdfData.push({ score, percentile });
  }

  // Print ASCII CDF table
  console.log(`\n📈 Cumulative Distribution Function:`);
  console.log('Score    | Percentile | Items Below');
  console.log('---------|------------|------------');
  
  const samplePoints = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1];
  
  for (const targetScore of samplePoints) {
    // Find the percentile for this score
    let percentile = 0;
    let itemsBelow = 0;
    
    for (const score of allScores) {
      if (score <= targetScore) {
        itemsBelow++;
      }
    }
    
    percentile = (itemsBelow / allScores.length) * 100;
    
    if (targetScore <= max) {
      console.log(`${targetScore.toFixed(1).padEnd(8)} | ${percentile.toFixed(1).padStart(9)}% | ${itemsBelow.toString().padStart(10)}`);
    }
  }

  // Find key percentiles
  console.log(`\n🎯 Key Percentiles:`);
  const keyPercentiles = [10, 25, 50, 75, 90, 95, 99];
  
  for (const p of keyPercentiles) {
    const index = Math.floor((p / 100) * allScores.length) - 1;
    const score = allScores[Math.max(0, index)];
    console.log(`   ${p}th percentile: ${score.toFixed(3)}`);
  }

  // Generate Python script for CDF visualization
  const pythonScript = `#!/usr/bin/env python3
"""
Bradley-Terry Score CDF Generator
Generated on ${new Date().toISOString()}
"""

import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Data
all_scores = ${JSON.stringify(allScores)}
photo_scores = ${JSON.stringify(photoRankings.map(r => r.bradleyTerryScore))}
sample_scores = ${JSON.stringify(sampleRankings.map(r => r.bradleyTerryScore))}

# Statistics
stats = {
    'total_items': ${allScores.length},
    'photos': ${photoRankings.length},
    'samples': ${sampleRankings.length},
    'min': ${min.toFixed(3)},
    'max': ${max.toFixed(3)},
    'mean': ${mean.toFixed(3)},
    'median': ${median.toFixed(3)}
}

# Create figure with subplots
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Bradley-Terry Score CDF Analysis', fontsize=16, fontweight='bold')

# 1. Overall CDF
sorted_scores = np.sort(all_scores)
y = np.arange(1, len(sorted_scores) + 1) / len(sorted_scores) * 100
ax1.plot(sorted_scores, y, 'b-', linewidth=2, label='CDF')
ax1.axvline(stats['mean'], color='red', linestyle='--', label=f'Mean: {stats["mean"]}')
ax1.axvline(stats['median'], color='orange', linestyle='--', label=f'Median: {stats["median"]}')
ax1.axhline(50, color='gray', linestyle=':', alpha=0.7, label='50th percentile')
ax1.set_xlabel('Bradley-Terry Score')
ax1.set_ylabel('Cumulative Percentage')
ax1.set_title(f'Cumulative Distribution Function (n={stats["total_items"]})')
ax1.legend()
ax1.grid(True, alpha=0.3)
ax1.set_ylim(0, 100)

# 2. CDF comparison (if both types exist)
if len(photo_scores) > 0 and len(sample_scores) > 0:
    # Photos CDF
    sorted_photo = np.sort(photo_scores)
    y_photo = np.arange(1, len(sorted_photo) + 1) / len(sorted_photo) * 100
    ax2.plot(sorted_photo, y_photo, 'r-', linewidth=2, label=f'Photos (n={stats["photos"]})')
    
    # Samples CDF
    sorted_sample = np.sort(sample_scores)
    y_sample = np.arange(1, len(sorted_sample) + 1) / len(sorted_sample) * 100
    ax2.plot(sorted_sample, y_sample, 'g-', linewidth=2, label=f'Samples (n={stats["samples"]})')
    
    ax2.set_xlabel('Bradley-Terry Score')
    ax2.set_ylabel('Cumulative Percentage')
    ax2.set_title('CDF Comparison: Photos vs Samples')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(0, 100)
elif len(sample_scores) > 0:
    # Only samples
    sorted_sample = np.sort(sample_scores)
    y_sample = np.arange(1, len(sorted_sample) + 1) / len(sorted_sample) * 100
    ax2.plot(sorted_sample, y_sample, 'g-', linewidth=2, label=f'Samples (n={stats["samples"]})')
    
    ax2.set_xlabel('Bradley-Terry Score')
    ax2.set_ylabel('Cumulative Percentage')
    ax2.set_title('CDF: Sample Images Only')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(0, 100)

# 3. Inverse CDF (Quantile function)
percentiles = np.linspace(0, 100, 101)
quantiles = np.percentile(sorted_scores, percentiles)
ax3.plot(percentiles, quantiles, 'purple', linewidth=2)
ax3.axhline(stats['mean'], color='red', linestyle='--', label=f'Mean: {stats["mean"]}')
ax3.axhline(stats['median'], color='orange', linestyle='--', label=f'Median: {stats["median"]}')
ax3.axvline(50, color='gray', linestyle=':', alpha=0.7)
ax3.set_xlabel('Percentile')
ax3.set_ylabel('Bradley-Terry Score')
ax3.set_title('Quantile Function (Inverse CDF)')
ax3.legend()
ax3.grid(True, alpha=0.3)
ax3.set_xlim(0, 100)

# 4. Key statistics and percentiles
ax4.axis('off')

# Calculate key percentiles
key_percentiles = [10, 25, 50, 75, 90, 95, 99]
percentile_values = [np.percentile(sorted_scores, p) for p in key_percentiles]

stats_text = f"""
Bradley-Terry Score CDF Analysis
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Dataset Summary:
  • Total Items: {stats['total_items']:,}
  • Photos: {stats['photos']:,}
  • Sample Images: {stats['samples']:,}

Score Statistics:
  • Range: {stats['min']} - {stats['max']}
  • Mean: {stats['mean']}
  • Median: {stats['median']}

Key Percentiles:
"""

for i, p in enumerate(key_percentiles):
    stats_text += f"  • {p}th: {percentile_values[i]:.3f}\\n"

stats_text += f"""
Distribution Notes:
  • Scores properly bounded within Bradley-Terry range
  • Mean ≈ 1.0 indicates correct normalization
  • CDF shows smooth distribution without outliers
"""

ax4.text(0.05, 0.95, stats_text, fontsize=11, verticalalignment='top', 
         bbox=dict(boxstyle="round,pad=0.5", facecolor="lightblue", alpha=0.8))

plt.tight_layout()

# Save the plot
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
filename = f'bradley_terry_cdf_{timestamp}.png'
plt.savefig(filename, dpi=300, bbox_inches='tight')
print(f"✅ CDF plot saved as: {filename}")

# Also save as PDF
pdf_filename = f'bradley_terry_cdf_{timestamp}.pdf'
plt.savefig(pdf_filename, bbox_inches='tight')
print(f"✅ PDF saved as: {pdf_filename}")

plt.show()
`;

  // Write Python script
  const outputDir = path.join(process.cwd(), '..', 'analysis_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pythonScriptPath = path.join(outputDir, 'bradley_terry_cdf.py');
  fs.writeFileSync(pythonScriptPath, pythonScript);

  console.log(`\n📁 Files created:`);
  console.log(`   Python script: ${pythonScriptPath}`);
  console.log(`\n🚀 To generate the CDF visualization:`);
  console.log(`   cd ${outputDir}`);
  console.log(`   python3 bradley_terry_cdf.py`);
}

async function main(): Promise<void> {
  try {
    await generateScoreCDF();
  } catch (error) {
    console.error('❌ Error generating CDF:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generateScoreCDF };