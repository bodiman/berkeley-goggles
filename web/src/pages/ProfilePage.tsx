import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';

interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
}

interface UserStats {
  photo: {
    id: string;
    url: string;
    uploadedAt: string;
  };
  performance: {
    totalComparisons: number;
    wins: number;
    losses: number;
    winRate: number;
    currentPercentile: number;
    confidence: 'low' | 'medium' | 'high';
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  context: {
    totalRankedPhotos: number;
    rankPosition: number;
  };
}

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUserName, updateUserPhoto } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [matchingPercentile, setMatchingPercentile] = useState(20);
  const [isUpdatingPreference, setIsUpdatingPreference] = useState(false);

  // Fetch user stats and preferences on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
      fetchUserPreferences();
    }
  }, [user?.id]);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStats(true);
      setStatsError(null);
      
      const response = await fetch(`/api/rankings/my-stats?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserStats(data.stats);
      } else {
        setStatsError(data.error || 'Failed to load stats');
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      setStatsError('Failed to load stats');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user?.id) return;

    try {
      // For now, we'll use a simple approach and assume the default is 20
      // In a real implementation, you might want a separate API endpoint
      // or include this in the user profile data
      setMatchingPercentile(20); // Default value
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(user?.name || '');
    setNameError(null);
  };

  const handleCancelNameEdit = () => {
    setIsEditingName(false);
    setEditedName('');
    setNameError(null);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    if (editedName.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }

    if (editedName.trim() === user?.name) {
      setIsEditingName(false);
      return;
    }

    setIsUpdatingName(true);
    setNameError(null);

    try {
      const success = await updateUserName(editedName.trim());
      
      if (success) {
        setIsEditingName(false);
      } else {
        setNameError('Failed to update name. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update name:', error);
      setNameError('Failed to update name. Please try again.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePhotoClick = () => {
    setShowPhotoCapture(true);
    setPhotoError(null);
  };

  const handlePhotoCapture = async (capture: CameraCapture) => {
    setIsUpdatingPhoto(true);
    setPhotoError(null);

    try {
      const success = await updateUserPhoto(capture.blob);
      
      if (success) {
        setShowPhotoCapture(false);
        // Refresh stats since profile photo changed
        fetchUserStats();
      } else {
        setPhotoError('Failed to update photo. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update photo:', error);
      setPhotoError('Failed to update photo. Please try again.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handlePhotoCaptureError = (error: string) => {
    setPhotoError(error);
  };

  const handleMatchingPreferenceChange = async (newPercentile: number) => {
    try {
      setIsUpdatingPreference(true);

      const response = await fetch('/api/matches/update-preference', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          matchingPercentile: newPercentile,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update matching preference');
      }

      const data = await response.json();
      
      if (data.success) {
        setMatchingPercentile(newPercentile);
      } else {
        throw new Error(data.error || 'Failed to update preference');
      }
    } catch (error) {
      console.error('Failed to update matching preference:', error);
    } finally {
      setIsUpdatingPreference(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black safe-area-inset flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 overflow-y-auto pb-20" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y'
      }}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <button
                onClick={handlePhotoClick}
                className="relative group focus:outline-none"
                disabled={isUpdatingPhoto}
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:3001/api/user/photo/${user.profilePhoto.split('/').pop()}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 group-hover:border-blue-500 transition-colors"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 group-hover:border-blue-500 transition-colors">
                    <svg className="w-16 h-16 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                
                {/* Camera Icon Overlay */}
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-black group-hover:bg-blue-700 transition-colors">
                  {isUpdatingPhoto ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            {isEditingName ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-2xl font-bold text-white bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {nameError && (
                  <p className="text-red-400 text-sm">{nameError}</p>
                )}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleSaveName}
                    disabled={isUpdatingName}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    {isUpdatingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelNameEdit}
                    disabled={isUpdatingName}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors cursor-pointer" onClick={handleEditName}>
                  {user.name}
                  <svg className="inline-block w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </h2>
              </div>
            )}
            {user.email && (
              <p className="text-gray-400 text-sm">{user.email}</p>
            )}
            <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
              <span>Member since {user.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Profile Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Profile Complete</span>
                <div className={`flex items-center space-x-2 ${user.profileComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span>{user.profileComplete ? '✓' : '⚠'}</span>
                  <span className="text-sm font-medium">
                    {user.profileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Display */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Your Stats</h3>
            
            {isLoadingStats ? (
              <div className="text-center py-6">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading stats...</p>
              </div>
            ) : statsError ? (
              <div className="text-center py-6">
                <p className="text-red-400 text-sm mb-3">{statsError}</p>
                <button
                  onClick={fetchUserStats}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Retry
                </button>
              </div>
            ) : !userStats ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-white font-medium mb-2">No Stats Yet</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Upload a profile photo and start comparing to see your ranking stats.
                </p>
                {!user?.profilePhoto && (
                  <button
                    onClick={handlePhotoClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Upload Photo
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-400">
                  {userStats.performance.winRate}% win rate
                </div>
                <div className="text-gray-400 text-sm">
                  on {userStats.performance.totalComparisons} comparison{userStats.performance.totalComparisons !== 1 ? 's' : ''}
                </div>
                <div className="text-lg text-white mt-3">
                  {Math.round(userStats.performance.currentPercentile)}th percentile
                </div>
                
                {/* Additional stats */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence:</span>
                    <span className={`font-medium ${
                      userStats.performance.confidence === 'high' ? 'text-green-400' :
                      userStats.performance.confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {userStats.performance.confidence.charAt(0).toUpperCase() + userStats.performance.confidence.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Trend:</span>
                    <span className={`font-medium ${
                      userStats.performance.trend === 'up' ? 'text-green-400' :
                      userStats.performance.trend === 'down' ? 'text-red-400' : 'text-gray-300'
                    }`}>
                      {userStats.performance.trend === 'up' ? '↗ Rising' :
                       userStats.performance.trend === 'down' ? '↘ Falling' : '→ Stable'}
                    </span>
                  </div>
                  {userStats.context.totalRankedPhotos > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Rank:</span>
                      <span className="text-white font-medium">
                        #{userStats.context.rankPosition} of {userStats.context.totalRankedPhotos}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Matching Settings */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Matching Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Match me with people in my top {matchingPercentile}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={matchingPercentile}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setMatchingPercentile(newValue);
                    handleMatchingPreferenceChange(newValue);
                  }}
                  disabled={isUpdatingPreference}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Top 5%</span>
                  <span>Top 50%</span>
                  <span>Top 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={logout}
              className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 px-4 rounded-lg font-medium transition-colors border border-red-600/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4"
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPhotoCapture(false);
            }
          }}
        >
          <div className="w-full max-w-md">
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Update Profile Photo</h3>
                <button
                  onClick={() => setShowPhotoCapture(false)}
                  disabled={isUpdatingPhoto}
                  className="text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {photoError && (
                <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <p className="text-red-400 text-sm">{photoError}</p>
                </div>
              )}
              
              <CameraCaptureComponent
                onCapture={handlePhotoCapture}
                onError={handlePhotoCaptureError}
                className="mb-4"
              />
              
              {isUpdatingPhoto && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Updating photo...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};