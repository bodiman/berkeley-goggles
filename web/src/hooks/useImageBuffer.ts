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
    type: 'user' | 'sample';
  };
  rightPhoto: {
    id: string;
    url: string;
    thumbnailUrl: string;
    userId: string;
    userAge: number;
    userGender: string;
    type: 'user' | 'sample';
  };
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
  const [isLoading, setIsLoading] = useState(false);
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

  // Image preloading utility
  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current[url]?.loaded) {
        resolve();
        return;
      }

      if (imageCache.current[url]?.error) {
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
        
        // Frontend logging for API call with exclusion
        console.log('📞 Frontend API Call: Including recently submitted pair for exclusion:', {
          recentWinnerId: recentPair.winnerId,
          recentLoserId: recentPair.loserId,
          recentWinnerType: recentPair.winnerType,
          recentLoserType: recentPair.loserType,
          requestedBufferSize,
          source: recentPairOverride ? 'parameter' : 'state',
          apiUrl: `/api/comparisons/next-pair?${params.toString()}`
        });
      } else {
        console.log('📞 Frontend API Call: No recent pair to exclude, normal request:', {
          requestedBufferSize,
          apiUrl: `/api/comparisons/next-pair?${params.toString()}`
        });
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
      console.log("pair received", pairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`));
      
      return pairs;
    } catch (error) {
      console.error('Failed to fetch pairs:', error);
      throw error;
    }
  }, [userId, recentlySubmittedPair]);

  // Refill buffer with new pairs
  const refillBuffer = useCallback(async (
    recentPairOverride?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<void> => {
    console.log('🔄 Frontend: RefillBuffer called with parameters:', {
      hasRecentPairOverride: !!recentPairOverride,
      recentPairOverride,
      hasStateRecentPair: !!recentlySubmittedPair,
      currentBufferLength: buffer.length,
      currentIndex
    });
    
    if (isFetching.current) return;
    
    isFetching.current = true;
    setIsBuffering(true);

    try {
      const newPairs = await fetchPairs(bufferSize, recentPairOverride);
      
      if (newPairs.length === 0) {
        onError?.('No more pairs available');
        return;
      }

      // Convert to buffered pairs - filtering DISABLED
      const newBufferedPairs: BufferedPair[] = newPairs.map(pair => ({
        ...pair,
        preloaded: false
      }));
      
      // Log state before buffer update
      logBufferState('before_refill', {
        newPairsReceived: newPairs.length,
        newPairsFiltered: newBufferedPairs.length,
        recentPairOverride: !!recentPairOverride
      });

      console.log('🔍 Frontend: New pairs validation:', {
        totalReceivedPairs: newPairs.length,
        bufferedPairs: newBufferedPairs.length,
        pairIds: newBufferedPairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`)
      });

      setBuffer(prev => {
        // Simple buffer management - no filtering, just append new pairs
        if (prev.length === 0) {
          console.log('🔄 Frontend: Buffer is empty, replacing entirely:', {
            newPairsCount: newBufferedPairs.length,
            currentIndex,
            willResetIndex: newBufferedPairs.length > 0
          });
          // Only reset index if we have new pairs
          if (newBufferedPairs.length > 0) {
            setCurrentIndex(0);
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
  }, [bufferSize, fetchPairs, preloadPairImages, onError]);

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
    console.log('🔍 getCurrentPair debug:', {
      bufferLength: buffer.length,
      currentIndex,
      hasValidIndex: currentIndex < buffer.length,
      bufferPairIds: buffer.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`)
    });
    
    if (buffer.length === 0) {
      return null;
    }
    
    // Fix: Reset index if it's out of bounds
    if (currentIndex >= buffer.length) {
      console.log('🔧 Index out of bounds, resetting to 0:', {
        currentIndex,
        bufferLength: buffer.length
      });
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

  // Advance to next pair - simplified without filtering
  const advanceToNext = useCallback(async (
    recentPair?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<void> => {
    logBufferState('before_advance', { hasRecentPair: !!recentPair, recentPair });
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= buffer.length) {
      // Buffer exhausted, need to refill
      console.log('🔄 Frontend: Buffer exhausted, refilling...');
      await refillBuffer(recentPair);
      return;
    }

    setCurrentIndex(nextIndex);
    
    // Log state after advance
    logBufferState('after_advance', { previousIndex: currentIndex, nextIndex });

    // Check if we need to refill buffer
    const remaining = buffer.length - nextIndex;
    if (remaining <= refillThreshold && !isBuffering) {
      console.log('📋 Frontend: Scheduling background refill, low buffer:', {
        remaining,
        refillThreshold
      });
      
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
  }, [currentIndex, buffer, refillThreshold, isBuffering, refillBuffer, preloadPairImages]);

  // Check if current pair images are preloaded
  const isCurrentPairReady = useCallback((): boolean => {
    const pair = getCurrentPair();
    if (!pair) return false;

    const urls = [
      pair.leftPhoto.url,
      pair.rightPhoto.url
    ];

    return urls.every(url => imageCache.current[url]?.loaded);
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