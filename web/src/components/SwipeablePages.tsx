import React, { useRef, useState, useEffect } from 'react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const hasDecidedDirection = useRef<boolean>(false);

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rawIndex = TAB_ORDER.indexOf(currentTab);
  const currentIndex = rawIndex >= 0 ? rawIndex : 1;

  // Use native event listeners to allow preventDefault on touch events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, textarea, select, [role="button"]')) {
        isSwiping.current = false;
        hasDecidedDirection.current = false;
        return;
      }

      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchCurrentX.current = e.touches[0].clientX;
      isSwiping.current = false;
      hasDecidedDirection.current = false;
      setIsTransitioning(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // If we already decided this is vertical scrolling, don't interfere
      if (hasDecidedDirection.current && !isSwiping.current) {
        return;
      }

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX.current;
      const diffY = currentY - touchStartY.current;

      // Decide direction on first significant movement
      if (!hasDecidedDirection.current && (Math.abs(diffX) > 8 || Math.abs(diffY) > 8)) {
        hasDecidedDirection.current = true;
        // Only treat as horizontal swipe if clearly horizontal (more X than Y)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {
          isSwiping.current = true;
        }
      }

      // Only handle horizontal swiping, let vertical scroll through
      if (isSwiping.current) {
        // Only preventDefault if the event is cancelable
        if (e.cancelable) {
          e.preventDefault();
        }

        const canSwipeLeft = currentIndex < TAB_ORDER.length - 1;
        const canSwipeRight = currentIndex > 0;

        let offset = diffX;
        if (offset > 0 && !canSwipeRight) {
          offset = offset * 0.3;
        }
        if (offset < 0 && !canSwipeLeft) {
          offset = offset * 0.3;
        }

        setSwipeOffset(offset);
        touchCurrentX.current = currentX;
      }
    };

    const handleTouchEnd = () => {
      if (!isSwiping.current) {
        setSwipeOffset(0);
        return;
      }

      const diffX = touchCurrentX.current - touchStartX.current;
      const threshold = window.innerWidth * 0.15; // More sensitive - 15% of screen width

      setIsTransitioning(true);

      if (diffX > threshold && currentIndex > 0) {
        updateNavigationTab(TAB_ORDER[currentIndex - 1]);
      } else if (diffX < -threshold && currentIndex < TAB_ORDER.length - 1) {
        updateNavigationTab(TAB_ORDER[currentIndex + 1]);
      }

      setSwipeOffset(0);
      isSwiping.current = false;
      hasDecidedDirection.current = false;

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, updateNavigationTab]);

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
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
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
