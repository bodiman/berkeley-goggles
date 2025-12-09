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
    const mutualMatches = [];
    
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