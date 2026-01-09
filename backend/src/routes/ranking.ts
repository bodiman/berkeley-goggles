import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { LeagueService } from '../services/leagueService';

export const rankingRoutes = Router();

// GET /api/rankings/my-stats - Get comprehensive stats for active photo
rankingRoutes.get('/my-stats', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get user and find photo that matches current profile photo
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.profilePhotoUrl) {
      return res.json({
        success: true,
        stats: null,
        message: 'No profile photo found',
      });
    }

    // Find the photo record that matches the current profile photo URL
    const photo = await prisma.photo.findFirst({
      where: {
        userId: userId,
        url: user.profilePhotoUrl,
      },
      include: {
        ranking: {
          include: {
            history: {
              orderBy: { recordedAt: 'desc' },
              take: 10, // Last 10 data points for trend analysis
            },
          },
        },
      },
    });

    if (!photo) {
      return res.json({
        success: true,
        stats: null,
        message: 'Profile photo not found in ranking system',
      });
    }

    const ranking = photo.ranking;
    const totalComparisons = ranking?.totalComparisons || 0;
    const wins = ranking?.wins || 0;
    const losses = ranking?.losses || 0;
    const winRate = totalComparisons > 0 ? (wins / totalComparisons) * 100 : 0;
    
    // Calculate confidence level
    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (totalComparisons >= 50) confidence = 'high';
    else if (totalComparisons >= 20) confidence = 'medium';

    // Calculate trend (simplified - compare current vs average of last 5 readings)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (ranking?.history && ranking.history.length >= 3) {
      const recent = ranking.history.slice(0, 3).map(h => h.percentile);
      const older = ranking.history.slice(3, 6).map(h => h.percentile);
      
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        if (recentAvg > olderAvg + 2) trend = 'up';
        else if (recentAvg < olderAvg - 2) trend = 'down';
      }
    }

    // Get total number of photos with rankings for percentile context
    const totalRankedPhotos = await prisma.photoRanking.count({
      where: {
        totalComparisons: { gt: 0 }, // Only count photos that have been compared
      },
    });

    // Calculate league information using trophy score
    const currentTrophy = ranking?.trophyScore || 0;
    const leagueProgression = LeagueService.getLeagueProgression(currentTrophy);

    const stats = {
      photo: {
        id: photo.id,
        url: photo.url,
        uploadedAt: photo.uploadedAt,
      },
      performance: {
        totalComparisons,
        wins,
        losses,
        winRate: Math.round(winRate * 10) / 10,
        currentPercentile: ranking?.currentPercentile || 50,
        trophyScore: ranking?.trophyScore || 0,
        targetTrophyScore: ranking?.targetTrophyScore,
        confidence,
        trend,
        lastUpdated: ranking?.lastUpdated,
      },
      context: {
        totalRankedPhotos,
        rankPosition: Math.ceil((ranking?.currentPercentile || 50) * totalRankedPhotos / 100),
      },
      league: leagueProgression,
      history: ranking?.history || [],
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user stats',
    });
  }
}));

// GET /api/rankings/my-percentile
rankingRoutes.get('/my-percentile', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.profilePhotoUrl) {
      return res.json({ 
        success: true, 
        percentile: null,
        hasProfilePhoto: false,
        timestamp: new Date().toISOString()
      });
    }

    // Find the photo record that matches the current profile photo URL
    const photo = await prisma.photo.findFirst({
      where: {
        userId: userId,
        url: user.profilePhotoUrl,
      },
      include: {
        ranking: true,
      },
    });

    const percentile = photo?.ranking?.currentPercentile || null;

    res.json({ 
      success: true, 
      percentile,
      hasProfilePhoto: user?.profilePhotoUrl !== null,
      hasRanking: photo?.ranking !== null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get percentile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get percentile',
    });
  }
}));

// GET /api/rankings/history
rankingRoutes.get('/history', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.profilePhotoUrl) {
      return res.json({ 
        success: true, 
        history: [],
        timestamp: new Date().toISOString()
      });
    }

    // Find the photo record that matches the current profile photo URL
    const photo = await prisma.photo.findFirst({
      where: {
        userId: userId,
        url: user.profilePhotoUrl,
      },
      include: {
        ranking: {
          include: {
            history: {
              orderBy: { recordedAt: 'desc' },
              take: 50, // Last 50 data points
            },
          },
        },
      },
    });

    const history = photo?.ranking?.history || [];

    res.json({ 
      success: true, 
      history: history.reverse(), // Oldest first for charting
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get ranking history',
    });
  }
}));

// GET /api/rankings/leaderboard
rankingRoutes.get('/leaderboard', asyncHandler(async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    
    // Get top ranked photos (only show users who opted in)
    const topRankings = await prisma.photoRanking.findMany({
      where: {
        photo: { status: 'approved' }, // Show all approved photos
        user: { optOutOfLeaderboards: false },
        totalComparisons: { gte: 10 }, // Minimum comparisons for leaderboard
      },
      include: {
        photo: true,
        user: {
          select: {
            id: true,
            name: true,
            age: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { currentPercentile: 'desc' },
      take: limit,
    });

    const leaderboard = topRankings.map((ranking, index) => ({
      rank: index + 1,
      user: {
        id: ranking.user.id,
        name: ranking.user.name,
        age: ranking.user.age,
        location: ranking.user.city && ranking.user.state 
          ? `${ranking.user.city}, ${ranking.user.state}` 
          : null,
      },
      photo: {
        id: ranking.photo.id,
        url: ranking.photo.thumbnailUrl || ranking.photo.url,
      },
      stats: {
        percentile: ranking.currentPercentile,
        totalComparisons: ranking.totalComparisons,
        winRate: ranking.totalComparisons > 0 
          ? Math.round((ranking.wins / ranking.totalComparisons) * 1000) / 10
          : 0,
      },
    }));

    res.json({ 
      success: true, 
      leaderboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get leaderboard',
    });
  }
}));

// GET /api/rankings/league-leaderboard - Get leaderboard for a specific league
rankingRoutes.get('/league-leaderboard', asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const leagueId = req.query.leagueId as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    if (!leagueId) {
      return res.status(400).json({
        success: false,
        error: 'League ID required',
      });
    }

    // Get the league information
    const league = LeagueService.getLeagueById(leagueId);
    if (!league) {
      return res.status(400).json({
        success: false,
        error: 'Invalid league ID',
      });
    }

    // Get players in the specified league based on trophy scores
    const leagueRankings = await prisma.photoRanking.findMany({
      where: {
        photo: { status: 'approved' },
        user: { optOutOfLeaderboards: false },
        totalComparisons: { gte: 5 }, // Minimum comparisons for league leaderboard
        trophyScore: {
          gte: league.minElo,
          lt: league.maxElo === Infinity ? undefined : league.maxElo,
        },
      },
      include: {
        photo: true,
        user: {
          select: {
            id: true,
            name: true,
            age: true,
            city: true,
            state: true,
            profilePhotoUrl: true,
            gender: true,
          },
        },
      },
      orderBy: { trophyScore: 'desc' },
      take: limit,
    });

    const leaderboard = leagueRankings.map((ranking, index) => ({
      rank: index + 1,
      user: {
        id: ranking.user.id,
        name: ranking.user.name,
        age: ranking.user.age,
        location: ranking.user.city && ranking.user.state 
          ? `${ranking.user.city}, ${ranking.user.state}` 
          : null,
        profilePhotoUrl: ranking.user.profilePhotoUrl,
        gender: ranking.user.gender,
      },
      photo: {
        id: ranking.photo.id,
        url: ranking.photo.thumbnailUrl || ranking.photo.url,
      },
      stats: {
        trophyScore: Math.round(ranking.trophyScore * 10) / 10,
        targetTrophyScore: ranking.targetTrophyScore ? Math.round(ranking.targetTrophyScore * 10) / 10 : null,
        percentile: ranking.currentPercentile,
        totalComparisons: ranking.totalComparisons,
        winRate: ranking.totalComparisons > 0 
          ? Math.round((ranking.wins / ranking.totalComparisons) * 1000) / 10
          : 0,
      },
      isCurrentUser: ranking.user.id === userId,
    }));

    res.json({ 
      success: true, 
      leaderboard,
      league: {
        id: league.id,
        name: league.name,
        tier: league.tier,
        category: league.category,
        minElo: league.minElo,
        maxElo: league.maxElo,
        color: league.color,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get league leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get league leaderboard',
    });
  }
}));

// GET /api/rankings/battle-log - Get recent comparisons involving the user's active photo
rankingRoutes.get('/battle-log', asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get user and find active profile photo
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.profilePhotoUrl) {
      return res.json({
        success: true,
        log: [],
        message: 'No profile photo found',
      });
    }

    // Find the photo record
    const photo = await prisma.photo.findFirst({
      where: {
        userId: userId,
        url: user.profilePhotoUrl,
      },
    });

    if (!photo) {
      return res.json({
        success: true,
        log: [],
        message: 'Profile photo not found',
      });
    }

    // Get comparisons where this photo was either winner or loser
    const comparisons = await prisma.comparison.findMany({
      where: {
        OR: [
          { winnerPhotoId: photo.id },
          { loserPhotoId: photo.id }
        ],
      },
      include: {
        rater: {
          select: {
            id: true,
            name: true,
            gender: true,
            profilePhotoUrl: true,
          },
        },
        winnerPhoto: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                gender: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
        loserPhoto: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                gender: true,
                profilePhotoUrl: true,
              },
            },
          },
        },
        winnerSampleImage: {
          select: {
            id: true,
            url: true,
            gender: true,
          },
        },
        loserSampleImage: {
          select: {
            id: true,
            url: true,
            gender: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    const log = comparisons.map(comp => {
      const isWinner = comp.winnerPhotoId === photo.id;
      const trophyDelta = isWinner ? comp.winnerTrophyDelta : comp.loserTrophyDelta;
      
      // Get opponent (could be a user photo or a sample image)
      let opponent = null;
      if (isWinner) {
        // User's photo won, so opponent is the loser
        if (comp.loserPhoto) {
          // Opponent is a user photo
          const opponentUser = comp.loserPhoto.user;
          opponent = opponentUser ? {
            id: opponentUser.id,
            name: opponentUser.name.split(' ')[0], // First name only
            gender: opponentUser.gender,
            photoUrl: opponentUser.profilePhotoUrl,
          } : null;
        } else if (comp.loserSampleImage) {
          // Opponent is a sample image
          opponent = {
            id: comp.loserSampleImage.id,
            name: 'Sample',
            gender: comp.loserSampleImage.gender,
            photoUrl: comp.loserSampleImage.url,
          };
        }
      } else {
        // User's photo lost, so opponent is the winner
        if (comp.winnerPhoto) {
          // Opponent is a user photo
          const opponentUser = comp.winnerPhoto.user;
          opponent = opponentUser ? {
            id: opponentUser.id,
            name: opponentUser.name.split(' ')[0], // First name only
            gender: opponentUser.gender,
            photoUrl: opponentUser.profilePhotoUrl,
          } : null;
        } else if (comp.winnerSampleImage) {
          // Opponent is a sample image
          opponent = {
            id: comp.winnerSampleImage.id,
            name: 'Sample',
            gender: comp.winnerSampleImage.gender,
            photoUrl: comp.winnerSampleImage.url,
          };
        }
      }
      
      return {
        id: comp.id,
        timestamp: comp.timestamp,
        isWinner,
        trophyDelta: trophyDelta ? Math.round(trophyDelta * 10) / 10 : 0,
        rater: {
          id: comp.rater.id,
          name: comp.rater.name.split(' ')[0], // First name only
          gender: comp.rater.gender,
          photoUrl: comp.rater.profilePhotoUrl,
        },
        opponent,
      };
    });

    res.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error('Get battle log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get battle log',
    });
  }
}));

// GET /api/rankings/demographics
rankingRoutes.get('/demographics', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware for personalized demographics
    
    // Get demographic breakdown of users with profile photos
    const demographics = await prisma.user.groupBy({
      by: ['gender', 'age'],
      where: {
        profilePhotoUrl: { not: null },
        optOutOfLeaderboards: false,
      },
      _count: {
        id: true,
      },
    });

    // Process demographics into useful format
    const genderBreakdown = demographics.reduce((acc, item) => {
      if (!item.gender) return acc;
      if (!acc[item.gender]) acc[item.gender] = 0;
      acc[item.gender] += item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const ageGroups = demographics.reduce((acc, item) => {
      if (!item.age) return acc;
      const ageGroup = Math.floor(item.age / 5) * 5; // Group by 5-year ranges
      const key = `${ageGroup}-${ageGroup + 4}`;
      if (!acc[key]) acc[key] = 0;
      acc[key] += item._count.id;
      return acc;
    }, {} as Record<string, number>);

    res.json({ 
      success: true, 
      demographics: {
        gender: genderBreakdown,
        ageGroups,
        totalActiveUsers: demographics.reduce((sum, item) => sum + item._count.id, 0),
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get demographics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get demographic breakdown',
    });
  }
}));