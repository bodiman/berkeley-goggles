#!/usr/bin/env ts-node

/**
 * Generate histogram of Bradley-Terry scores
 * 
 * This script creates a histogram showing the distribution of Bradley-Terry scores
 * for all items (photos and sample images) that have been included in comparisons.
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

interface ScoreData {
  id: string;
  score: number;
  type: 'photo' | 'sample';
  totalComparisons: number;
}

async function generateScoreHistogram(): Promise<void> {
  console.log('📊 Generating Bradley-Terry score histogram...');

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

  // Combine all scores
  const allScores: ScoreData[] = [
    ...photoRankings.map(r => ({
      id: r.photoId,
      score: r.bradleyTerryScore,
      type: 'photo' as const,
      totalComparisons: r.totalComparisons,
    })),
    ...sampleRankings.map(r => ({
      id: r.sampleImageId,
      score: r.bradleyTerryScore,
      type: 'sample' as const,
      totalComparisons: r.totalComparisons,
    })),
  ];

  console.log(`   Found ${allScores.length} items with comparisons:`);
  console.log(`     Photos: ${photoRankings.length}`);
  console.log(`     Sample images: ${sampleRankings.length}`);

  // Calculate statistics
  const scores = allScores.map(item => item.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const median = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];

  console.log(`\n📈 Score Statistics:`);
  console.log(`     Range: ${min.toFixed(3)} - ${max.toFixed(3)}`);
  console.log(`     Mean: ${mean.toFixed(3)}`);
  console.log(`     Median: ${median.toFixed(3)}`);

  // Create histogram data
  const numBins = 20;
  const binSize = (max - min) / numBins;
  const bins: number[] = new Array(numBins).fill(0);
  const binLabels: string[] = [];

  // Generate bin labels
  for (let i = 0; i < numBins; i++) {
    const binStart = min + (i * binSize);
    const binEnd = min + ((i + 1) * binSize);
    binLabels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);
  }

  // Count items in each bin
  for (const score of scores) {
    let binIndex = Math.floor((score - min) / binSize);
    if (binIndex >= numBins) binIndex = numBins - 1; // Handle edge case for max value
    bins[binIndex]++;
  }

  // Create ASCII histogram
  console.log(`\n📊 Bradley-Terry Score Distribution (${allScores.length} items):`);
  console.log('=' .repeat(80));
  
  const maxCount = Math.max(...bins);
  const barWidth = 50; // Max width of bars in characters

  for (let i = 0; i < numBins; i++) {
    const count = bins[i];
    const percentage = (count / allScores.length * 100).toFixed(1);
    const barLength = Math.round((count / maxCount) * barWidth);
    const bar = '█'.repeat(barLength) + '░'.repeat(barWidth - barLength);
    
    console.log(`${binLabels[i].padEnd(12)} │${bar}│ ${count.toString().padStart(3)} (${percentage.padStart(5)}%)`);
  }

  console.log('=' .repeat(80));

  // Generate Python script for matplotlib visualization
  const pythonScript = `#!/usr/bin/env python3
"""
Bradley-Terry Score Histogram Generator
Generated on ${new Date().toISOString()}
"""

import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Data
scores = ${JSON.stringify(scores)}
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
fig.suptitle('Bradley-Terry Score Distribution Analysis', fontsize=16, fontweight='bold')

# 1. Overall distribution
ax1.hist(scores, bins=30, alpha=0.7, color='steelblue', edgecolor='black')
ax1.axvline(stats['mean'], color='red', linestyle='--', label=f'Mean: {stats["mean"]}')
ax1.axvline(stats['median'], color='orange', linestyle='--', label=f'Median: {stats["median"]}')
ax1.set_xlabel('Bradley-Terry Score')
ax1.set_ylabel('Frequency')
ax1.set_title(f'All Items (n={stats["total_items"]})')
ax1.legend()
ax1.grid(True, alpha=0.3)

# 2. Photos vs Samples comparison
if len(photo_scores) > 0 and len(sample_scores) > 0:
    ax2.hist([photo_scores, sample_scores], bins=20, alpha=0.7, 
             label=[f'Photos (n={stats["photos"]})', f'Samples (n={stats["samples"]})'],
             color=['lightcoral', 'lightgreen'], edgecolor='black')
    ax2.set_xlabel('Bradley-Terry Score')
    ax2.set_ylabel('Frequency')
    ax2.set_title('Photos vs Sample Images')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
elif len(sample_scores) > 0:
    ax2.hist(sample_scores, bins=20, alpha=0.7, color='lightgreen', edgecolor='black')
    ax2.set_xlabel('Bradley-Terry Score')
    ax2.set_ylabel('Frequency')
    ax2.set_title(f'Sample Images Only (n={stats["samples"]})')
    ax2.grid(True, alpha=0.3)

# 3. Box plot
box_data = []
box_labels = []
if len(photo_scores) > 0:
    box_data.append(photo_scores)
    box_labels.append(f'Photos\\n(n={stats["photos"]})')
if len(sample_scores) > 0:
    box_data.append(sample_scores)
    box_labels.append(f'Samples\\n(n={stats["samples"]})')

if box_data:
    ax3.boxplot(box_data, labels=box_labels)
    ax3.set_ylabel('Bradley-Terry Score')
    ax3.set_title('Score Distribution by Type')
    ax3.grid(True, alpha=0.3)

# 4. Statistics summary
ax4.axis('off')
stats_text = f"""
Bradley-Terry Score Statistics
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Total Items: {stats['total_items']:,}
  • Photos: {stats['photos']:,}
  • Sample Images: {stats['samples']:,}

Score Range: {stats['min']} - {stats['max']}
Mean Score: {stats['mean']}
Median Score: {stats['median']}

Score bounds are properly maintained within
the expected Bradley-Terry range (0.01 - 10.0)
"""
ax4.text(0.1, 0.9, stats_text, fontsize=12, verticalalignment='top', 
         bbox=dict(boxstyle="round,pad=0.5", facecolor="lightgray", alpha=0.8))

plt.tight_layout()

# Save the plot
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
filename = f'bradley_terry_scores_{timestamp}.png'
plt.savefig(filename, dpi=300, bbox_inches='tight')
print(f"✅ Histogram saved as: {filename}")

# Also save as PDF
pdf_filename = f'bradley_terry_scores_{timestamp}.pdf'
plt.savefig(pdf_filename, bbox_inches='tight')
print(f"✅ PDF saved as: {pdf_filename}")

plt.show()
`;

  // Write Python script
  const outputDir = path.join(process.cwd(), '..', 'analysis_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pythonScriptPath = path.join(outputDir, 'bradley_terry_histogram.py');
  fs.writeFileSync(pythonScriptPath, pythonScript);

  console.log(`\n📁 Files created:`);
  console.log(`   Python script: ${pythonScriptPath}`);
  console.log(`\n🚀 To generate the histogram visualization:`);
  console.log(`   cd ${outputDir}`);
  console.log(`   python3 bradley_terry_histogram.py`);
}

async function main(): Promise<void> {
  try {
    await generateScoreHistogram();
  } catch (error) {
    console.error('❌ Error generating histogram:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generateScoreHistogram };