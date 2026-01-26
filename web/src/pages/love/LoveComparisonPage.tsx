import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PhotoComparisonCard } from '../../components/PhotoComparisonCard';
import { apiRequest } from '../../config/api';
import type { PhotoPair } from '../../hooks/useImageBuffer';

interface LoveComparisonPageProps {
  userId: string;
  onComplete: () => void;
  isContinueRanking?: boolean;
}

interface LoveStatus {
  comparisonsCompleted: number;
  comparisonsRequired: number;
  onboardingComplete: boolean;
  progress: number;
}

export const LoveComparisonPage: React.FC<LoveComparisonPageProps> = ({
  userId,
  onComplete,
  isContinueRanking = false,
}) => {
  const [currentPair, setCurrentPair] = useState<PhotoPair | null>(null);
  const [status, setStatus] = useState<LoveStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [pairBuffer, setPairBuffer] = useState<PhotoPair[]>([]);

  const pendingSubmittedPairRef = useRef<{
    winnerId: string;
    loserId: string;
    winnerType: string;
    loserType: string;
  } | null>(null);

  // Preload images for a pair
  const preloadImages = useCallback(async (pair: PhotoPair): Promise<boolean> => {
    const urls = [pair.leftPhoto.url, pair.rightPhoto.url];

    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });
    };

    try {
      await Promise.all(urls.map(loadImage));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Fetch status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await apiRequest(`/api/love/status/${userId}`);
      const data = await response.json();

      if (data.success) {
        setStatus(data.status);

        // Check if onboarding is complete (skip redirect when continuing to rank)
        if (data.status.onboardingComplete && !isContinueRanking) {
          onComplete();
        }
      }
    } catch (err) {
      console.error('Failed to fetch love status:', err);
    }
  }, [userId, onComplete, isContinueRanking]);

  // Fetch next pair
  const fetchPairs = useCallback(async (count: number = 3) => {
    try {
      const params = new URLSearchParams({
        userId,
        source: 'love',
        buffer: String(count),
      });

      const response = await apiRequest(`/api/comparisons/next-pair?${params}`);
      const data = await response.json();

      if (data.success) {
        // Handle buffer format
        if (data.pairs && Array.isArray(data.pairs)) {
          return data.pairs as PhotoPair[];
        } else if (data.pair) {
          return [data.pair as PhotoPair];
        }
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch pairs:', err);
      setError('Failed to load photos. Please try again.');
      return [];
    }
  }, [userId]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchStatus();

      const pairs = await fetchPairs(5);
      if (pairs.length > 0) {
        setPairBuffer(pairs.slice(1));
        setCurrentPair(pairs[0]);
        const ready = await preloadImages(pairs[0]);
        setImagesReady(ready);
      }
      setIsLoading(false);
    };

    init();
  }, [fetchStatus, fetchPairs, preloadImages]);

  // Handle selection
  const handleSelection = async (winnerId: string, loserId: string) => {
    if (isSubmitting || !currentPair) return;

    setIsSubmitting(true);

    try {
      const winner = winnerId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;
      const loser = loserId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;

      const response = await apiRequest('/api/comparisons/submit', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: currentPair.sessionId,
          winnerId,
          loserId,
          winnerType: winner.type,
          loserType: loser.type,
          userId,
          source: 'love',
        }),
      });

      const data = await response.json();

      if (data.success) {
        pendingSubmittedPairRef.current = {
          winnerId,
          loserId,
          winnerType: winner.type,
          loserType: loser.type,
        };

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }

        // Update status
        await fetchStatus();
      } else {
        setError(data.error || 'Failed to submit comparison');
      }
    } catch (err) {
      console.error('Failed to submit comparison:', err);
      setError('Failed to submit comparison');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle animation complete
  const handleAnimationComplete = useCallback(async () => {
    setIsTransitioning(true);
    setImagesReady(false);
    pendingSubmittedPairRef.current = null;

    // Get next pair from buffer
    if (pairBuffer.length > 0) {
      const nextPair = pairBuffer[0];
      const remainingBuffer = pairBuffer.slice(1);

      setCurrentPair(nextPair);
      setPairBuffer(remainingBuffer);

      const ready = await preloadImages(nextPair);
      setImagesReady(ready);

      // Refill buffer if low
      if (remainingBuffer.length < 2) {
        const newPairs = await fetchPairs(3);
        setPairBuffer(prev => [...prev, ...newPairs]);
      }
    } else {
      // Buffer empty, fetch more
      const pairs = await fetchPairs(3);
      if (pairs.length > 0) {
        setCurrentPair(pairs[0]);
        setPairBuffer(pairs.slice(1));
        const ready = await preloadImages(pairs[0]);
        setImagesReady(ready);
      } else {
        setCurrentPair(null);
      }
    }

    setIsTransitioning(false);
  }, [pairBuffer, fetchPairs, preloadImages]);

  const shouldShowCard = Boolean(currentPair && !isTransitioning && imagesReady);

  // Reset transition when images ready
  useEffect(() => {
    if (isTransitioning && currentPair && imagesReady) {
      setIsTransitioning(false);
    }
  }, [isTransitioning, currentPair, imagesReady]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading photos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-white/80 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No pairs available
  if (!currentPair && !isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">💕</div>
          <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-white/90 text-lg mb-2">
            {status?.comparisonsCompleted || 0} / {status?.comparisonsRequired || 25} comparisons
          </p>
          <p className="text-white/70 mb-8">
            Check back soon for more photos!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden h-full absolute inset-0" style={{
      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    }}>
      {/* Header */}
      <header className="pt-safe px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-black italic uppercase tracking-tight text-white drop-shadow-lg">
            Love<span className="text-pink-200">@Berkeley</span>
          </h1>
          <div className="text-sm text-white font-bold bg-white/20 px-3 py-1 rounded-full">
            {status?.comparisonsCompleted || 0} / {status?.comparisonsRequired || 25}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${status?.progress || 0}%` }}
          />
        </div>
      </header>

      {/* Main Comparison Area */}
      <main className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        {currentPair ? (
          <PhotoComparisonCard
            topPhoto={{
              id: currentPair.leftPhoto.id,
              url: currentPair.leftPhoto.url,
              userId: currentPair.leftPhoto.userId,
              name: currentPair.leftPhoto.name,
              age: currentPair.leftPhoto.userAge,
              gender: currentPair.leftPhoto.userGender as 'male' | 'female',
              bio: currentPair.leftPhoto.bio,
              type: currentPair.leftPhoto.type,
            }}
            bottomPhoto={{
              id: currentPair.rightPhoto.id,
              url: currentPair.rightPhoto.url,
              userId: currentPair.rightPhoto.userId,
              name: currentPair.rightPhoto.name,
              age: currentPair.rightPhoto.userAge,
              gender: currentPair.rightPhoto.userGender as 'male' | 'female',
              bio: currentPair.rightPhoto.bio,
              type: currentPair.rightPhoto.type,
            }}
            onSelection={handleSelection}
            className="fade-up"
            disabled={isSubmitting}
            shouldShowCard={shouldShowCard}
            bufferStats={{
              total: pairBuffer.length + 1,
              current: 1,
              remaining: pairBuffer.length,
              preloadedCount: pairBuffer.length,
            }}
            onAnimationComplete={handleAnimationComplete}
            hideOverlayText={true}
          />
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading next pair...</p>
          </div>
        )}
      </main>

      {/* Footer Tips */}
      <footer className="px-6 py-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium mb-2">
            Help us understand your type by swiping or double tapping towards the image you prefer
          </p>
          <div className="flex justify-center space-x-6 text-xs text-white/60">
            <span>Swipe up/down to choose</span>
            <span>Double tap to select</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
