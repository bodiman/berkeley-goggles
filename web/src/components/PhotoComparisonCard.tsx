import React, { useState, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';

interface Photo {
  id: string;
  url: string;
  userId: string;
  age?: number;
}

interface PhotoComparisonCardProps {
  leftPhoto: Photo;
  rightPhoto: Photo;
  onSelection: (winnerId: string, loserId: string) => void;
  onSkip: () => void;
  className?: string;
  disabled?: boolean;
}

export const PhotoComparisonCard: React.FC<PhotoComparisonCardProps> = ({
  leftPhoto,
  rightPhoto,
  onSelection,
  onSkip,
  className = '',
  disabled = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);

  // Spring animation for the card
  const [{ x, y, rotateZ, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateZ: 0,
    opacity: 1,
    config: { tension: 200, friction: 20 },
  }));

  const handleSelection = useCallback((winner: Photo, loser: Photo) => {
    if (isAnimating || disabled) return;
    
    setIsAnimating(true);
    onSelection(winner.id, loser.id);
    
    // Reset animation after a brief delay
    setTimeout(() => {
      api.start({ x: 0, y: 0, rotateZ: 0, opacity: 1 });
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  }, [isAnimating, disabled, onSelection, api]);

  const handleSkip = useCallback(() => {
    if (isAnimating || disabled) return;
    
    setIsAnimating(true);
    onSkip();
    
    setTimeout(() => {
      api.start({ x: 0, y: 0, rotateZ: 0, opacity: 1 });
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  }, [isAnimating, disabled, onSkip, api]);

  // Drag gesture handler
  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [xDir], velocity: [vx, vy] }) => {
      if (disabled) return;
      
      // Determine swipe direction
      const isSwipeLeft = mx < -50;
      const isSwipeRight = mx > 50;
      const isSwipeUp = my < -50;
      
      if (active) {
        // Update visual feedback during drag
        setSwipeDirection(
          isSwipeUp ? 'up' : 
          isSwipeLeft ? 'left' : 
          isSwipeRight ? 'right' : 
          null
        );
        
        // Apply drag transformation
        api.start({
          x: mx,
          y: my,
          rotateZ: mx / 10, // Slight rotation based on horizontal movement
          opacity: 1 - Math.abs(mx) / 200,
          immediate: true,
        });
      } else {
        setSwipeDirection(null);
        
        // Check if swipe threshold is met
        const threshold = 80;
        const velocityThreshold = 0.5;
        
        if (my < -threshold && vy < -velocityThreshold) {
          // Swipe up to skip
          api.start({ 
            y: -window.innerHeight, 
            opacity: 0,
            config: { tension: 200, friction: 20 }
          });
          handleSkip();
        } else if (mx < -threshold || (vx < -velocityThreshold && mx < -30)) {
          // Swipe left - left photo wins
          api.start({ 
            x: -window.innerWidth, 
            rotateZ: -30, 
            opacity: 0,
            config: { tension: 200, friction: 20 }
          });
          handleSelection(leftPhoto, rightPhoto);
        } else if (mx > threshold || (vx > velocityThreshold && mx > 30)) {
          // Swipe right - right photo wins
          api.start({ 
            x: window.innerWidth, 
            rotateZ: 30, 
            opacity: 0,
            config: { tension: 200, friction: 20 }
          });
          handleSelection(rightPhoto, leftPhoto);
        } else {
          // Snap back to center
          api.start({ x: 0, y: 0, rotateZ: 0, opacity: 1 });
        }
      }
    },
    {
      filterTaps: true,
      preventDefaultCondition: () => true,
    }
  );

  const handleDirectSelection = (winner: Photo, loser: Photo) => {
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    handleSelection(winner, loser);
  };

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          rotateZ: rotateZ.to(r => `${r}deg`),
          opacity,
        }}
        className="photo-card w-full h-[70vh] cursor-grab active:cursor-grabbing gpu-accelerated"
      >
        <div className="flex h-full gap-2 p-4">
          {/* Left Photo */}
          <button
            onClick={() => handleDirectSelection(leftPhoto, rightPhoto)}
            className="flex-1 relative overflow-hidden rounded-xl touch-target prevent-zoom"
            disabled={isAnimating || disabled}
          >
            <img 
              src={leftPhoto.url} 
              alt="Comparison option A"
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
            
            {/* Photo Label */}
            <div className="absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
            
            {/* Swipe Direction Overlay */}
            {swipeDirection === 'left' && (
              <div className="swipe-overlay active">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  ← WINNER
                </div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="w-0.5 bg-gray-700 mx-1" />

          {/* Right Photo */}
          <button
            onClick={() => handleDirectSelection(rightPhoto, leftPhoto)}
            className="flex-1 relative overflow-hidden rounded-xl touch-target prevent-zoom"
            disabled={isAnimating || disabled}
          >
            <img 
              src={rightPhoto.url} 
              alt="Comparison option B"
              className="w-full h-full object-cover"
              loading="eager"
              draggable={false}
            />
            
            {/* Photo Label */}
            <div className="absolute top-3 right-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              B
            </div>
            
            {/* Swipe Direction Overlay */}
            {swipeDirection === 'right' && (
              <div className="swipe-overlay active">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  WINNER →
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Skip Overlay */}
        {swipeDirection === 'up' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              ↑ SKIP
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-white font-semibold mb-1">
              Tap or swipe to choose who is more attractive
            </p>
            <p className="text-gray-400 text-sm">
              Swipe up to skip • Be honest or you gonna get matched with some chuzz
            </p>
          </div>
        </div>
      </animated.div>
    </div>
  );
};