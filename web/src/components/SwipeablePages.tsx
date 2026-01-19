import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { useAuth } from '../contexts/AuthContext';
import 'swiper/css';

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
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const currentIndex = TAB_ORDER.indexOf(navigationState.currentTab);

  // Sync bottom nav taps to swiper
  useEffect(() => {
    if (swiper && swiper.activeIndex !== currentIndex) {
      swiper.slideTo(currentIndex);
    }
  }, [currentIndex, swiper]);

  return (
    <div className="absolute inset-0">
      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(s) => updateNavigationTab(TAB_ORDER[s.activeIndex])}
        initialSlide={currentIndex >= 0 ? currentIndex : 1}
        spaceBetween={0}
        slidesPerView={1}
        resistance={true}
        resistanceRatio={0.5}
        speed={300}
        cssMode={false}
        className="h-full"
      >
        {TAB_ORDER.map((tabId) => {
          const pageConfig = pages.find(p => p.id === tabId);
          return (
            <SwiperSlide key={tabId} className="overflow-auto">
              {pageConfig?.component}
            </SwiperSlide>
          );
        })}
      </Swiper>

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
