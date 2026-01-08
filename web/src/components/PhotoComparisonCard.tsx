import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import TinderCard from './TinderCard';
import type { DragState, TinderCardRef } from './TinderCard';

interface Photo {
  id: string;
  url: string;
  userId: string;
  age?: number;
  height?: number; // Height in inches (for males)
  weight?: number; // Weight in pounds (for females)
  gender?: 'male' | 'female';
  bio?: string;
  type?: 'user' | 'sample';
}

interface PhotoComparisonCardProps {
  topPhoto: Photo;
  bottomPhoto: Photo;
  onSelection: (winnerId: string, loserId: string) => void;
  onSkip?: () => void;
  className?: string;
  disabled?: boolean;
  shouldShowCard?: boolean;
  onAnimationComplete?: () => void;
  bufferStats?: {
    total: number;
    current: number;
    remaining: number;
    preloadedCount: number;
  };
}

export interface PhotoComparisonCardRef {
  swipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

// Helper function to format height from inches to feet'inches"
const formatHeight = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

export const PhotoComparisonCard = forwardRef<PhotoComparisonCardRef, PhotoComparisonCardProps>(({
  topPhoto,
  bottomPhoto,
  onSelection,
  className = '',
  disabled = false,
  shouldShowCard = true,
  onAnimationComplete,
  bufferStats,
}, ref) => {
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Immediate state tracking for instructions (to prevent timing issues)
  const instructionsVisibleRef = useRef(true);
  
  // First load tracking to show hints/instructions only on initial page load
  const isFirstLoadRef = useRef(true);
  
  // Selection cooldown to prevent rapid state changes
  const cooldownActiveRef = useRef(false);
  const cooldownTimerRef = useRef<number | null>(null);
  
  // Swipe tracking state for MOGS overlay
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  
  // Inactivity hint system
  const [showHints, setShowHints] = useState(false);
  const showHintsRef = useRef(false);
  const inactivityTimerRef = useRef<number | null>(null);
  
  // Ref for programmatic swiping
  const cardRef = useRef<TinderCardRef>(null);

  // Expose swipe method to parent
  useImperativeHandle(ref, () => ({
    swipe: (direction: 'left' | 'right' | 'up' | 'down') => {
      if (cardRef.current) {
        cardRef.current.swipe(direction);
      }
    }
  }));

  // Timer management functions
  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    inactivityTimerRef.current = window.setTimeout(() => {
      console.log('⏰ Inactivity timer fired - showing hints and updating ref');
      setShowHints(true);
      showHintsRef.current = true; // Update ref immediately
    }, 5000); // 5 seconds
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    console.log('🔄 resetInactivityTimer - starting new timer (hints will be hidden after interaction)');
    // Don't hide hints immediately - let the interaction handlers check the current state first
    startInactivityTimer();
  }, [startInactivityTimer]);

  // Function to hide hints after interaction is processed
  const hideHintsAfterInteraction = useCallback(() => {
    console.log('🔄 hideHintsAfterInteraction - hiding hints and updating ref');
    setShowHints(false);
    showHintsRef.current = false;
  }, []);

  // Cooldown timer management
  const startSelectionCooldown = useCallback(() => {
    cooldownActiveRef.current = true;
    if (cooldownTimerRef.current) {
      window.clearTimeout(cooldownTimerRef.current);
    }
    cooldownTimerRef.current = window.setTimeout(() => {
      cooldownActiveRef.current = false;
      cooldownTimerRef.current = null;
    }, 200); // 200ms cooldown
  }, []);

  // Helper to dismiss instructions with proper state tracking
  const dismissInstructions = useCallback(() => {
    console.log('📋 Dismissing instructions');
    instructionsVisibleRef.current = false;
    setShowInstructions(false);
    startSelectionCooldown();
  }, [startSelectionCooldown]);


  // Unified dismissal function for any visible UI elements
  const dismissVisibleElements = useCallback(() => {
    console.log('👋 Dismissing visible elements - instructions:', instructionsVisibleRef.current, 'hints:', showHintsRef.current);
    
    const hadVisibleElements = instructionsVisibleRef.current || showHintsRef.current;
    
    // Start cooldown IMMEDIATELY if any elements were visible
    if (hadVisibleElements) {
      cooldownActiveRef.current = true; // Set cooldown ref immediately
      startSelectionCooldown();
    }
    
    // Then clear the UI elements
    if (instructionsVisibleRef.current) {
      instructionsVisibleRef.current = false;
      setShowInstructions(false);
    }
    
    if (showHintsRef.current) {
      showHintsRef.current = false;
      setShowHints(false);
    }
    
    // Hide hints after processing to ensure clean state for next interaction
    hideHintsAfterInteraction();
  }, [startSelectionCooldown, hideHintsAfterInteraction]);

  // Sync ref state with useState on component mount and state changes
  useEffect(() => {
    instructionsVisibleRef.current = showInstructions;
  }, [showInstructions]);


  // Start timer when component mounts and shouldShowCard becomes true
  useEffect(() => {
    console.log('🔄 useEffect - shouldShowCard:', shouldShowCard, 'disabled:', disabled, 'isFirstLoad:', isFirstLoadRef.current);
    
    if (shouldShowCard && !disabled) {
      // Show hints immediately only on first load
      if (isFirstLoadRef.current) {
        console.log('💡 First load - showing hints and updating ref');
        setShowHints(true);
        showHintsRef.current = true; // Update ref immediately
        isFirstLoadRef.current = false; // Mark that we've shown the first load hints
      }
      startInactivityTimer();
    } else {
      console.log('💡 Hiding hints and updating ref');
      clearInactivityTimer();
      setShowHints(false);
      showHintsRef.current = false; // Update ref immediately
    }
    
    return () => {
      clearInactivityTimer();
      if (cooldownTimerRef.current) {
        window.clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [shouldShowCard, disabled, startInactivityTimer, clearInactivityTimer]);

  // Handle swipe completion
  const handleSwipe = useCallback((direction: string) => {
    console.log('🔄 handleSwipe called:', direction, 'instructionsVisible (ref):', instructionsVisibleRef.current, 'hintsVisible (ref):', showHintsRef.current, 'cooldown (ref):', cooldownActiveRef.current);
    
    if (disabled) return;

    // If instructions or hints are showing, dismiss them instead of processing swipe
    if (instructionsVisibleRef.current || showHintsRef.current) {
      console.log('📋💡 UI elements visible - dismissing only');
      dismissVisibleElements();
      // Reset timer after dismissing to start fresh countdown
      resetInactivityTimer();
      return;
    }

    // If in cooldown period, ignore the interaction
    if (cooldownActiveRef.current) {
      console.log('⏱️ In cooldown period - ignoring swipe');
      return;
    }
    
    // Reset inactivity timer on successful interaction
    resetInactivityTimer();

    console.log('✅ Processing swipe:', direction);

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
        // Skip functionality disabled - ignore these swipes
        console.log('Skip disabled - ignoring left/right swipe');
        break;
    }
  }, [disabled, onSelection, topPhoto.id, bottomPhoto.id, resetInactivityTimer, dismissVisibleElements]);

  // Handle card leaving screen
  const handleCardLeftScreen = useCallback(() => {
    console.log('Card left screen');
    
    // Notify parent that animation completed
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);


  // Handle direct tap selection
  const handleDirectSelection = useCallback((event: React.MouseEvent, winner: Photo, loser: Photo) => {
    console.log('👆 handleDirectSelection called, instructionsVisible (ref):', instructionsVisibleRef.current, 'hintsVisible (ref):', showHintsRef.current, 'cooldown (ref):', cooldownActiveRef.current);
    
    if (disabled) return;

    // If instructions or hints are showing, first tap should only dismiss them
    if (instructionsVisibleRef.current || showHintsRef.current) {
      console.log('📋💡 Direct tap - UI elements visible, dismissing only');
      event.preventDefault();
      event.stopPropagation();
      dismissVisibleElements();
      // Reset timer after dismissing to start fresh countdown
      resetInactivityTimer();
      return;
    }

    // If in cooldown period, ignore the interaction
    if (cooldownActiveRef.current) {
      console.log('⏱️ In cooldown period - ignoring tap');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    console.log('✅ Direct tap - processing selection:', winner.id);
    
    // Reset inactivity timer on successful interaction
    resetInactivityTimer();

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Submit the selection
    onSelection(winner.id, loser.id);
    
    // Determine swipe direction based on which photo was selected
    // Top photo (topPhoto) -> swipe up, Bottom photo (bottomPhoto) -> swipe down
    const swipeDirection = winner.id === topPhoto.id ? 'up' : 'down';
    
    // Trigger programmatic swipe animation after a brief delay for visual feedback
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.swipe(swipeDirection);
      }
    }, 150); // 150ms delay for user to see their selection
  }, [disabled, onSelection, topPhoto.id, resetInactivityTimer, dismissVisibleElements]);

  // Handle real-time drag movement for MOGS overlay
  const handleDragMove = useCallback((dragState: DragState) => {
    // If hints are showing, dismiss them when drag begins (consistent with tap/swipe behavior)
    if (showHintsRef.current) {
      dismissVisibleElements();
      return; // Early return after dismissing, like handleSwipe and handleDirectSelection
    }
    
    // Reset inactivity timer on drag interaction
    resetInactivityTimer();
    
    // Only track up/down for MOGS overlay
    if (dragState.direction === 'up' || dragState.direction === 'down') {
      setSwipeDirection(dragState.direction);
      setSwipeProgress(dragState.progress);
    } else {
      setSwipeDirection(null);
      setSwipeProgress(0);
    }
  }, [resetInactivityTimer, dismissVisibleElements]);

  // Handle drag end - reset overlay
  const handleDragEnd = useCallback(() => {
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, []);


  // Control card visibility - hide if shouldShowCard is false
  if (!shouldShowCard) {
    return (
      <div className={`relative w-full max-w-md mx-auto ${className}`}>
        <div className="w-full h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading next pair... {bufferStats?.current ?? 0}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      <TinderCard
        ref={cardRef}
        onSwipe={handleSwipe}
        onCardLeftScreen={handleCardLeftScreen}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        preventSwipe={disabled || instructionsVisibleRef.current ? ['up', 'down', 'left', 'right'] : ['left', 'right']}
        swipeRequirementType="velocity"
        swipeThreshold={300}
        flickOnSwipe={true}
        className="w-full h-[75vh] cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col h-full gap-2 p-4 bg-gray-900 rounded-xl shadow-2xl">
          {/* Top Photo */}
          <button
            onClick={(event) => handleDirectSelection(event, topPhoto, bottomPhoto)}
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
            
            {/* Height/Weight Display */}
            {(topPhoto.gender === 'male' && topPhoto.height) && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {formatHeight(topPhoto.height)}
              </div>
            )}
            {(topPhoto.gender === 'female' && topPhoto.weight) && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {topPhoto.weight} lbs
              </div>
            )}

            {/* Bio Display */}
            {topPhoto.bio && (
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium max-w-[calc(100%-6rem)]">
                {topPhoto.bio}
              </div>
            )}
            
            {/* Inactivity Hint Overlay for Top Photo */}
            {showHints && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ease-in-out">
                <div className="text-white">
                  <svg className="w-16 h-16 mx-auto animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-center mt-2 font-semibold text-lg">Tap or Swipe Up</p>
                </div>
              </div>
            )}
            
            {/* MOGS Overlay for Top Photo */}
            {swipeDirection === 'up' && (
              <div 
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-100 ease-out pointer-events-none"
                style={{ 
                  backgroundColor: `rgba(34, 197, 94, ${swipeProgress * 0.7})`, // green-500 with dynamic opacity
                  opacity: Math.max(0.3, swipeProgress) // Minimum 30% opacity when visible
                }}
              >
                <div className="text-white text-6xl font-bold tracking-widest drop-shadow-2xl animate-pulse">
                  MOGS
                </div>
              </div>
            )}
            
          </button>

          {/* Divider */}
          <div className="h-0.5 bg-gray-700 my-1" />

          {/* Bottom Photo */}
          <button
            onClick={(event) => handleDirectSelection(event, bottomPhoto, topPhoto)}
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
            
            {/* Height/Weight Display */}
            {(bottomPhoto.gender === 'male' && bottomPhoto.height) && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {formatHeight(bottomPhoto.height)}
              </div>
            )}
            {(bottomPhoto.gender === 'female' && bottomPhoto.weight) && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {bottomPhoto.weight} lbs
              </div>
            )}

            {/* Bio Display */}
            {bottomPhoto.bio && (
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium max-w-[calc(100%-6rem)]">
                {bottomPhoto.bio}
              </div>
            )}
            
            {/* Inactivity Hint Overlay for Bottom Photo */}
            {showHints && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ease-in-out">
                <div className="text-white">
                  <svg className="w-16 h-16 mx-auto animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-center mt-2 font-semibold text-lg">Tap or Swipe Down</p>
                </div>
              </div>
            )}
            
            {/* MOGS Overlay for Bottom Photo */}
            {swipeDirection === 'down' && (
              <div 
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-100 ease-out pointer-events-none"
                style={{ 
                  backgroundColor: `rgba(34, 197, 94, ${swipeProgress * 0.7})`, // green-500 with dynamic opacity
                  opacity: Math.max(0.3, swipeProgress) // Minimum 30% opacity when visible
                }}
              >
                <div className="text-white text-6xl font-bold tracking-widest drop-shadow-2xl animate-pulse">
                  MOGS
                </div>
              </div>
            )}
            
          </button>
        </div>


      </TinderCard>


      {/* Instructions - Outside TinderCard to overlay above */}
      {showInstructions && (
        <div className="absolute bottom-4 left-4 right-4 z-50 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center relative pointer-events-auto">
            {/* Close button */}
            <button
              onClick={dismissInstructions}
              className="absolute top-2 right-2 w-6 h-6 bg-gray-600/80 hover:bg-gray-500/80 rounded-full flex items-center justify-center text-white text-sm transition-colors"
              aria-label="Close instructions"
            >
              ×
            </button>
            
            <p className="text-white font-semibold mb-1">
              Tap or swipe to choose who is more attractive
            </p>
            <p className="text-gray-400 text-sm">
              Swipe up/down to choose • Tap photos to select
            </p>
          </div>
        </div>
      )}
    </div>
  );
});