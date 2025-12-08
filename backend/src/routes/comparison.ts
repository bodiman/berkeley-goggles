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

    // Priority system for photo selection:
    // 1. Try user photos first (current behavior)
    // 2. If <2 user photos, try mixed (1 user + 1 sample)
    // 3. If <1 user photo, use 2 sample images

    // Get available user photos
    const userPhotos = await prisma.photo.findMany({
      where: {
        status: 'approved',
        userId: { not: userId }, // Don't show user their own photos
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

    // Get available sample images
    const sampleImages = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
      },
      include: {
        ranking: true,
      },
      orderBy: {
        lastUsed: 'asc', // Prefer less recently used samples
      },
      take: 50,
    });

    let pair = null;
    let comparisonType = 'user_photos';

    if (userPhotos.length >= 2) {
      // Use two user photos
      const shuffled = userPhotos.sort(() => 0.5 - Math.random());
      const leftPhoto = shuffled[0];
      const rightPhoto = shuffled[1];

      pair = {
        sessionId: session.id,
        leftPhoto: {
          id: leftPhoto.id,
          url: leftPhoto.url,
          thumbnailUrl: leftPhoto.thumbnailUrl,
          userId: leftPhoto.userId,
          userAge: leftPhoto.user.age,
          userGender: leftPhoto.user.gender,
          type: 'user',
        },
        rightPhoto: {
          id: rightPhoto.id,
          url: rightPhoto.url,
          thumbnailUrl: rightPhoto.thumbnailUrl,
          userId: rightPhoto.userId,
          userAge: rightPhoto.user.age,
          userGender: rightPhoto.user.gender,
          type: 'user',
        },
      };
      comparisonType = 'user_photos';
    } else if (userPhotos.length === 1 && sampleImages.length >= 1) {
      // Use 1 user photo + 1 sample image
      const userPhoto = userPhotos[0];
      const samplePhoto = sampleImages[Math.floor(Math.random() * sampleImages.length)];

      // Randomly assign which side gets which type
      const leftIsUser = Math.random() < 0.5;

      pair = {
        sessionId: session.id,
        leftPhoto: leftIsUser ? {
          id: userPhoto.id,
          url: userPhoto.url,
          thumbnailUrl: userPhoto.thumbnailUrl,
          userId: userPhoto.userId,
          userAge: userPhoto.user.age,
          userGender: userPhoto.user.gender,
          type: 'user',
        } : {
          id: samplePhoto.id,
          url: `http://localhost:3001${samplePhoto.url}`,
          thumbnailUrl: `http://localhost:3001${samplePhoto.thumbnailUrl}`,
          userId: 'sample',
          userAge: samplePhoto.estimatedAge,
          userGender: samplePhoto.gender,
          type: 'sample',
        },
        rightPhoto: leftIsUser ? {
          id: samplePhoto.id,
          url: `http://localhost:3001${samplePhoto.url}`,
          thumbnailUrl: `http://localhost:3001${samplePhoto.thumbnailUrl}`,
          userId: 'sample',
          userAge: samplePhoto.estimatedAge,
          userGender: samplePhoto.gender,
          type: 'sample',
        } : {
          id: userPhoto.id,
          url: userPhoto.url,
          thumbnailUrl: userPhoto.thumbnailUrl,
          userId: userPhoto.userId,
          userAge: userPhoto.user.age,
          userGender: userPhoto.user.gender,
          type: 'user',
        },
      };
      comparisonType = 'mixed';

      // Update sample image last used timestamp
      await prisma.sampleImage.update({
        where: { id: samplePhoto.id },
        data: { lastUsed: new Date() },
      });
    } else if (sampleImages.length >= 2) {
      // Use two sample images
      const shuffled = sampleImages.sort(() => 0.5 - Math.random());
      const leftPhoto = shuffled[0];
      const rightPhoto = shuffled[1];

      pair = {
        sessionId: session.id,
        leftPhoto: {
          id: leftPhoto.id,
          url: `http://localhost:3001${leftPhoto.url}`,
          thumbnailUrl: `http://localhost:3001${leftPhoto.thumbnailUrl}`,
          userId: 'sample',
          userAge: leftPhoto.estimatedAge,
          userGender: leftPhoto.gender,
          type: 'sample',
        },
        rightPhoto: {
          id: rightPhoto.id,
          url: `http://localhost:3001${rightPhoto.url}`,
          thumbnailUrl: `http://localhost:3001${rightPhoto.thumbnailUrl}`,
          userId: 'sample',
          userAge: rightPhoto.estimatedAge,
          userGender: rightPhoto.gender,
          type: 'sample',
        },
      };
      comparisonType = 'sample_images';

      // Update sample images last used timestamps
      await Promise.all([
        prisma.sampleImage.update({
          where: { id: leftPhoto.id },
          data: { lastUsed: new Date() },
        }),
        prisma.sampleImage.update({
          where: { id: rightPhoto.id },
          data: { lastUsed: new Date() },
        }),
      ]);
    } else {
      // No photos available at all
      return res.json({
        success: true,
        pair: null,
        message: 'No photos available for comparison',
      });
    }

    res.json({
      success: true,
      pair,
      comparisonType,
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
    } else if (finalComparisonType === 'sample_images') {
      // Both are sample images - use sample image rating update
      await updateSampleImageRatings(winnerId, loserId);
    }
    // For mixed comparisons, we might skip cross-pool rating updates
    // to keep user and sample rankings separate

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