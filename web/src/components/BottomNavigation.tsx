import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const BottomNavigation: React.FC = () => {
  const { navigationState, updateNavigationTab } = useAuth();
  const { currentTab } = navigationState;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 safe-area-inset">
      <div className="flex">
        {/* Profile Tab */}
        <button
          onClick={() => updateNavigationTab('profile')}
          className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'profile'
              ? 'text-blue-400 bg-blue-400/10'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Profile</span>
        </button>

        {/* Play Tab */}
        <button
          onClick={() => updateNavigationTab('play')}
          className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'play'
              ? 'text-blue-400 bg-blue-400/10'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Play</span>
        </button>

        {/* Matched Tab */}
        <button
          onClick={() => updateNavigationTab('matched')}
          className={`flex-1 py-3 px-4 flex flex-col items-center space-y-1 transition-colors ${
            currentTab === 'matched'
              ? 'text-blue-400 bg-blue-400/10'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Matched</span>
        </button>
      </div>
    </nav>
  );
};