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
    trophyScore: number;
    targetTrophyScore?: number;
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

interface BattleLogEntry {
  id: string;
  timestamp: string;
  isWinner: boolean;
  trophyDelta: number;
  rater: {
    id: string;
    name: string;
    gender: string;
    photoUrl: string | null;
  };
}

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUserName, updateUserPhoto, updateProfile, refreshUser, updateNavigationTab } = useAuth();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [showFullBattleLog, setShowFullBattleLog] = useState(false);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedAge, setEditedAge] = useState<number>(18);
  const [editedGender, setEditedGender] = useState<'male' | 'female'>('male');
  const [editedBio, setEditedBio] = useState('');
  const [editedHeightFeet, setEditedHeightFeet] = useState<number>(5);
  const [editedHeightInches, setEditedHeightInches] = useState<number>(0);
  const [editedWeight, setEditedWeight] = useState<number>(120);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
      refreshUser();
    }
  }, [user?.id]);

  const fetchUserStats = async () => {
    if (!user?.id) return;
    try {
      const statsResponse = await apiRequest(`/api/rankings/my-stats?userId=${user.id}`);
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setUserStats(statsData.stats);
      }

      const logResponse = await apiRequest(`/api/rankings/battle-log?userId=${user.id}&limit=50`);
      const logData = await logResponse.json();
      if (logData.success) {
        setBattleLog(logData.log);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
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
      if (success) setIsEditingName(false);
      else setNameError('Failed to update name.');
    } catch (error) {
      console.error('Failed to update name:', error);
      setNameError('Failed to update name.');
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
      const photoData = capture.uploadResult ? {
        r2Url: capture.uploadResult.url,
        r2ThumbnailUrl: capture.uploadResult.thumbnailUrl,
      } : {
        blob: capture.blob,
      };
      const success = await updateUserPhoto(photoData);
      if (success) {
        setShowPhotoCapture(false);
        fetchUserStats();
      } else {
        setPhotoError('Failed to update photo.');
      }
    } catch (error) {
      console.error('Failed to update photo:', error);
      setPhotoError('Failed to update photo.');
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handlePhotoCaptureError = (error: string) => {
    setPhotoError(error);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileError(null);
    setEditedAge(user?.age || 18);
    setEditedGender(user?.gender || 'male');
    setEditedBio(user?.bio || '');
    if (user?.height) {
      setEditedHeightFeet(Math.floor(user.height / 12));
      setEditedHeightInches(user.height % 12);
    } else {
      setEditedHeightFeet(5);
      setEditedHeightInches(8);
    }
    if (user?.weight) setEditedWeight(user.weight);
    else setEditedWeight(130);
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileError(null);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!editedBio.trim()) {
      setProfileError('Bio is required');
      return;
    }
    if (editedBio.length > 25) {
      setProfileError('Bio must be 25 characters or less');
      return;
    }
    setIsUpdatingProfile(true);
    setProfileError(null);
    try {
      const profileData: any = {
        age: editedAge,
        gender: editedGender,
        bio: editedBio.trim(),
      };
      if (editedGender === 'male') {
        const totalInches = editedHeightFeet * 12 + editedHeightInches;
        profileData.height = totalInches;
      } else {
        profileData.weight = editedWeight;
      }
      const success = await updateProfile(profileData);
      if (success) setIsEditingProfile(false);
      else setProfileError('Failed to update profile.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileError('Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Helper to get first name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (!user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-blue-900">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      height: '100dvh',
      width: '100vw',
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px]" />
      </div>

      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex-shrink-0 z-10">
        <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
          PROFILE
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 relative z-10" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        minHeight: 0,
        paddingBottom: '100px',
      }}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Photo - Compacted */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105" onClick={handlePhotoClick}>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="relative w-36 h-36 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                  <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-2 border-2 border-[#1e3a8a] shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center w-full">
              {isEditingName ? (
                <div className="flex flex-col items-center space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-black text-white bg-white/10 border-2 border-white/30 rounded-xl px-4 py-2 text-center focus:outline-none focus:border-white/60 backdrop-blur-md w-full"
                    autoFocus
                  />
                  {nameError && <p className="text-red-300 font-bold text-sm">{nameError}</p>}
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveName} 
                      disabled={isUpdatingName}
                      className="bg-white text-blue-700 px-4 py-1.5 rounded-lg font-bold text-sm shadow-md disabled:opacity-50"
                    >
                      {isUpdatingName ? '...' : 'Save'}
                    </button>
                    <button 
                      onClick={handleCancelNameEdit} 
                      disabled={isUpdatingName}
                      className="bg-black/30 text-white px-4 py-1.5 rounded-lg font-bold text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="inline-flex items-center space-x-2 cursor-pointer group transition-transform duration-300 hover:scale-105" onClick={handleEditName}>
                      <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                        {getFirstName(user.name)}
                      </h2>
                      <svg className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    
                    <button 
                      onClick={() => updateNavigationTab('league')}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/40 transition-transform hover:scale-125"
                      style={{ 
                        backgroundColor: userStats?.league.currentLeague.color || '#7F1D1D',
                        boxShadow: `0 0 15px ${userStats?.league.currentLeague.color || '#7F1D1D'}66`
                      }}
                      title={`Current League: ${userStats?.league.currentLeague.name || 'Cooked 1'}`}
                    >
                      <span className="text-white font-black text-xl drop-shadow-md">
                        {userStats?.league.currentLeague.tier || 1}
                      </span>
                    </button>
                  </div>
                  <p className="text-white/70 font-medium text-base mt-1 italic px-4">
                    {user.bio || "No bio set yet."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Elo / Trophy Section - Compacted Highlight */}
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/30 shadow-2xl transform transition-transform duration-300 hover:scale-102">
            <div className="flex flex-col items-center text-center">
              {/* Trophies on Top - BIGGER & WIDER */}
              <div className="w-full bg-black/20 backdrop-blur-xl px-6 py-8 rounded-[2.5rem] border border-white/10 mb-6 transition-transform hover:scale-105 shadow-inner">
                <div className="flex items-center justify-center space-x-6">
                  <span className="text-6xl drop-shadow-lg">🏆</span>
                  <div className="text-left">
                    <div className="text-7xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                      {Math.round(userStats?.performance.trophyScore || 0)}
                    </div>
                    <div className="text-blue-200 font-black text-sm uppercase tracking-[0.4em] mt-2 opacity-80">TROPHIES</div>
                  </div>
                </div>
              </div>

              {/* Percentile / Unlock Section below Trophies */}
              <div className="mt-2 flex flex-col items-center">
                {!userStats || userStats.performance.totalComparisons < 100 ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-inner mb-2 group transition-transform hover:scale-110">
                      <svg className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest">
                      Unlock Percentile at 100 Ratings
                    </div>
                    <div className="mt-1 w-32 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="bg-blue-400 h-full transition-all duration-500" 
                        style={{ width: `${Math.min(userStats?.performance.totalComparisons || 0, 100)}%` }}
                      />
                    </div>
                    <div className="text-[8px] font-black text-blue-200/40 mt-1 uppercase">
                      {userStats?.performance.totalComparisons || 0} / 100
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 mb-2 transform transition-transform hover:scale-110">
                      <div className="text-center">
                        <div className="text-3xl font-black text-white leading-none">
                          {Math.round(userStats.performance.currentPercentile)}
                        </div>
                        <div className="text-[10px] font-black text-white/80">TH</div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-white uppercase tracking-[0.2em] drop-shadow-md">
                      USER PERCENTILE
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information - Smaller & Grid */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Identity</h3>
              <button
                onClick={handleEditProfile}
                className="bg-white text-blue-700 px-4 py-1 rounded-lg text-xs font-black transition-all hover:scale-105 uppercase tracking-widest shadow-md"
              >
                Edit
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Bio (Required)</label>
                    <span className={`text-[10px] font-black tracking-widest ${editedBio.length > 25 ? 'text-red-400' : 'text-blue-100/60'}`}>
                      {editedBio.length}/25
                    </span>
                  </div>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    maxLength={25}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-white/40 backdrop-blur-md min-h-[60px] text-sm"
                    placeholder="Briefly about you..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-blue-100 uppercase tracking-widest ml-1">Age</label>
                    <input
                      type="number"
                      value={editedAge}
                      onChange={(e) => setEditedAge(parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-white/40 backdrop-blur-md text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-blue-100 uppercase tracking-widest ml-1">Gender</label>
                    <select
                      value={editedGender}
                      onChange={(e) => setEditedGender(e.target.value as 'male' | 'female')}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-white/40 backdrop-blur-md appearance-none text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                {profileError && <p className="text-red-300 font-bold text-center text-xs">{profileError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveProfile} disabled={isUpdatingProfile} className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-black shadow-md hover:scale-102 transition-transform text-sm disabled:opacity-50">SAVE</button>
                  <button onClick={handleCancelProfileEdit} disabled={isUpdatingProfile} className="flex-1 bg-black/30 text-white py-3 rounded-xl font-black hover:scale-102 transition-transform text-sm disabled:opacity-50">CANCEL</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 transition-transform hover:scale-102">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">🎂</div>
                  <div>
                    <div className="text-[8px] font-black text-blue-100 uppercase tracking-widest opacity-60">Age</div>
                    <div className="text-base font-black text-white">{user.age || '—'} yrs</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 transition-transform hover:scale-102">
                  <div className={`w-10 h-10 ${user.gender === 'female' ? 'bg-pink-500/20' : 'bg-blue-500/20'} rounded-xl flex items-center justify-center text-xl`}>
                    {user.gender === 'female' ? '💃' : '🕺'}
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-blue-100 uppercase tracking-widest opacity-60">Gender</div>
                    <div className="text-base font-black text-white uppercase">{user.gender || '—'}</div>
                  </div>
                </div>
                {user.gender === 'male' ? (
                  <div className="col-span-2 flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 transition-transform hover:scale-102">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-xl">📏</div>
                    <div>
                      <div className="text-[8px] font-black text-blue-100 uppercase tracking-widest opacity-60">Height</div>
                      <div className="text-base font-black text-white">{user.height ? `${Math.floor(user.height / 12)}'${user.height % 12}"` : '—'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 transition-transform hover:scale-102">
                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-xl">⚖️</div>
                    <div>
                      <div className="text-[8px] font-black text-blue-100 uppercase tracking-widest opacity-60">Weight</div>
                      <div className="text-base font-black text-white">{user.weight ? `${user.weight} lbs` : '—'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Battle Log Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Battle Log</h3>
              <button
                onClick={() => setShowFullBattleLog(true)}
                className="text-blue-200 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                View All
              </button>
            </div>

            {battleLog.length > 0 ? (
              <div className="space-y-3">
                {battleLog.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {entry.rater.photoUrl ? (
                          <img src={entry.rater.photoUrl} alt={entry.rater.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-xs">
                            {entry.rater.gender === 'female' ? '💃' : '🕺'}
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border border-black ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                          {entry.isWinner ? 'W' : 'L'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-tight">{entry.rater.name} Rated</div>
                        <div className="text-[8px] font-bold text-blue-100/40 uppercase">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-black ${entry.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.isWinner ? '+' : ''}{entry.trophyDelta}
                      </div>
                      <div className="text-[8px] font-black text-blue-200/40 uppercase tracking-widest">Trophies</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">No battles recorded yet</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-[1.5rem] font-black transition-all border border-red-500/20 uppercase tracking-[0.2em] hover:scale-102 text-xs"
          >
            Sign Out
          </button>
        </div>
      </main>

      {/* Photo Capture Modal */}
      {showPhotoCapture && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPhotoCapture(false); }}
        >
          <div className="w-full max-w-md bg-gray-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Update Photo</h3>
              <button onClick={() => setShowPhotoCapture(false)} className="text-white/50 hover:text-white transition-transform hover:scale-125">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {photoError && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-xl">
                <p className="text-red-400 text-sm font-bold text-center">{photoError}</p>
              </div>
            )}
            
            <CameraCaptureComponent onCapture={handlePhotoCapture} onError={handlePhotoCaptureError} className="mb-6 rounded-3xl overflow-hidden" />
            
            {isUpdatingPhoto && (
              <div className="flex items-center justify-center space-x-3 text-blue-400 font-black uppercase text-xs tracking-widest bg-blue-400/10 py-4 rounded-2xl border border-blue-400/20">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Full Battle Log Modal */}
      {showFullBattleLog && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowFullBattleLog(false); }}
        >
          <div className="w-full max-w-md h-[80vh] bg-gray-900 rounded-[2.5rem] flex flex-col border border-white/10 shadow-2xl overflow-hidden">
            <header className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Full Battle Log</h3>
              <button onClick={() => setShowFullBattleLog(false)} className="text-white/50 hover:text-white transition-transform hover:scale-125">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {battleLog.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 transition-colors hover:bg-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {entry.rater.photoUrl ? (
                        <img src={entry.rater.photoUrl} alt={entry.rater.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl">
                          {entry.rater.gender === 'female' ? '💃' : '🕺'}
                        </div>
                      )}
                      <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-gray-900 ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                        {entry.isWinner ? 'W' : 'L'}
                      </div>
                    </div>
                    <div>
                      <div className="text-base font-black text-white uppercase tracking-tight">{entry.rater.name} Rated</div>
                      <div className="text-[10px] font-bold text-blue-100/40 uppercase">
                        {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${entry.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.isWinner ? '+' : ''}{entry.trophyDelta}
                    </div>
                    <div className="text-[8px] font-black text-blue-200/40 uppercase tracking-[0.2em]">Trophies</div>
                  </div>
                </div>
              ))}
              
              {battleLog.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/20 font-black uppercase tracking-widest">No battles recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};