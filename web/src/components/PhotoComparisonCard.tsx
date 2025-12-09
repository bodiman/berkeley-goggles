import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';

interface Photo {
  id: string;
  url: string;
  userId: string;
  age?: number;
  type?: 'user' | 'sample';
}

interface PhotoComparisonCardProps {
  topPhoto: Photo;
  bottomPhoto: Photo;
  onSelection: (winnerId: string, loserId: string) => void;
  onSkip: () => void;
  className?: string;
  disabled?: boolean;
  shouldShowCard?: boolean;
  onAnimationComplete?: () => void;
}

export interface PhotoComparisonCardRef {
  swipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export const PhotoComparisonCard = forwardRef<PhotoComparisonCardRef, PhotoComparisonCardProps>(({
  topPhoto,
  bottomPhoto,
  onSelection,
  onSkip,
  className = '',
  disabled = false,
  shouldShowCard = true,
  onAnimationComplete,
}, ref) => {
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  
  // Ref for programmatic swiping
  const cardRef = useRef<any>();

  // Expose swipe method to parent
  useImperativeHandle(ref, () => ({
    swipe: (direction: 'left' | 'right' | 'up' | 'down') => {
      if (cardRef.current) {
        cardRef.current.swipe(direction);
      }
    }
  }));

  // Handle swipe completion
  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (disabled) return;

    console.log('Swiped:', direction);

    switch (direction) {
      case 'up':
        // Top photo wins
        onSelection(topPhoto.id, bottomPhoto.id);
        break;
      case 'down':
        // Bottom photo wins
        onSelection(bottomPhoto.id, topPhoto.id);
        break;
      case 'left':
      case 'right':
        // Skip
        onSkip();
        break;
    }
  }, [disabled, onSelection, onSkip, topPhoto.id, bottomPhoto.id]);

  // Handle card leaving screen
  const handleCardLeftScreen = useCallback(() => {
    console.log('Card left screen');
    setIsVisible(false);
    
    // Notify parent that animation completed
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  // Handle swipe requirement changes for visual feedback
  const handleSwipeRequirementFulfilled = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    setSwipeDirection(direction);
  }, []);

  const handleSwipeRequirementUnfulfilled = useCallback(() => {
    setSwipeDirection(null);
  }, []);

  // Reset visibility when shouldShowCard becomes true
  useEffect(() => {
    if (shouldShowCard) {
      setIsVisible(true);
      setSwipeDirection(null);
    }
  }, [shouldShowCard]);

  // Handle direct tap selection
  const handleDirectSelection = useCallback((winner: Photo, loser: Photo) => {
    if (disabled) return;

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    onSelection(winner.id, loser.id);
  }, [disabled, onSelection]);

  // Control card visibility - hide if shouldShowCard is false
  if (!shouldShowCard || !isVisible) {
    return (
      <div className={`relative w-full max-w-md mx-auto ${className}`}>
        <div className="w-full h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading next pair...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <TinderCard
        ref={cardRef}
        onSwipe={handleSwipe}
        onCardLeftScreen={handleCardLeftScreen}
        onSwipeRequirementFulfilled={handleSwipeRequirementFulfilled}
        onSwipeRequirementUnfulfilled={handleSwipeRequirementUnfulfilled}
        preventSwipe={disabled ? ['up', 'down', 'left', 'right'] : []}
        swipeRequirementType="position"
        swipeThreshold={80}
        className="w-full h-[70vh] cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col h-full gap-2 p-4 bg-gray-900 rounded-xl shadow-2xl">
          {/* Top Photo */}
          <button
            onClick={() => handleDirectSelection(topPhoto, bottomPhoto)}
            className="flex-1 relative overflow-hidden rounded-xl touch-target prevent-zoom"
            disabled={disabled}
          >
            <img 
              src={topPhoto.url} 
              alt="Comparison option A"
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
            
            {/* Photo Label */}
            <div className="absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
            
            {/* Sample Photo Indicator */}
            {topPhoto.type === 'sample' && (
              <div className="absolute top-3 left-12 bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                Sample
              </div>
            )}
            
            {/* Swipe Direction Overlay */}
            {swipeDirection === 'up' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  ↑ WINNER
                </div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="h-0.5 bg-gray-700 my-1" />

          {/* Bottom Photo */}
          <button
            onClick={() => handleDirectSelection(bottomPhoto, topPhoto)}
            className="flex-1 relative overflow-hidden rounded-xl touch-target prevent-zoom"
            disabled={disabled}
          >
            <img 
              src={bottomPhoto.url} 
              alt="Comparison option B"
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
            
            {/* Photo Label */}
            <div className="absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              B
            </div>
            
            {/* Sample Photo Indicator */}
            {bottomPhoto.type === 'sample' && (
              <div className="absolute top-3 left-12 bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium">
                Sample
              </div>
            )}
            
            {/* Swipe Direction Overlay */}
            {swipeDirection === 'down' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  ↓ WINNER
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Skip Overlay */}
        {(swipeDirection === 'left' || swipeDirection === 'right') && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              ← SKIP →
            </div>
          </div>
        )}

        {/* Instructions */}
        {showInstructions && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center relative">
              {/* Close button */}
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-2 right-2 w-6 h-6 bg-gray-600/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                aria-label="Close instructions"
              >
                ×
              </button>
              
              <p className="text-white font-semibold mb-1">
                Tap or swipe to choose who is more attractive
              </p>
              <p className="text-gray-400 text-sm">
                Swipe up/down to choose • Swipe left/right to skip
              </p>
            </div>
          </div>
        )}
      </TinderCard>
    </div>
  );
});