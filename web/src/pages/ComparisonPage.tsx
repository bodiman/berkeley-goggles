import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PhotoComparisonCard } from '../components/PhotoComparisonCard';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import { useImageBuffer } from '../hooks/useImageBuffer';

// PhotoPair interface now imported from useImageBuffer hook

interface DailyProgress {
  comparisonsCompleted: number;
  comparisonsSkipped: number;
  dailyTarget: number;
  progress: number;
  streak: number;
  isTargetReached: boolean;
}

export const ComparisonPage: React.FC = () => {
  const { user } = useAuth();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recentlySubmittedPair, setRecentlySubmittedPair] = useState<{
    winnerId: string;
    loserId: string;
    winnerType: string;
    loserType: string;
  } | null>(null);
  
  // Use ref to reliably store recent pair info for animation completion
  const pendingSubmittedPairRef = useRef<{
    winnerId: string;
    loserId: string;
    winnerType: string;
    loserType: string;
  } | null>(null);
  
  // Initialize image buffer hook
  const {
    getCurrentPair,
    advanceToNext,
    initializeBuffer,
    isLoading,
    isBuffering,
    isCurrentPairReady,
    bufferStats
  } = useImageBuffer({
    bufferSize: 10,
    refillThreshold: 3,
    userId: user?.id || '',
    recentlySubmittedPair,
    onError: setError
  });
  
  const currentPair = getCurrentPair();
  
  
  // Control card visibility - only show when we have a pair, not transitioning, and images are ready
  const shouldShowCard = Boolean(currentPair && !isTransitioning && isCurrentPairReady());

  // Handle animation completion - card has finished swiping off screen
  const handleAnimationComplete = useCallback(async (submittedPairInfo?: {
    winnerId: string;
    loserId: string;
    winnerType: string;
    loserType: string;
  } | null) => {
    setIsTransitioning(true);
    
    // Move to next pair in buffer, passing recent pair info for immediate exclusion
    await advanceToNext(submittedPairInfo);
    
    // Card will automatically show again when new images are ready
    // via the shouldShowCard computed value and useEffect below
  }, [advanceToNext]);

  // Fetch initial data on component mount
  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id]);

  // Reset transition state when new pair is ready
  useEffect(() => {
    const hasCurrentPair = !!currentPair;
    const pairReady = isCurrentPairReady();
    const shouldReset = isTransitioning && hasCurrentPair && pairReady;
    
    
    if (shouldReset) {
      console.log('✅ Resetting isTransitioning to false');
      setIsTransitioning(false);
    } else if (isTransitioning) {

    }
  }, [isTransitioning, currentPair, isCurrentPairReady]);

  // Prevent body scroll on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      await Promise.all([
        initializeBuffer(),
        fetchDailyProgress(),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load comparison data');
    }
  };

  // fetchNextPair is now handled by the buffer hook

  const fetchDailyProgress = async () => {
    if (!user?.id) return;

    try {
      const response = await apiRequest(`/api/comparisons/daily-progress?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDailyProgress(data.progress);
      } else {
        console.error('Failed to get daily progress:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch daily progress:', error);
    }
  };

  const handleSelection = async (winnerId: string, loserId: string) => {
    if (isSubmitting || !currentPair || !user?.id) return;

    try {
      setIsSubmitting(true);

      // Check if this is a challenge battle
      if (currentPair.isChallenge && currentPair.challengeId) {
        // Submit vote via challenge endpoint
        const response = await apiRequest('/api/challenges/vote', {
          method: 'POST',
          body: JSON.stringify({
            challengeId: currentPair.challengeId,
            voterId: user.id,
            chosenUserId: winnerId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log('⚔️ Challenge vote submitted:', {
            challengeId: currentPair.challengeId,
            winner: winnerId,
            totalVotes: data.totalVotes
          });

          // Add haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate([50, 100, 50]); // Different pattern for challenges
          }
        } else {
          // Don't show error for "already voted" since it's a valid state
          if (!data.error?.includes('Already voted')) {
            setError(data.error || 'Failed to submit challenge vote');
          }
        }
      } else {
        // Regular comparison submission
        // Determine winner and loser types
        const winner = winnerId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;
        const loser = loserId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;

        const response = await apiRequest('/api/comparisons/submit', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: currentPair.sessionId,
            winnerId: winnerId,
            loserId: loserId,
            winnerType: winner.type,
            loserType: loser.type,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Create recent pair info for immediate exclusion
          const submittedPairInfo = {
            winnerId: winnerId,
            loserId: loserId,
            winnerType: winner.type,
            loserType: loser.type,
          };

          // IMMEDIATELY store in ref for reliable access in animation completion (before any async operations)
          pendingSubmittedPairRef.current = submittedPairInfo;

          // Store for future use (fallback)
          setRecentlySubmittedPair(submittedPairInfo);

          // Add haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
          }

          // Update progress (pair advancement will happen in animation completion with exclusion info)
          await fetchDailyProgress();
        } else {
          setError(data.error || 'Failed to submit comparison');
        }
      }
    } catch (error) {
      console.error('Failed to submit comparison:', error);
      setError('Failed to submit comparison');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{
        background: '#4A90E2', // Solid blueish-yellow background
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="drop-shadow-lg" style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}>Loading photos...</p>
          <p className="text-white/80 text-sm mt-2 drop-shadow" style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}>Preparing buffer...</p>
        </div>
      </div>
    );
  }


  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 safe-area-inset">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <button 
            onClick={loadInitialData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading if still preparing data
  if (!currentPair && (isBuffering || !isCurrentPairReady())) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center safe-area-inset">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Preparing next pair...</p>
          <p className="text-gray-400 text-sm mt-2">
            {isBuffering ? 'Loading new pairs...' : 'Loading images...'}
          </p>
        </div>
      </div>
    );
  }

  // No pairs available (only show this when genuinely done)
  if (!currentPair) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 safe-area-inset">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">All Done!</h1>
          <p className="text-xl text-blue-400 mb-4">
            {dailyProgress?.comparisonsCompleted || 0} comparisons completed today
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you for helping improve our ranking algorithm! 
            Your honest feedback makes our system better for everyone.
          </p>
          <button 
            onClick={loadInitialData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{
      background: '#4A90E2', // Solid blueish-yellow background
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100dvh',
    }}>
      {/* Header */}
      <header className="px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Berkeley Goggles</h1>
          <div className="text-sm text-gray-400">
            {dailyProgress?.comparisonsCompleted || 0}/{dailyProgress?.dailyTarget || 20} today
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${dailyProgress?.progress || 0}%` }}
          />
        </div>
        
        {/* Streak & Buffer Status */}
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center">
            <span className="text-orange-500 mr-2">🔥</span>
            <span className="text-white font-medium">{dailyProgress?.streak || 0} day streak</span>
          </div>
          
          {/* Buffer Status */}
          <div className="flex items-center text-xs text-gray-500">
            {isBuffering && <span className="mr-2">⏳ Loading...</span>}
            <span>{bufferStats.remaining} pairs ready</span>
            {!isCurrentPairReady() && (
              <span className="ml-2 text-yellow-500">📷</span>
            )}
          </div>
        </div>
      </header>

      {/* Challenge Banner */}
      {currentPair?.isChallenge && (
        <div className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center space-x-2 shadow-lg">
          <span className="text-2xl">⚔️</span>
          <span className="text-white font-black italic uppercase tracking-wider drop-shadow-md">
            Mog Battle
          </span>
          <span className="text-2xl">⚔️</span>
        </div>
      )}

      {/* Main Comparison Area */}
      <main className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        {currentPair ? (
          <PhotoComparisonCard
            topPhoto={{
              id: currentPair.leftPhoto.id,
              url: currentPair.leftPhoto.url.startsWith('http') 
                ? currentPair.leftPhoto.url 
                : `http://localhost:3001/api/user/photo/${currentPair.leftPhoto.url.split('/').pop()}`,
              userId: currentPair.leftPhoto.userId,
              age: currentPair.leftPhoto.userAge,
              gender: currentPair.leftPhoto.userGender as 'male' | 'female',
              bio: currentPair.leftPhoto.bio,
              type: currentPair.leftPhoto.type,
            }}
            bottomPhoto={{
              id: currentPair.rightPhoto.id,
              url: currentPair.rightPhoto.url.startsWith('http') 
                ? currentPair.rightPhoto.url 
                : `http://localhost:3001/api/user/photo/${currentPair.rightPhoto.url.split('/').pop()}`,
              userId: currentPair.rightPhoto.userId,
              age: currentPair.rightPhoto.userAge,
              gender: currentPair.rightPhoto.userGender as 'male' | 'female',
              bio: currentPair.rightPhoto.bio,
              type: currentPair.rightPhoto.type,
            }}
            onSelection={handleSelection}
            className="fade-up"
            disabled={isSubmitting}
            shouldShowCard={shouldShowCard}
            bufferStats={bufferStats}
            onAnimationComplete={() => {
              // Retrieve submitted pair info from ref and pass to handler
              const submittedPairInfo = pendingSubmittedPairRef.current;

              // Clear the pending info
              pendingSubmittedPairRef.current = null;
              // Call handler with the info
              handleAnimationComplete(submittedPairInfo);
            }}
          />
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading next pair rn {bufferStats.current}</p>
          </div>
        )}
      </main>

      {/* Footer Tips */}
      <footer className="px-6 py-4 flex-shrink-0">
        <div className="text-center">
          {/* <p className="text-xs text-gray-500 mb-2">
            💡 Pro tip: Be honest or we match you with chuzz
          </p> */}
          <div className="flex justify-center space-x-6 text-xs text-gray-600">
            <span>↔️ Swipe left/right to skip</span>
            <span>👆 Double tap to select</span>
          </div>
        </div>
      </footer>
    </div>
  );
};