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
    
    // Get recently submitted pair info to exclude from next load
    const recentWinnerId = req.query.recentWinnerId as string;
    const recentLoserId = req.query.recentLoserId as string;
    const recentWinnerType = req.query.recentWinnerType as string;
    const recentLoserType = req.query.recentLoserType as string;
    
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

    // Get photos that are current profile photos (opposite gender only)
    // We need actual Photo records to satisfy foreign key constraints in comparisons
    const totalUserPhotos = await prisma.photo.count({
      where: {
        status: 'approved',
        userId: { not: userId },
        user: {
          gender: oppositeGender,
          profilePhotoUrl: { not: null },
          isActive: true,
          // profileComplete: true, // REMOVED - approved photos should be available regardless of profile completion
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
          profilePhotoUrl: { not: null }, // Must have an active profile photo
          isActive: true,
          // profileComplete: true, // REMOVED - approved photos should be available regardless of profile completion
        },
      },
      include: {
        user: {
          select: {
            id: true,
            age: true,
            gender: true,
            profilePhotoUrl: true,
            bio: true,
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

    // Filter to only include photos that match the user's current profile photo URL
    // Since both photo URLs and profile URLs are now absolute URLs, we can compare directly
    const filteredUserPhotosByProfile = userPhotos.filter(photo => {
      const photoUrl = photo.url;
      const userProfileUrl = photo.user.profilePhotoUrl;
      
      if (!userProfileUrl) return false;
      
      // Direct comparison since both are absolute URLs
      return photoUrl === userProfileUrl;
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
    
    // Use deterministic pseudo-random selection instead of expensive ORDER BY RANDOM()
    // This maintains diversity while being much faster than SQL RANDOM()
    const randomOffset = Math.floor(Math.random() * Math.max(1, totalSampleImages - sampleImagePoolSize));
    const randomizedSamples = await prisma.sampleImage.findMany({
      where: {
        isActive: true,
        gender: oppositeGender,
      },
      skip: randomOffset,
      take: sampleImagePoolSize,
      orderBy: {
        id: 'asc', // Consistent ordering for reproducible results
      },
    });

    // Get ranking data for the randomly selected samples
    const sampleImageIds = randomizedSamples.map(s => s.id);
    const rankings = await prisma.sampleImageRanking.findMany({
      where: {
        sampleImageId: { in: sampleImageIds }
      }
    });

    // Build ranking lookup map
    const rankingMap = new Map();
    rankings.forEach(ranking => {
      rankingMap.set(ranking.sampleImageId, ranking);
    });

    // Combine sample data with rankings (maintaining same structure as before)
    const sampleImages = randomizedSamples.map(sample => ({
      id: sample.id,
      url: sample.url,
      thumbnailUrl: sample.thumbnailUrl,
      gender: sample.gender,
      estimatedAge: sample.estimatedAge,
      source: sample.source,
      description: sample.description,
      isActive: sample.isActive,
      createdAt: sample.createdAt,
      lastUsed: sample.lastUsed,
      ranking: rankingMap.get(sample.id) || null,
    }));

    // Debug: Log sample diversity to verify ethnic representation
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PAIRS) {
      const sampleUrlPrefixes = sampleImages.map(sample => {
        const filename = sample.url.split('/').pop() || '';
        return filename.substring(0, 2); // Get AF, AM, CF, CM prefix
      });
      
      const prefixCounts = sampleUrlPrefixes.reduce((acc, prefix) => {
        acc[prefix] = (acc[prefix] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log(`🎭 Sample diversity: AF=${prefixCounts.AF || 0}, AM=${prefixCounts.AM || 0}, CF=${prefixCounts.CF || 0}, CM=${prefixCounts.CM || 0} (Total: ${sampleImages.length})`);
    }

    // Get user's previous comparisons to avoid duplicates
    const previousComparisons = await getPreviousComparisons(userId);
    const comparedPairs = extractComparedPairs(previousComparisons);
    
    // Add recently submitted pair to exclusion list if provided
    console.log('🔍 Backend Debug: Recent pair exclusion check:', {
      recentWinnerId,
      recentLoserId,
      recentWinnerType,
      recentLoserType,
      hasAllParams: !!(recentWinnerId && recentLoserId && recentWinnerType && recentLoserType),
      nodeEnv: process.env.NODE_ENV
    });
    
    if (recentWinnerId && recentLoserId && recentWinnerType && recentLoserType) {
      const recentPairKey = generateRecentPairKey(recentWinnerId, recentLoserId, recentWinnerType, recentLoserType);
      comparedPairs.add(recentPairKey);
      
      console.log(`🚫 Excluding recently submitted pair:`);
      console.log(`  - Winner: ${recentWinnerId} (${recentWinnerType})`);
      console.log(`  - Loser: ${recentLoserId} (${recentLoserType})`);
      console.log(`  - Generated exclusion key: "${recentPairKey}"`);
      console.log(`  - Total excluded pairs now: ${comparedPairs.size}`);
    } else {
      console.log('❌ Backend: Missing recent pair parameters - will not exclude');
    }
    
    // Debug logging for duplicate detection
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Duplicate Detection Debug for user ${userId}:`);
      console.log(`  - Found ${previousComparisons.length} previous comparisons`);
      console.log(`  - Generated ${comparedPairs.size} unique compared pairs`);
      if (comparedPairs.size > 0 && comparedPairs.size <= 5) {
        console.log(`  - Compared pairs:`, Array.from(comparedPairs));
      }
    }

    // Get recently shown photos to avoid immediate repetition (optimized for performance)
    const recentTimeWindow = 2 * 60 * 1000; // 2 minutes (reduced from 5 minutes for faster queries)
    const recentThreshold = new Date(Date.now() - recentTimeWindow);
    
    const recentlyShownPhotoIds = await getRecentlyShownPhotos(userId, recentThreshold);
    
    // Filter out recently shown photos for better variety
    const filteredUserPhotos = filteredUserPhotosByProfile.filter(photo => 
      !recentlyShownPhotoIds.userPhotoIds.has(photo.id)
    );
    const filteredSampleImages = sampleImages.filter(sample => 
      !recentlyShownPhotoIds.sampleImageIds.has(sample.id)
    );

    // Improved fallback strategy: if too many filtered out, get fresh random samples
    // instead of falling back to the same biased pool
    let finalUserPhotos = filteredUserPhotos;
    let finalSampleImages = filteredSampleImages;
    
    if (filteredUserPhotos.length < 10) {
      // If not enough user photos, use all available profile photos
      finalUserPhotos = filteredUserPhotosByProfile;
    }
    
    if (filteredSampleImages.length < 20) {
      // If not enough sample images after filtering, get a fresh random batch
      // This prevents falling back to the same set repeatedly
      console.log(`Only ${filteredSampleImages.length} samples after filtering, getting fresh random batch`);
      
      // Get fresh random samples excluding already selected ones
      const freshRandomSamples = sampleImageIds.length > 0 
        ? await prisma.sampleImage.findMany({
            where: {
              isActive: true,
              gender: oppositeGender,
              id: { notIn: sampleImageIds }
            },
            take: Math.max(50, sampleImagePoolSize - filteredSampleImages.length),
            // Use orderBy with random skip to simulate RANDOM() for compatibility
            orderBy: { createdAt: 'asc' },
            skip: Math.floor(Math.random() * Math.max(1, totalSampleImages - sampleImageIds.length)),
          })
        : await prisma.sampleImage.findMany({
            where: {
              isActive: true,
              gender: oppositeGender,
            },
            skip: Math.floor(Math.random() * Math.max(1, totalSampleImages)),
            take: Math.max(50, sampleImagePoolSize - filteredSampleImages.length),
            orderBy: { id: 'asc' }, // Use consistent ordering instead of expensive RANDOM()
          });
      
      // Get rankings for fresh samples
      const freshIds = freshRandomSamples.map(s => s.id);
      const freshRankings = await prisma.sampleImageRanking.findMany({
        where: { sampleImageId: { in: freshIds } }
      });
      
      const freshRankingMap = new Map();
      freshRankings.forEach(ranking => {
        freshRankingMap.set(ranking.sampleImageId, ranking);
      });
      
      const freshSamplesWithRankings = freshRandomSamples.map(sample => ({
        id: sample.id,
        url: sample.url,
        thumbnailUrl: sample.thumbnailUrl,
        gender: sample.gender,
        estimatedAge: sample.estimatedAge,
        source: sample.source,
        description: sample.description,
        isActive: sample.isActive,
        createdAt: sample.createdAt,
        lastUsed: sample.lastUsed,
        ranking: freshRankingMap.get(sample.id) || null,
      }));
      
      // Combine filtered samples with fresh random samples
      finalSampleImages = [...filteredSampleImages, ...freshSamplesWithRankings];
    }

    // Add type information to photos for easier processing
    const typedUserPhotos = finalUserPhotos.map(photo => ({ ...photo, type: 'user' }));
    const typedSampleImages = finalSampleImages.map(sample => ({ ...sample, type: 'sample' }));

    let pair = null;
    let comparisonType = 'user_photos';

    // Prioritize user photos first when available, then mixed pairs, then sample-only pairs
    let availablePairs: Array<{left: any, right: any, type?: string}> = [];
    let phase = 'user_photos';
    let message = '';

    // Phase 1: Prioritize user-only comparisons when available
    if (typedUserPhotos.length >= 2) {
      // Generate all possible user photo pairs
      const userPairs = generateUserPhotoPairs(typedUserPhotos);
      // Filter out already compared pairs
      availablePairs = filterUncomparedPairs(userPairs, comparedPairs);
      
      // Debug logging for pair filtering
      if (process.env.NODE_ENV === 'development') {
        console.log(`👥 User Photo Pair Filtering (Priority Phase):`);
        console.log(`  - Generated ${userPairs.length} possible user photo pairs`);
        console.log(`  - After filtering: ${availablePairs.length} available pairs`);
        if (userPairs.length > 0 && availablePairs.length === 0) {
          console.log(`  - ⚠️  All user pairs filtered out - moving to mixed pairs`);
        }
      }
      
      if (availablePairs.length > 0) {
        phase = 'user_photos';
        message = 'Comparing user photos';
      }
    }

    // Phase 2: Mixed pairs (user vs sample) if no user-only pairs available
    if (availablePairs.length === 0 && typedUserPhotos.length >= 1 && typedSampleImages.length > 0) {
      // Generate user vs sample pairs only (not sample vs sample)
      const mixedPairs = generateUserVsSamplePairs(typedUserPhotos, typedSampleImages);
      availablePairs = filterUncomparedPairs(mixedPairs, comparedPairs);
      
      // Debug logging for mixed pair filtering
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 User vs Sample Pair Filtering (Mixed Phase):`);
        console.log(`  - Generated ${mixedPairs.length} possible user vs sample pairs`);
        console.log(`  - After filtering: ${availablePairs.length} available pairs`);
        if (mixedPairs.length > 0 && availablePairs.length === 0) {
          console.log(`  - ⚠️  All mixed pairs filtered out - moving to sample-only pairs`);
        }
      }
      
      if (availablePairs.length > 0) {
        phase = 'mixed_pairs';
        message = 'Comparing user photos with sample images';
      }
    }

    // Phase 3: Sample-only pairs as final fallback
    if (availablePairs.length === 0 && typedSampleImages.length >= 2) {
      // Generate sample-only pairs
      const samplePairs = generateSampleOnlyPairs(typedSampleImages);
      availablePairs = filterUncomparedPairs(samplePairs, comparedPairs);
      
      // Debug logging for sample pair filtering
      if (process.env.NODE_ENV === 'development') {
        console.log(`🖼️ Sample-Only Pair Filtering (Fallback Phase):`);
        console.log(`  - Generated ${samplePairs.length} possible sample-only pairs`);
        console.log(`  - After filtering: ${availablePairs.length} available pairs`);
        if (samplePairs.length > 0 && availablePairs.length === 0) {
          console.log(`  - ⚠️  All sample pairs filtered out - potential duplicate detection issue`);
        }
      }
      
      if (availablePairs.length > 0) {
        phase = 'sample_images';
        message = 'Rating sample images';
      }
    }

    // Select pairs from available options (for buffering)
    const selectedPairs = [];
    const usedPersonIds = new Set<string>();
    
    // Mix and shuffle pools for selection
    const userPool = [...typedUserPhotos].sort(() => Math.random() - 0.5);
    const samplePool = [...typedSampleImages].sort(() => Math.random() - 0.5);

    // Phase 1: User-only pairs
    if (userPool.length >= 2) {
      for (let i = 0; i < userPool.length - 1 && selectedPairs.length < bufferSize; i++) {
        for (let j = i + 1; j < userPool.length && selectedPairs.length < bufferSize; j++) {
          const left = userPool[i];
          const right = userPool[j];
          const leftPersonId = getPersonId(left);
          const rightPersonId = getPersonId(right);
          
          if (usedPersonIds.has(leftPersonId) || usedPersonIds.has(rightPersonId)) continue;
          
          const pairKey = normalizePair(left.id, right.id);
          if (!comparedPairs.has(pairKey)) {
            selectedPairs.push({ left, right, type: 'user_photos' });
            usedPersonIds.add(leftPersonId);
            usedPersonIds.add(rightPersonId);
          }
        }
      }
    }

    // Phase 2: Mixed pairs (User vs Sample)
    if (selectedPairs.length < bufferSize && userPool.length >= 1 && samplePool.length >= 1) {
      for (const userPhoto of userPool) {
        if (selectedPairs.length >= bufferSize) break;
        const userPersonId = getPersonId(userPhoto);
        if (usedPersonIds.has(userPersonId)) continue;

        for (const sampleImage of samplePool) {
          if (selectedPairs.length >= bufferSize) break;
          const samplePersonId = getPersonId(sampleImage);
          if (usedPersonIds.has(samplePersonId)) continue;

          const pairKey = normalizePair(`photo_${userPhoto.id}`, `sample_${sampleImage.id}`);
          if (!comparedPairs.has(pairKey)) {
            // Randomize side
            const [left, right] = Math.random() > 0.5 ? [userPhoto, sampleImage] : [sampleImage, userPhoto];
            selectedPairs.push({ left, right, type: 'mixed' });
            usedPersonIds.add(userPersonId);
            usedPersonIds.add(samplePersonId);
          }
        }
      }
    }

    // Phase 3: Sample-only pairs
    if (selectedPairs.length < bufferSize && samplePool.length >= 2) {
      for (let i = 0; i < samplePool.length - 1 && selectedPairs.length < bufferSize; i++) {
        for (let j = i + 1; j < samplePool.length && selectedPairs.length < bufferSize; j++) {
          const left = samplePool[i];
          const right = samplePool[j];
          const leftPersonId = getPersonId(left);
          const rightPersonId = getPersonId(right);
          
          if (usedPersonIds.has(leftPersonId) || usedPersonIds.has(rightPersonId)) continue;

          const pairKey = normalizePair(left.id, right.id);
          if (!comparedPairs.has(pairKey)) {
            selectedPairs.push({ left, right, type: 'sample_images' });
            usedPersonIds.add(leftPersonId);
            usedPersonIds.add(rightPersonId);
          }
        }
      }
    }

    // Fallback: If still not enough pairs, relax person deduplication but keep pair deduplication
    if (selectedPairs.length < bufferSize) {
      const allPool = [...userPool.map(p => ({ ...p, type: 'user' })), ...samplePool.map(p => ({ ...p, type: 'sample' }))];
      
      for (let i = 0; i < allPool.length - 1 && selectedPairs.length < bufferSize; i++) {
        for (let j = i + 1; j < allPool.length && selectedPairs.length < bufferSize; j++) {
          const left = allPool[i];
          const right = allPool[j];
          
          let pairKey: string;
          if (left.type === 'user' && right.type === 'user') {
            pairKey = normalizePair(left.id, right.id);
          } else if (left.type === 'sample' && right.type === 'sample') {
            pairKey = normalizePair(left.id, right.id);
          } else {
            const photoId = left.type === 'user' ? left.id : right.id;
            const sampleId = left.type === 'sample' ? left.id : right.id;
            pairKey = normalizePair(`photo_${photoId}`, `sample_${sampleId}`);
          }

          if (!comparedPairs.has(pairKey)) {
            // Check if this exact pair (any order) is already in selectedPairs
            const isAlreadySelected = selectedPairs.some(p => 
              (p.left.id === left.id && p.right.id === right.id) || 
              (p.left.id === right.id && p.right.id === left.id)
            );

            if (!isAlreadySelected) {
              let type = 'mixed';
              if (left.type === 'user' && right.type === 'user') type = 'user_photos';
              if (left.type === 'sample' && right.type === 'sample') type = 'sample_images';
              
              selectedPairs.push({ left, right, type });
            }
          }
        }
      }
    }

    if (selectedPairs.length === 0) {
      // Provide more detailed error messages to help with debugging
      let message = '';
      
      if (typedUserPhotos.length === 0 && typedSampleImages.length === 0) {
        message = `No ${oppositeGender} photos available for comparison. Please check sample image configuration.`;
      } else {
        message = `You've compared all available photo combinations! (${typedUserPhotos.length} user photos, ${typedSampleImages.length} sample images)`;
      }

      return res.json({
        success: true,
        pair: bufferSize === 1 ? null : undefined,
        pairs: bufferSize > 1 ? [] : undefined,
        message,
      });
    }

    // Debug logging for selected pairs
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 Optimized Pair Selection Results:`);
      console.log(`  - Requested buffer size: ${bufferSize}`);
      console.log(`  - Selected pairs: ${selectedPairs.length}`);
    }

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
        // Handle user photo URLs properly
        let finalUrl = photo.url;
        let finalThumbnailUrl = photo.thumbnailUrl || photo.url;
        
        // Only prepend baseUrl if the URL doesn't already start with http
        if (!photo.url.startsWith('http')) {
          finalUrl = `${baseUrl}${photo.url}`;
          finalThumbnailUrl = photo.thumbnailUrl 
            ? `${baseUrl}${photo.thumbnailUrl}`
            : finalUrl;
        }
        
        return {
          id: photo.id,
          url: finalUrl,
          thumbnailUrl: finalThumbnailUrl,
          userId: photo.userId,
          userAge: photo.user.age,
          gender: photo.user.gender,
          bio: photo.user.bio,
          type: 'user',
        };
      } else {
        // For sample images, handle URL construction properly
        let finalUrl = photo.url;
        let finalThumbnailUrl = photo.thumbnailUrl || photo.url;
        
        // In production, convert localhost URLs to R2 URLs
        if (process.env.NODE_ENV === 'production' && photo.url.includes('localhost')) {
          const r2Domain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'pub-348e171b4d40413abdb8c2b075b6de0d.r2.dev';
          const filename = photo.url.split('/').pop();
          finalUrl = `https://${r2Domain}/sample-images/${filename}`;
          finalThumbnailUrl = finalUrl;
        } else if (!photo.url.startsWith('http')) {
          // Handle relative URLs
          finalUrl = `${baseUrl}${photo.url}`;
          finalThumbnailUrl = photo.thumbnailUrl 
            ? `${baseUrl}${photo.thumbnailUrl}`
            : finalUrl;
        }
        
        return {
          id: photo.id,
          url: finalUrl,
          thumbnailUrl: finalThumbnailUrl,
          userId: 'sample',
          age: photo.estimatedAge,
          gender: photo.gender,
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

    // Debug logging for comparison submission
    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 Comparison Submission Debug:`);
      console.log(`  - Winner ID: ${winnerId} (${winnerType})`);
      console.log(`  - Loser ID: ${loserId} (${loserType})`);
      console.log(`  - Database fields:`, {
        winnerPhotoId: comparisonData.winnerPhotoId,
        loserPhotoId: comparisonData.loserPhotoId,
        winnerSampleImageId: comparisonData.winnerSampleImageId,
        loserSampleImageId: comparisonData.loserSampleImageId,
      });
    }

    // Use transaction to ensure comparison and basic stats are atomically written
    // This prevents race conditions in duplicate detection
    const result = await prisma.$transaction(async (tx) => {
      // Create the comparison record first
      const comparison = await tx.comparison.create({
        data: comparisonData,
      });

      // Prepare ranking updates for immediate execution
      const rankingPromises = [];

      if (winnerType === 'user') {
        // Get winner photo's user ID first
        const winnerPhoto = await tx.photo.findUnique({ 
          where: { id: winnerId },
          select: { userId: true }
        });
        if (!winnerPhoto) throw new Error(`Winner photo ${winnerId} not found`);

        rankingPromises.push(
          tx.photoRanking.upsert({
            where: { photoId: winnerId },
            update: {
              totalComparisons: { increment: 1 },
              wins: { increment: 1 },
              lastUpdated: new Date(),
            },
            create: {
              photoId: winnerId,
              userId: winnerPhoto.userId,
              totalComparisons: 1,
              wins: 1,
              losses: 0,
            },
          })
        );
      } else {
        rankingPromises.push(
          tx.sampleImageRanking.upsert({
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
        // Get loser photo's user ID first
        const loserPhoto = await tx.photo.findUnique({ 
          where: { id: loserId },
          select: { userId: true }
        });
        if (!loserPhoto) throw new Error(`Loser photo ${loserId} not found`);

        rankingPromises.push(
          tx.photoRanking.upsert({
            where: { photoId: loserId },
            update: {
              totalComparisons: { increment: 1 },
              losses: { increment: 1 },
              lastUpdated: new Date(),
            },
            create: {
              photoId: loserId,
              userId: loserPhoto.userId,
              totalComparisons: 1,
              wins: 0,
              losses: 1,
            },
          })
        );
      } else {
        rankingPromises.push(
          tx.sampleImageRanking.upsert({
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

      // Execute all ranking updates in the same transaction
      await Promise.all(rankingPromises);

      // Update session stats in the same transaction
      await tx.comparisonSession.update({
        where: { id: sessionId },
        data: {
          comparisonsCompleted: { increment: 1 },
        },
      });

      return comparison;
    });

    const comparison = result;

    // Send response immediately - comparison is now saved and available for duplicate detection
    res.json({
      success: true,
      comparison: {
        id: comparison.id,
        timestamp: comparison.timestamp,
        comparisonType: finalComparisonType,
        submittedPair: {
          winnerId,
          loserId,
          winnerType,
          loserType,
        },
      },
      message: 'Comparison submitted successfully',
    });

    // Calculate expensive rating updates in background (non-blocking)
    console.log(`🔄 Scheduling background rating update for comparison ${comparison.id}, type: ${finalComparisonType}`);
    setImmediate(() => {
      (async () => {
        try {
          console.log(`⏰ Background update starting for ${comparison.id}, type: ${finalComparisonType}`);
          if (finalComparisonType === 'user_photos') {
            // Both are user photos - use existing rating update function
            console.log(`📊 Updating user photo ratings: winner=${winnerId}, loser=${loserId}`);
            await updatePhotoRatings(winnerId, loserId, comparison.id);
            // Also update combined rankings for cross-comparisons
            await updateCombinedRankings(winnerId, loserId, 'user', 'user');
          } else if (finalComparisonType === 'sample_images') {
            // Both are sample images - use sample image rating update
            console.log(`📊 Updating sample image ratings: winner=${winnerId}, loser=${loserId}`);
            await updateSampleImageRatings(winnerId, loserId, comparison.id);
            // Also update combined rankings
            await updateCombinedRankings(winnerId, loserId, 'sample', 'sample');
          } else if (finalComparisonType === 'mixed') {
            // Mixed comparison - update individual rankings for each type + combined
            console.log(`📊 Updating mixed rankings: winner=${winnerId} (${winnerType}), loser=${loserId} (${loserType})`);
            await updateMixedRatings(winnerId, loserId, winnerType, loserType, comparison.id);
            await updateCombinedRankings(winnerId, loserId, winnerType, loserType);
          } else {
            console.log(`⚠️ Unknown comparison type: ${finalComparisonType}`);
          }
          console.log(`✅ Background update completed for ${comparison.id}`);
        } catch (error) {
          // Log errors but don't affect user experience
          console.error('❌ Background rating update failed:', error);
        }
      })();
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
    // Optimized: Get all sessions from last 30 days in a single query
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = await prisma.comparisonSession.findMany({
      where: {
        userId: userId,
        startedAt: {
          gte: thirtyDaysAgo,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // tomorrow
        },
        comparisonsCompleted: { gt: 0 },
      },
      select: {
        startedAt: true,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    // Calculate streak from the sessions data
    let streak = 0;
    const activeDays = new Set<string>();
    
    // Extract unique active days
    for (const session of recentSessions) {
      const dayKey = session.startedAt.toISOString().split('T')[0]; // YYYY-MM-DD format
      activeDays.add(dayKey);
    }
    
    // Check consecutive days starting from today
    const checkDate = new Date(today);
    for (let i = 0; i < 30; i++) {
      const dayKey = checkDate.toISOString().split('T')[0];
      
      if (activeDays.has(dayKey)) {
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
      }),
      withActiveProfiles: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { 
            gender: oppositeGender,
            isActive: true 
          },
        }
      }),
      withCompleteProfiles: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { 
            gender: oppositeGender,
            profileComplete: true 
          },
        }
      }),
      withActiveAndCompleteProfiles: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { 
            gender: oppositeGender,
            isActive: true,
            profileComplete: true 
          },
        }
      }),
      withProfilePhotos: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { 
            gender: oppositeGender,
            profilePhotoUrl: { not: null }
          },
        }
      }),
      meetingCurrentFilters: await prisma.photo.count({
        where: {
          status: 'approved',
          userId: { not: userId },
          user: { 
            gender: oppositeGender,
            profilePhotoUrl: { not: null },
            isActive: true,
            // Note: profileComplete no longer required after fix
          },
        }
      }),
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

// Helper function to update photo ratings using dual-layer trophy system
// Note: Basic counts (wins/losses/totalComparisons) are already updated in main flow
async function updatePhotoRatings(winnerPhotoId: string, loserPhotoId: string, comparisonId?: string) {
  console.log(`🎯 updatePhotoRatings called: winner=${winnerPhotoId}, loser=${loserPhotoId}, comparison=${comparisonId}`);
  try {
    // Get current rankings for both photos
    const [winnerRanking, loserRanking] = await Promise.all([
      prisma.photoRanking.findUnique({ where: { photoId: winnerPhotoId } }),
      prisma.photoRanking.findUnique({ where: { photoId: loserPhotoId } }),
    ]);

    if (!winnerRanking || !loserRanking) {
      console.error(`❌ Photo rankings not found: winner=${!!winnerRanking}, loser=${!!loserRanking}`);
      return;
    }

    console.log(`📈 Current hidden BT scores: winner=${winnerRanking.hiddenBradleyTerryScore}, loser=${loserRanking.hiddenBradleyTerryScore}`);

    // ---- Truth Layer: Update hidden Bradley-Terry scores ----
    const hiddenUpdate = bradleyTerryService.updateRatings(
      winnerRanking.hiddenBradleyTerryScore || 0,
      loserRanking.hiddenBradleyTerryScore || 0,
      { learningRate: 0.05 } // K_BT from script
    );

    console.log(`📈 New hidden BT scores: winner=${hiddenUpdate.newWinnerScore.toFixed(4)}, loser=${hiddenUpdate.newLoserScore.toFixed(4)}`);

    // Update hidden scores first
    await Promise.all([
      prisma.photoRanking.update({
        where: { photoId: winnerPhotoId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newWinnerScore,
          lastUpdated: new Date(),
        },
      }),
      prisma.photoRanking.update({
        where: { photoId: loserPhotoId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newLoserScore,
          lastUpdated: new Date(),
        },
      }),
    ]);

    console.log(`✅ Hidden BT scores updated in database`);

    // ---- Product Layer: Calculate target trophies and update trophy scores ----
    await updateSpecificTrophyScores(winnerPhotoId, loserPhotoId, 'photo', comparisonId);

    // Update percentiles based on trophy scores (for display)
    await updatePercentiles();
    console.log(`✅ updatePhotoRatings completed successfully`);
  } catch (error) {
    console.error('❌ Error updating photo ratings:', error);
  }
}

// Helper function to update sample image ratings using dual-layer trophy system
// Note: Basic counts (wins/losses/totalComparisons) are already updated in main flow
async function updateSampleImageRatings(winnerSampleId: string, loserSampleId: string, comparisonId?: string) {
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

    // ---- Truth Layer: Update hidden Bradley-Terry scores ----
    const hiddenUpdate = bradleyTerryService.updateRatings(
      winnerRanking.hiddenBradleyTerryScore || 0,
      loserRanking.hiddenBradleyTerryScore || 0,
      { learningRate: 0.05 } // K_BT from script
    );

    // Update hidden scores first
    await Promise.all([
      prisma.sampleImageRanking.update({
        where: { sampleImageId: winnerSampleId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newWinnerScore,
          lastUpdated: new Date(),
        },
      }),
      prisma.sampleImageRanking.update({
        where: { sampleImageId: loserSampleId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newLoserScore,
          lastUpdated: new Date(),
        },
      }),
    ]);

    // ---- Product Layer: Calculate target trophies and update trophy scores ----
    await updateSpecificTrophyScores(winnerSampleId, loserSampleId, 'sample', comparisonId);

    // Update percentiles for sample images
    await updateSampleImagePercentiles();
  } catch (error) {
    console.error('Error updating sample image ratings:', error);
  }
}

// Helper function to update ratings for mixed comparisons (user photo vs sample image)
async function updateMixedRatings(
  winnerId: string,
  loserId: string,
  winnerType: string,
  loserType: string,
  comparisonId?: string
) {
  console.log(`🎯 updateMixedRatings called: winner=${winnerId} (${winnerType}), loser=${loserId} (${loserType})`);
  try {
    // Get rankings for both participants based on their types
    const winnerRanking = winnerType === 'user'
      ? await prisma.photoRanking.findUnique({ where: { photoId: winnerId } })
      : await prisma.sampleImageRanking.findUnique({ where: { sampleImageId: winnerId } });

    const loserRanking = loserType === 'user'
      ? await prisma.photoRanking.findUnique({ where: { photoId: loserId } })
      : await prisma.sampleImageRanking.findUnique({ where: { sampleImageId: loserId } });

    if (!winnerRanking || !loserRanking) {
      console.error(`❌ Mixed rankings not found: winner=${!!winnerRanking}, loser=${!!loserRanking}`);
      return;
    }

    console.log(`📈 Current hidden BT scores: winner=${winnerRanking.hiddenBradleyTerryScore}, loser=${loserRanking.hiddenBradleyTerryScore}`);

    // ---- Truth Layer: Update hidden Bradley-Terry scores ----
    const hiddenUpdate = bradleyTerryService.updateRatings(
      winnerRanking.hiddenBradleyTerryScore || 0,
      loserRanking.hiddenBradleyTerryScore || 0,
      { learningRate: 0.05 }
    );

    console.log(`📈 New hidden BT scores: winner=${hiddenUpdate.newWinnerScore.toFixed(4)}, loser=${hiddenUpdate.newLoserScore.toFixed(4)}`);

    // Update winner's hidden BT score
    if (winnerType === 'user') {
      await prisma.photoRanking.update({
        where: { photoId: winnerId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newWinnerScore,
          lastUpdated: new Date(),
        },
      });
      // Update winner's trophy score
      await updateSingleTrophyScore(winnerId, 'photo', true, comparisonId);
    } else {
      await prisma.sampleImageRanking.update({
        where: { sampleImageId: winnerId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newWinnerScore,
          lastUpdated: new Date(),
        },
      });
      await updateSingleTrophyScore(winnerId, 'sample', true, comparisonId);
    }

    // Update loser's hidden BT score
    if (loserType === 'user') {
      await prisma.photoRanking.update({
        where: { photoId: loserId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newLoserScore,
          lastUpdated: new Date(),
        },
      });
      // Update loser's trophy score
      await updateSingleTrophyScore(loserId, 'photo', false, comparisonId);
    } else {
      await prisma.sampleImageRanking.update({
        where: { sampleImageId: loserId },
        data: {
          hiddenBradleyTerryScore: hiddenUpdate.newLoserScore,
          lastUpdated: new Date(),
        },
      });
      await updateSingleTrophyScore(loserId, 'sample', false, comparisonId);
    }

    console.log(`✅ Mixed ratings updated successfully`);

    // Update percentiles
    await updatePercentiles();
    await updateSampleImagePercentiles();
  } catch (error) {
    console.error('❌ Error updating mixed ratings:', error);
  }
}

// Helper function to update trophy score for a single item in mixed comparisons
async function updateSingleTrophyScore(
  itemId: string,
  itemType: 'photo' | 'sample',
  isWinner: boolean,
  comparisonId?: string
) {
  console.log(`🏆 updateSingleTrophyScore: ${itemId} (${itemType}), winner=${isWinner}`);
  try {
    const trophyConfig = bradleyTerryService.getDefaultTrophyConfig();

    // Get the item's ranking
    const ranking = itemType === 'photo'
      ? await prisma.photoRanking.findUnique({ where: { photoId: itemId } })
      : await prisma.sampleImageRanking.findUnique({ where: { sampleImageId: itemId } });

    if (!ranking) return;

    // Get total count for this type
    const totalCount = itemType === 'photo'
      ? await prisma.photoRanking.count({ where: { totalComparisons: { gt: 0 } } })
      : await prisma.sampleImageRanking.count({ where: { totalComparisons: { gt: 0 } } });

    if (totalCount === 0) return;

    // Get rank based on hidden BT score
    const rank = itemType === 'photo'
      ? await prisma.photoRanking.count({ where: { hiddenBradleyTerryScore: { lt: ranking.hiddenBradleyTerryScore } } })
      : await prisma.sampleImageRanking.count({ where: { hiddenBradleyTerryScore: { lt: ranking.hiddenBradleyTerryScore } } });

    // Calculate target trophy
    const p = (rank + 1) / (totalCount + 1);
    const targetTrophy = trophyConfig.targetMean + trophyConfig.targetStd * bradleyTerryService.inverseNormalCDF(p);
    const oldTrophy = ranking.trophyScore || 0;

    // Calculate new trophy using the step function
    const newTrophy = bradleyTerryService.calculateTrophyStep(
      oldTrophy,
      targetTrophy,
      isWinner,
      trophyConfig.winGain,
      trophyConfig.lossPenalty,
      trophyConfig.fadeWidth
    );

    const delta = newTrophy - oldTrophy;

    // Get user email for searchable logging (only for user photos)
    let userEmail = 'sample_image';
    if (itemType === 'photo') {
      const photo = await prisma.photo.findUnique({
        where: { id: itemId },
        include: { user: { select: { email: true } } }
      });
      userEmail = photo?.user?.email || 'unknown';
    }

    const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
    console.log(`🏆 Trophy update: ${oldTrophy} → ${newTrophy.toFixed(1)} (${deltaStr}), target=${targetTrophy.toFixed(1)}`);
    console.log(`TROPHY_UPDATE abcdefg | User: ${userEmail} | ${isWinner ? 'WON' : 'LOST'} | Delta: ${deltaStr} trophies | New total: ${newTrophy.toFixed(1)}`);

    // Update the trophy score
    if (itemType === 'photo') {
      await prisma.photoRanking.update({
        where: { photoId: itemId },
        data: {
          trophyScore: newTrophy,
          targetTrophyScore: targetTrophy,
          lastUpdated: new Date(),
        },
      });
    } else {
      await prisma.sampleImageRanking.update({
        where: { sampleImageId: itemId },
        data: {
          trophyScore: newTrophy,
          targetTrophyScore: targetTrophy,
          lastUpdated: new Date(),
        },
      });
    }

    // Update comparison record with delta if it's a user photo and we have comparison ID
    if (comparisonId && itemType === 'photo') {
      const updateData = isWinner
        ? { winnerTrophyDelta: delta }
        : { loserTrophyDelta: delta };

      await prisma.comparison.update({
        where: { id: comparisonId },
        data: updateData,
      });
    }
  } catch (error) {
    console.error(`❌ Error updating single trophy score for ${itemId}:`, error);
  }
}

// Throttling for percentile updates to prevent database overload
let lastPhotoPercentileUpdate = 0;
let lastSamplePercentileUpdate = 0;
const PERCENTILE_UPDATE_INTERVAL = 60 * 1000; // 60 seconds

// Helper function to recalculate percentiles for all photos
async function updatePercentiles() {
  const now = Date.now();
  if (now - lastPhotoPercentileUpdate < PERCENTILE_UPDATE_INTERVAL) {
    return; // Skip if updated recently
  }
  
  try {
    lastPhotoPercentileUpdate = now;
    // Use CTE approach since window functions aren't allowed in UPDATE
    await prisma.$executeRaw`
      WITH ranked_photos AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (ORDER BY bradley_terry_score DESC) as rank_num,
          COUNT(*) OVER () as total_count
        FROM photo_rankings 
        WHERE total_comparisons > 0
      )
      UPDATE photo_rankings 
      SET current_percentile = ROUND(((total_count - rank_num + 1)::DECIMAL / total_count::DECIMAL) * 100.0, 1)
      FROM ranked_photos 
      WHERE photo_rankings.id = ranked_photos.id
    `;
    console.log('✅ Global photo percentiles updated');
  } catch (error) {
    console.error('Error updating percentiles:', error);
  }
}

// Helper function to recalculate percentiles for all sample images
async function updateSampleImagePercentiles() {
  const now = Date.now();
  if (now - lastSamplePercentileUpdate < PERCENTILE_UPDATE_INTERVAL) {
    return;
  }

  try {
    lastSamplePercentileUpdate = now;
    // Use CTE approach since window functions aren't allowed in UPDATE
    await prisma.$executeRaw`
      WITH ranked_sample_images AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (ORDER BY bradley_terry_score DESC) as rank_num,
          COUNT(*) OVER () as total_count
        FROM sample_image_rankings 
        WHERE total_comparisons > 0
      )
      UPDATE sample_image_rankings 
      SET current_percentile = ROUND(((total_count - rank_num + 1)::DECIMAL / total_count::DECIMAL) * 100.0, 1)
      FROM ranked_sample_images 
      WHERE sample_image_rankings.id = ranked_sample_images.id
    `;
    console.log('✅ Global sample image percentiles updated');
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
    // Use CTE approach for male rankings
    await prisma.$executeRaw`
      WITH ranked_male_combined AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (ORDER BY bradley_terry_score DESC) as rank_num,
          COUNT(*) OVER () as total_count
        FROM combined_rankings 
        WHERE total_comparisons > 0 AND gender = 'male'
      )
      UPDATE combined_rankings 
      SET current_percentile = ROUND(((total_count - rank_num + 1)::DECIMAL / total_count::DECIMAL) * 100.0, 1)
      FROM ranked_male_combined 
      WHERE combined_rankings.id = ranked_male_combined.id
    `;
    
    // Use CTE approach for female rankings
    await prisma.$executeRaw`
      WITH ranked_female_combined AS (
        SELECT 
          id,
          ROW_NUMBER() OVER (ORDER BY bradley_terry_score DESC) as rank_num,
          COUNT(*) OVER () as total_count
        FROM combined_rankings 
        WHERE total_comparisons > 0 AND gender = 'female'
      )
      UPDATE combined_rankings 
      SET current_percentile = ROUND(((total_count - rank_num + 1)::DECIMAL / total_count::DECIMAL) * 100.0, 1)
      FROM ranked_female_combined 
      WHERE combined_rankings.id = ranked_female_combined.id
    `;
  } catch (error) {
    console.error('Error updating combined percentiles:', error);
  }
}

// Helper function to update trophy scores for a specific comparison
async function updateSpecificTrophyScores(
  winnerId: string,
  loserId: string,
  rankingType: 'photo' | 'sample' | 'combined',
  comparisonId?: string
) {
  console.log(`🏆 updateSpecificTrophyScores called: winner=${winnerId}, loser=${loserId}, type=${rankingType}`);
  try {
    const trophyConfig = bradleyTerryService.getDefaultTrophyConfig();

    // 1. Get total count and current rankings for the two items
    let winnerRanking: any = null;
    let loserRanking: any = null;
    let totalCount = 0;

    if (rankingType === 'photo') {
      [winnerRanking, loserRanking, totalCount] = await Promise.all([
        prisma.photoRanking.findUnique({ where: { photoId: winnerId } }),
        prisma.photoRanking.findUnique({ where: { photoId: loserId } }),
        prisma.photoRanking.count({ where: { totalComparisons: { gt: 0 } } })
      ]);
    } else if (rankingType === 'sample') {
      [winnerRanking, loserRanking, totalCount] = await Promise.all([
        prisma.sampleImageRanking.findUnique({ where: { sampleImageId: winnerId } }),
        prisma.sampleImageRanking.findUnique({ where: { sampleImageId: loserId } }),
        prisma.sampleImageRanking.count({ where: { totalComparisons: { gt: 0 } } })
      ]);
    }

    console.log(`📊 Trophy update data: winnerRanking=${!!winnerRanking}, loserRanking=${!!loserRanking}, totalCount=${totalCount}`);

    if (!winnerRanking || !loserRanking || totalCount === 0) {
      console.log(`⚠️ Skipping trophy update: missing data`);
      return;
    }

    // 2. Get ranks for winner and loser based on hidden Bradley-Terry scores
    // This allows us to calculate their target trophies without updating everyone
    const [winnerRank, loserRank] = await Promise.all([
      rankingType === 'photo' 
        ? prisma.photoRanking.count({ where: { hiddenBradleyTerryScore: { lt: winnerRanking.hiddenBradleyTerryScore } } })
        : prisma.sampleImageRanking.count({ where: { hiddenBradleyTerryScore: { lt: winnerRanking.hiddenBradleyTerryScore } } }),
      rankingType === 'photo'
        ? prisma.photoRanking.count({ where: { hiddenBradleyTerryScore: { lt: loserRanking.hiddenBradleyTerryScore } } })
        : prisma.sampleImageRanking.count({ where: { hiddenBradleyTerryScore: { lt: loserRanking.hiddenBradleyTerryScore } } })
    ]);

    // 3. Calculate target trophies for just these two (using percentile rank)
    // p = (rank + 1) / (total + 1) to match the logic in calculateTargetTrophies
    const winnerP = (winnerRank + 1) / (totalCount + 1);
    const loserP = (loserRank + 1) / (totalCount + 1);

    console.log(`📊 Percentile calculation: winnerRank=${winnerRank}, loserRank=${loserRank}, winnerP=${winnerP.toFixed(4)}, loserP=${loserP.toFixed(4)}`);

    // We can use the service's target trophy logic directly for individual P values
    const winnerTarget = trophyConfig.targetMean + trophyConfig.targetStd * bradleyTerryService.inverseNormalCDF(winnerP);
    const loserTarget = trophyConfig.targetMean + trophyConfig.targetStd * bradleyTerryService.inverseNormalCDF(loserP);

    const winnerOldTrophy = winnerRanking.trophyScore || 0;
    const loserOldTrophy = loserRanking.trophyScore || 0;

    console.log(`📊 Trophy targets: winnerTarget=${winnerTarget.toFixed(1)}, loserTarget=${loserTarget.toFixed(1)}`);
    console.log(`📊 Current trophies: winner=${winnerOldTrophy}, loser=${loserOldTrophy}`);

    // 4. Calculate new trophy scores using the trophy progression logic
    const trophyUpdate = bradleyTerryService.updateTrophyScores(
      winnerOldTrophy,
      loserOldTrophy,
      winnerTarget,
      loserTarget,
      {
        winGain: trophyConfig.winGain,
        lossPenalty: trophyConfig.lossPenalty,
        fadeWidth: trophyConfig.fadeWidth
      }
    );

    const winnerDelta = trophyUpdate.newWinnerTrophy - winnerOldTrophy;
    const loserDelta = trophyUpdate.newLoserTrophy - loserOldTrophy;

    console.log(`🏆 Trophy update result: winner ${winnerOldTrophy} → ${trophyUpdate.newWinnerTrophy.toFixed(1)} (+${winnerDelta.toFixed(1)}), loser ${loserOldTrophy} → ${trophyUpdate.newLoserTrophy.toFixed(1)} (${loserDelta.toFixed(1)})`);

    // Get user emails for searchable logging (only for user photos)
    if (rankingType === 'photo') {
      const [winnerPhoto, loserPhoto] = await Promise.all([
        prisma.photo.findUnique({ where: { id: winnerId }, include: { user: { select: { email: true } } } }),
        prisma.photo.findUnique({ where: { id: loserId }, include: { user: { select: { email: true } } } }),
      ]);
      const winnerEmail = winnerPhoto?.user?.email || 'unknown';
      const loserEmail = loserPhoto?.user?.email || 'unknown';
      const winnerDeltaStr = winnerDelta >= 0 ? `+${winnerDelta.toFixed(1)}` : winnerDelta.toFixed(1);
      const loserDeltaStr = loserDelta >= 0 ? `+${loserDelta.toFixed(1)}` : loserDelta.toFixed(1);
      console.log(`TROPHY_UPDATE abcdefg | User: ${winnerEmail} | WON | Delta: ${winnerDeltaStr} trophies | New total: ${trophyUpdate.newWinnerTrophy.toFixed(1)}`);
      console.log(`TROPHY_UPDATE abcdefg | User: ${loserEmail} | LOST | Delta: ${loserDeltaStr} trophies | New total: ${trophyUpdate.newLoserTrophy.toFixed(1)}`);
    }

    // 5. Update rankings in database
    if (rankingType === 'photo') {
      await Promise.all([
        prisma.photoRanking.update({
          where: { photoId: winnerId },
          data: {
            trophyScore: trophyUpdate.newWinnerTrophy,
            targetTrophyScore: winnerTarget,
            lastUpdated: new Date(),
          }
        }),
        prisma.photoRanking.update({
          where: { photoId: loserId },
          data: {
            trophyScore: trophyUpdate.newLoserTrophy,
            targetTrophyScore: loserTarget,
            lastUpdated: new Date(),
          }
        })
      ]);
    } else if (rankingType === 'sample') {
      await Promise.all([
        prisma.sampleImageRanking.update({
          where: { sampleImageId: winnerId },
          data: {
            trophyScore: trophyUpdate.newWinnerTrophy,
            targetTrophyScore: winnerTarget,
            lastUpdated: new Date(),
          }
        }),
        prisma.sampleImageRanking.update({
          where: { sampleImageId: loserId },
          data: {
            trophyScore: trophyUpdate.newLoserTrophy,
            targetTrophyScore: loserTarget,
            lastUpdated: new Date(),
          }
        })
      ]);
    }

    // 6. Update comparison record with deltas if ID provided
    if (comparisonId) {
      await prisma.comparison.update({
        where: { id: comparisonId },
        data: {
          winnerTrophyDelta: winnerDelta,
          loserTrophyDelta: loserDelta,
        }
      });
    }

    console.log(`Updated ${rankingType} trophies - Winner: ${trophyUpdate.newWinnerTrophy.toFixed(1)} (+${winnerDelta.toFixed(1)}), Loser: ${trophyUpdate.newLoserTrophy.toFixed(1)} (${loserDelta.toFixed(1)})`);
  } catch (error) {
    console.error(`Error updating specific ${rankingType} trophy scores:`, error);
  }
}

// Helper function to get recent previous comparisons for a user (optimized)
async function getPreviousComparisons(userId: string) {
  // Only get recent comparisons to avoid loading thousands of records
  // This significantly improves performance while still preventing immediate duplicates
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const comparisons = await prisma.comparison.findMany({
    where: {
      raterId: userId,
      timestamp: {
        gte: thirtyDaysAgo, // Only get last 30 days
      },
    },
    select: {
      winnerPhotoId: true,
      loserPhotoId: true,
      winnerSampleImageId: true,
      loserSampleImageId: true,
      comparisonType: true,
    },
    orderBy: {
      timestamp: 'desc', // Get most recent first
    },
    take: 1000, // Limit to prevent runaway queries
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

// Helper function to generate user vs sample pairs only (not user vs user or sample vs sample)
function generateUserVsSamplePairs(userPhotos: any[], sampleImages: any[]): Array<{left: any, right: any, type: string}> {
  const pairs = [];

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

// Helper function to generate sample-only pairs
function generateSampleOnlyPairs(sampleImages: any[]): Array<{left: any, right: any, type: string}> {
  const pairs = [];

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

  return pairs;
}

// DEPRECATED: Helper function to generate mixed pairs (user photos + sample images)
// This function is kept for backward compatibility but is replaced by the more specific functions above
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
  const filteredPairs = [];
  
  for (const pair of pairs) {
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
    
    const isAlreadyCompared = comparedPairs.has(pairKey);
    
    // Debug logging for pair filtering (only log first few to avoid spam)
    if (process.env.NODE_ENV === 'development' && filteredPairs.length < 3) {
      console.log(`  🔍 Checking pair: ${leftId} vs ${rightId} (types: ${pair.left.type}/${pair.right.type})`);
      console.log(`    - Generated key: "${pairKey}"`);
      console.log(`    - Already compared: ${isAlreadyCompared}`);
    }
    
    if (!isAlreadyCompared) {
      filteredPairs.push(pair);
    }
  }
  
  return filteredPairs;
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
 * Uses a tiered approach: first try person deduplication, then allow image reuse if needed
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
  
  // Phase 1: Try strict person deduplication (ideal case)
  let selectedPairs = [];
  let usedPersonIds = new Set<string>();
  
  for (const scoredPair of scoredPairs) {
    if (selectedPairs.length >= bufferSize) break;
    
    const { leftPersonId, rightPersonId } = scoredPair;
    if (!usedPersonIds.has(leftPersonId) && !usedPersonIds.has(rightPersonId)) {
      selectedPairs.push(scoredPair.pair);
      usedPersonIds.add(leftPersonId);
      usedPersonIds.add(rightPersonId);
    }
  }
  
  // Phase 2: If we don't have enough pairs, allow image reuse but track exact pairs
  if (selectedPairs.length < bufferSize && selectedPairs.length < availablePairs.length) {
    const usedPairKeys = new Set<string>();
    
    // Add already selected pairs to the set
    selectedPairs.forEach(pair => {
      const key = `${pair.left.id}_${pair.right.id}`;
      const reverseKey = `${pair.right.id}_${pair.left.id}`;
      usedPairKeys.add(key);
      usedPairKeys.add(reverseKey);
    });
    
    // Try to add more pairs without exact duplicates
    for (const scoredPair of scoredPairs) {
      if (selectedPairs.length >= bufferSize) break;
      
      const { pair } = scoredPair;
      const key = `${pair.left.id}_${pair.right.id}`;
      const reverseKey = `${pair.right.id}_${pair.left.id}`;
      
      if (!usedPairKeys.has(key) && !usedPairKeys.has(reverseKey)) {
        selectedPairs.push(pair);
        usedPairKeys.add(key);
        usedPairKeys.add(reverseKey);
      }
    }
  }
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 selectInformativePairs results:`);
    console.log(`  - Available pairs: ${availablePairs.length}`);
    console.log(`  - Requested buffer size: ${bufferSize}`);
    console.log(`  - Phase 1 (person dedup): ${Math.min(selectedPairs.length, usedPersonIds.size / 2)} pairs`);
    console.log(`  - Final selection: ${selectedPairs.length} pairs`);
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
  // Get recent comparisons to extract recently shown photos (optimized)
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
    orderBy: {
      timestamp: 'desc',
    },
    take: 100, // Limit to most recent 100 comparisons for performance
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

/**
 * Generate exclusion key for recently submitted pair
 * This ensures the exact same pair won't be loaded again immediately
 */
function generateRecentPairKey(
  winnerId: string, 
  loserId: string, 
  winnerType: string, 
  loserType: string
): string {
  // Use the same logic as extractComparedPairs for consistency
  if (winnerType === 'user' && loserType === 'user') {
    // User photo comparison
    return normalizePair(winnerId, loserId);
  } else if (winnerType === 'sample' && loserType === 'sample') {
    // Sample image comparison
    return normalizePair(winnerId, loserId);
  } else {
    // Mixed comparison (user photo vs sample image)
    const photoId = winnerType === 'user' ? winnerId : loserId;
    const sampleId = winnerType === 'sample' ? winnerId : loserId;
    return normalizePair(`photo_${photoId}`, `sample_${sampleId}`);
  }
}