import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';

export const matchesRoutes = Router();

// GET /api/matches/get-matches - Get users that match the current user's percentile preferences
matchesRoutes.get('/get-matches', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get current user with their matching preference
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        gender: true,
        matchingPercentile: true,
        photos: {
          where: {
            status: 'approved'
          },
          orderBy: { uploadedAt: 'desc' },
          take: 1 // Get the most recent approved photo
        }
      },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!currentUser.gender) {
      return res.status(400).json({
        success: false,
        error: 'User gender not set. Please complete your profile.',
      });
    }

    // Check if user has any photos
    const currentUserPhoto = currentUser.photos[0];
    if (!currentUserPhoto) {
      return res.json({
        success: true,
        matches: [],
        message: 'Please upload a photo to start matching.',
      });
    }

    // Get the user's combined ranking for their photo
    const userCombinedRanking = await prisma.combinedRanking.findFirst({
      where: { photoId: currentUserPhoto.id },
    });

    if (!userCombinedRanking || userCombinedRanking.totalComparisons < 5) {
      return res.json({
        success: true,
        matches: [],
        message: 'Complete more comparisons to get your ranking and find matches.',
      });
    }

    const currentUserPercentile = userCombinedRanking.currentPercentile;
    const userMatchingRange = currentUser.matchingPercentile; // e.g., 20 for top 20%

    // Calculate percentile range based on user's current position
    // If user is at 80th percentile and wants top 20%, they want people from 80th-100th percentile
    const minPercentile = Math.max(0, currentUserPercentile);
    const maxPercentile = 100;

    // Determine opposite gender for matching
    const oppositeGender = currentUser.gender === 'male' ? 'female' : 'male';

    // Find potential matches: opposite gender users with photos in the user's desired percentile range
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: oppositeGender,
        isActive: true,
        photos: {
          some: {
            status: 'approved',
            combinedRanking: {
              currentPercentile: {
                gte: Math.max(0, 100 - userMatchingRange), // e.g., for top 20%, get 80th percentile and above
              },
              totalComparisons: {
                gte: 5, // Require minimum comparisons for reliable ranking
              }
            }
          }
        }
      },
      include: {
        photos: {
          where: {
            status: 'approved',
            combinedRanking: {
              totalComparisons: { gte: 5 }
            }
          },
          include: {
            combinedRanking: true
          },
          orderBy: { uploadedAt: 'desc' },
          take: 1
        }
      },
      take: 50, // Limit results
    });

    // Filter for mutual matches - users whose preferences would also include current user
    const mutualMatches: Array<{
      id: string;
      name: string;
      profilePhotoUrl: string | null;
      currentPercentile: number;
      totalComparisons: number;
      confidence: string;
    }> = [];

    for (const potentialMatch of potentialMatches) {
      if (potentialMatch.photos.length === 0 || !potentialMatch.photos[0].combinedRanking) {
        continue;
      }

      const matchPhoto = potentialMatch.photos[0];
      if (!matchPhoto?.combinedRanking) continue;

      const matchPercentile = matchPhoto.combinedRanking.currentPercentile;
      const matchPreference = potentialMatch.matchingPercentile;

      // Check if current user would fall in this person's desired range
      const matchMinPercentile = Math.max(0, 100 - matchPreference);

      if (currentUserPercentile >= matchMinPercentile) {
        // This is a mutual match
        const confidence = getMatchConfidence(
          matchPhoto.combinedRanking.totalComparisons,
          matchPhoto.combinedRanking.confidence
        );

        mutualMatches.push({
          id: potentialMatch.id,
          name: potentialMatch.name,
          profilePhotoUrl: potentialMatch.profilePhotoUrl,
          currentPercentile: matchPercentile,
          totalComparisons: matchPhoto.combinedRanking.totalComparisons,
          confidence: confidence,
        });
      }
    }

    // Sort by percentile (highest first) then by total comparisons
    mutualMatches.sort((a, b) => {
      if (b.currentPercentile !== a.currentPercentile) {
        return b.currentPercentile - a.currentPercentile;
      }
      return b.totalComparisons - a.totalComparisons;
    });

    return res.json({
      success: true,
      matches: mutualMatches,
      meta: {
        userPercentile: currentUserPercentile,
        userPreference: userMatchingRange,
        totalFound: mutualMatches.length,
      },
    });

  } catch (error) {
    console.error('Failed to get matches:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}));

// GET /api/matches/update-preference - Update user's matching preference
matchesRoutes.put('/update-preference', asyncHandler(async (req, res) => {
  try {
    const { userId, matchingPercentile } = req.body;

    if (!userId || matchingPercentile === undefined) {
      return res.status(400).json({
        success: false,
        error: 'User ID and matching percentile required',
      });
    }

    if (matchingPercentile < 1 || matchingPercentile > 100) {
      return res.status(400).json({
        success: false,
        error: 'Matching percentile must be between 1 and 100',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { matchingPercentile },
      select: {
        id: true,
        matchingPercentile: true,
      },
    });

    return res.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Failed to update matching preference:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}));

// GET /api/matches/potential-matches - Get 3 potential matches for girls based on percentile (closest to her percentile)
matchesRoutes.get('/potential-matches', asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        gender: true,
        photos: {
          where: {
            status: 'approved'
          },
          orderBy: { uploadedAt: 'desc' },
          take: 1
        }
      },
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Only allow this feature for girls (female users)
    if (currentUser.gender !== 'female') {
      return res.status(400).json({
        success: false,
        error: 'This feature is only available for female users',
      });
    }

    // Check if user has already done a daily match today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayMatch = await prisma.match.findFirst({
      where: {
        initiatorId: userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (todayMatch) {
      return res.json({
        success: false,
        error: 'You have already used your daily match today. Come back tomorrow!',
        hasUsedDailyMatch: true,
      });
    }

    // Check if user has any photos
    const currentUserPhoto = currentUser.photos[0];
    if (!currentUserPhoto) {
      return res.json({
        success: true,
        matches: [],
        message: 'Please upload a photo to start matching.',
      });
    }

    // Get the user's combined ranking for their photo
    const userCombinedRanking = await prisma.combinedRanking.findFirst({
      where: { photoId: currentUserPhoto.id },
    });

    if (!userCombinedRanking || userCombinedRanking.totalComparisons < 5) {
      return res.json({
        success: true,
        matches: [],
        message: 'Complete more comparisons to get your ranking and find matches.',
      });
    }

    const currentUserPercentile = userCombinedRanking.currentPercentile;

    // Find potential matches: male users with approved photos
    // First get all male users with approved photos, then filter by combinedRanking
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: 'male',
        isActive: true,
        photos: {
          some: {
            status: 'approved'
          }
        }
      },
      select: {
        id: true,
        name: true,
        age: true,
        profilePhotoUrl: true,
        photos: {
          where: {
            status: 'approved'
          },
          select: {
            id: true,
            url: true,
            combinedRanking: {
              select: {
                currentPercentile: true,
                totalComparisons: true,
              }
            }
          },
          orderBy: { uploadedAt: 'desc' },
          take: 1
        }
      },
      take: 100, // Get more candidates to sort by closest percentile
    });

    // Filter and sort by percentile difference (closest to her percentile)
    // Only include matches with combinedRanking and >= 5 comparisons
    const matches: Array<{
      id: string;
      name: string;
      profilePhotoUrl: string | null;
      currentPercentile: number;
      age: number | null;
      photoUrl: string;
      percentileDiff: number;
    }> = [];

    for (const potentialMatch of potentialMatches) {
      if (potentialMatch.photos.length === 0) {
        continue;
      }

      const matchPhoto = potentialMatch.photos[0];
      if (!matchPhoto?.combinedRanking) {
        continue;
      }

      // Only include matches with at least 5 comparisons
      if (matchPhoto.combinedRanking.totalComparisons < 5) {
        continue;
      }

      const matchPercentile = matchPhoto.combinedRanking.currentPercentile;
      const percentileDiff = Math.abs(matchPercentile - currentUserPercentile);

      matches.push({
        id: potentialMatch.id,
        name: potentialMatch.name,
        profilePhotoUrl: potentialMatch.profilePhotoUrl,
        currentPercentile: matchPercentile,
        age: potentialMatch.age || null,
        photoUrl: matchPhoto.url,
        percentileDiff,
      });
    }

    // Sort by percentile difference (closest first), then take top 3
    matches.sort((a, b) => (a as any).percentileDiff - (b as any).percentileDiff);
    const topMatches = matches.slice(0, 3).map(({ percentileDiff, ...match }) => match);

    return res.json({
      success: true,
      matches: topMatches,
      hasUsedDailyMatch: false,
      meta: {
        userPercentile: currentUserPercentile,
        totalFound: topMatches.length,
      },
    });

  } catch (error) {
    console.error('Failed to get potential matches:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}));

// POST /api/matches/create-match - Create a match/conversation when girl selects a guy
matchesRoutes.post('/create-match', asyncHandler(async (req, res) => {
  try {
    const { userId, selectedUserId } = req.body;

    if (!userId || !selectedUserId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and selected user ID required',
      });
    }

    if (userId === selectedUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot match with yourself',
      });
    }

    // Verify the user is female
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true },
    });

    if (!currentUser || currentUser.gender !== 'female') {
      return res.status(400).json({
        success: false,
        error: 'This feature is only available for female users',
      });
    }

    // Check if match already exists between these users
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { initiatorId: userId, matchedId: selectedUserId },
          { initiatorId: selectedUserId, matchedId: userId }
        ]
      }
    });

    if (existingMatch) {
      return res.json({
        success: true,
        match: existingMatch,
        message: 'Match already exists',
      });
    }

    // Create match - girl initiates, so userId is the initiator
    // Status is 'accepted' immediately since the girl chose this match
    const match = await prisma.match.create({
      data: {
        initiatorId: userId,
        matchedId: selectedUserId,
        status: 'accepted',
      },
      include: {
        matched: {
          select: {
            id: true,
            name: true,
            profilePhotoUrl: true,
            age: true,
          }
        }
      }
    });

    return res.json({
      success: true,
      match,
      message: 'Match created successfully',
    });

  } catch (error) {
    console.error('Failed to create match:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}));

// Helper function to determine match confidence based on comparison data
function getMatchConfidence(totalComparisons: number, rankingConfidence: number): 'low' | 'medium' | 'high' {
  // Base confidence on number of comparisons and ranking stability
  if (totalComparisons >= 50 && rankingConfidence >= 0.8) {
    return 'high';
  } else if (totalComparisons >= 20 && rankingConfidence >= 0.6) {
    return 'medium';
  } else {
    return 'low';
  }
}
