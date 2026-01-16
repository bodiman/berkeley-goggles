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

  const threshold = window.innerWidth * 0.08; // Lowered from 0.15 for more sensitive swiping

  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], active, first, last }) => {
      // Log every gesture event
      console.log('🖐️ Gesture:', {
        active,
        first,
        last,
        movement: { x: mx.toFixed(1), y: my.toFixed(1) },
        velocity: { x: vx.toFixed(3), y: vy.toFixed(3) },
        direction: { x: dx, y: dy },
        currentTab,
        currentIndex,
      });


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
        const velocityMet = Math.abs(vx) > 0.15; // Lowered from 0.3 for more sensitive swiping
        const distanceMet = Math.abs(mx) > threshold;
        const shouldSwipe = velocityMet || distanceMet;

        console.log('🏁 Gesture ended:', {
          velocityMet: `${velocityMet} (|${vx.toFixed(3)}| > 0.3)`,
          distanceMet: `${distanceMet} (|${mx.toFixed(1)}| > ${threshold.toFixed(1)})`,
          shouldSwipe,
          direction: mx > 0 ? 'RIGHT (prev tab)' : 'LEFT (next tab)',
        });

        setIsTransitioning(true);

        if (shouldSwipe) {
          // Use mx (total movement) not dx (last frame direction) to determine swipe direction
          // mx > 0 means swiped right (go to previous tab)
          // mx < 0 means swiped left (go to next tab)
          if (mx > 0 && currentIndex > 0) {
            console.log('✅ Navigating to:', TAB_ORDER[currentIndex - 1]);
            updateNavigationTab(TAB_ORDER[currentIndex - 1]);
          } else if (mx < 0 && currentIndex < TAB_ORDER.length - 1) {
            console.log('✅ Navigating to:', TAB_ORDER[currentIndex + 1]);
            updateNavigationTab(TAB_ORDER[currentIndex + 1]);
          } else {
            console.log('⚠️ Cannot navigate: at boundary');
          }
        } else {
          console.log('❌ Swipe not registered: thresholds not met');
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
            {pageConfig?.component}
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
