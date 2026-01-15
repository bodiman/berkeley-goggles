import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CrossedSwordsIcon, ChestIcon, LeagueShieldIcon, ProfileIcon } from './NavIcons';

type TabType = 'league' | 'play' | 'matched' | 'profile';

interface NavItem {
  id: TabType;
  icon: React.FC<{ className?: string; size?: number }>;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'league', icon: LeagueShieldIcon, label: 'League' },
  { id: 'play', icon: CrossedSwordsIcon, label: 'Battle' },
  { id: 'matched', icon: ChestIcon, label: 'Matches' },
  { id: 'profile', icon: ProfileIcon, label: 'Profile' },
];

export const BottomNavigation: React.FC = () => {
  const { navigationState, updateNavigationTab } = useAuth();
  const { currentTab } = navigationState;

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-area-inset z-50">
      {/* Nav bar background */}
      <div className="bg-gradient-to-t from-[#1a2744] to-[#243b5c] border-t-2 border-[#3d5a80] shadow-2xl">
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4a90d9] to-transparent opacity-50" />

        <div className="flex items-center justify-around px-4 h-16">
          {navItems.map((item, index) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <React.Fragment key={item.id}>
                {/* Arrow indicator between items */}
                {index > 0 && (
                  <div className="flex items-center opacity-40">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path d="M1 1 L5 5 L1 9" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <button
                  onClick={() => updateNavigationTab(item.id)}
                  className="flex flex-col items-center justify-center relative w-16 h-14"
                >
                  {/* Icon container that pops up when active */}
                  <div
                    className={`relative flex items-center justify-center transition-all duration-300 ease-out ${
                      isActive ? '-translate-y-1' : ''
                    }`}
                  >
                    {/* Glow effect for active tab */}
                    {isActive && (
                      <div className="absolute inset-0 bg-[#4a90d9]/30 rounded-full blur-md scale-125" />
                    )}

                    <Icon
                      size={isActive ? 32 : 28}
                      className={`relative z-10 transition-all duration-300 ${
                        isActive ? 'drop-shadow-lg' : 'drop-shadow-sm opacity-60'
                      }`}
                    />
                  </div>

                  {/* Label - only show for active tab */}
                  {isActive && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-white mt-0.5 drop-shadow-md">
                      {item.label}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom safe area fill */}
        <div className="h-safe-area-inset-bottom bg-[#1a2744]" />
      </div>
    </nav>
  );
};
