import { useState, useCallback, useRef, useEffect } from 'react';

export interface PhotoPair {
  sessionId: string;
  leftPhoto: {
    id: string;
    url: string;
    thumbnailUrl: string;
    userId: string;
    userAge: number;
    userGender: string;
    bio?: string;
    type: 'user' | 'sample';
    name?: string;
  };
  rightPhoto: {
    id: string;
    url: string;
    thumbnailUrl: string;
    userId: string;
    userAge: number;
    userGender: string;
    bio?: string;
    type: 'user' | 'sample';
    name?: string;
  };
  // Challenge-specific fields
  isChallenge?: boolean;
  challengeId?: string;
}

interface BufferedPair extends PhotoPair {
  preloaded: boolean;
}

interface UseImageBufferOptions {
  bufferSize?: number;
  refillThreshold?: number;
  userId: string;
  recentlySubmittedPair?: {
    winnerId: string;
    loserId: string;
    winnerType: string;
    loserType: string;
  } | null;
  onError?: (error: string) => void;
}

interface ImageCache {
  [url: string]: {
    loaded: boolean;
    error: boolean;
    image?: HTMLImageElement;
  };
}

export const useImageBuffer = ({
  bufferSize = 5,
  refillThreshold = 2,
  userId,
  recentlySubmittedPair,
  onError
}: UseImageBufferOptions) => {
  const [buffer, setBuffer] = useState<BufferedPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to show loading state initially
  const [isBuffering, setIsBuffering] = useState(false);
  
  const imageCache = useRef<ImageCache>({});
  const isFetching = useRef(false);
  
  // Track compared photo combinations to prevent duplicates - DISABLED
  // DISABLED: const viewedCombinations = useRef<Set<string>>(new Set());
  // DISABLED: const comparedCombinations = useRef<Set<string>>(new Set());

  // Comprehensive buffer state logging
  const logBufferState = useCallback((_action: string, _context: any = {}) => {
    // console.log(`📊 Frontend Buffer State [${action}]:`, {
    //   action,
    //   bufferLength: buffer.length,
    //   currentIndex,
    //   remainingPairs: buffer.length - currentIndex,
    //   isBuffering,
    //   isLoading,
    //   bufferPairs: buffer.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`),
    //   currentPair: buffer[currentIndex] ? `${buffer[currentIndex].leftPhoto.id} vs ${buffer[currentIndex].rightPhoto.id}` : 'none',
    //   ...context
    // });
  }, [buffer, currentIndex, isBuffering, isLoading]);
  
  // Storage keys for persistence - DISABLED
  // DISABLED: const comparedStorageKey = `compared_pairs_${userId}`;

  // Helper function to create consistent photo combination key matching backend format - DISABLED
  // DISABLED: const createCombinationKey = useCallback((pair: PhotoPair): string => {
  //   // Add prefixes based on photo type to match backend key format
  //   const leftKey = pair.leftPhoto.type === 'sample' ? `sample_${pair.leftPhoto.id}` : `photo_${pair.leftPhoto.id}`;
  //   const rightKey = pair.rightPhoto.type === 'sample' ? `sample_${pair.rightPhoto.id}` : `photo_${pair.rightPhoto.id}`;
  //   
  //   // Sort keys to ensure consistent key regardless of left/right order
  //   return leftKey < rightKey ? `${leftKey}_${rightKey}` : `${rightKey}_${leftKey}`;
  // }, []);

  // Persistent storage functions - DISABLED
  // DISABLED: const loadStoredCombinations = useCallback(() => {
  //   try {
  //     // DISABLED: Load viewed combinations
  //     // const storedViewed = localStorage.getItem(storageKey);
  //     // if (storedViewed) {
  //       //   const viewedArray = JSON.parse(storedViewed) as string[];
  //       //   viewedCombinations.current = new Set(viewedArray);
  //       //   console.log('📦 Frontend: Loaded viewed combinations from storage:', {
  //       //     count: viewedArray.length,
  //       //     combinations: viewedArray
  //       //   });
  //       // }

  //     // Load compared combinations
  //     const storedCompared = localStorage.getItem(comparedStorageKey);
  //     if (storedCompared) {
  //       const comparedArray = JSON.parse(storedCompared) as string[];
  //       comparedCombinations.current = new Set(comparedArray);
  //       // console.log('📦 Frontend: Loaded compared combinations from storage:', {
  //       //   count: comparedArray.length,
  //       //   combinations: comparedArray
  //       // });
  //     }
  //   } catch (error) {
  //     console.warn('Failed to load stored combinations:', error);
  //     // Reset to empty sets on error
  //     comparedCombinations.current = new Set();
  //   }
  // }, [comparedStorageKey]);

  // Initialize storage on mount - DISABLED
  // DISABLED: useEffect(() => {
  //   if (userId) {
  //     loadStoredCombinations();
  //   }
  // }, [userId, loadStoredCombinations]);

  // Helper function to check if a buffer pair matches the recently submitted pair
  const doesPairMatch = useCallback((
    bufferPair: PhotoPair,
    submittedPair: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    }
  ): boolean => {
    const leftId = bufferPair.leftPhoto.id;
    const rightId = bufferPair.rightPhoto.id;
    const leftType = bufferPair.leftPhoto.type;
    const rightType = bufferPair.rightPhoto.type;

    // Check if this buffer pair contains the same two photos as the submitted pair
    // Order doesn't matter - A vs B is the same as B vs A
    const hasWinnerPhoto = 
      (leftId === submittedPair.winnerId && leftType === submittedPair.winnerType) ||
      (rightId === submittedPair.winnerId && rightType === submittedPair.winnerType);
    
    const hasLoserPhoto = 
      (leftId === submittedPair.loserId && leftType === submittedPair.loserType) ||
      (rightId === submittedPair.loserId && rightType === submittedPair.loserType);

    return hasWinnerPhoto && hasLoserPhoto;
  }, []);

  // Image preloading utility
  const preloadImage = useCallback((url: string): Promise<void> => {
    // console.log('🖼️ Starting image preload:', { url });
    
    return new Promise((resolve, reject) => {
      if (imageCache.current[url]?.loaded) {
        // console.log('✅ Image already cached and loaded:', { url });
        resolve();
        return;
      }

      if (imageCache.current[url]?.error) {
        // console.log('❌ Image previously failed, rejecting:', { url });
        reject(new Error('Image failed to load previously'));
        return;
      }

      const img = new Image();
      // Remove crossOrigin to avoid CORS issues with R2 URLs
      
      img.onload = () => {
        imageCache.current[url] = { loaded: true, error: false, image: img };
        resolve();
      };

      img.onerror = () => {
        imageCache.current[url] = { loaded: false, error: true };
        reject(new Error(`Failed to load image: ${url}`));
      };

      imageCache.current[url] = { loaded: false, error: false };
      img.src = url;
    });
  }, []);

  // Preload images for a pair
  const preloadPairImages = useCallback(async (pair: PhotoPair): Promise<void> => {
    const urls = [
      pair.leftPhoto.url,
      pair.rightPhoto.url,
      pair.leftPhoto.thumbnailUrl,
      pair.rightPhoto.thumbnailUrl
    ].filter(Boolean);

    try {
      await Promise.allSettled(urls.map(url => preloadImage(url)));
    } catch (error) {
      console.warn('Some images failed to preload for pair:', pair.sessionId, error);
    }
  }, [preloadImage]);

  // Fetch pairs from API with optional recent pair exclusion
  const fetchPairs = useCallback(async (
    requestedBufferSize: number, 
    recentPairOverride?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<PhotoPair[]> => {
    try {
      // Import apiRequest dynamically to avoid circular dependencies
      const { apiRequest } = await import('../config/api');
      
      // Build query parameters
      const params = new URLSearchParams({
        userId,
        buffer: requestedBufferSize.toString()
      });
      
      // Add recently submitted pair info if available (use override first, then state)
      const recentPair = recentPairOverride || recentlySubmittedPair;
      
      if (recentPair) {
        params.append('recentWinnerId', recentPair.winnerId);
        params.append('recentLoserId', recentPair.loserId);
        params.append('recentWinnerType', recentPair.winnerType);
        params.append('recentLoserType', recentPair.loserType);
      } else {

      }
      
      const response = await apiRequest(
        `/api/comparisons/next-pair?${params.toString()}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch pairs');
      }

      // Handle both single pair and multiple pairs response format
      let pairs: PhotoPair[] = [];
      if (data.pairs && Array.isArray(data.pairs)) {
        pairs = data.pairs;
      } else if (data.pair) {
        pairs = [data.pair];
      }
      
      // Frontend logging for received pairs
      // console.log('✅ Frontend: Received pairs from API:', {
      //   requestedBufferSize,
      //   receivedPairsCount: pairs.length,
      //   hadRecentPairExclusion: !!recentlySubmittedPair,
      //   pairIds: pairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`),
      //   message: data.message || 'No message from backend'
      // });
      // console.log("pair received", pairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`));
      
      return pairs;
    } catch (error) {
      console.error('Failed to fetch pairs:', error);
      throw error;
    }
  }, [userId, recentlySubmittedPair]);

  // Fetch active challenge for mog battles
  const fetchChallengePair = useCallback(async (): Promise<PhotoPair | null> => {
    try {
      const { apiRequest } = await import('../config/api');

      const response = await apiRequest(
        `/api/challenges/active?excludeUserId=${userId}`
      );

      const data = await response.json();

      if (!data.success || !data.challenge) {
        return null;
      }

      const challenge = data.challenge;

      // Convert challenge to PhotoPair format
      const challengePair: PhotoPair = {
        sessionId: `challenge_${challenge.id}`,
        isChallenge: true,
        challengeId: challenge.id,
        leftPhoto: {
          id: challenge.challenger.id,
          url: challenge.challenger.profilePhotoUrl || '',
          thumbnailUrl: challenge.challenger.profilePhotoUrl || '',
          userId: challenge.challenger.id,
          userAge: 0,
          userGender: '',
          bio: '',
          type: 'user',
          name: challenge.challenger.name,
        },
        rightPhoto: {
          id: challenge.challenged.id,
          url: challenge.challenged.profilePhotoUrl || '',
          thumbnailUrl: challenge.challenged.profilePhotoUrl || '',
          userId: challenge.challenged.id,
          userAge: 0,
          userGender: '',
          bio: '',
          type: 'user',
          name: challenge.challenged.name,
        },
      };

      console.log('⚔️ Fetched challenge pair:', challengePair.sessionId);
      return challengePair;
    } catch (error) {
      console.warn('Failed to fetch challenge pair:', error);
      return null;
    }
  }, [userId]);

  // Refill buffer with new pairs
  const refillBuffer = useCallback(async (
    recentPairOverride?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<void> => {
    
    if (isFetching.current) return;
    
    isFetching.current = true;
    setIsBuffering(true);

    try {
      // Fetch regular pairs
      const newPairs = await fetchPairs(bufferSize, recentPairOverride);

      // Try to fetch a challenge pair (~30% chance if challenges exist)
      let challengePair: PhotoPair | null = null;
      if (Math.random() < 0.3) {
        challengePair = await fetchChallengePair();
      }

      if (newPairs.length === 0 && !challengePair) {
        onError?.('No more pairs available');
        return;
      }

      // Convert to buffered pairs - filtering DISABLED
      let newBufferedPairs: BufferedPair[] = newPairs.map(pair => ({
        ...pair,
        preloaded: false
      }));

      // Insert challenge pair at a random position if available
      if (challengePair) {
        const challengeBufferedPair: BufferedPair = {
          ...challengePair,
          preloaded: false
        };
        // Insert challenge at random position (but not at index 0 to avoid confusion)
        const insertIndex = Math.floor(Math.random() * newBufferedPairs.length) + 1;
        newBufferedPairs.splice(Math.min(insertIndex, newBufferedPairs.length), 0, challengeBufferedPair);
        console.log(`⚔️ Inserted challenge at position ${insertIndex}`);
      }
      
      // Log state before buffer update
      logBufferState('before_refill', {
        newPairsReceived: newPairs.length,
        newPairsFiltered: newBufferedPairs.length,
        recentPairOverride: !!recentPairOverride
      });

      setBuffer(prev => {
        // Simple buffer management - no filtering, just append new pairs
        if (prev.length === 0) {
          // Only reset index if we have new pairs
          if (newBufferedPairs.length > 0) {
            setCurrentIndex(0);
          }
          // Immediately preload the current pair (index 0) when buffer is reset
          if (newBufferedPairs.length > 0) {
            setTimeout(() => {
              preloadPairImages(newBufferedPairs[0]).catch(console.error);
            }, 0);
          }
          
          return newBufferedPairs;
        }
        
        // Otherwise, keep existing pairs and append new ones
        const result = [...prev, ...newBufferedPairs];
        
        // Log state after buffer update
        setTimeout(() => {
          logBufferState('after_refill', {
            prevLength: prev.length,
            newPairsAdded: newBufferedPairs.length,
            totalAfterRefill: result.length
          });
        }, 0);
        
        return result;
      });

      // Start preloading images in background for new pairs
      newBufferedPairs.forEach(async (pair, index) => {
        if (index < 2) { // Preload first 2 new pairs immediately
          try {
            await preloadPairImages(pair);
            setBuffer(prev => {
              // Find the pair in the updated buffer and mark as preloaded
              const pairIndex = prev.findIndex(p => p.sessionId === pair.sessionId);
              if (pairIndex !== -1) {
                const updated = [...prev];
                updated[pairIndex] = { ...updated[pairIndex], preloaded: true };
                return updated;
              }
              return prev;
            });
          } catch (error) {
            console.warn(`Failed to preload pair ${index}:`, error);
          }
        }
      });

    } catch (error) {
      console.error('Buffer refill failed:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to load pairs');
    } finally {
      isFetching.current = false;
      setIsBuffering(false);
    }
  }, [bufferSize, fetchPairs, fetchChallengePair, preloadPairImages, onError]);

  // Initial buffer load
  const initializeBuffer = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await refillBuffer();
    } finally {
      setIsLoading(false);
    }
  }, [refillBuffer]);

  // DISABLED: Mark a pair as viewed and save to storage
  const markPairAsViewed = useCallback((_pair: PhotoPair) => {
    // DISABLED: No longer tracking viewed pairs - just log for debugging
    // console.log('📝 Frontend: Pair displayed (viewed tracking disabled):', {
    //   leftPhotoId: pair.leftPhoto.id,
    //   rightPhotoId: pair.rightPhoto.id,
    //   sessionId: pair.sessionId
    // });
    // REMOVED: setBuffer call that was causing infinite re-renders
  }, []);

  // Get current pair
  const getCurrentPair = useCallback((): PhotoPair | null => {
    // Debug logging for buffer vs index mismatch
    
    if (buffer.length === 0) {
      return null;
    }
    
    // Fix: Reset index if it's out of bounds
    if (currentIndex >= buffer.length) {
      setCurrentIndex(0);
      // Return the first pair after reset
      if (buffer.length > 0) {
        const pair = buffer[0];
        if (pair) {
          markPairAsViewed(pair);
        }
        return pair;
      }
      return null;
    }
    
    const pair = buffer[currentIndex];
    
    // Mark this pair as viewed when it becomes current
    if (pair) {
      markPairAsViewed(pair);
    }
    
    return pair;
  }, [buffer, currentIndex, markPairAsViewed]);

  // Advance to next pair with immediate filtering of submitted pair
  const advanceToNext = useCallback(async (
    recentPair?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<void> => {
    logBufferState('before_advance', { hasRecentPair: !!recentPair, recentPair });
    
    // Backend handles all filtering - no frontend filtering needed
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= buffer.length) {
      // Buffer exhausted, need to refill
      await refillBuffer(recentPair);
      return;
    }

    setCurrentIndex(nextIndex);
    
    // Immediately preload the new current pair
    if (buffer[nextIndex]) {
      setTimeout(() => {
        preloadPairImages(buffer[nextIndex]).catch(console.error);
      }, 0);
    }
    
    // Log state after advance
    logBufferState('after_advance', { previousIndex: currentIndex, nextIndex });

    // Check if we need to refill buffer
    const remaining = buffer.length - nextIndex;
    if (remaining <= refillThreshold && !isBuffering) {
      
      // Refill in background
      setTimeout(() => {
        refillBuffer(recentPair).catch(console.error);
      }, 100);
    }

    // Preload upcoming images
    const nextPair = buffer[nextIndex + 1];
    if (nextPair && !nextPair.preloaded) {
      preloadPairImages(nextPair).then(() => {
        setBuffer(prev => {
          const updated = [...prev];
          const targetIndex = nextIndex + 1;
          if (updated[targetIndex]) {
            updated[targetIndex] = { ...updated[targetIndex], preloaded: true };
          }
          return updated;
        });
      }).catch(console.warn);
    }
  }, [currentIndex, buffer, refillThreshold, isBuffering, refillBuffer, preloadPairImages, doesPairMatch]);

  // Check if current pair images are preloaded
  const isCurrentPairReady = useCallback((): boolean => {
    const pair = getCurrentPair();
    if (!pair) {
      return false;
    }

    const urls = [
      pair.leftPhoto.url,
      pair.rightPhoto.url
    ];

    const cacheStatus = urls.map(url => ({
      url,
      cached: !!imageCache.current[url],
      loaded: imageCache.current[url]?.loaded || false,
      error: imageCache.current[url]?.error || false,
      hasImage: !!imageCache.current[url]?.image
    }));

    const allLoaded = urls.every(url => imageCache.current[url]?.loaded);

    // Log any problematic images
    cacheStatus.forEach(status => {
      if (!status.loaded) {
        // console.log(`❌ Image not ready: ${status.url}`, {
        //   cached: status.cached,
        //   loaded: status.loaded,
        //   error: status.error,
        //   hasImage: status.hasImage
        // });
      }
    });

    return allLoaded;
  }, [getCurrentPair]);

  // Cleanup unused images from cache
  useEffect(() => {
    const cleanup = () => {
      const currentUrls = new Set<string>();
      
      // Keep images for current and next few pairs
      for (let i = Math.max(0, currentIndex - 1); i < Math.min(buffer.length, currentIndex + 3); i++) {
        const pair = buffer[i];
        if (pair) {
          currentUrls.add(pair.leftPhoto.url);
          currentUrls.add(pair.rightPhoto.url);
          currentUrls.add(pair.leftPhoto.thumbnailUrl);
          currentUrls.add(pair.rightPhoto.thumbnailUrl);
        }
      }

      // Remove unused images from cache
      Object.keys(imageCache.current).forEach(url => {
        if (!currentUrls.has(url)) {
          delete imageCache.current[url];
        }
      });
    };

    cleanup();
  }, [currentIndex, buffer]);

  return {
    getCurrentPair,
    advanceToNext,
    initializeBuffer,
    isLoading,
    isBuffering,
    isCurrentPairReady,
    bufferStats: {
      total: buffer.length,
      current: currentIndex,
      remaining: buffer.length - currentIndex,
      preloadedCount: buffer.filter(p => p.preloaded).length
    }
  };
};