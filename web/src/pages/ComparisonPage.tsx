import React, { useState, useEffect } from 'react';
import { PhotoComparisonCard } from '../components/PhotoComparisonCard';
import { useAuth } from '../contexts/AuthContext';

interface PhotoPair {
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
  const [currentPair, setCurrentPair] = useState<PhotoPair | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data on component mount
  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id]);

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
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchNextPair(),
        fetchDailyProgress(),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load comparison data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPair = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/comparisons/next-pair?userId=${user.id}`);
      console.log('response', response);
      const data = await response.json();
      
      if (data.success) {
        setCurrentPair(data.pair);
      } else {
        setError(data.error || 'Failed to get photo pair');
      }
    } catch (error) {
      console.error('Failed to fetch next pair:', error);
      setError('Failed to fetch photo pair');
    }
  };

  const fetchDailyProgress = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/comparisons/daily-progress?userId=${user.id}`);
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
      
      // Determine winner and loser types
      const winner = winnerId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;
      const loser = loserId === currentPair.leftPhoto.id ? currentPair.leftPhoto : currentPair.rightPhoto;
      
      const response = await fetch('/api/comparisons/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Add haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }
        
        // Fetch next pair and update progress
        await Promise.all([
          fetchNextPair(),
          fetchDailyProgress(),
        ]);
        
        // Daily goal completion handled by UI indicators (progress bar, etc.)
      } else {
        setError(data.error || 'Failed to submit comparison');
      }
    } catch (error) {
      console.error('Failed to submit comparison:', error);
      setError('Failed to submit comparison');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (isSubmitting || !currentPair || !user?.id) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/comparisons/skip-pair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentPair.sessionId,
          userId: user.id,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Light haptic feedback for skip
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
        
        // Fetch next pair and update progress
        await Promise.all([
          fetchNextPair(),
          fetchDailyProgress(),
        ]);
      } else {
        setError(data.error || 'Failed to skip comparison');
      }
    } catch (error) {
      console.error('Failed to skip comparison:', error);
      setError('Failed to skip comparison');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center safe-area-inset">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading photos...</p>
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

  // No pairs available
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
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
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
        
        {/* Streak */}
        <div className="flex items-center justify-center mt-3 text-sm">
          <span className="text-orange-500 mr-2">🔥</span>
          <span className="text-white font-medium">{dailyProgress?.streak || 0} day streak</span>
        </div>
      </header>

      {/* Main Comparison Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <PhotoComparisonCard
          topPhoto={{
            id: currentPair.leftPhoto.id,
            url: currentPair.leftPhoto.url.startsWith('http') 
              ? currentPair.leftPhoto.url 
              : `http://localhost:3001/api/user/photo/${currentPair.leftPhoto.url.split('/').pop()}`,
            userId: currentPair.leftPhoto.userId,
            age: currentPair.leftPhoto.userAge,
            type: currentPair.leftPhoto.type,
          }}
          bottomPhoto={{
            id: currentPair.rightPhoto.id,
            url: currentPair.rightPhoto.url.startsWith('http') 
              ? currentPair.rightPhoto.url 
              : `http://localhost:3001/api/user/photo/${currentPair.rightPhoto.url.split('/').pop()}`,
            userId: currentPair.rightPhoto.userId,
            age: currentPair.rightPhoto.userAge,
            type: currentPair.rightPhoto.type,
          }}
          onSelection={handleSelection}
          onSkip={handleSkip}
          className="fade-up"
          disabled={isSubmitting}
        />
      </main>

      {/* Footer Tips */}
      <footer className="px-6 py-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            💡 Pro tip: Be honest in your ratings to help everyone get accurate feedback
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-600">
            <span>👆 Tap to select</span>
            <span>↕️ Swipe up/down</span>
            <span>↔️ Swipe left/right to skip</span>
          </div>
        </div>
      </footer>
    </div>
  );
};