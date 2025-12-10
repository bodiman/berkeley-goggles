import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../services/database';
import { bradleyTerryService } from '../services/bradleyTerryService';

export const comparisonRoutes = Router();

// GET /api/comparisons/next-pair
comparisonRoutes.get('/next-pair', asyncHandler(async (req, res) => {
  try {
    // TODO: Get user ID from auth middleware
    const userId = req.query.userId as string;
    const bufferSize = parseInt(req.query.buffer as string) || 1;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Validate buffer size
    if (bufferSize < 1 || bufferSize > 10) {
      return res.status(400).json({
        success: false,
        error: 'Buffer size must be between 1 and 10',
      });
    }

    // Get rater's info first to validate user exists
    const rater = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        gender: true,
        createdAt: true,
      },
    });

    if (!rater) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please register first.',
      });
    }

    if (!rater.gender) {
      return res.status(400).json({
        success: false,
        error: 'User gender not found. Please complete profile setup.',
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

    // Determine opposite gender for filtering
    const oppositeGender = rater.gender === 'male' ? 'female' : 'male';

    // Priority system for photo selection:
    // 1. Prioritize user photos over sample images
    // 2. Require full ordering of real users before expanding to samples
    // 3. 10% chance to include samples even with incomplete user ordering
    // 4. Gender filtering: show only opposite gender

    // Get available user photos (opposite gender only)
    // Increased pool size for better variety and randomized selection
    const totalUserPhotos = await prisma.photo.count({
      where: {
        status: 'approved',
        userId: { not: userId },
        user: {
          gender: oppositeGender,
        },
      },
    });

    // Use larger pool size, up to 300 photos or all available
    const userPhotoPoolSize = Math.min(300, totalUserPhotos);
    
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
      orderBy: [
        // Mix of recent and older photos for variety
        { uploadedAt: 'desc' },
        { id: 'asc' }, // Secondary sort for consistent pagination
      ],
      take: userPhotoPoolSize,
    });

    // Get available sample images (opposite gender only)
    // Improved rotation with larger pool and mixed selection strategy
    const totalSampleImages = await prisma.sampleImage.count({
      where: {
        isActive: true,
        gender: oppositeGender,
      },
    });

    // Use larger pool size for much better variety
    const sampleImagePoolSize = Math.min(200, totalSampleImages);
    
    // Get a mix of least recently used and random samples
    const leastUsedSamples = await prisma.sampleImage.findMany({
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
      take: Math.floor(sampleImagePoolSize * 0.7), // 70% least recently used
    });

    // Get some random samples for variety (remaining 30%)
    const randomSampleCount = sampleImagePoolSize - leastUsedSamples.length;
    const randomSamples = randomSampleCount > 0 ? await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        gender: oppositeGender,
        id: {
          notIn: leastUsedSamples.map(s => s.id), // Exclude already selected
        },
      },
      include: {
        ranking: true,
      },
      orderBy: {
        id: 'asc', // Deterministic ordering for consistent pagination
      },
      skip: Math.floor(Math.random() * Math.max(1, totalSampleImages - leastUsedSamples.length - randomSampleCount)),
      take: randomSampleCount,
    }) : [];

    // Combine and shuffle the samples for variety
    const sampleImages = [...leastUsedSamples, ...randomSamples];
    
    // Shuffle array for additional randomness in selection
    for (let i = sampleImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sampleImages[i], sampleImages[j]] = [sampleImages[j], sampleImages[i]];
    }

    // Get user's previous comparisons to avoid duplicates
    const previousComparisons = await getPreviousComparisons(userId);
    const comparedPairs = extractComparedPairs(previousComparisons);

    // Get recently shown photos from current session to avoid immediate repetition
    const recentTimeWindow = 30 * 60 * 1000; // 30 minutes
    const recentThreshold = new Date(Date.now() - recentTimeWindow);
    
    const recentlyShownPhotoIds = await getRecentlyShownPhotos(userId, recentThreshold);
    
    // Filter out recently shown photos for better variety
    const filteredUserPhotos = userPhotos.filter(photo => 
      !recentlyShownPhotoIds.userPhotoIds.has(photo.id)
    );
    const filteredSampleImages = sampleImages.filter(sample => 
      !recentlyShownPhotoIds.sampleImageIds.has(sample.id)
    );

    // If we've filtered out too many, use original pools (fall back to avoid empty results)
    const finalUserPhotos = filteredUserPhotos.length > 10 ? filteredUserPhotos : userPhotos;
    const finalSampleImages = filteredSampleImages.length > 20 ? filteredSampleImages : sampleImages;

    // Add type information to photos for easier processing
    const typedUserPhotos = finalUserPhotos.map(photo => ({ ...photo, type: 'user' }));
    const typedSampleImages = finalSampleImages.map(sample => ({ ...sample, type: 'sample' }));

    let pair = null;
    let comparisonType = 'user_photos';

    // Phase 1: Try user-only comparisons first
    let availablePairs: Array<{left: any, right: any, type?: string}> = [];
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

    // Select random pairs from available options (for buffering)
    if (availablePairs.length === 0) {
      // Provide more detailed error messages to help with debugging
      let message = '';
      
      if (typedUserPhotos.length === 0 && typedSampleImages.length === 0) {
        message = `No ${oppositeGender} photos available for comparison. Please check sample image configuration.`;
      } else if (typedSampleImages.length === 0) {
        message = `No sample images available for ${oppositeGender} gender. Please check sample image database.`;
      } else if (typedUserPhotos.length === 0) {
        message = `No user photos available. You've compared all available sample combinations!`;
      } else {
        message = `You've compared all available photo combinations! (${typedUserPhotos.length} user photos, ${typedSampleImages.length} sample images)`;
      }

      return res.json({
        success: true,
        pair: bufferSize === 1 ? null : undefined,
        pairs: bufferSize > 1 ? [] : undefined,
        message,
        debug: process.env.NODE_ENV === 'development' ? {
          userPhotosCount: typedUserPhotos.length,
          sampleImagesCount: typedSampleImages.length,
          phase,
          userGender: rater?.gender,
          oppositeGender,
        } : undefined,
      });
    }

    // Use intelligent Bradley-Terry sampler to select most informative pairs
    // while ensuring no person appears more than once in the buffer
    const selectedPairs = selectInformativePairs(availablePairs, bufferSize);

    // Build the response pair objects
    const buildPhotoObject = (photo: any) => {
      // Get the base URL for the current environment
      // Use Railway URL if available, otherwise fall back to production URL, then localhost
      const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : process.env.API_BASE_URL
        ? (process.env.API_BASE_URL.startsWith('http') ? process.env.API_BASE_URL : `https://${process.env.API_BASE_URL}`)
        : process.env.NODE_ENV === 'production'
        ? 'https://berkeley-goggles-production.up.railway.app'
        : 'http://localhost:3001';

      if (photo.type === 'user') {
        return {
          id: photo.id,
          url: `${baseUrl}${photo.url}`,
          thumbnailUrl: `${baseUrl}${photo.thumbnailUrl}`,
          userId: photo.userId,
          userAge: photo.user.age,
          userGender: photo.user.gender,
          type: 'user',
        };
      } else {
        // For sample images, use the stored URLs directly
        // This allows for R2 URLs to work without manual URL construction
        return {
          id: photo.id,
          url: photo.url.startsWith('http') ? photo.url : `${baseUrl}${photo.url}`,
          thumbnailUrl: photo.thumbnailUrl 
            ? (photo.thumbnailUrl.startsWith('http') ? photo.thumbnailUrl : `${baseUrl}${photo.thumbnailUrl}`)
            : (photo.url.startsWith('http') ? photo.url : `${baseUrl}${photo.url}`),
          userId: 'sample',
          userAge: photo.estimatedAge,
          userGender: photo.gender,
          type: 'sample',
        };
      }
    };

    // Build response pairs and collect sample images for timestamp updates
    const pairs = [];
    const sampleUpdatePromises = [];
    const sampleImagesUsed = new Set<string>();

    for (const selectedPair of selectedPairs) {
      const leftPhoto = selectedPair.left;
      const rightPhoto = selectedPair.right;

      // Determine comparison type for this pair
      let pairComparisonType: string;
      if (leftPhoto.type === 'user' && rightPhoto.type === 'user') {
        pairComparisonType = 'user_photos';
      } else if (leftPhoto.type === 'sample' && rightPhoto.type === 'sample') {
        pairComparisonType = 'sample_images';
      } else {
        pairComparisonType = 'mixed';
      }

      const pairObject = {
        sessionId: session.id,
        leftPhoto: buildPhotoObject(leftPhoto),
        rightPhoto: buildPhotoObject(rightPhoto),
        comparisonType: pairComparisonType,
      };

      pairs.push(pairObject);

      // Collect sample images for timestamp updates (avoid duplicates)
      if (leftPhoto.type === 'sample' && !sampleImagesUsed.has(leftPhoto.id)) {
        sampleImagesUsed.add(leftPhoto.id);
        sampleUpdatePromises.push(
          prisma.sampleImage.update({
            where: { id: leftPhoto.id },
            data: { lastUsed: new Date() },
          })
        );
      }
      if (rightPhoto.type === 'sample' && !sampleImagesUsed.has(rightPhoto.id)) {
        sampleImagesUsed.add(rightPhoto.id);
        sampleUpdatePromises.push(
          prisma.sampleImage.update({
            where: { id: rightPhoto.id },
            data: { lastUsed: new Date() },
          })
        );
      }
    }

    // Update sample image timestamps if used
    if (sampleUpdatePromises.length > 0) {
      await Promise.all(sampleUpdatePromises);
    }

    // Set the overall comparison type based on the most common type in the buffer
    const pairTypes = pairs.map(p => p.comparisonType);
    const typeCount = pairTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    comparisonType = Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);

    // Return appropriate format based on buffer size
    if (bufferSize === 1) {
      // Single pair - maintain backward compatibility
      pair = pairs[0];
      res.json({
        success: true,
        pair,
        comparisonType,
        phase,
        message: message || undefined,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Multiple pairs - new buffer format
      res.json({
        success: true,
        pairs,
        bufferSize: pairs.length,
        requestedBufferSize: bufferSize,
        comparisonType,
        phase,
        message: message || undefined,
        timestamp: new Date().toISOString(),
      });
    }
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

// DEBUG endpoint to diagnose ranking issues
comparisonRoutes.get('/debug', asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
      });
    }

    // Get rater's info
    const rater = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        gender: true,
        age: true,
        createdAt: true,
      },
    });

    if (!rater) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please register first.',
      });
    }

    const oppositeGender = rater.gender === 'male' ? 'female' : 'male';

    // Get user photo counts
    const userPhotoStats = {
      total: await prisma.photo.count(),
      approved: await prisma.photo.count({
        where: { status: 'approved' }
      }),
      approvedOppositeGender: await prisma.photo.count({
        where: {
          status: 'approved',
          user: { gender: oppositeGender },
        }
      }),
      excludingCurrentUser: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { gender: oppositeGender },
        }
      })
    };

    // Get sample image counts
    const sampleImageStats = {
      total: await prisma.sampleImage.count(),
      active: await prisma.sampleImage.count({
        where: { isActive: true }
      }),
      activeOppositeGender: await prisma.sampleImage.count({
        where: {
          isActive: true,
          gender: oppositeGender,
        }
      }),
      withR2Urls: await prisma.sampleImage.count({
        where: {
          isActive: true,
          gender: oppositeGender,
          url: { startsWith: 'https://' }
        }
      }),
      withLocalUrls: await prisma.sampleImage.count({
        where: {
          isActive: true,
          gender: oppositeGender,
          url: { startsWith: '/sample-images/' }
        }
      })
    };

    // Get sample of sample images for URL inspection
    const sampleImageExamples = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        gender: oppositeGender,
      },
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        gender: true,
        isActive: true,
      },
      take: 5,
    });

    // Get comparison stats
    const comparisonStats = {
      totalByUser: await prisma.comparison.count({
        where: { raterId: userId }
      }),
      userPhotoComparisons: await prisma.comparison.count({
        where: { 
          raterId: userId,
          comparisonType: 'user_photos'
        }
      }),
      sampleImageComparisons: await prisma.comparison.count({
        where: { 
          raterId: userId,
          comparisonType: 'sample_images'
        }
      }),
      mixedComparisons: await prisma.comparison.count({
        where: { 
          raterId: userId,
          comparisonType: 'mixed'
        }
      }),
    };

    // Get user photos for pair generation testing
    const actualUserPhotos = await prisma.photo.findMany({
      where: {
        status: 'approved',
        userId: { not: userId },
        user: { gender: oppositeGender },
      },
      take: 10,
      select: { id: true, userId: true }
    });

    const actualSampleImages = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        gender: oppositeGender,
      },
      take: 10,
      select: { id: true, url: true }
    });

    // Test pair generation logic
    const typedUserPhotos = actualUserPhotos.map(photo => ({ ...photo, type: 'user' }));
    const typedSampleImages = actualSampleImages.map(sample => ({ ...sample, type: 'sample' }));

    // Generate test pairs
    const userOnlyPairs = typedUserPhotos.length >= 2 ? generateUserPhotoPairs(typedUserPhotos) : [];
    const mixedPairs = generateMixedPairs(typedUserPhotos, typedSampleImages);
    
    const pairStats = {
      userOnlyPairsGenerated: userOnlyPairs.length,
      mixedPairsGenerated: mixedPairs.length,
      sampleOnlyPairs: mixedPairs.filter(p => p.type === 'sample_images').length,
      userVsSamplePairs: mixedPairs.filter(p => p.type === 'mixed').length,
    };

    // Environment info
    const environmentInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasR2Config: !!(
        process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
        process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN &&
        process.env.CLOUDFLARE_R2_BUCKET_NAME
      ),
      r2PublicDomain: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'not configured',
    };

    res.json({
      success: true,
      debug: {
        user: rater,
        oppositeGender,
        userPhotoStats,
        sampleImageStats,
        comparisonStats,
        pairStats,
        sampleImageExamples,
        environmentInfo,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Helper function to update photo ratings using corrected Bradley-Terry algorithm
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

    // Use the corrected Bradley-Terry service
    const update = bradleyTerryService.updateRatings(
      winnerRanking.bradleyTerryScore,
      loserRanking.bradleyTerryScore,
      { learningRate: 0.1 }
    );
    
    // Update Bradley-Terry scores in database
    await Promise.all([
      prisma.photoRanking.update({
        where: { photoId: winnerPhotoId },
        data: {
          bradleyTerryScore: update.newWinnerScore,
          lastUpdated: new Date(),
        },
      }),
      prisma.photoRanking.update({
        where: { photoId: loserPhotoId },
        data: {
          bradleyTerryScore: update.newLoserScore,
          lastUpdated: new Date(),
        },
      }),
    ]);

    // Update percentiles based on new scores
    await updatePercentiles();
  } catch (error) {
    console.error('Error updating photo ratings:', error);
  }
}

// Helper function to update sample image ratings using corrected Bradley-Terry algorithm
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

    // Use the corrected Bradley-Terry service
    const update = bradleyTerryService.updateRatings(
      winnerRanking.bradleyTerryScore,
      loserRanking.bradleyTerryScore,
      { learningRate: 0.1 }
    );
    
    // Update Bradley-Terry scores in database
    await Promise.all([
      prisma.sampleImageRanking.update({
        where: { sampleImageId: winnerSampleId },
        data: {
          bradleyTerryScore: update.newWinnerScore,
          lastUpdated: new Date(),
        },
      }),
      prisma.sampleImageRanking.update({
        where: { sampleImageId: loserSampleId },
        data: {
          bradleyTerryScore: update.newLoserScore,
          lastUpdated: new Date(),
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

    // Use the corrected Bradley-Terry service for combined rankings
    const update = bradleyTerryService.updateRatings(
      winnerCombinedRanking.bradleyTerryScore,
      loserCombinedRanking.bradleyTerryScore,
      { learningRate: 0.1 }
    );
    
    // Update Bradley-Terry scores in database
    await Promise.all([
      prisma.combinedRanking.update({
        where: { id: winnerCombinedRanking.id },
        data: {
          bradleyTerryScore: update.newWinnerScore,
        },
      }),
      prisma.combinedRanking.update({
        where: { id: loserCombinedRanking.id },
        data: {
          bradleyTerryScore: update.newLoserScore,
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

// Helper function to get person ID from photo (user ID for user photos, photo ID for samples)
function getPersonId(photo: any): string {
  if (photo.type === 'user') {
    return photo.userId || photo.user?.id || photo.id;
  } else {
    // For sample images, use the photo ID as the "person" ID since samples are unique entities
    return `sample_${photo.id}`;
  }
}

// Helper function to get Bradley-Terry score and comparison count from photo
function getRatingData(photo: any): { score: number; comparisons: number } {
  if (photo.ranking) {
    return {
      score: photo.ranking.bradleyTerryScore || 0.5,
      comparisons: photo.ranking.totalComparisons || 0,
    };
  }
  
  // Default values for photos without rankings
  return {
    score: 1.0, // Default Bradley-Terry starting score
    comparisons: 0,
  };
}

/**
 * Intelligent Bradley-Terry sampler that selects pairs for maximum information gain
 * while ensuring no person OR image appears more than once in the buffer
 */
function selectInformativePairs(
  availablePairs: Array<{left: any, right: any, type?: string}>, 
  bufferSize: number
): Array<{left: any, right: any, type?: string}> {
  if (availablePairs.length === 0 || bufferSize === 0) {
    return [];
  }

  // Score all pairs by information gain
  const scoredPairs = availablePairs.map(pair => {
    const leftRating = getRatingData(pair.left);
    const rightRating = getRatingData(pair.right);
    
    const informationGain = bradleyTerryService.calculateInformationGain(
      leftRating.score,
      rightRating.score,
      leftRating.comparisons,
      rightRating.comparisons
    );
    
    return {
      pair,
      score: informationGain,
      leftPersonId: getPersonId(pair.left),
      rightPersonId: getPersonId(pair.right),
      leftImageId: pair.left.id,
      rightImageId: pair.right.id,
    };
  });

  // Sort by information gain (highest first)
  scoredPairs.sort((a, b) => b.score - a.score);

  // Greedy selection with both person and image duplicate prevention
  const selectedPairs = [];
  const usedPersonIds = new Set<string>();
  const usedImageIds = new Set<string>();

  for (const scoredPair of scoredPairs) {
    // Check if we've reached the buffer limit
    if (selectedPairs.length >= bufferSize) {
      break;
    }

    // Check if either person is already in the buffer
    const { leftPersonId, rightPersonId, leftImageId, rightImageId } = scoredPair;
    if (usedPersonIds.has(leftPersonId) || usedPersonIds.has(rightPersonId)) {
      continue; // Skip this pair, one of the people is already used
    }

    // Check if either image is already in the buffer
    if (usedImageIds.has(leftImageId) || usedImageIds.has(rightImageId)) {
      continue; // Skip this pair, one of the images is already used
    }

    // Add this pair to the selection
    selectedPairs.push(scoredPair.pair);
    usedPersonIds.add(leftPersonId);
    usedPersonIds.add(rightPersonId);
    usedImageIds.add(leftImageId);
    usedImageIds.add(rightImageId);
  }

  return selectedPairs;
}

/**
 * Get photos that were recently shown to the user to avoid immediate repetition
 */
async function getRecentlyShownPhotos(
  userId: string, 
  sinceTimestamp: Date
): Promise<{
  userPhotoIds: Set<string>;
  sampleImageIds: Set<string>;
}> {
  // Get recent comparisons to extract recently shown photos
  const recentComparisons = await prisma.comparison.findMany({
    where: {
      raterId: userId,
      timestamp: {
        gte: sinceTimestamp,
      },
    },
    select: {
      winnerPhotoId: true,
      loserPhotoId: true,
      winnerSampleImageId: true,
      loserSampleImageId: true,
    },
  });

  const userPhotoIds = new Set<string>();
  const sampleImageIds = new Set<string>();

  for (const comparison of recentComparisons) {
    // Add user photo IDs
    if (comparison.winnerPhotoId) userPhotoIds.add(comparison.winnerPhotoId);
    if (comparison.loserPhotoId) userPhotoIds.add(comparison.loserPhotoId);
    
    // Add sample image IDs
    if (comparison.winnerSampleImageId) sampleImageIds.add(comparison.winnerSampleImageId);
    if (comparison.loserSampleImageId) sampleImageIds.add(comparison.loserSampleImageId);
  }

  return {
    userPhotoIds,
    sampleImageIds,
  };
}