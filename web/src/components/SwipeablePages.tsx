import React, { useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'league' | 'play' | 'matched' | 'profile';

const TAB_ORDER: TabType[] = ['league', 'play', 'matched', 'profile'];

interface PageConfig {
  id: TabType;
  component: React.ReactNode;
}

interface SwipeablePagesProps {
  pages: PageConfig[];
}

export const SwipeablePages: React.FC<SwipeablePagesProps> = ({ pages }) => {
  const { navigationState, updateNavigationTab } = useAuth();
  const { currentTab } = navigationState;

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rawIndex = TAB_ORDER.indexOf(currentTab);
  const currentIndex = rawIndex >= 0 ? rawIndex : 1;

  const threshold = window.innerWidth * 0.15;

  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], direction: [dx], active }) => {
      if (active) {
        // Apply resistance at boundaries
        const canSwipeRight = currentIndex > 0;
        const canSwipeLeft = currentIndex < TAB_ORDER.length - 1;

        let offset = mx;
        if (offset > 0 && !canSwipeRight) {
          offset = offset * 0.3;
        }
        if (offset < 0 && !canSwipeLeft) {
          offset = offset * 0.3;
        }

        setSwipeOffset(offset);
      } else {
        // Gesture ended - determine if we should navigate
        const velocityMet = Math.abs(vx) > 0.3;
        const distanceMet = Math.abs(mx) > threshold;
        const shouldSwipe = velocityMet || distanceMet;

        setIsTransitioning(true);

        if (shouldSwipe) {
          // dx > 0 means swiping right (go to previous tab)
          // dx < 0 means swiping left (go to next tab)
          if (dx > 0 && currentIndex > 0) {
            updateNavigationTab(TAB_ORDER[currentIndex - 1]);
          } else if (dx < 0 && currentIndex < TAB_ORDER.length - 1) {
            updateNavigationTab(TAB_ORDER[currentIndex + 1]);
          }
        }

        setSwipeOffset(0);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    },
    {
      axis: 'x',
      filterTaps: true,
      from: () => [swipeOffset, 0],
    }
  );

  // Handle tab changes from bottom nav
  useEffect(() => {
    setSwipeOffset(0);
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Calculate offset percentage for swipe
  const swipePercent = (swipeOffset / window.innerWidth) * 100;

  return (
    <div
      {...bind()}
      className="absolute inset-0 overflow-hidden touch-pan-y"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      {/* Each page positioned absolutely, translated based on its position relative to current */}
      {TAB_ORDER.map((tabId, index) => {
        const pageConfig = pages.find(p => p.id === tabId);
        const offsetFromCurrent = index - currentIndex;
        const translateX = (offsetFromCurrent * 100) + swipePercent;
        const isVisible = Math.abs(offsetFromCurrent) <= 1 || swipeOffset !== 0;

        return (
          <div
            key={tabId}
            className={`absolute inset-0 ${isTransitioning ? 'transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]' : ''}`}
            style={{
              transform: `translateX(${translateX}%)`,
              visibility: isVisible ? 'visible' : 'hidden',
            }}
          >
            {/* Scrollable content wrapper */}
            <div
              className="w-full h-full overflow-x-hidden"
              style={{
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                paddingBottom: '80px',
              }}
            >
              {pageConfig?.component}
            </div>
          </div>
        );
      })}

      {/* Page indicator dots */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
        {TAB_ORDER.map((tab, index) => (
          <div
            key={tab}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
