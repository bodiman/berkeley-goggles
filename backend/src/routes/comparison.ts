import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';

export const comparisonRoutes = Router();

// GET /api/comparisons/next-pair
comparisonRoutes.get('/next-pair', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Find or create current comparison session for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    let session = await prisma.comparisonSession.findFirst({
      where: {
        userId: userId,
        startedAt: { gte: today },
        endedAt: null, // Still active
      },
    });

    if (!session) {
      session = await prisma.comparisonSession.create({
        data: {
          userId: userId,
          startedAt: new Date(),
        },
      });
    }

    // Get rater's gender for filtering
    const rater = await prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true },
    });

    if (!rater?.gender) {
      return res.status(400).json({
        success: false,
        error: 'User gender not found. Please complete profile setup.',
      });
    }

    // Determine opposite gender for filtering
    const oppositeGender = rater.gender === 'male' ? 'female' : 'male';

    // Priority system for photo selection:
    // 1. Prioritize user photos over sample images
    // 2. Require full ordering of real users before expanding to samples
    // 3. 10% chance to include samples even with incomplete user ordering
    // 4. Gender filtering: show only opposite gender

    // Get available user photos (opposite gender only)
    const userPhotos = await prisma.photo.findMany({
      where: {
        status: 'approved',
        userId: { not: userId }, // Don't show user their own photos
        user: {
          gender: oppositeGender, // Only opposite gender
        },
      },
      include: {
        user: {
          select: {
            id: true,
            age: true,
            gender: true,
          },
        },
        ranking: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
      take: 50,
    });

    // Get available sample images (opposite gender only)
    const sampleImages = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        gender: oppositeGender, // Only opposite gender
      },
      include: {
        ranking: true,
      },
      orderBy: {
        lastUsed: 'asc', // Prefer less recently used samples
      },
      take: 50,
    });

    // Get user's previous comparisons to avoid duplicates
    const previousComparisons = await getPreviousComparisons(userId);
    const comparedPairs = extractComparedPairs(previousComparisons);

    // Add type information to photos for easier processing
    const typedUserPhotos = userPhotos.map(photo => ({ ...photo, type: 'user' }));
    const typedSampleImages = sampleImages.map(sample => ({ ...sample, type: 'sample' }));

    let pair = null;
    let comparisonType = 'user_photos';

    // Phase 1: Try user-only comparisons first
    let availablePairs = [];
    let phase = 'user_only';
    let message = '';

    if (typedUserPhotos.length >= 2) {
      // Generate all possible user photo pairs
      const userPairs = generateUserPhotoPairs(typedUserPhotos);
      // Filter out already compared pairs
      availablePairs = filterUncomparedPairs(userPairs, comparedPairs);
      
      if (availablePairs.length > 0) {
        phase = 'user_only';
      }
    }

    // Phase 2: If no user pairs left, move to combined phase
    if (availablePairs.length === 0 && (typedUserPhotos.length > 0 || typedSampleImages.length > 0)) {
      // Generate mixed pairs (user + sample images)
      const mixedPairs = generateMixedPairs(typedUserPhotos, typedSampleImages);
      availablePairs = filterUncomparedPairs(mixedPairs, comparedPairs);
      
      if (availablePairs.length > 0) {
        phase = 'combined';
        if (typedUserPhotos.length >= 2) {
          message = 'You\'ve compared all user photos! Now comparing with sample images.';
        }
      }
    }

    // Select random pair from available options
    if (availablePairs.length === 0) {
      return res.json({
        success: true,
        pair: null,
        message: typedUserPhotos.length === 0 && typedSampleImages.length === 0
          ? `No ${oppositeGender} photos available for comparison`
          : 'You\'ve compared all available photo combinations!',
      });
    }

    // Select a random pair
    const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    const leftPhoto = selectedPair.left;
    const rightPhoto = selectedPair.right;

    // Determine comparison type
    if (leftPhoto.type === 'user' && rightPhoto.type === 'user') {
      comparisonType = 'user_photos';
    } else if (leftPhoto.type === 'sample' && rightPhoto.type === 'sample') {
      comparisonType = 'sample_images';
    } else {
      comparisonType = 'mixed';
    }

    // Build the response pair object
    const buildPhotoObject = (photo: any) => {
      if (photo.type === 'user') {
        return {
          id: photo.id,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl,
          userId: photo.userId,
          userAge: photo.user.age,
          userGender: photo.user.gender,
          type: 'user',
        };
      } else {
        return {
          id: photo.id,
          url: `http://localhost:3001${photo.url}`,
          thumbnailUrl: `http://localhost:3001${photo.thumbnailUrl}`,
          userId: 'sample',
          userAge: photo.estimatedAge,
          userGender: photo.gender,
          type: 'sample',
        };
      }
    };

    pair = {
      sessionId: session.id,
      leftPhoto: buildPhotoObject(leftPhoto),
      rightPhoto: buildPhotoObject(rightPhoto),
    };

    // Update sample image timestamps if used
    const sampleUpdatePromises = [];
    if (leftPhoto.type === 'sample') {
      sampleUpdatePromises.push(
        prisma.sampleImage.update({
          where: { id: leftPhoto.id },
          data: { lastUsed: new Date() },
        })
      );
    }
    if (rightPhoto.type === 'sample') {
      sampleUpdatePromises.push(
        prisma.sampleImage.update({
          where: { id: rightPhoto.id },
          data: { lastUsed: new Date() },
        })
      );
    }
    
    if (sampleUpdatePromises.length > 0) {
      await Promise.all(sampleUpdatePromises);
    }

    res.json({
      success: true,
      pair,
      comparisonType,
      phase,
      message: message || undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get next pair error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get next photo pair',
    });
  }
}));

// POST /api/comparisons/submit
comparisonRoutes.post('/submit', asyncHandler(async (req, res) => {
  try {
    const { 
      sessionId, 
      winnerId, 
      loserId, 
      winnerType, 
      loserType, 
      comparisonType,
      userId 
    } = req.body;
    
    if (!sessionId || !winnerId || !loserId || !winnerType || !loserType || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, winnerId, loserId, winnerType, loserType, userId',
      });
    }

    // Verify photos exist and are different
    if (winnerId === loserId) {
      return res.status(400).json({
        success: false,
        error: 'Winner and loser must be different',
      });
    }

    // Verify session belongs to user
    const session = await prisma.comparisonSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or does not belong to user',
      });
    }

    // Determine comparison type from photo types
    let finalComparisonType = comparisonType;
    if (!finalComparisonType) {
      if (winnerType === 'user' && loserType === 'user') {
        finalComparisonType = 'user_photos';
      } else if (winnerType === 'sample' && loserType === 'sample') {
        finalComparisonType = 'sample_images';
      } else {
        finalComparisonType = 'mixed';
      }
    }

    // Prepare comparison data based on photo types
    const comparisonData: any = {
      raterId: userId,
      sessionId,
      comparisonType: finalComparisonType,
      source: 'mobile',
      timestamp: new Date(),
    };

    // Set the appropriate ID fields based on photo types
    if (winnerType === 'user') {
      comparisonData.winnerPhotoId = winnerId;
    } else {
      comparisonData.winnerSampleImageId = winnerId;
    }

    if (loserType === 'user') {
      comparisonData.loserPhotoId = loserId;
    } else {
      comparisonData.loserSampleImageId = loserId;
    }

    // Create the comparison record
    const comparison = await prisma.comparison.create({
      data: comparisonData,
    });

    // Update rankings based on photo types
    const rankingUpdates = [];

    if (winnerType === 'user') {
      // Update user photo ranking for winner
      rankingUpdates.push(
        prisma.photoRanking.upsert({
          where: { photoId: winnerId },
          update: {
            totalComparisons: { increment: 1 },
            wins: { increment: 1 },
            lastUpdated: new Date(),
          },
          create: {
            photoId: winnerId,
            userId: (await prisma.photo.findUnique({ where: { id: winnerId } }))!.userId,
            totalComparisons: 1,
            wins: 1,
            losses: 0,
          },
        })
      );
    } else {
      // Update sample image ranking for winner
      rankingUpdates.push(
        prisma.sampleImageRanking.upsert({
          where: { sampleImageId: winnerId },
          update: {
            totalComparisons: { increment: 1 },
            wins: { increment: 1 },
            lastUpdated: new Date(),
          },
          create: {
            sampleImageId: winnerId,
            totalComparisons: 1,
            wins: 1,
            losses: 0,
            currentPercentile: 50.0,
            bradleyTerryScore: 0.5,
            confidence: 0.0,
          },
        })
      );
    }

    if (loserType === 'user') {
      // Update user photo ranking for loser
      rankingUpdates.push(
        prisma.photoRanking.upsert({
          where: { photoId: loserId },
          update: {
            totalComparisons: { increment: 1 },
            losses: { increment: 1 },
            lastUpdated: new Date(),
          },
          create: {
            photoId: loserId,
            userId: (await prisma.photo.findUnique({ where: { id: loserId } }))!.userId,
            totalComparisons: 1,
            wins: 0,
            losses: 1,
          },
        })
      );
    } else {
      // Update sample image ranking for loser
      rankingUpdates.push(
        prisma.sampleImageRanking.upsert({
          where: { sampleImageId: loserId },
          update: {
            totalComparisons: { increment: 1 },
            losses: { increment: 1 },
            lastUpdated: new Date(),
          },
          create: {
            sampleImageId: loserId,
            totalComparisons: 1,
            wins: 0,
            losses: 1,
            currentPercentile: 50.0,
            bradleyTerryScore: 0.5,
            confidence: 0.0,
          },
        })
      );
    }

    // Execute all ranking updates
    await Promise.all(rankingUpdates);

    // Update session stats
    await prisma.comparisonSession.update({
      where: { id: sessionId },
      data: {
        comparisonsCompleted: { increment: 1 },
      },
    });

    // Calculate rating updates based on comparison type
    if (finalComparisonType === 'user_photos') {
      // Both are user photos - use existing rating update function
      await updatePhotoRatings(winnerId, loserId);
      // Also update combined rankings for cross-comparisons
      await updateCombinedRankings(winnerId, loserId, 'user', 'user');
    } else if (finalComparisonType === 'sample_images') {
      // Both are sample images - use sample image rating update
      await updateSampleImageRatings(winnerId, loserId);
      // Also update combined rankings
      await updateCombinedRankings(winnerId, loserId, 'sample', 'sample');
    } else if (finalComparisonType === 'mixed') {
      // Mixed comparison - only update combined rankings
      await updateCombinedRankings(winnerId, loserId, winnerType, loserType);
    }

    res.json({
      success: true,
      comparison: {
        id: comparison.id,
        timestamp: comparison.timestamp,
        comparisonType: finalComparisonType,
      },
      message: 'Comparison submitted successfully',
    });
  } catch (error) {
    console.error('Submit comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit comparison',
    });
  }
}));

// GET /api/comparisons/daily-progress
comparisonRoutes.get('/daily-progress', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's session(s) for the user
    const sessions = await prisma.comparisonSession.findMany({
      where: {
        userId: userId,
        startedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Calculate totals from all sessions today
    const totalComparisons = sessions.reduce((sum, session) => sum + session.comparisonsCompleted, 0);
    const totalSkipped = sessions.reduce((sum, session) => sum + session.comparisonsSkipped, 0);

    // Calculate user's streak (consecutive days with at least 1 comparison)
    let streak = 0;
    const checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const daySession = await prisma.comparisonSession.findFirst({
        where: {
          userId: userId,
          startedAt: {
            gte: dayStart,
            lt: dayEnd,
          },
          comparisonsCompleted: { gt: 0 },
        },
      });
      
      if (daySession) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get user's daily target (from user settings)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyLimit: true },
    });

    const dailyTarget = user?.dailyLimit || 20;
    const progress = Math.min((totalComparisons / dailyTarget) * 100, 100);

    res.json({
      success: true,
      progress: {
        comparisonsCompleted: totalComparisons,
        comparisonsSkipped: totalSkipped,
        dailyTarget,
        progress: Math.round(progress),
        streak,
        isTargetReached: totalComparisons >= dailyTarget,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get daily progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get daily progress',
    });
  }
}));

// POST /api/comparisons/skip-pair
comparisonRoutes.post('/skip-pair', asyncHandler(async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    
    if (!sessionId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, userId',
      });
    }

    // Verify session belongs to user
    const session = await prisma.comparisonSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or does not belong to user',
      });
    }

    // Update session skip count
    await prisma.comparisonSession.update({
      where: { id: sessionId },
      data: {
        comparisonsSkipped: { increment: 1 },
      },
    });

    res.json({
      success: true,
      message: 'Comparison skipped successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Skip comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to skip comparison',
    });
  }
}));

// Helper function to update photo ratings using simple Elo algorithm
async function updatePhotoRatings(winnerPhotoId: string, loserPhotoId: string) {
  try {
    // Get current rankings for both photos
    const [winnerRanking, loserRanking] = await Promise.all([
      prisma.photoRanking.findUnique({ where: { photoId: winnerPhotoId } }),
      prisma.photoRanking.findUnique({ where: { photoId: loserPhotoId } }),
    ]);

    if (!winnerRanking || !loserRanking) {
      console.error('Photo rankings not found for rating update');
      return;
    }

    // Simple Bradley-Terry model update
    const K = 32; // Rating change factor
    const winnerScore = winnerRanking.bradleyTerryScore;
    const loserScore = loserRanking.bradleyTerryScore;
    
    // Expected scores
    const expectedWinnerScore = winnerScore / (winnerScore + loserScore);
    const expectedLoserScore = loserScore / (winnerScore + loserScore);
    
    // Update scores (winner gets 1, loser gets 0)
    const newWinnerScore = winnerScore + K * (1 - expectedWinnerScore);
    const newLoserScore = loserScore + K * (0 - expectedLoserScore);
    
    // Update Bradley-Terry scores
    await Promise.all([
      prisma.photoRanking.update({
        where: { photoId: winnerPhotoId },
        data: {
          bradleyTerryScore: Math.max(0.1, newWinnerScore), // Minimum score
        },
      }),
      prisma.photoRanking.update({
        where: { photoId: loserPhotoId },
        data: {
          bradleyTerryScore: Math.max(0.1, newLoserScore), // Minimum score
        },
      }),
    ]);

    // TODO: Update percentiles based on new scores
    await updatePercentiles();
  } catch (error) {
    console.error('Error updating photo ratings:', error);
  }
}

// Helper function to update sample image ratings using Bradley-Terry algorithm
async function updateSampleImageRatings(winnerSampleId: string, loserSampleId: string) {
  try {
    // Get current rankings for both sample images
    const [winnerRanking, loserRanking] = await Promise.all([
      prisma.sampleImageRanking.findUnique({ where: { sampleImageId: winnerSampleId } }),
      prisma.sampleImageRanking.findUnique({ where: { sampleImageId: loserSampleId } }),
    ]);

    if (!winnerRanking || !loserRanking) {
      console.error('Sample image rankings not found for rating update');
      return;
    }

    // Simple Bradley-Terry model update
    const K = 32; // Rating change factor
    const winnerScore = winnerRanking.bradleyTerryScore;
    const loserScore = loserRanking.bradleyTerryScore;
    
    // Expected scores
    const expectedWinnerScore = winnerScore / (winnerScore + loserScore);
    const expectedLoserScore = loserScore / (winnerScore + loserScore);
    
    // Update scores (winner gets 1, loser gets 0)
    const newWinnerScore = winnerScore + K * (1 - expectedWinnerScore);
    const newLoserScore = loserScore + K * (0 - expectedLoserScore);
    
    // Update Bradley-Terry scores
    await Promise.all([
      prisma.sampleImageRanking.update({
        where: { sampleImageId: winnerSampleId },
        data: {
          bradleyTerryScore: Math.max(0.1, newWinnerScore), // Minimum score
        },
      }),
      prisma.sampleImageRanking.update({
        where: { sampleImageId: loserSampleId },
        data: {
          bradleyTerryScore: Math.max(0.1, newLoserScore), // Minimum score
        },
      }),
    ]);

    // Update percentiles for sample images
    await updateSampleImagePercentiles();
  } catch (error) {
    console.error('Error updating sample image ratings:', error);
  }
}

// Helper function to recalculate percentiles for all photos
async function updatePercentiles() {
  try {
    // Get all photo rankings ordered by Bradley-Terry score
    const rankings = await prisma.photoRanking.findMany({
      where: {
        totalComparisons: { gt: 0 }, // Only photos that have been compared
      },
      orderBy: {
        bradleyTerryScore: 'desc',
      },
    });

    const totalPhotos = rankings.length;
    
    if (totalPhotos === 0) return;

    // Update percentiles
    for (let i = 0; i < rankings.length; i++) {
      const percentile = ((totalPhotos - i) / totalPhotos) * 100;
      
      await prisma.photoRanking.update({
        where: { id: rankings[i].id },
        data: {
          currentPercentile: Math.round(percentile * 10) / 10, // Round to 1 decimal
        },
      });
    }
  } catch (error) {
    console.error('Error updating percentiles:', error);
  }
}

// Helper function to recalculate percentiles for all sample images
async function updateSampleImagePercentiles() {
  try {
    // Get all sample image rankings ordered by Bradley-Terry score
    const rankings = await prisma.sampleImageRanking.findMany({
      where: {
        totalComparisons: { gt: 0 }, // Only sample images that have been compared
      },
      orderBy: {
        bradleyTerryScore: 'desc',
      },
    });

    const totalSampleImages = rankings.length;
    
    if (totalSampleImages === 0) return;

    // Update percentiles
    for (let i = 0; i < rankings.length; i++) {
      const percentile = ((totalSampleImages - i) / totalSampleImages) * 100;
      
      await prisma.sampleImageRanking.update({
        where: { id: rankings[i].id },
        data: {
          currentPercentile: Math.round(percentile * 10) / 10, // Round to 1 decimal
        },
      });
    }
  } catch (error) {
    console.error('Error updating sample image percentiles:', error);
  }
}

// Helper function to update combined rankings for mixed comparisons
async function updateCombinedRankings(
  winnerId: string, 
  loserId: string, 
  winnerType: 'user' | 'sample', 
  loserType: 'user' | 'sample'
) {
  try {
    // Get or create combined rankings for both photos
    const winnerCombinedRanking = await getOrCreateCombinedRanking(winnerId, winnerType);
    const loserCombinedRanking = await getOrCreateCombinedRanking(loserId, loserType);

    if (!winnerCombinedRanking || !loserCombinedRanking) {
      console.error('Failed to get combined rankings for rating update');
      return;
    }

    // Update comparison counts
    await Promise.all([
      prisma.combinedRanking.update({
        where: { id: winnerCombinedRanking.id },
        data: {
          totalComparisons: { increment: 1 },
          wins: { increment: 1 },
          lastUpdated: new Date(),
        },
      }),
      prisma.combinedRanking.update({
        where: { id: loserCombinedRanking.id },
        data: {
          totalComparisons: { increment: 1 },
          losses: { increment: 1 },
          lastUpdated: new Date(),
        },
      }),
    ]);

    // Simple Bradley-Terry model update for combined rankings
    const K = 32; // Rating change factor
    const winnerScore = winnerCombinedRanking.bradleyTerryScore;
    const loserScore = loserCombinedRanking.bradleyTerryScore;
    
    // Expected scores
    const expectedWinnerScore = winnerScore / (winnerScore + loserScore);
    const expectedLoserScore = loserScore / (winnerScore + loserScore);
    
    // Update scores (winner gets 1, loser gets 0)
    const newWinnerScore = winnerScore + K * (1 - expectedWinnerScore);
    const newLoserScore = loserScore + K * (0 - expectedLoserScore);
    
    // Update Bradley-Terry scores
    await Promise.all([
      prisma.combinedRanking.update({
        where: { id: winnerCombinedRanking.id },
        data: {
          bradleyTerryScore: Math.max(0.1, newWinnerScore), // Minimum score
        },
      }),
      prisma.combinedRanking.update({
        where: { id: loserCombinedRanking.id },
        data: {
          bradleyTerryScore: Math.max(0.1, newLoserScore), // Minimum score
        },
      }),
    ]);

    // Update combined percentiles
    await updateCombinedPercentiles();
  } catch (error) {
    console.error('Error updating combined rankings:', error);
  }
}

// Helper function to get or create combined ranking
async function getOrCreateCombinedRanking(photoId: string, photoType: 'user' | 'sample') {
  try {
    // First try to find existing combined ranking
    const existingRanking = await prisma.combinedRanking.findFirst({
      where: photoType === 'user' 
        ? { photoId: photoId }
        : { sampleImageId: photoId }
    });

    if (existingRanking) {
      return existingRanking;
    }

    // Get gender info for new ranking
    let gender: string;
    let userId: string | null = null;

    if (photoType === 'user') {
      const photo = await prisma.photo.findUnique({
        where: { id: photoId },
        include: { user: { select: { gender: true, id: true } } },
      });
      if (!photo?.user.gender) return null;
      gender = photo.user.gender;
      userId = photo.user.id;
    } else {
      const sampleImage = await prisma.sampleImage.findUnique({
        where: { id: photoId },
        select: { gender: true },
      });
      if (!sampleImage?.gender) return null;
      gender = sampleImage.gender;
    }

    // Create new combined ranking
    return await prisma.combinedRanking.create({
      data: {
        photoId: photoType === 'user' ? photoId : null,
        sampleImageId: photoType === 'sample' ? photoId : null,
        userId: userId,
        gender: gender,
        currentPercentile: 50.0,
        totalComparisons: 0,
        wins: 0,
        losses: 0,
        bradleyTerryScore: 0.5,
        confidence: 0.0,
      },
    });
  } catch (error) {
    console.error('Error getting/creating combined ranking:', error);
    return null;
  }
}

// Helper function to recalculate percentiles for all combined rankings
async function updateCombinedPercentiles() {
  try {
    // Update percentiles by gender separately
    const genders = ['male', 'female'];
    
    for (const gender of genders) {
      // Get all combined rankings for this gender ordered by Bradley-Terry score
      const rankings = await prisma.combinedRanking.findMany({
        where: {
          gender: gender,
          totalComparisons: { gt: 0 }, // Only items that have been compared
        },
        orderBy: {
          bradleyTerryScore: 'desc',
        },
      });

      const totalItems = rankings.length;
      
      if (totalItems === 0) continue;

      // Update percentiles
      for (let i = 0; i < rankings.length; i++) {
        const percentile = ((totalItems - i) / totalItems) * 100;
        
        await prisma.combinedRanking.update({
          where: { id: rankings[i].id },
          data: {
            currentPercentile: Math.round(percentile * 10) / 10, // Round to 1 decimal
          },
        });
      }
    }
  } catch (error) {
    console.error('Error updating combined percentiles:', error);
  }
}

// Helper function to get all previous comparisons for a user
async function getPreviousComparisons(userId: string) {
  const comparisons = await prisma.comparison.findMany({
    where: {
      raterId: userId,
    },
    select: {
      winnerPhotoId: true,
      loserPhotoId: true,
      winnerSampleImageId: true,
      loserSampleImageId: true,
      comparisonType: true,
    },
  });

  return comparisons;
}

// Helper function to normalize photo pair (order doesn't matter: A vs B = B vs A)
function normalizePair(id1: string, id2: string): string {
  return [id1, id2].sort().join('_');
}

// Helper function to extract compared pairs from comparison history
function extractComparedPairs(comparisons: any[]): Set<string> {
  const comparedPairs = new Set<string>();

  for (const comp of comparisons) {
    if (comp.winnerPhotoId && comp.loserPhotoId) {
      // User photo comparison
      comparedPairs.add(normalizePair(comp.winnerPhotoId, comp.loserPhotoId));
    } else if (comp.winnerSampleImageId && comp.loserSampleImageId) {
      // Sample image comparison
      comparedPairs.add(normalizePair(comp.winnerSampleImageId, comp.loserSampleImageId));
    } else if (
      (comp.winnerPhotoId && comp.loserSampleImageId) ||
      (comp.winnerSampleImageId && comp.loserPhotoId)
    ) {
      // Mixed comparison (user photo vs sample image)
      const photoId = comp.winnerPhotoId || comp.loserPhotoId;
      const sampleId = comp.winnerSampleImageId || comp.loserSampleImageId;
      comparedPairs.add(normalizePair(`photo_${photoId}`, `sample_${sampleId}`));
    }
  }

  return comparedPairs;
}

// Helper function to generate all possible user photo pairs
function generateUserPhotoPairs(photos: any[]): Array<{left: any, right: any}> {
  const pairs = [];
  for (let i = 0; i < photos.length - 1; i++) {
    for (let j = i + 1; j < photos.length; j++) {
      pairs.push({ left: photos[i], right: photos[j] });
    }
  }
  return pairs;
}

// Helper function to generate mixed pairs (user photos + sample images)
function generateMixedPairs(userPhotos: any[], sampleImages: any[]): Array<{left: any, right: any, type: string}> {
  const pairs = [];

  // User photo vs user photo
  for (let i = 0; i < userPhotos.length - 1; i++) {
    for (let j = i + 1; j < userPhotos.length; j++) {
      pairs.push({ 
        left: userPhotos[i], 
        right: userPhotos[j], 
        type: 'user_photos' 
      });
    }
  }

  // Sample image vs sample image  
  for (let i = 0; i < sampleImages.length - 1; i++) {
    for (let j = i + 1; j < sampleImages.length; j++) {
      pairs.push({ 
        left: sampleImages[i], 
        right: sampleImages[j], 
        type: 'sample_images' 
      });
    }
  }

  // User photo vs sample image
  for (const userPhoto of userPhotos) {
    for (const sampleImage of sampleImages) {
      pairs.push({ 
        left: userPhoto, 
        right: sampleImage, 
        type: 'mixed' 
      });
      pairs.push({ 
        left: sampleImage, 
        right: userPhoto, 
        type: 'mixed' 
      });
    }
  }

  return pairs;
}

// Helper function to filter out already compared pairs
function filterUncomparedPairs(pairs: Array<{left: any, right: any, type?: string}>, comparedPairs: Set<string>): Array<{left: any, right: any, type?: string}> {
  return pairs.filter(pair => {
    const leftId = pair.left.id;
    const rightId = pair.right.id;
    
    let pairKey: string;
    
    // Determine the pair key based on photo types
    if (pair.left.type === 'user' && pair.right.type === 'user') {
      pairKey = normalizePair(leftId, rightId);
    } else if (pair.left.type === 'sample' && pair.right.type === 'sample') {
      pairKey = normalizePair(leftId, rightId);
    } else {
      // Mixed comparison
      const photoId = pair.left.type === 'user' ? leftId : rightId;
      const sampleId = pair.left.type === 'sample' ? leftId : rightId;
      pairKey = normalizePair(`photo_${photoId}`, `sample_${sampleId}`);
    }
    
    return !comparedPairs.has(pairKey);
  });
}