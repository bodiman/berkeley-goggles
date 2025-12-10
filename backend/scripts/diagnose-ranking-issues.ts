#!/usr/bin/env ts-node

/**
 * Ranking Diagnostic Script
 * 
 * This script analyzes the current state of ranking data to identify inconsistencies
 * and issues with Bradley-Terry score calculations and percentile distributions.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

interface RankingDiagnostics {
  photoRankings: any[];
  sampleRankings: any[];
  combinedRankings: any[];
  comparisons: any[];
  diagnostics: {
    photoRankingIssues: string[];
    sampleRankingIssues: string[];
    combinedRankingIssues: string[];
    consistencyIssues: string[];
    mathematicalIssues: string[];
  };
}

async function runDiagnostics(): Promise<RankingDiagnostics> {
  console.log('🔍 Running ranking diagnostics...\n');

  const diagnostics: RankingDiagnostics = {
    photoRankings: [],
    sampleRankings: [],
    combinedRankings: [],
    comparisons: [],
    diagnostics: {
      photoRankingIssues: [],
      sampleRankingIssues: [],
      combinedRankingIssues: [],
      consistencyIssues: [],
      mathematicalIssues: [],
    },
  };

  // 1. Fetch all ranking data
  console.log('📊 Fetching ranking data...');
  
  const [photoRankings, sampleRankings, combinedRankings, comparisonStats] = await Promise.all([
    prisma.photoRanking.findMany({
      include: {
        photo: {
          select: { userId: true }
        }
      },
      orderBy: { bradleyTerryScore: 'desc' }
    }),
    prisma.sampleImageRanking.findMany({
      include: {
        sampleImage: {
          select: { gender: true }
        }
      },
      orderBy: { bradleyTerryScore: 'desc' }
    }),
    prisma.combinedRanking.findMany({
      orderBy: { bradleyTerryScore: 'desc' }
    }),
    prisma.comparison.groupBy({
      by: ['comparisonType'],
      _count: {
        id: true
      }
    })
  ]);

  diagnostics.photoRankings = photoRankings;
  diagnostics.sampleRankings = sampleRankings;
  diagnostics.combinedRankings = combinedRankings;
  diagnostics.comparisons = comparisonStats;

  console.log(`   Photo rankings: ${photoRankings.length}`);
  console.log(`   Sample rankings: ${sampleRankings.length}`);
  console.log(`   Combined rankings: ${combinedRankings.length}`);
  console.log('   Comparison breakdown:');
  comparisonStats.forEach(stat => {
    console.log(`     ${stat.comparisonType}: ${stat._count.id} comparisons`);
  });

  // 2. Check for mathematical issues in photo rankings
  console.log('\n🧮 Checking mathematical consistency...');
  
  photoRankings.forEach((ranking, index) => {
    const { totalComparisons, wins, losses, bradleyTerryScore, currentPercentile } = ranking;
    
    // Check if wins + losses = totalComparisons
    if (wins + losses !== totalComparisons && totalComparisons > 0) {
      diagnostics.diagnostics.photoRankingIssues.push(
        `Photo ${ranking.photoId}: wins(${wins}) + losses(${losses}) ≠ totalComparisons(${totalComparisons})`
      );
    }
    
    // Check Bradley-Terry score bounds
    if (bradleyTerryScore <= 0 || bradleyTerryScore > 100) {
      diagnostics.diagnostics.photoRankingIssues.push(
        `Photo ${ranking.photoId}: Invalid Bradley-Terry score ${bradleyTerryScore}`
      );
    }
    
    // Check percentile bounds
    if (currentPercentile < 0 || currentPercentile > 100) {
      diagnostics.diagnostics.photoRankingIssues.push(
        `Photo ${ranking.photoId}: Invalid percentile ${currentPercentile}`
      );
    }
    
    // Check if percentile ordering matches Bradley-Terry ordering
    if (index > 0) {
      const prevRanking = photoRankings[index - 1];
      if (ranking.bradleyTerryScore > prevRanking.bradleyTerryScore && 
          ranking.currentPercentile < prevRanking.currentPercentile) {
        diagnostics.diagnostics.mathematicalIssues.push(
          `Photo ranking order mismatch: ${ranking.photoId} has higher BT score but lower percentile than ${prevRanking.photoId}`
        );
      }
    }
  });

  // 3. Check for mathematical issues in sample rankings
  sampleRankings.forEach((ranking, index) => {
    const { totalComparisons, wins, losses, bradleyTerryScore, currentPercentile } = ranking;
    
    if (wins + losses !== totalComparisons && totalComparisons > 0) {
      diagnostics.diagnostics.sampleRankingIssues.push(
        `Sample ${ranking.sampleImageId}: wins(${wins}) + losses(${losses}) ≠ totalComparisons(${totalComparisons})`
      );
    }
    
    if (bradleyTerryScore <= 0 || bradleyTerryScore > 100) {
      diagnostics.diagnostics.sampleRankingIssues.push(
        `Sample ${ranking.sampleImageId}: Invalid Bradley-Terry score ${bradleyTerryScore}`
      );
    }
    
    if (currentPercentile < 0 || currentPercentile > 100) {
      diagnostics.diagnostics.sampleRankingIssues.push(
        `Sample ${ranking.sampleImageId}: Invalid percentile ${currentPercentile}`
      );
    }
  });

  // 4. Check for mathematical issues in combined rankings
  combinedRankings.forEach((ranking) => {
    const { totalComparisons, wins, losses, bradleyTerryScore, currentPercentile } = ranking;
    
    if (wins + losses !== totalComparisons && totalComparisons > 0) {
      diagnostics.diagnostics.combinedRankingIssues.push(
        `Combined ${ranking.photoId || ranking.sampleImageId}: wins(${wins}) + losses(${losses}) ≠ totalComparisons(${totalComparisons})`
      );
    }
    
    if (bradleyTerryScore <= 0 || bradleyTerryScore > 100) {
      diagnostics.diagnostics.combinedRankingIssues.push(
        `Combined ${ranking.photoId || ranking.sampleImageId}: Invalid Bradley-Terry score ${bradleyTerryScore}`
      );
    }
    
    if (currentPercentile < 0 || currentPercentile > 100) {
      diagnostics.diagnostics.combinedRankingIssues.push(
        `Combined ${ranking.photoId || ranking.sampleImageId}: Invalid percentile ${currentPercentile}`
      );
    }
  });

  // 5. Check for consistency between ranking systems
  console.log('\n🔄 Checking consistency between ranking systems...');
  
  // Check if photos exist in both photo_rankings and combined_rankings
  const photoRankingIds = new Set(photoRankings.map(r => r.photoId));
  const combinedPhotoIds = new Set(combinedRankings.filter(r => r.photoId).map(r => r.photoId!));
  
  // Photos in photo_rankings but not in combined_rankings
  photoRankingIds.forEach(photoId => {
    if (!combinedPhotoIds.has(photoId)) {
      diagnostics.diagnostics.consistencyIssues.push(
        `Photo ${photoId} exists in photo_rankings but not in combined_rankings`
      );
    }
  });
  
  // Photos in combined_rankings but not in photo_rankings
  combinedPhotoIds.forEach(photoId => {
    if (!photoRankingIds.has(photoId)) {
      diagnostics.diagnostics.consistencyIssues.push(
        `Photo ${photoId} exists in combined_rankings but not in photo_rankings`
      );
    }
  });

  // Check if sample images exist in both systems
  const sampleRankingIds = new Set(sampleRankings.map(r => r.sampleImageId));
  const combinedSampleIds = new Set(combinedRankings.filter(r => r.sampleImageId).map(r => r.sampleImageId!));
  
  sampleRankingIds.forEach(sampleId => {
    if (!combinedSampleIds.has(sampleId)) {
      diagnostics.diagnostics.consistencyIssues.push(
        `Sample ${sampleId} exists in sample_image_rankings but not in combined_rankings`
      );
    }
  });
  
  combinedSampleIds.forEach(sampleId => {
    if (!sampleRankingIds.has(sampleId)) {
      diagnostics.diagnostics.consistencyIssues.push(
        `Sample ${sampleId} exists in combined_rankings but not in sample_image_rankings`
      );
    }
  });

  // 6. Check for score discrepancies between systems
  photoRankings.forEach(photoRanking => {
    const correspondingCombined = combinedRankings.find(cr => cr.photoId === photoRanking.photoId);
    if (correspondingCombined) {
      // Check if scores are significantly different
      const scoreDiff = Math.abs(photoRanking.bradleyTerryScore - correspondingCombined.bradleyTerryScore);
      const comparisonDiff = Math.abs(photoRanking.totalComparisons - correspondingCombined.totalComparisons);
      
      if (scoreDiff > 0.1 || comparisonDiff > 5) {
        diagnostics.diagnostics.consistencyIssues.push(
          `Photo ${photoRanking.photoId}: Score/comparison mismatch between systems - Photo: BT=${photoRanking.bradleyTerryScore}, comparisons=${photoRanking.totalComparisons} vs Combined: BT=${correspondingCombined.bradleyTerryScore}, comparisons=${correspondingCombined.totalComparisons}`
        );
      }
    }
  });

  return diagnostics;
}

async function analyzeBradleyTerryDistribution(): Promise<void> {
  console.log('\n📈 Analyzing Bradley-Terry score distributions...');
  
  const [photoScores, sampleScores, combinedScores] = await Promise.all([
    prisma.photoRanking.findMany({
      select: { bradleyTerryScore: true, totalComparisons: true },
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'asc' }
    }),
    prisma.sampleImageRanking.findMany({
      select: { bradleyTerryScore: true, totalComparisons: true },
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'asc' }
    }),
    prisma.combinedRanking.findMany({
      select: { bradleyTerryScore: true, totalComparisons: true },
      where: { totalComparisons: { gt: 0 } },
      orderBy: { bradleyTerryScore: 'asc' }
    })
  ]);

  function analyzeScores(scores: { bradleyTerryScore: number }[], name: string) {
    if (scores.length === 0) return;
    
    const values = scores.map(s => s.bradleyTerryScore);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const median = values[Math.floor(values.length / 2)];
    
    // Count scores exactly at 0.5 (default/unupdated)
    const defaultScores = values.filter(v => v === 0.5).length;
    const belowHalf = values.filter(v => v < 0.5).length;
    const aboveHalf = values.filter(v => v > 0.5).length;
    
    console.log(`\n   ${name}:`);
    console.log(`     Count: ${values.length}`);
    console.log(`     Range: ${min.toFixed(3)} - ${max.toFixed(3)}`);
    console.log(`     Mean: ${mean.toFixed(3)}`);
    console.log(`     Median: ${median.toFixed(3)}`);
    console.log(`     Scores = 0.5: ${defaultScores} (${(defaultScores/values.length*100).toFixed(1)}%)`);
    console.log(`     Scores < 0.5: ${belowHalf} (${(belowHalf/values.length*100).toFixed(1)}%)`);
    console.log(`     Scores > 0.5: ${aboveHalf} (${(aboveHalf/values.length*100).toFixed(1)}%)`);
  }

  analyzeScores(photoScores, 'Photo Rankings');
  analyzeScores(sampleScores, 'Sample Rankings');
  analyzeScores(combinedScores, 'Combined Rankings');
}

async function checkComparisonIntegrity(): Promise<void> {
  console.log('\n🔗 Checking comparison data integrity...');
  
  // Check for orphaned comparisons
  const comparisonsWithMissingData = await prisma.$queryRaw<any[]>`
    SELECT 
      c.id,
      c.comparison_type,
      c.winner_photo_id,
      c.loser_photo_id,
      c.winner_sample_image_id,
      c.loser_sample_image_id,
      p1.id as winner_photo_exists,
      p2.id as loser_photo_exists,
      s1.id as winner_sample_exists,
      s2.id as loser_sample_exists
    FROM comparisons c
    LEFT JOIN photos p1 ON c.winner_photo_id = p1.id
    LEFT JOIN photos p2 ON c.loser_photo_id = p2.id
    LEFT JOIN sample_images s1 ON c.winner_sample_image_id = s1.id
    LEFT JOIN sample_images s2 ON c.loser_sample_image_id = s2.id
    WHERE 
      (c.comparison_type = 'user_photos' AND (p1.id IS NULL OR p2.id IS NULL))
      OR (c.comparison_type = 'sample_images' AND (s1.id IS NULL OR s2.id IS NULL))
      OR (c.comparison_type = 'mixed' AND 
          ((c.winner_photo_id IS NOT NULL AND p1.id IS NULL) OR 
           (c.loser_photo_id IS NOT NULL AND p2.id IS NULL) OR
           (c.winner_sample_image_id IS NOT NULL AND s1.id IS NULL) OR
           (c.loser_sample_image_id IS NOT NULL AND s2.id IS NULL)))
  `;

  if (comparisonsWithMissingData.length > 0) {
    console.log(`   ⚠️  Found ${comparisonsWithMissingData.length} comparisons with orphaned references`);
    comparisonsWithMissingData.forEach(comp => {
      console.log(`     Comparison ${comp.id} (${comp.comparison_type}): Missing referenced items`);
    });
  } else {
    console.log('   ✅ All comparisons have valid references');
  }

  // Check comparison type consistency
  const inconsistentComparisons = await prisma.$queryRaw<any[]>`
    SELECT 
      id,
      comparison_type,
      winner_photo_id,
      loser_photo_id,
      winner_sample_image_id,
      loser_sample_image_id
    FROM comparisons
    WHERE 
      (comparison_type = 'user_photos' AND (winner_sample_image_id IS NOT NULL OR loser_sample_image_id IS NOT NULL))
      OR (comparison_type = 'sample_images' AND (winner_photo_id IS NOT NULL OR loser_photo_id IS NOT NULL))
      OR (comparison_type = 'mixed' AND 
          ((winner_photo_id IS NOT NULL AND loser_photo_id IS NOT NULL) OR 
           (winner_sample_image_id IS NOT NULL AND loser_sample_image_id IS NOT NULL)))
  `;

  if (inconsistentComparisons.length > 0) {
    console.log(`   ⚠️  Found ${inconsistentComparisons.length} comparisons with incorrect type classification`);
  } else {
    console.log('   ✅ All comparison types are correctly classified');
  }
}

async function main() {
  try {
    console.log('🚀 Starting ranking diagnostics...\n');
    
    const startTime = Date.now();
    
    // Run the diagnostics
    const results = await runDiagnostics();
    
    // Run additional analyses
    await analyzeBradleyTerryDistribution();
    await checkComparisonIntegrity();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(60));
    
    const { diagnostics } = results;
    const totalIssues = 
      diagnostics.photoRankingIssues.length +
      diagnostics.sampleRankingIssues.length +
      diagnostics.combinedRankingIssues.length +
      diagnostics.consistencyIssues.length +
      diagnostics.mathematicalIssues.length;
    
    console.log(`\nTotal issues found: ${totalIssues}`);
    
    if (diagnostics.photoRankingIssues.length > 0) {
      console.log(`\n❌ Photo Ranking Issues (${diagnostics.photoRankingIssues.length}):`);
      diagnostics.photoRankingIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (diagnostics.sampleRankingIssues.length > 0) {
      console.log(`\n❌ Sample Ranking Issues (${diagnostics.sampleRankingIssues.length}):`);
      diagnostics.sampleRankingIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (diagnostics.combinedRankingIssues.length > 0) {
      console.log(`\n❌ Combined Ranking Issues (${diagnostics.combinedRankingIssues.length}):`);
      diagnostics.combinedRankingIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (diagnostics.consistencyIssues.length > 0) {
      console.log(`\n⚠️  Consistency Issues (${diagnostics.consistencyIssues.length}):`);
      diagnostics.consistencyIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (diagnostics.mathematicalIssues.length > 0) {
      console.log(`\n🧮 Mathematical Issues (${diagnostics.mathematicalIssues.length}):`);
      diagnostics.mathematicalIssues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (totalIssues === 0) {
      console.log('\n✅ No issues found! Ranking system appears to be working correctly.');
    } else {
      console.log('\n🔧 Issues found that need to be addressed. Proceed with ranking system fixes.');
    }
    
    const endTime = Date.now();
    console.log(`\n⏱️  Diagnostics completed in ${(endTime - startTime) / 1000}s`);
    
  } catch (error) {
    console.error('❌ Error running diagnostics:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the diagnostics
if (require.main === module) {
  main().catch(console.error);
}

export { runDiagnostics, analyzeBradleyTerryDistribution, checkComparisonIntegrity };