#!/usr/bin/env ts-node

/**
 * Simplified Ranking Recalculation Script
 * 
 * This script uses the new Bradley-Terry service to recalculate all rankings
 * from scratch using the corrected algorithm.
 */

import { PrismaClient } from '@prisma/client';
import { bradleyTerryService } from '../src/services/bradleyTerryService';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:../prisma/dev.db',
    },
  },
});

/**
 * Update database with fresh rankings
 */
async function updateDatabaseRankings(
  photoRankings: Map<string, any>,
  sampleImageRankings: Map<string, any>,
  combinedRankings: Map<string, any>
): Promise<void> {
  console.log('💾 Updating database with fresh rankings...');

  // Update photo rankings
  console.log(`   Updating ${photoRankings.size} photo rankings...`);
  const photoUpdates = Array.from(photoRankings.entries()).map(([photoId, rating]) =>
    prisma.photoRanking.upsert({
      where: { photoId },
      update: {
        bradleyTerryScore: rating.score,
        wins: rating.wins,
        losses: rating.losses,
        totalComparisons: rating.totalComparisons,
        confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
        lastUpdated: new Date(),
      },
      create: {
        photoId,
        userId: '', // Will be populated by foreign key
        bradleyTerryScore: rating.score,
        wins: rating.wins,
        losses: rating.losses,
        totalComparisons: rating.totalComparisons,
        confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
        currentPercentile: 50.0, // Will be updated below
      },
    })
  );

  // Update sample image rankings
  console.log(`   Updating ${sampleImageRankings.size} sample image rankings...`);
  const sampleUpdates = Array.from(sampleImageRankings.entries()).map(([sampleImageId, rating]) =>
    prisma.sampleImageRanking.upsert({
      where: { sampleImageId },
      update: {
        bradleyTerryScore: rating.score,
        wins: rating.wins,
        losses: rating.losses,
        totalComparisons: rating.totalComparisons,
        confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
        lastUpdated: new Date(),
      },
      create: {
        sampleImageId,
        bradleyTerryScore: rating.score,
        wins: rating.wins,
        losses: rating.losses,
        totalComparisons: rating.totalComparisons,
        confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
        currentPercentile: 50.0, // Will be updated below
      },
    })
  );

  // Execute all updates
  await Promise.all([...photoUpdates, ...sampleUpdates]);

  console.log('✅ Database rankings updated successfully');
}

/**
 * Update combined rankings with proper user/gender mapping
 */
async function updateCombinedRankings(combinedRankings: Map<string, any>): Promise<void> {
  console.log(`💫 Updating ${combinedRankings.size} combined rankings...`);

  const updates = [];

  for (const [itemId, rating] of combinedRankings.entries()) {
    // Determine if this is a photo or sample image
    const photo = await prisma.photo.findUnique({
      where: { id: itemId },
      include: { user: { select: { id: true, gender: true } } }
    });

    if (photo && photo.user.gender) {
      // This is a user photo
      updates.push(
        prisma.combinedRanking.upsert({
          where: { photoId: itemId },
          update: {
            bradleyTerryScore: rating.score,
            wins: rating.wins,
            losses: rating.losses,
            totalComparisons: rating.totalComparisons,
            confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
            lastUpdated: new Date(),
          },
          create: {
            photoId: itemId,
            userId: photo.user.id,
            gender: photo.user.gender,
            bradleyTerryScore: rating.score,
            wins: rating.wins,
            losses: rating.losses,
            totalComparisons: rating.totalComparisons,
            confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
            currentPercentile: 50.0, // Will be updated below
          },
        })
      );
    } else {
      // Check if it's a sample image
      const sampleImage = await prisma.sampleImage.findUnique({
        where: { id: itemId },
        select: { gender: true }
      });

      if (sampleImage) {
        updates.push(
          prisma.combinedRanking.upsert({
            where: { sampleImageId: itemId },
            update: {
              bradleyTerryScore: rating.score,
              wins: rating.wins,
              losses: rating.losses,
              totalComparisons: rating.totalComparisons,
              confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
              lastUpdated: new Date(),
            },
            create: {
              sampleImageId: itemId,
              gender: sampleImage.gender,
              bradleyTerryScore: rating.score,
              wins: rating.wins,
              losses: rating.losses,
              totalComparisons: rating.totalComparisons,
              confidence: bradleyTerryService.calculateConfidence(rating.totalComparisons),
              currentPercentile: 50.0, // Will be updated below
            },
          })
        );
      }
    }
  }

  // Execute updates in batches to avoid overwhelming the database
  const batchSize = 100;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    await Promise.all(batch);
  }

  console.log('✅ Combined rankings updated successfully');
}

/**
 * Calculate and update percentiles for all ranking systems
 */
async function updateAllPercentiles(): Promise<void> {
  console.log('📊 Calculating and updating percentiles...');

  // Update photo ranking percentiles
  const photoRankings = await prisma.photoRanking.findMany({
    where: { totalComparisons: { gt: 0 } },
    orderBy: { bradleyTerryScore: 'desc' }
  });

  const photoPercentiles = bradleyTerryService.calculatePercentiles(
    photoRankings.map(r => ({
      id: r.photoId,
      score: r.bradleyTerryScore,
      wins: r.wins,
      losses: r.losses,
      totalComparisons: r.totalComparisons,
    }))
  );

  const photoPercentileUpdates = Array.from(photoPercentiles.entries()).map(([photoId, percentile]) =>
    prisma.photoRanking.update({
      where: { photoId },
      data: { currentPercentile: percentile },
    })
  );

  // Update sample image ranking percentiles  
  const sampleRankings = await prisma.sampleImageRanking.findMany({
    where: { totalComparisons: { gt: 0 } },
    orderBy: { bradleyTerryScore: 'desc' }
  });

  const samplePercentiles = bradleyTerryService.calculatePercentiles(
    sampleRankings.map(r => ({
      id: r.sampleImageId,
      score: r.bradleyTerryScore,
      wins: r.wins,
      losses: r.losses,
      totalComparisons: r.totalComparisons,
    }))
  );

  const samplePercentileUpdates = Array.from(samplePercentiles.entries()).map(([sampleId, percentile]) =>
    prisma.sampleImageRanking.update({
      where: { sampleImageId: sampleId },
      data: { currentPercentile: percentile },
    })
  );

  // Update combined ranking percentiles by gender
  for (const gender of ['male', 'female']) {
    const combinedRankings = await prisma.combinedRanking.findMany({
      where: { 
        gender,
        totalComparisons: { gt: 0 }
      },
      orderBy: { bradleyTerryScore: 'desc' }
    });

    const combinedPercentiles = bradleyTerryService.calculatePercentiles(
      combinedRankings.map(r => ({
        id: r.photoId || r.sampleImageId!,
        score: r.bradleyTerryScore,
        wins: r.wins,
        losses: r.losses,
        totalComparisons: r.totalComparisons,
      }))
    );

    const combinedPercentileUpdates = combinedRankings.map(ranking => {
      const itemId = ranking.photoId || ranking.sampleImageId!;
      const percentile = combinedPercentiles.get(itemId) || 50.0;
      
      return prisma.combinedRanking.update({
        where: { id: ranking.id },
        data: { currentPercentile: percentile },
      });
    });

    await Promise.all(combinedPercentileUpdates);
  }

  // Execute all photo and sample updates
  await Promise.all([...photoPercentileUpdates, ...samplePercentileUpdates]);

  console.log('✅ All percentiles updated successfully');
}

/**
 * Validate the corrected rankings
 */
async function validateResults(): Promise<void> {
  console.log('🔍 Validating corrected rankings...');

  // Get sample of rankings for validation
  const [photoRankings, sampleRankings, combinedRankings] = await Promise.all([
    prisma.photoRanking.findMany({ take: 1000 }),
    prisma.sampleImageRanking.findMany({ take: 1000 }),
    prisma.combinedRanking.findMany({ take: 1000 }),
  ]);

  const allRankings = [
    ...photoRankings.map(r => ({
      id: r.photoId,
      score: r.bradleyTerryScore,
      wins: r.wins,
      losses: r.losses,
      totalComparisons: r.totalComparisons,
    })),
    ...sampleRankings.map(r => ({
      id: r.sampleImageId,
      score: r.bradleyTerryScore,
      wins: r.wins,
      losses: r.losses,
      totalComparisons: r.totalComparisons,
    })),
    ...combinedRankings.map(r => ({
      id: r.photoId || r.sampleImageId!,
      score: r.bradleyTerryScore,
      wins: r.wins,
      losses: r.losses,
      totalComparisons: r.totalComparisons,
    })),
  ];

  const validation = bradleyTerryService.validateRatings(allRankings);
  
  if (validation.isValid) {
    console.log('✅ All rankings are mathematically consistent');
  } else {
    console.log(`❌ Found ${validation.errors.length} validation errors:`);
    validation.errors.slice(0, 5).forEach(error => {
      console.log(`   • ${error}`);
    });
  }

  // Check score distribution
  const scores = allRankings.map(r => r.score);
  if (scores.length > 0) {
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    console.log(`📊 Final score distribution:`);
    console.log(`   Range: ${min.toFixed(3)} - ${max.toFixed(3)}`);
    console.log(`   Mean: ${mean.toFixed(3)}`);
    
    if (max <= 10.0 && min >= 0.01) {
      console.log('✅ Score bounds are within expected ranges');
    } else {
      console.log('⚠️  Warning: Scores outside expected bounds (0.01 - 10.0)');
    }
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting simplified ranking recalculation...\n');
    const startTime = Date.now();

    // Calculate fresh rankings using the Bradley-Terry service
    const results = await bradleyTerryService.calculateFreshRankingsFromDatabase(
      prisma,
      { learningRate: 0.1, normalizeScores: true }
    );

    console.log(`\n📈 Results Summary:`);
    console.log(`   Total comparisons processed: ${results.stats.totalComparisons}`);
    console.log(`   User photo comparisons: ${results.stats.userPhotoComparisons}`);
    console.log(`   Sample image comparisons: ${results.stats.sampleImageComparisons}`);
    console.log(`   Mixed comparisons: ${results.stats.mixedComparisons}`);
    console.log('');

    // Update database with fresh rankings
    await updateDatabaseRankings(
      results.photoRankings,
      results.sampleImageRankings,
      results.combinedRankings
    );

    // Update combined rankings with proper mapping
    await updateCombinedRankings(results.combinedRankings);

    // Calculate and update percentiles
    await updateAllPercentiles();

    // Validate results
    await validateResults();

    const endTime = Date.now();
    console.log('\n' + '='.repeat(60));
    console.log('✅ RANKING RECALCULATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`⏱️  Total time: ${(endTime - startTime) / 1000}s`);
    console.log('\n🎉 All rankings recalculated with corrected Bradley-Terry algorithm');
    console.log('📊 Rankings are now mathematically consistent');
    console.log('🔄 Run the diagnostic script to verify the fixes');

  } catch (error) {
    console.error('❌ Error during ranking recalculation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the simplified recalculation
if (require.main === module) {
  main().catch(console.error);
}

export { main as recalculateRankingsSimple };