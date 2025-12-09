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
  onError
}: UseImageBufferOptions) => {
  const [buffer, setBuffer] = useState<BufferedPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const imageCache = useRef<ImageCache>({});
  const isFetching = useRef(false);

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

  // Fetch pairs from API
  const fetchPairs = useCallback(async (requestedBufferSize: number): Promise<PhotoPair[]> => {
    try {
      // Import apiRequest dynamically to avoid circular dependencies
      const { apiRequest } = await import('../config/api');
      
      const response = await apiRequest(
        `/api/comparisons/next-pair?userId=${userId}&buffer=${requestedBufferSize}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch pairs');
      }

      // Handle both single pair and multiple pairs response format
      if (data.pairs && Array.isArray(data.pairs)) {
        return data.pairs;
      } else if (data.pair) {
        return [data.pair];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch pairs:', error);
      throw error;
    }
  }, [userId]);

  // Refill buffer with new pairs
  const refillBuffer = useCallback(async (): Promise<void> => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setIsBuffering(true);

    try {
      const newPairs = await fetchPairs(bufferSize);
      
      if (newPairs.length === 0) {
        onError?.('No more pairs available');
        return;
      }

      // Convert to buffered pairs
      const newBufferedPairs: BufferedPair[] = newPairs.map(pair => ({
        ...pair,
        preloaded: false
      }));

      setBuffer(prev => {
        // If buffer is empty, replace entirely
        if (prev.length === 0) {
          setCurrentIndex(0);
          return newBufferedPairs;
        }
        
        // Otherwise, keep unused pairs and append new ones to the end
        return [...prev, ...newBufferedPairs];
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

  // Advance to next pair
  const advanceToNext = useCallback(async (): Promise<void> => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex >= buffer.length) {
      // Buffer exhausted, need to refill
      await refillBuffer();
      return;
    }

    setCurrentIndex(nextIndex);

    // Check if we need to refill buffer
    const remaining = buffer.length - nextIndex;
    if (remaining <= refillThreshold && !isBuffering) {
      // Refill in background
      setTimeout(() => {
        refillBuffer().catch(console.error);
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

  // Get current pair
  const getCurrentPair = useCallback((): PhotoPair | null => {
    if (buffer.length === 0 || currentIndex >= buffer.length) {
      return null;
    }
    return buffer[currentIndex];
  }, [buffer, currentIndex]);

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