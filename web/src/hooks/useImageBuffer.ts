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
  
  // Track viewed and compared photo combinations to prevent duplicates
  const viewedCombinations = useRef<Set<string>>(new Set());
  const comparedCombinations = useRef<Set<string>>(new Set());

  // Comprehensive buffer state logging
  const logBufferState = useCallback((action: string, context: any = {}) => {
    console.log(`📊 Frontend Buffer State [${action}]:`, {
      action,
      bufferLength: buffer.length,
      currentIndex,
      remainingPairs: buffer.length - currentIndex,
      viewedCombinationsCount: viewedCombinations.current.size,
      comparedCombinationsCount: comparedCombinations.current.size,
      isBuffering,
      isLoading,
      bufferPairs: buffer.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`),
      viewedCombinations: Array.from(viewedCombinations.current),
      comparedCombinations: Array.from(comparedCombinations.current),
      currentPair: buffer[currentIndex] ? `${buffer[currentIndex].leftPhoto.id} vs ${buffer[currentIndex].rightPhoto.id}` : 'none',
      ...context
    });
  }, [buffer, currentIndex, isBuffering, isLoading]);
  
  // Storage keys for persistence
  const storageKey = `viewed_pairs_${userId}`;
  const comparedStorageKey = `compared_pairs_${userId}`;

  // Helper function to create consistent photo combination key matching backend format
  const createCombinationKey = useCallback((pair: PhotoPair): string => {
    // Add prefixes based on photo type to match backend key format
    const leftKey = pair.leftPhoto.type === 'sample' ? `sample_${pair.leftPhoto.id}` : `photo_${pair.leftPhoto.id}`;
    const rightKey = pair.rightPhoto.type === 'sample' ? `sample_${pair.rightPhoto.id}` : `photo_${pair.rightPhoto.id}`;
    
    // Sort keys to ensure consistent key regardless of left/right order
    return leftKey < rightKey ? `${leftKey}_${rightKey}` : `${rightKey}_${leftKey}`;
  }, []);

  // Persistent storage functions
  const loadStoredCombinations = useCallback(() => {
    try {
      // Load viewed combinations
      const storedViewed = localStorage.getItem(storageKey);
      if (storedViewed) {
        const viewedArray = JSON.parse(storedViewed) as string[];
        viewedCombinations.current = new Set(viewedArray);
        console.log('📦 Frontend: Loaded viewed combinations from storage:', {
          count: viewedArray.length,
          combinations: viewedArray
        });
      }

      // Load compared combinations
      const storedCompared = localStorage.getItem(comparedStorageKey);
      if (storedCompared) {
        const comparedArray = JSON.parse(storedCompared) as string[];
        comparedCombinations.current = new Set(comparedArray);
        console.log('📦 Frontend: Loaded compared combinations from storage:', {
          count: comparedArray.length,
          combinations: comparedArray
        });
      }
    } catch (error) {
      console.warn('Failed to load stored combinations:', error);
      // Reset to empty sets on error
      viewedCombinations.current = new Set();
      comparedCombinations.current = new Set();
    }
  }, [storageKey, comparedStorageKey]);

  const saveStoredCombinations = useCallback(() => {
    try {
      // Save viewed combinations
      const viewedArray = Array.from(viewedCombinations.current);
      localStorage.setItem(storageKey, JSON.stringify(viewedArray));
      
      // Save compared combinations
      const comparedArray = Array.from(comparedCombinations.current);
      localStorage.setItem(comparedStorageKey, JSON.stringify(comparedArray));
      
      console.log('💾 Frontend: Saved combinations to storage:', {
        viewedCount: viewedArray.length,
        comparedCount: comparedArray.length
      });
    } catch (error) {
      console.warn('Failed to save combinations to storage:', error);
    }
  }, [storageKey, comparedStorageKey]);

  // Initialize storage on mount
  useEffect(() => {
    if (userId) {
      loadStoredCombinations();
    }
  }, [userId, loadStoredCombinations]);

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
      console.log('✅ Frontend: Received pairs from API:', {
        requestedBufferSize,
        receivedPairsCount: pairs.length,
        hadRecentPairExclusion: !!recentlySubmittedPair,
        pairIds: pairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`),
        message: data.message || 'No message from backend'
      });
      
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

      // Convert to buffered pairs and filter out already viewed or compared combinations
      const newBufferedPairs: BufferedPair[] = newPairs
        .filter(pair => {
          const combinationKey = createCombinationKey(pair);
          const isAlreadyViewed = viewedCombinations.current.has(combinationKey);
          const isAlreadyCompared = comparedCombinations.current.has(combinationKey);
          
          if (isAlreadyViewed || isAlreadyCompared) {
            console.log('🚫 Frontend: Filtering out already seen combination from new pairs:', {
              combinationKey,
              sessionId: pair.sessionId,
              leftPhotoId: pair.leftPhoto.id,
              rightPhotoId: pair.rightPhoto.id,
              reason: isAlreadyCompared ? 'compared' : 'viewed'
            });
          }
          
          return !isAlreadyViewed && !isAlreadyCompared;
        })
        .map(pair => ({
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
        filteredValidPairs: newBufferedPairs.length,
        viewedCombinations: Array.from(viewedCombinations.current),
        comparedCombinations: Array.from(comparedCombinations.current),
        totalBlocked: viewedCombinations.current.size + comparedCombinations.current.size,
        validPairIds: newBufferedPairs.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`)
      });

      setBuffer(prev => {
        // Filter existing buffer to remove any viewed or compared combinations
        const cleanedPrevBuffer = prev.filter(pair => {
          const combinationKey = createCombinationKey(pair);
          const isViewed = viewedCombinations.current.has(combinationKey);
          const isCompared = comparedCombinations.current.has(combinationKey);
          const shouldKeep = !isViewed && !isCompared;
          
          if (!shouldKeep) {
            console.log('🧹 Frontend: Cleaning seen combination from existing buffer:', {
              combinationKey,
              sessionId: pair.sessionId,
              leftPhotoId: pair.leftPhoto.id,
              rightPhotoId: pair.rightPhoto.id,
              reason: isCompared ? 'compared' : 'viewed'
            });
          }
          return shouldKeep;
        });
        
        // If buffer is empty, replace entirely without resetting index initially
        if (cleanedPrevBuffer.length === 0) {
          console.log('🔄 Frontend: Buffer is empty after cleaning, replacing entirely:', {
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
        
        // Otherwise, keep unused pairs and append new ones to the end
        const result = [...cleanedPrevBuffer, ...newBufferedPairs];
        
        // Log state after buffer update
        setTimeout(() => {
          logBufferState('after_refill', {
            cleanedPrevLength: cleanedPrevBuffer.length,
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
  }, [bufferSize, fetchPairs, preloadPairImages, onError, createCombinationKey]);

  // Initial buffer load
  const initializeBuffer = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await refillBuffer();
    } finally {
      setIsLoading(false);
    }
  }, [refillBuffer]);

  // Mark a pair as viewed and save to storage
  const markPairAsViewed = useCallback((pair: PhotoPair) => {
    const combinationKey = createCombinationKey(pair);
    if (!viewedCombinations.current.has(combinationKey)) {
      viewedCombinations.current.add(combinationKey);
      console.log('👀 Frontend: Marking pair as viewed:', {
        combinationKey,
        leftPhotoId: pair.leftPhoto.id,
        rightPhotoId: pair.rightPhoto.id,
        sessionId: pair.sessionId,
        totalViewedCombinations: viewedCombinations.current.size
      });
      
      // Save to storage immediately
      saveStoredCombinations();
      
      // Proactively clean buffer of viewed pairs to prevent duplicates
      setBuffer(prev => {
        const cleanedBuffer = prev.filter(bufferPair => {
          const bufferKey = createCombinationKey(bufferPair);
          const shouldKeep = !viewedCombinations.current.has(bufferKey) && !comparedCombinations.current.has(bufferKey);
          
          if (!shouldKeep) {
            console.log('🧹 Frontend: Proactively removing viewed/compared pair from buffer:', {
              removedCombinationKey: bufferKey,
              sessionId: bufferPair.sessionId,
              leftPhotoId: bufferPair.leftPhoto.id,
              rightPhotoId: bufferPair.rightPhoto.id,
              reason: viewedCombinations.current.has(bufferKey) ? 'viewed' : 'compared'
            });
          }
          
          return shouldKeep;
        });
        
        if (cleanedBuffer.length !== prev.length) {
          console.log('🧹 Frontend: Proactive buffer cleanup completed:', {
            bufferLengthBefore: prev.length,
            bufferLengthAfter: cleanedBuffer.length,
            removedCount: prev.length - cleanedBuffer.length,
            remainingPairIds: cleanedBuffer.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`)
          });
          
          // Adjust current index if needed
          setCurrentIndex(prevIndex => {
            const adjustedIndex = prevIndex >= cleanedBuffer.length ? Math.max(0, cleanedBuffer.length - 1) : prevIndex;
            if (adjustedIndex !== prevIndex) {
              console.log('📍 Frontend: Adjusting index after proactive cleanup:', {
                previousIndex: prevIndex,
                adjustedIndex,
                bufferLengthAfter: cleanedBuffer.length
              });
            }
            return adjustedIndex;
          });
        }
        
        return cleanedBuffer;
      });
    }
  }, [createCombinationKey, saveStoredCombinations]);

  // Get current pair
  const getCurrentPair = useCallback((): PhotoPair | null => {
    if (buffer.length === 0 || currentIndex >= buffer.length) {
      return null;
    }
    
    const pair = buffer[currentIndex];
    
    // Mark this pair as viewed when it becomes current
    if (pair) {
      markPairAsViewed(pair);
    }
    
    return pair;
  }, [buffer, currentIndex, markPairAsViewed]);

  // Advance to next pair
  const advanceToNext = useCallback(async (
    recentPair?: {
      winnerId: string;
      loserId: string;
      winnerType: string;
      loserType: string;
    } | null
  ): Promise<void> => {
    logBufferState('before_advance', { hasRecentPair: !!recentPair, recentPair });
    // Remove the compared pair from buffer immediately after submission
    if (recentPair) {
      const currentPair = getCurrentPair();
      if (currentPair) {
        // Create combination key and add to compared combinations
        const combinationKey = createCombinationKey(currentPair);
        comparedCombinations.current.add(combinationKey);
        
        console.log('🗑️ Frontend: Marking photo combination as compared:', {
          combinationKey,
          leftPhotoId: currentPair.leftPhoto.id,
          rightPhotoId: currentPair.rightPhoto.id,
          sessionId: currentPair.sessionId,
          recentPair,
          bufferLengthBefore: buffer.length,
          currentIndex,
          totalComparedCombinations: comparedCombinations.current.size
        });
        
        setBuffer(prev => {
          // Filter out any pairs with the same photo combination, regardless of session ID
          const updatedBuffer = prev.filter(pair => {
            const pairKey = createCombinationKey(pair);
            const shouldKeep = !comparedCombinations.current.has(pairKey);
            if (!shouldKeep) {
              console.log('🚫 Frontend: Filtering out compared combination:', {
                filteredCombinationKey: pairKey,
                sessionId: pair.sessionId,
                leftPhotoId: pair.leftPhoto.id,
                rightPhotoId: pair.rightPhoto.id
              });
            }
            return shouldKeep;
          });
          
          console.log('🗑️ Frontend: Buffer after filtering compared combinations:', {
            removedCombinationKey: combinationKey,
            bufferLengthBefore: prev.length,
            bufferLengthAfter: updatedBuffer.length,
            remainingPairIds: updatedBuffer.map(p => `${p.leftPhoto.id} vs ${p.rightPhoto.id}`),
            comparedCombinations: Array.from(comparedCombinations.current)
          });
          
          // If buffer becomes empty after removal, need to refill immediately
          if (updatedBuffer.length === 0) {
            console.log('🔄 Frontend: Buffer empty after filtering, triggering immediate refill');
            // Reset index immediately when buffer is empty
            setCurrentIndex(0);
            setTimeout(() => {
              refillBuffer(recentPair).catch(console.error);
            }, 0);
          } else {
            // Check if current index is still valid after removal
            setCurrentIndex(prev => {
              const adjustedIndex = prev >= updatedBuffer.length ? Math.max(0, updatedBuffer.length - 1) : prev;
              console.log('📍 Frontend: Adjusting index after filtering:', {
                previousIndex: prev,
                adjustedIndex,
                bufferLengthAfter: updatedBuffer.length,
                reason: 'ensure_index_within_bounds'
              });
              return adjustedIndex;
            });
            
            // Check if we need to refill buffer after removal
            const remainingAfterRemoval = updatedBuffer.length - currentIndex;
            if (remainingAfterRemoval <= refillThreshold && !isBuffering) {
              // Capture recent pair info in closure to prevent timing issues
              const capturedRecentPair = recentPair;
              console.log('📋 Frontend: Scheduling background refill after filtering:', {
                hasCapturedPair: !!capturedRecentPair,
                capturedPair: capturedRecentPair,
                remainingAfterRemoval,
                refillThreshold
              });
              
              // Refill in background
              setTimeout(() => {
                console.log('⏰ Frontend: Executing background refill after filtering:', {
                  hasCapturedPair: !!capturedRecentPair,
                  capturedPair: capturedRecentPair
                });
                refillBuffer(capturedRecentPair).catch(console.error);
              }, 100);
            }
          }
          
          return updatedBuffer;
        });
        
        // Log state after removal
        setTimeout(() => {
          logBufferState('after_pair_removal', { removedCombinationKey: combinationKey });
        }, 0);
        
        return; // Early return since we handled the pair removal and index adjustment
      }
    }
    
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= buffer.length) {
      // Buffer exhausted, need to refill
      await refillBuffer(recentPair);
      return;
    }

    setCurrentIndex(nextIndex);
    
    // Log state after normal advance
    logBufferState('after_normal_advance', { previousIndex: currentIndex, nextIndex });

    // Check if we need to refill buffer
    const remaining = buffer.length - nextIndex;
    if (remaining <= refillThreshold && !isBuffering) {
      // Capture recent pair info in closure to prevent timing issues
      const capturedRecentPair = recentPair;
      console.log('📋 Frontend: Scheduling background refill with captured pair:', {
        hasCapturedPair: !!capturedRecentPair,
        capturedPair: capturedRecentPair,
        remaining,
        refillThreshold
      });
      
      // Refill in background
      setTimeout(() => {
        console.log('⏰ Frontend: Executing background refill with captured pair:', {
          hasCapturedPair: !!capturedRecentPair,
          capturedPair: capturedRecentPair
        });
        refillBuffer(capturedRecentPair).catch(console.error);
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
  }, [currentIndex, buffer, refillThreshold, isBuffering, refillBuffer, preloadPairImages, createCombinationKey, getCurrentPair]);

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