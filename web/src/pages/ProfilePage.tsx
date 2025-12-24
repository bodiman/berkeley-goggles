import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';
import { apiRequest } from '../config/api';
// League types defined locally to avoid import issues
interface League {
  id: string;
  name: string;
  tier: number;
  category: 'cooked' | 'chopped' | 'chuzz' | 'mid' | 'huzz' | 'ultimate';
  minElo: number;
  maxElo: number;
  color: string;
  description: string;
}

interface LeagueProgression {
  currentLeague: League;
  nextLeague?: League;
  previousLeague?: League;
  progressToNext: number; // 0-100 percentage
  eloToNextLeague?: number;
  eloFromPreviousLeague: number;
}

interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
  uploadResult?: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
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
    bradleyTerryScore: number;
    confidence: 'low' | 'medium' | 'high';
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  context: {
    totalRankedPhotos: number;
    rankPosition: number;
  };
  league: LeagueProgression;
}

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUserName, updateUserPhoto, updateProfile, refreshUser } = useAuth();
  
  // Debug: Log user profilePhoto value
  console.log('ProfilePage - user.profilePhoto:', user?.profilePhoto);
  console.log('ProfilePage - full user object:', user);
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
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedAge, setEditedAge] = useState<number>(18);
  const [editedGender, setEditedGender] = useState<'male' | 'female'>('male');
  const [editedHeightFeet, setEditedHeightFeet] = useState<number>(5);
  const [editedHeightInches, setEditedHeightInches] = useState<number>(0);
  const [editedWeight, setEditedWeight] = useState<number>(120);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch user stats and preferences on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
      fetchUserPreferences();
      // Refresh user data to get latest height/weight info
      refreshUser();
    }
  }, [user?.id]);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStats(true);
      setStatsError(null);
      
      const response = await apiRequest(`/api/rankings/my-stats?userId=${user.id}`);
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
      // Use R2 URL if available, otherwise fall back to blob
      const photoData = capture.uploadResult ? {
        r2Url: capture.uploadResult.url,
        r2ThumbnailUrl: capture.uploadResult.thumbnailUrl,
      } : {
        blob: capture.blob,
      };

      const success = await updateUserPhoto(photoData);
      console.log('success', success);
      
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

      const response = await apiRequest('/api/matches/update-preference', {
        method: 'PUT',
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

  // Profile editing functions
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileError(null);
    
    // Initialize values based on current user data
    setEditedAge(user?.age || 18);
    setEditedGender(user?.gender || 'male');
    
    if (user?.height) {
      setEditedHeightFeet(Math.floor(user.height / 12));
      setEditedHeightInches(user.height % 12);
    } else {
      setEditedHeightFeet(5);
      setEditedHeightInches(8); // Default to 5'8"
    }
    
    if (user?.weight) {
      setEditedWeight(user.weight);
    } else {
      setEditedWeight(130); // Default weight
    }
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileError(null);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsUpdatingProfile(true);
    setProfileError(null);

    try {
      const profileData: { age?: number; gender?: 'male' | 'female'; height?: number; weight?: number } = {};
      
      // Validate and add age
      if (editedAge < 18 || editedAge > 99) {
        setProfileError('Age must be between 18 and 99');
        return;
      }
      profileData.age = editedAge;
      profileData.gender = editedGender;
      
      // Add height for males or if user wants to update it
      if (editedGender === 'male') {
        const totalInches = editedHeightFeet * 12 + editedHeightInches;
        if (totalInches < 60 || totalInches > 84) {
          setProfileError('Height must be between 5\'0" and 7\'0"');
          return;
        }
        profileData.height = totalInches;
      }
      
      // Add weight for females or if user wants to update it
      if (editedGender === 'female') {
        if (editedWeight < 80 || editedWeight > 300) {
          setProfileError('Weight must be between 80 and 300 lbs');
          return;
        }
        profileData.weight = editedWeight;
      }
      
      const success = await updateProfile(profileData);
      
      if (success) {
        setIsEditingProfile(false);
      } else {
        setProfileError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
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
                    src={user.profilePhoto}
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
            
            {/* Profile Information Display/Edit */}
            {isEditingProfile ? (
              <div className="space-y-4">
                {/* Profile editing form */}
                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                  {/* Age input */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      value={editedAge}
                      onChange={(e) => setEditedAge(parseInt(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Gender selector */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditedGender('male')}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          editedGender === 'male'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditedGender('female')}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          editedGender === 'female'
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                  
                  {editedGender === 'male' && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Height
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={editedHeightFeet}
                          onChange={(e) => setEditedHeightFeet(parseInt(e.target.value))}
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[5, 6, 7].map(feet => (
                            <option key={feet} value={feet}>{feet} ft</option>
                          ))}
                        </select>
                        <select
                          value={editedHeightInches}
                          onChange={(e) => setEditedHeightInches(parseInt(e.target.value))}
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{i} in</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {editedGender === 'female' && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="80"
                        max="300"
                        value={editedWeight}
                        onChange={(e) => setEditedWeight(parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {profileError && (
                    <p className="text-red-400 text-sm text-center">{profileError}</p>
                  )}
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelProfileEdit}
                      disabled={isUpdatingProfile}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Add edit button for all profile info */}
                <div className="text-center mb-2">
                  <button
                    onClick={handleEditProfile}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
                
                {user.gender === 'male' && (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m-3-9h6" />
                    </svg>
                    {user.height ? (
                      <p className="text-gray-400 text-sm">
                        Height: {Math.floor(user.height / 12)}'{user.height % 12}"
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Height not provided
                      </p>
                    )}
                  </div>
                )}
                
                {user.gender === 'female' && (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {user.weight ? (
                      <p className="text-gray-400 text-sm">
                        Weight: {user.weight} lbs
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Weight not provided
                      </p>
                    )}
                  </div>
                )}
                
                {user.gender && (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-gray-400 text-sm capitalize">
                      {user.gender}
                    </p>
                  </div>
                )}
                
                {user.age && (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-400 text-sm">
                      {user.age} years old
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
              <span>Member since {user.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* League Information */}
          {userStats && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Current League</h3>
              
              <div className="space-y-4">
                {/* League Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: userStats.league.currentLeague.color }}
                    >
                      <span className="text-white font-bold text-lg">
                        {userStats.league.currentLeague.tier}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {userStats.league.currentLeague.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {userStats.league.currentLeague.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {Math.round(userStats.performance.bradleyTerryScore)}
                    </div>
                    <div className="text-gray-400 text-xs">Elo Rating</div>
                  </div>
                </div>

                {/* Elo Range Display */}
                <div className="text-center text-sm text-gray-400">
                  {userStats.league.currentLeague.id === 'ultimate-champion' ? (
                    <span>Elite tier - {userStats.league.currentLeague.minElo}+ Elo</span>
                  ) : (
                    <span>{userStats.league.currentLeague.minElo} - {userStats.league.currentLeague.maxElo} Elo</span>
                  )}
                </div>

                {/* Progress to Next League */}
                {userStats.league.nextLeague && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress to {userStats.league.nextLeague.name}</span>
                      <span className="text-white">{userStats.league.progressToNext.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${userStats.league.progressToNext}%`,
                          backgroundColor: userStats.league.nextLeague.color
                        }}
                      />
                    </div>
                    {userStats.league.eloToNextLeague && (
                      <div className="text-center text-xs text-gray-400">
                        {userStats.league.eloToNextLeague} Elo to next league
                      </div>
                    )}
                  </div>
                )}

                {/* Ultimate Champion Display */}
                {userStats.league.currentLeague.id === 'ultimate-champion' && (
                  <div className="text-center py-2">
                    <span className="text-purple-400 font-bold">🏆 Ultimate Champion 🏆</span>
                    <p className="text-gray-400 text-sm mt-1">You've reached the highest league!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rating Distribution */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
            
            {isLoadingStats ? (
              <div className="text-center py-6">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Loading stats...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Your Rating Display */}
                <div className="text-center">
                  <div className="text-green-400 font-semibold text-lg mb-2">
                    Your rating ({userStats ? Math.round(userStats.performance.bradleyTerryScore) : 1000})
                  </div>
                </div>

                {/* Distribution Chart */}
                <div className="relative h-64 bg-gray-900 rounded-lg p-4 overflow-hidden">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 25" fill="none" stroke="#374151" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#grid)" />
                    
                    {/* Y-axis labels (Players) */}
                    <text x="15" y="20" fill="#9CA3AF" fontSize="8" textAnchor="end">8,000</text>
                    <text x="15" y="45" fill="#9CA3AF" fontSize="8" textAnchor="end">7,000</text>
                    <text x="15" y="70" fill="#9CA3AF" fontSize="8" textAnchor="end">6,000</text>
                    <text x="15" y="95" fill="#9CA3AF" fontSize="8" textAnchor="end">5,000</text>
                    <text x="15" y="120" fill="#9CA3AF" fontSize="8" textAnchor="end">4,000</text>
                    <text x="15" y="145" fill="#9CA3AF" fontSize="8" textAnchor="end">3,000</text>
                    <text x="15" y="170" fill="#9CA3AF" fontSize="8" textAnchor="end">2,000</text>
                    <text x="15" y="195" fill="#9CA3AF" fontSize="8" textAnchor="end">1,000</text>
                    
                    {/* X-axis labels (Rating) */}
                    <text x="40" y="195" fill="#9CA3AF" fontSize="8" textAnchor="middle">200</text>
                    <text x="120" y="195" fill="#9CA3AF" fontSize="8" textAnchor="middle">600</text>
                    <text x="200" y="195" fill="#9CA3AF" fontSize="8" textAnchor="middle">1000</text>
                    <text x="280" y="195" fill="#9CA3AF" fontSize="8" textAnchor="middle">1400</text>
                    <text x="360" y="195" fill="#9CA3AF" fontSize="8" textAnchor="middle">1800</text>
                    
                    {/* Right Y-axis labels (Cumulative %) */}
                    <text x="385" y="20" fill="#9CA3AF" fontSize="8" textAnchor="start">100.0%</text>
                    <text x="385" y="45" fill="#9CA3AF" fontSize="8" textAnchor="start">90.0%</text>
                    <text x="385" y="70" fill="#9CA3AF" fontSize="8" textAnchor="start">80.0%</text>
                    <text x="385" y="95" fill="#9CA3AF" fontSize="8" textAnchor="start">70.0%</text>
                    <text x="385" y="120" fill="#9CA3AF" fontSize="8" textAnchor="start">60.0%</text>
                    <text x="385" y="145" fill="#9CA3AF" fontSize="8" textAnchor="start">50.0%</text>
                    <text x="385" y="170" fill="#9CA3AF" fontSize="8" textAnchor="start">40.0%</text>
                    <text x="385" y="195" fill="#9CA3AF" fontSize="8" textAnchor="start">30.0%</text>
                    
                    {/* Bell curve (histogram) */}
                    <path
                      d="M 40 180 Q 50 175 60 170 Q 80 160 100 140 Q 120 120 140 100 Q 160 80 180 70 Q 200 65 220 70 Q 240 80 260 100 Q 280 120 300 140 Q 320 160 340 170 Q 350 175 360 180"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="2"
                    />
                    
                    {/* Fill under curve */}
                    <path
                      d="M 40 180 Q 50 175 60 170 Q 80 160 100 140 Q 120 120 140 100 Q 160 80 180 70 Q 200 65 220 70 Q 240 80 260 100 Q 280 120 300 140 Q 320 160 340 170 Q 350 175 360 180 L 360 180 L 40 180 Z"
                      fill="rgba(96, 165, 250, 0.3)"
                    />
                    
                    {/* Cumulative percentage curve (yellow) */}
                    <path
                      d="M 40 180 Q 80 170 120 150 Q 160 120 200 80 Q 240 40 280 25 Q 320 15 360 20"
                      fill="none"
                      stroke="#FDE047"
                      strokeWidth="2"
                    />
                    
                    {/* User rating line (green dashed) */}
                    {userStats && (
                      <>
                        <line
                          x1={40 + ((userStats.performance.bradleyTerryScore - 200) / 1600) * 320}
                          y1="15"
                          x2={40 + ((userStats.performance.bradleyTerryScore - 200) / 1600) * 320}
                          y2="180"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                        <circle
                          cx={40 + ((userStats.performance.bradleyTerryScore - 200) / 1600) * 320}
                          cy="180"
                          r="4"
                          fill="#10B981"
                        />
                      </>
                    )}
                  </svg>
                  
                  {/* Axis labels */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs">
                    Bradley-Terry rating
                  </div>
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400 text-xs">
                    Players
                  </div>
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 text-xs">
                    Cumulative
                  </div>
                </div>

                {/* Stats summary */}
                {userStats && (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.round(userStats.performance.currentPercentile)}th
                      </div>
                      <div className="text-gray-400 text-sm">percentile</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {userStats.performance.totalComparisons}
                      </div>
                      <div className="text-gray-400 text-sm">comparisons</div>
                    </div>
                  </div>
                )}
              </div>
            )}
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