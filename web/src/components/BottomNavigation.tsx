import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const BottomNavigation: React.FC = () => {
  const { navigationState, updateNavigationTab } = useAuth();
  const { currentTab } = navigationState;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 safe-area-inset">
      <div className="flex">
        {/* League Tab - Coming Soon */}
        <button
          onClick={() => updateNavigationTab('league')}
          className={`flex-1 py-4 px-4 flex flex-col items-center justify-center transition-colors ${
            currentTab === 'league'
              ? 'text-white bg-gray-700/50'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            {/* Trophy Icon */}
            <img 
              src="/trophy.png" 
              alt="Trophy"
              className="w-6 h-6"
              style={{ filter: 'brightness(0) saturate(100%) invert(66%) sepia(9%) saturate(424%) hue-rotate(181deg) brightness(96%) contrast(93%)' }}
            />
          </div>
        </button>

        {/* Play Tab - Rating/Comparison */}
        <button
          onClick={() => updateNavigationTab('play')}
          className={`flex-1 py-4 px-4 flex flex-col items-center justify-center transition-colors ${
            currentTab === 'play'
              ? 'text-white bg-gray-700/50'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            {/* Crossed Swords Icon */}
            <img 
              src="/sword.svg" 
              alt="Crossed Swords"
              className="w-6 h-6"
              style={{ filter: 'brightness(0) saturate(100%) invert(66%) sepia(9%) saturate(424%) hue-rotate(181deg) brightness(96%) contrast(93%)' }}
            />
          </div>
        </button>

        {/* Matched Tab - Heart for matches */}
        <button
          onClick={() => updateNavigationTab('matched')}
          className={`flex-1 py-4 px-4 flex flex-col items-center justify-center transition-colors ${
            currentTab === 'matched'
              ? 'text-white bg-gray-700/50'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            <img 
              src="/heart.png" 
              alt="Heart"
              className="w-6 h-6"
              style={{ filter: 'brightness(0) saturate(100%) invert(66%) sepia(9%) saturate(424%) hue-rotate(181deg) brightness(96%) contrast(93%)' }}
            />
          </div>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => updateNavigationTab('profile')}
          className={`flex-1 py-4 px-4 flex flex-col items-center justify-center transition-colors ${
            currentTab === 'profile'
              ? 'text-white bg-gray-700/50'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            <img 
              src="/user.png" 
              alt="User"
              className="w-6 h-6"
              style={{ filter: 'brightness(0) saturate(100%) invert(66%) sepia(9%) saturate(424%) hue-rotate(181deg) brightness(96%) contrast(93%)' }}
            />
          </div>
        </button>
      </div>
    </nav>
  );
};