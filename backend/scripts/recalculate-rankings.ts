#!/usr/bin/env ts-node

/**
 * Ranking Recalculation Migration Script
 * 
 * This script recalculates all existing rankings using the corrected Bradley-Terry algorithm
 * and synchronizes data across all three ranking tables.
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

interface ComparisonData {
  winnerPhotoId?: string | null;
  loserPhotoId?: string | null;
  winnerSampleImageId?: string | null;
  loserSampleImageId?: string | null;
  comparisonType: string;
}

interface ItemRating {
  id: string;
  rating: number;
  wins: number;
  losses: number;
  totalComparisons: number;
}

/**
 * Calculate new ratings using the corrected Bradley-Terry service
 */
function calculateNewRatings(
  winnerRating: number,
  loserRating: number,
  learningRate: number = 0.1
): { newWinnerRating: number; newLoserRating: number } {
  const update = bradleyTerryService.updateRatings(
    winnerRating,
    loserRating,
    { learningRate }
  );
  
  return {
    newWinnerRating: update.newWinnerScore,
    newLoserRating: update.newLoserScore,
  };
}

/**
 * Calculate percentile based on ranking position
 */
function calculatePercentile(rank: number, totalItems: number): number {
  if (totalItems === 0) return 50.0;
  return Math.round(((totalItems - rank + 1) / totalItems) * 1000) / 10; // Round to 1 decimal
}

/**
 * Reset all ranking scores to initial values
 */
async function resetAllRankings(): Promise<void> {
  console.log('🔄 Resetting all rankings to initial values...');
  
  await Promise.all([
    // Reset photo rankings to standard Bradley-Terry initial value
    prisma.photoRanking.updateMany({
      data: {
        bradleyTerryScore: 1.0,  // Standard Bradley-Terry initial rating
        currentPercentile: 50.0,
        confidence: 0.0,
      },
    }),
    
    // Reset sample image rankings to standard Bradley-Terry initial value
    prisma.sampleImageRanking.updateMany({
      data: {
        bradleyTerryScore: 1.0,  // Standard Bradley-Terry initial rating
        currentPercentile: 50.0,
        confidence: 0.0,
      },
    }),
    
    // Reset combined rankings to standard Bradley-Terry initial value
    prisma.combinedRanking.updateMany({
      data: {
        bradleyTerryScore: 1.0,  // Standard Bradley-Terry initial rating
        currentPercentile: 50.0,
        confidence: 0.0,
      },
    }),
  ]);
  
  console.log('✅ All rankings reset to initial values');
}

/**
 * Recalculate photo rankings from comparisons
 */
async function recalculatePhotoRankings(): Promise<void> {
  console.log('📊 Recalculating photo rankings...');
  
  // Get all user photo comparisons in chronological order
  const photoComparisons = await prisma.comparison.findMany({
    where: {
      comparisonType: 'user_photos',
      winnerPhotoId: { not: null },
      loserPhotoId: { not: null },
    },
    select: {
      winnerPhotoId: true,
      loserPhotoId: true,
      timestamp: true,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
  
  console.log(`   Processing ${photoComparisons.length} photo comparisons...`);
  
  // Get all photo rankings and create a lookup map
  const photoRankings = await prisma.photoRanking.findMany();
  const ratingMap = new Map<string, ItemRating>();
  
  photoRankings.forEach(ranking => {
    ratingMap.set(ranking.photoId, {
      id: ranking.photoId,
      rating: ranking.bradleyTerryScore, // This will be 1.0 after reset
      wins: ranking.wins,
      losses: ranking.losses,
      totalComparisons: ranking.totalComparisons,
    });
  });
  
  // Process each comparison sequentially
  for (const comparison of photoComparisons) {
    const winnerId = comparison.winnerPhotoId!;
    const loserId = comparison.loserPhotoId!;
    
    const winnerRating = ratingMap.get(winnerId);
    const loserRating = ratingMap.get(loserId);
    
    if (winnerRating && loserRating) {
      const { newWinnerRating, newLoserRating } = calculateNewRatings(
        winnerRating.rating,
        loserRating.rating
      );
      
      // Update the in-memory ratings
      winnerRating.rating = newWinnerRating;
      loserRating.rating = newLoserRating;
    }
  }
  
  // Update all photo rankings in the database
  const updatePromises = Array.from(ratingMap.values()).map(rating =>
    prisma.photoRanking.update({
      where: { photoId: rating.id },
      data: { bradleyTerryScore: rating.rating },
    })
  );
  
  await Promise.all(updatePromises);
  
  // Calculate and update percentiles
  const sortedRankings = Array.from(ratingMap.values())
    .sort((a, b) => b.rating - a.rating); // Descending order
  
  const percentilePromises = sortedRankings.map((rating, index) =>
    prisma.photoRanking.update({
      where: { photoId: rating.id },
      data: { currentPercentile: calculatePercentile(index + 1, sortedRankings.length) },
    })
  );
  
  await Promise.all(percentilePromises);
  
  console.log(`✅ Updated ${ratingMap.size} photo rankings`);
}

/**
 * Recalculate sample image rankings from comparisons
 */
async function recalculateSampleImageRankings(): Promise<void> {
  console.log('🖼️  Recalculating sample image rankings...');
  
  // Get all sample image comparisons in chronological order
  const sampleComparisons = await prisma.comparison.findMany({
    where: {
      comparisonType: 'sample_images',
      winnerSampleImageId: { not: null },
      loserSampleImageId: { not: null },
    },
    select: {
      winnerSampleImageId: true,
      loserSampleImageId: true,
      timestamp: true,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
  
  console.log(`   Processing ${sampleComparisons.length} sample image comparisons...`);
  
  // Get all sample image rankings and create a lookup map
  const sampleRankings = await prisma.sampleImageRanking.findMany();
  const ratingMap = new Map<string, ItemRating>();
  
  sampleRankings.forEach(ranking => {
    ratingMap.set(ranking.sampleImageId, {
      id: ranking.sampleImageId,
      rating: ranking.bradleyTerryScore, // This will be 1.0 after reset
      wins: ranking.wins,
      losses: ranking.losses,
      totalComparisons: ranking.totalComparisons,
    });
  });
  
  // Process each comparison sequentially
  for (const comparison of sampleComparisons) {
    const winnerId = comparison.winnerSampleImageId!;
    const loserId = comparison.loserSampleImageId!;
    
    const winnerRating = ratingMap.get(winnerId);
    const loserRating = ratingMap.get(loserId);
    
    if (winnerRating && loserRating) {
      const { newWinnerRating, newLoserRating } = calculateNewRatings(
        winnerRating.rating,
        loserRating.rating
      );
      
      // Update the in-memory ratings
      winnerRating.rating = newWinnerRating;
      loserRating.rating = newLoserRating;
    }
  }
  
  // Update all sample image rankings in the database
  const updatePromises = Array.from(ratingMap.values()).map(rating =>
    prisma.sampleImageRanking.update({
      where: { sampleImageId: rating.id },
      data: { bradleyTerryScore: rating.rating },
    })
  );
  
  await Promise.all(updatePromises);
  
  // Calculate and update percentiles
  const sortedRankings = Array.from(ratingMap.values())
    .sort((a, b) => b.rating - a.rating); // Descending order
  
  const percentilePromises = sortedRankings.map((rating, index) =>
    prisma.sampleImageRanking.update({
      where: { sampleImageId: rating.id },
      data: { currentPercentile: calculatePercentile(index + 1, sortedRankings.length) },
    })
  );
  
  await Promise.all(percentilePromises);
  
  console.log(`✅ Updated ${ratingMap.size} sample image rankings`);
}

/**
 * Recalculate combined rankings from all comparisons
 */
async function recalculateCombinedRankings(): Promise<void> {
  console.log('🔀 Recalculating combined rankings...');
  
  // Get all comparisons (user photos, sample images, and mixed) in chronological order
  const allComparisons = await prisma.comparison.findMany({
    select: {
      winnerPhotoId: true,
      loserPhotoId: true,
      winnerSampleImageId: true,
      loserSampleImageId: true,
      comparisonType: true,
      timestamp: true,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
  
  console.log(`   Processing ${allComparisons.length} total comparisons...`);
  
  // Get all combined rankings and create a lookup map
  const combinedRankings = await prisma.combinedRanking.findMany();
  const ratingMap = new Map<string, ItemRating>();
  
  combinedRankings.forEach(ranking => {
    const id = ranking.photoId || ranking.sampleImageId!;
    ratingMap.set(id, {
      id: id,
      rating: ranking.bradleyTerryScore, // This will be 1.0 after reset
      wins: ranking.wins,
      losses: ranking.losses,
      totalComparisons: ranking.totalComparisons,
    });
  });
  
  // Process each comparison sequentially
  for (const comparison of allComparisons) {
    let winnerId: string | null = null;
    let loserId: string | null = null;
    
    // Determine winner and loser IDs based on comparison type
    if (comparison.comparisonType === 'user_photos') {
      winnerId = comparison.winnerPhotoId;
      loserId = comparison.loserPhotoId;
    } else if (comparison.comparisonType === 'sample_images') {
      winnerId = comparison.winnerSampleImageId;
      loserId = comparison.loserSampleImageId;
    } else if (comparison.comparisonType === 'mixed') {
      winnerId = comparison.winnerPhotoId || comparison.winnerSampleImageId;
      loserId = comparison.loserPhotoId || comparison.loserSampleImageId;
    }
    
    if (!winnerId || !loserId) continue;
    
    const winnerRating = ratingMap.get(winnerId);
    const loserRating = ratingMap.get(loserId);
    
    if (winnerRating && loserRating) {
      const { newWinnerRating, newLoserRating } = calculateNewRatings(
        winnerRating.rating,
        loserRating.rating
      );
      
      // Update the in-memory ratings
      winnerRating.rating = newWinnerRating;
      loserRating.rating = newLoserRating;
    }
  }
  
  // Update all combined rankings in the database
  const updatePromises = Array.from(ratingMap.values()).map(rating => {
    const combinedRanking = combinedRankings.find(cr => 
      cr.photoId === rating.id || cr.sampleImageId === rating.id
    );
    
    if (combinedRanking) {
      return prisma.combinedRanking.update({
        where: { id: combinedRanking.id },
        data: { bradleyTerryScore: rating.rating },
      });
    }
    return Promise.resolve();
  });
  
  await Promise.all(updatePromises);
  
  // Calculate and update percentiles by gender
  const genders = ['male', 'female'];
  
  for (const gender of genders) {
    const genderRankings = await prisma.combinedRanking.findMany({
      where: { 
        gender: gender,
        totalComparisons: { gt: 0 }
      },
      orderBy: { bradleyTerryScore: 'desc' },
    });
    
    const percentilePromises = genderRankings.map((ranking, index) =>
      prisma.combinedRanking.update({
        where: { id: ranking.id },
        data: { currentPercentile: calculatePercentile(index + 1, genderRankings.length) },
      })
    );
    
    await Promise.all(percentilePromises);
  }
  
  console.log(`✅ Updated ${ratingMap.size} combined rankings`);
}

/**
 * Synchronize missing rankings between systems
 */
async function synchronizeMissingRankings(): Promise<void> {
  console.log('🔄 Synchronizing missing rankings between systems...');
  
  // Get all photos that have rankings but no combined ranking
  const photosWithoutCombined = await prisma.photoRanking.findMany({
    where: {
      photo: {
        combinedRanking: null,
      },
    },
    include: {
      photo: {
        include: {
          user: {
            select: { gender: true, id: true }
          }
        }
      }
    }
  });
  
  // Create combined rankings for missing photos
  const createCombinedForPhotos = photosWithoutCombined.map(photoRanking => {
    if (!photoRanking.photo.user.gender) return Promise.resolve();
    
    return prisma.combinedRanking.create({
      data: {
        photoId: photoRanking.photoId,
        userId: photoRanking.photo.user.id,
        gender: photoRanking.photo.user.gender,
        currentPercentile: photoRanking.currentPercentile,
        totalComparisons: photoRanking.totalComparisons,
        wins: photoRanking.wins,
        losses: photoRanking.losses,
        bradleyTerryScore: photoRanking.bradleyTerryScore,
        confidence: photoRanking.confidence,
      },
    });
  });
  
  await Promise.all(createCombinedForPhotos);
  console.log(`   Created ${photosWithoutCombined.length} missing combined rankings for photos`);
  
  // Get all sample images that have rankings but no combined ranking
  const samplesWithoutCombined = await prisma.sampleImageRanking.findMany({
    where: {
      sampleImage: {
        combinedRanking: null,
      },
    },
    include: {
      sampleImage: {
        select: { gender: true }
      }
    }
  });
  
  // Create combined rankings for missing sample images
  const createCombinedForSamples = samplesWithoutCombined.map(sampleRanking => {
    if (!sampleRanking.sampleImage.gender) return Promise.resolve();
    
    return prisma.combinedRanking.create({
      data: {
        sampleImageId: sampleRanking.sampleImageId,
        gender: sampleRanking.sampleImage.gender,
        currentPercentile: sampleRanking.currentPercentile,
        totalComparisons: sampleRanking.totalComparisons,
        wins: sampleRanking.wins,
        losses: sampleRanking.losses,
        bradleyTerryScore: sampleRanking.bradleyTerryScore,
        confidence: sampleRanking.confidence,
      },
    });
  });
  
  await Promise.all(createCombinedForSamples);
  console.log(`   Created ${samplesWithoutCombined.length} missing combined rankings for samples`);
}

/**
 * Calculate and update confidence scores based on number of comparisons
 */
async function updateConfidenceScores(): Promise<void> {
  console.log('🎯 Updating confidence scores...');
  
  // Simple confidence calculation based on number of comparisons
  const calculateConfidence = (totalComparisons: number): number => {
    // Confidence approaches 1.0 as comparisons increase
    // Uses a logarithmic scale: confidence = log(comparisons + 1) / log(101)
    // This gives 0.0 for 0 comparisons and ~1.0 for 100 comparisons
    return Math.min(Math.log(totalComparisons + 1) / Math.log(101), 1.0);
  };
  
  // Update photo rankings confidence
  const photoRankings = await prisma.photoRanking.findMany();
  const updatePhotoPromises = photoRankings.map(ranking =>
    prisma.photoRanking.update({
      where: { id: ranking.id },
      data: { confidence: calculateConfidence(ranking.totalComparisons) },
    })
  );
  
  await Promise.all(updatePhotoPromises);
  
  // Update sample image rankings confidence
  const sampleRankings = await prisma.sampleImageRanking.findMany();
  const updateSamplePromises = sampleRankings.map(ranking =>
    prisma.sampleImageRanking.update({
      where: { id: ranking.id },
      data: { confidence: calculateConfidence(ranking.totalComparisons) },
    })
  );
  
  await Promise.all(updateSamplePromises);
  
  // Update combined rankings confidence
  const combinedRankings = await prisma.combinedRanking.findMany();
  const updateCombinedPromises = combinedRankings.map(ranking =>
    prisma.combinedRanking.update({
      where: { id: ranking.id },
      data: { confidence: calculateConfidence(ranking.totalComparisons) },
    })
  );
  
  await Promise.all(updateCombinedPromises);
  
  console.log('✅ Updated confidence scores for all rankings');
}

/**
 * Validate that the corrected rankings are mathematically consistent
 */
async function validateCorrectedRankings(): Promise<void> {
  console.log('🔍 Validating corrected rankings...');
  
  // Get all rankings
  const [photoRankings, sampleRankings, combinedRankings] = await Promise.all([
    prisma.photoRanking.findMany(),
    prisma.sampleImageRanking.findMany(),
    prisma.combinedRanking.findMany(),
  ]);

  // Validate using the Bradley-Terry service
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
    validation.errors.slice(0, 10).forEach(error => {
      console.log(`   • ${error}`);
    });
    if (validation.errors.length > 10) {
      console.log(`   ... and ${validation.errors.length - 10} more errors`);
    }
  }

  // Check score distributions
  const scores = allRankings.map(r => r.score);
  if (scores.length > 0) {
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const median = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
    
    console.log(`📊 Score distribution after correction:`);
    console.log(`   Range: ${min.toFixed(3)} - ${max.toFixed(3)}`);
    console.log(`   Mean: ${mean.toFixed(3)}`);
    console.log(`   Median: ${median.toFixed(3)}`);
    
    if (max > 10.0) {
      console.log(`⚠️  Warning: Maximum score ${max.toFixed(3)} exceeds expected bounds`);
    }
    if (min < 0.01) {
      console.log(`⚠️  Warning: Minimum score ${min.toFixed(3)} is below expected bounds`);
    }
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting ranking recalculation migration...\n');
    const startTime = Date.now();
    
    // Step 1: Reset all rankings to initial values
    await resetAllRankings();
    console.log('');
    
    // Step 2: Recalculate photo rankings
    await recalculatePhotoRankings();
    console.log('');
    
    // Step 3: Recalculate sample image rankings
    await recalculateSampleImageRankings();
    console.log('');
    
    // Step 4: Recalculate combined rankings
    await recalculateCombinedRankings();
    console.log('');
    
    // Step 5: Synchronize missing rankings
    await synchronizeMissingRankings();
    console.log('');
    
    // Step 6: Update confidence scores
    await updateConfidenceScores();
    console.log('');
    
    // Step 7: Validate corrected rankings
    await validateCorrectedRankings();
    console.log('');
    
    const endTime = Date.now();
    console.log('=' .repeat(60));
    console.log('✅ RANKING RECALCULATION COMPLETE');
    console.log('=' .repeat(60));
    console.log(`⏱️  Total time: ${(endTime - startTime) / 1000}s`);
    console.log('');
    console.log('🎉 All rankings have been recalculated with the correct Bradley-Terry algorithm');
    console.log('📊 Rankings are now synchronized across all systems');
    console.log('🎯 Confidence scores have been updated');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run the diagnostic script again to verify fixes');
    console.log('2. Test visualization scripts to confirm corrected data');
    console.log('3. Verify ranking progression in the UI');
    
  } catch (error) {
    console.error('❌ Error during ranking recalculation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}

export { main as recalculateAllRankings };