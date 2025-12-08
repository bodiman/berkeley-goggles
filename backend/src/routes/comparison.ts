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

    // Get two random approved photos that:
    // 1. Don't belong to the current user
    // 2. Haven't been compared by this user recently
    const photos = await prisma.photo.findMany({
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
        uploadedAt: 'desc', // Prefer newer photos
      },
      take: 50, // Get a pool to choose from
    });

    if (photos.length < 2) {
      return res.json({
        success: true,
        pair: null,
        message: 'Not enough photos available for comparison',
      });
    }

    // Simple selection: pick two random photos from the pool
    // TODO: Implement smarter pairing algorithm to avoid recent comparisons
    const shuffled = photos.sort(() => 0.5 - Math.random());
    const leftPhoto = shuffled[0];
    const rightPhoto = shuffled[1];

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

    const pair = {
      sessionId: session.id,
      leftPhoto: {
        id: leftPhoto.id,
        url: leftPhoto.url,
        thumbnailUrl: leftPhoto.thumbnailUrl,
        userId: leftPhoto.userId,
        userAge: leftPhoto.user.age,
        userGender: leftPhoto.user.gender,
      },
      rightPhoto: {
        id: rightPhoto.id,
        url: rightPhoto.url,
        thumbnailUrl: rightPhoto.thumbnailUrl,
        userId: rightPhoto.userId,
        userAge: rightPhoto.user.age,
        userGender: rightPhoto.user.gender,
      },
    };

    res.json({
      success: true,
      pair,
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
    const { sessionId, winnerPhotoId, loserPhotoId, userId } = req.body;
    
    if (!sessionId || !winnerPhotoId || !loserPhotoId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, winnerPhotoId, loserPhotoId, userId',
      });
    }

    // Verify photos exist and are different
    if (winnerPhotoId === loserPhotoId) {
      return res.status(400).json({
        success: false,
        error: 'Winner and loser photos must be different',
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

    // Check if this exact comparison already exists to prevent duplicates
    const existingComparison = await prisma.comparison.findFirst({
      where: {
        raterId: userId,
        OR: [
          { winnerPhotoId: winnerPhotoId, loserPhotoId: loserPhotoId },
          { winnerPhotoId: loserPhotoId, loserPhotoId: winnerPhotoId },
        ],
      },
    });

    if (existingComparison) {
      return res.status(400).json({
        success: false,
        error: 'This photo pair has already been compared by this user',
      });
    }

    // Create the comparison record
    const comparison = await prisma.comparison.create({
      data: {
        raterId: userId,
        winnerPhotoId,
        loserPhotoId,
        sessionId,
        source: 'mobile',
        timestamp: new Date(),
      },
    });

    // Update photo rankings for winner and loser
    await Promise.all([
      // Update winner's ranking
      prisma.photoRanking.upsert({
        where: { photoId: winnerPhotoId },
        update: {
          totalComparisons: { increment: 1 },
          wins: { increment: 1 },
          lastUpdated: new Date(),
        },
        create: {
          photoId: winnerPhotoId,
          userId: (await prisma.photo.findUnique({ where: { id: winnerPhotoId } }))!.userId,
          totalComparisons: 1,
          wins: 1,
          losses: 0,
        },
      }),
      // Update loser's ranking
      prisma.photoRanking.upsert({
        where: { photoId: loserPhotoId },
        update: {
          totalComparisons: { increment: 1 },
          losses: { increment: 1 },
          lastUpdated: new Date(),
        },
        create: {
          photoId: loserPhotoId,
          userId: (await prisma.photo.findUnique({ where: { id: loserPhotoId } }))!.userId,
          totalComparisons: 1,
          wins: 0,
          losses: 1,
        },
      }),
    ]);

    // Update session stats
    await prisma.comparisonSession.update({
      where: { id: sessionId },
      data: {
        comparisonsCompleted: { increment: 1 },
      },
    });

    // Calculate simple Elo-style rating updates
    await updatePhotoRatings(winnerPhotoId, loserPhotoId);

    res.json({
      success: true,
      comparison: {
        id: comparison.id,
        timestamp: comparison.timestamp,
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