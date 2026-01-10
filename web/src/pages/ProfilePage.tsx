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
  opponent: {
    id: string;
    name: string;
    gender: string;
    photoUrl: string | null;
  } | null;
}

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUserPhoto, updateProfile, refreshUser, updateNavigationTab } = useAuth();
  
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [showFullBattleLog, setShowFullBattleLog] = useState(false);
  
  // Friends state
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isAcceptingFriend, setIsAcceptingFriend] = useState<string | null>(null);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedAge, setEditedAge] = useState<number>(18);
  const [editedBio, setEditedBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
      fetchFriends();
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

  const fetchFriends = async () => {
    if (!user?.id) return;
    try {
      const friendsResponse = await apiRequest(`/api/friends/list?userId=${user.id}`);
      const friendsData = await friendsResponse.json();
      if (friendsData.success) {
        setFriends(friendsData.friends);
      }

      const pendingResponse = await apiRequest(`/api/friends/pending?userId=${user.id}`);
      const pendingData = await pendingResponse.json();
      if (pendingData.success) {
        setPendingRequests(pendingData.pending);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const handleAcceptFriend = async (friendId: string) => {
    if (!user?.id) return;
    setIsAcceptingFriend(friendId);
    try {
      const response = await apiRequest('/api/friends/accept', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, friendId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchFriends();
      }
    } catch (error) {
      console.error('Failed to accept friend:', error);
    } finally {
      setIsAcceptingFriend(null);
    }
  };

  const handleDeclineFriend = async (friendId: string) => {
    if (!user?.id) return;
    try {
      const response = await apiRequest('/api/friends/decline', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, friendId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchFriends();
      }
    } catch (error) {
      console.error('Failed to decline friend:', error);
    }
  };

  const handleShareInvite = async () => {
    const inviteUrl = window.location.origin + '/register';
    const inviteText = `Join me on Berkeley Goggles! See how you rank and challenge me to a MOG battle. ${inviteUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Berkeley Goggles',
          text: inviteText,
          url: inviteUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(inviteText);
        alert('Invite link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
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
    } catch (error: any) {
      console.error('Failed to update photo:', error);
      
      // Check if it's a gender detection error
      if (error.message && error.message.includes('gender')) {
        setPhotoError(error.message);
      } else {
        setPhotoError('Failed to update photo. Please try again.');
      }
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
    setEditedBio(user?.bio || '');
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
        bio: editedBio.trim(),
      };
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

      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex-shrink-0 z-10 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
          PROFILE
        </h1>
        <button 
          onClick={() => setShowFriendsList(true)}
          className="relative p-2 bg-white/10 rounded-xl border border-white/20 transition-transform hover:scale-110 active:scale-95 group"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#1e3a8a] animate-bounce shadow-lg">
              {pendingRequests.length}
            </span>
          )}
        </button>
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
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center space-x-2">
                  <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                    {getFirstName(user.name)}
                  </h2>
                  
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
                
                {/* Consolidatied Identity - WAY SMALLER */}
                <div className="flex items-center space-x-2 mt-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group cursor-pointer hover:bg-black/30 transition-all" onClick={handleEditProfile}>
                  <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">{user.age || '—'} YRS</span>
                  <span className="text-white/30 text-[10px]">•</span>
                  <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">{user.gender || '—'}</span>
                  <svg className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>

                {isEditingProfile ? (
                  <div className="mt-4 w-full max-w-[300px] bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[8px] font-black text-blue-100 uppercase tracking-widest">Bio</label>
                        <span className="text-[8px] font-black text-blue-100/40">{editedBio.length}/25</span>
                      </div>
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        maxLength={25}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-white/30 min-h-[50px]"
                        placeholder="Say something..."
                      />
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="number"
                          value={editedAge}
                          onChange={(e) => setEditedAge(parseInt(e.target.value))}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-white font-bold text-[10px] text-center"
                        />
                      </div>
                      {profileError && <p className="text-red-300 font-bold text-[8px] text-center uppercase">{profileError}</p>}
                      <div className="flex gap-2 pt-1">
                        <button onClick={handleSaveProfile} disabled={isUpdatingProfile} className="flex-1 bg-white text-blue-700 py-2 rounded-lg font-black text-[10px] uppercase shadow-md active:scale-95 transition-all">SAVE</button>
                        <button onClick={handleCancelProfileEdit} disabled={isUpdatingProfile} className="flex-1 bg-black/30 text-white py-2 rounded-lg font-black text-[10px] uppercase active:scale-95 transition-all">CANCEL</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 font-medium text-xs mt-2 italic px-6 leading-tight max-w-[280px]">
                    {user.bio || "No bio set yet."}
                  </p>
                )}
              </div>
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
                    <div className="flex items-center space-x-4">
                      {/* Rater Photo with Label */}
                      <div className="flex flex-col items-center space-y-1">
                        {entry.rater.photoUrl ? (
                          <img src={entry.rater.photoUrl} alt={entry.rater.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg">
                            {entry.rater.gender === 'female' ? '💃' : '🕺'}
                          </div>
                        )}
                        <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Rater</span>
                      </div>
                      
                      {/* Space Separator */}
                      <div className="w-8"></div>
                      
                      {/* Opponent Photo with W/L Indicator */}
                      {entry.opponent ? (
                        <div className="flex items-center space-x-2">
                          {entry.opponent.photoUrl ? (
                            <img src={entry.opponent.photoUrl} alt={entry.opponent.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg">
                              {entry.opponent.gender === 'female' ? '💃' : '🕺'}
                            </div>
                          )}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-gray-900 ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                            {entry.isWinner ? 'W' : 'L'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg">
                            ?
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-gray-900 ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                            {entry.isWinner ? 'W' : 'L'}
                          </div>
                        </div>
                      )}
                      
                      <div className="ml-2">
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
              <div className="mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-xl">
                <p className="text-red-400 text-sm font-bold text-center mb-3">{photoError}</p>
                {photoError.includes('gender') && (
                  <div className="text-center">
                    <button
                      onClick={() => setPhotoError(null)}
                      className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
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
                    {/* Rater Photo with Label */}
                    <div className="flex flex-col items-center space-y-2">
                      {entry.rater.photoUrl ? (
                        <img src={entry.rater.photoUrl} alt={entry.rater.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl">
                          {entry.rater.gender === 'female' ? '💃' : '🕺'}
                        </div>
                      )}
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Rater</span>
                    </div>
                    
                    {/* Space Separator */}
                    <div className="w-12"></div>
                    
                    {/* Opponent Photo with W/L Indicator */}
                    {entry.opponent ? (
                      <div className="flex items-center space-x-3">
                        {entry.opponent.photoUrl ? (
                          <img src={entry.opponent.photoUrl} alt={entry.opponent.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl">
                            {entry.opponent.gender === 'female' ? '💃' : '🕺'}
                          </div>
                        )}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 border-gray-900 ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                          {entry.isWinner ? 'W' : 'L'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl">
                          ?
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 border-gray-900 ${entry.isWinner ? 'bg-green-500' : 'bg-red-500'}`}>
                          {entry.isWinner ? 'W' : 'L'}
                        </div>
                      </div>
                    )}
                    
                    <div className="ml-4">
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
      {/* Friends List Modal (Social) */}
      {showFriendsList && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowFriendsList(false); }}
        >
          <div className="w-full max-w-md h-[85vh] bg-[#4a5568] rounded-[1.5rem] flex flex-col border-[3px] border-[#2d3748] shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden font-sans">
            {/* Supercell Style Header */}
            <div className="bg-[#2d3748] p-4 flex items-center justify-center relative shadow-lg">
              <h3 className="text-2xl font-black text-white italic tracking-wider uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]">Social</h3>
              <button 
                onClick={() => setShowFriendsList(false)}
                className="absolute right-3 top-3 bg-[#e53e3e] hover:bg-[#c53030] text-white w-8 h-8 rounded-lg flex items-center justify-center border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px] shadow-lg transition-all"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#cbd5e0] relative">
              {/* Online Count */}
              <div className="text-center">
                <p className="text-[#38a169] font-black italic uppercase tracking-widest text-xs drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                  Online: {friends.length > 0 ? '1' : '0'}
                </p>
              </div>

              {/* Invite Friend Button */}
              <button
                onClick={handleShareInvite}
                className="w-full bg-gradient-to-b from-[#f6ad55] to-[#ed8936] hover:from-[#ed8936] hover:to-[#dd6b20] text-white py-4 rounded-xl font-black italic uppercase tracking-[0.15em] border-b-[6px] border-[#c05621] active:border-b-0 active:translate-y-[4px] shadow-xl text-lg drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] transition-all"
              >
                Invite Friend
              </button>

              {/* Pending Requests Section (Always shown at top if any) */}
              {pendingRequests.length > 0 && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 py-2">
                    <div className="flex-1 h-[2px] bg-red-400/30" />
                    <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] italic">Pending Requests</span>
                    <div className="flex-1 h-[2px] bg-red-400/30" />
                  </div>
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="bg-white p-4 rounded-2xl border-[3px] border-[#3182ce] shadow-md flex items-center justify-between transition-transform active:scale-[0.98]">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden border-2 border-gray-300">
                          {request.profilePhotoUrl ? (
                            <img src={request.profilePhotoUrl} alt={request.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#2d3748] font-black italic uppercase text-sm">{request.name}</p>
                          <p className="text-[#718096] font-bold text-[10px] uppercase italic">Wants to friend you</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleAcceptFriend(request.id)}
                          disabled={isAcceptingFriend === request.id}
                          className="bg-[#48bb78] hover:bg-[#38a169] text-white px-4 py-2 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#2f855a] active:border-b-0 active:translate-y-[2px] disabled:opacity-50"
                        >
                          {isAcceptingFriend === request.id ? '...' : 'Accept'}
                        </button>
                        <button 
                          onClick={() => handleDeclineFriend(request.id)}
                          className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-1 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px]"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leaderboard Divider */}
              <div className="flex items-center space-x-2 py-2">
                <div className="flex-1 h-[2px] bg-[#a0aec0]/50" />
                <span className="text-[#4a5568] font-black text-[10px] uppercase tracking-[0.3em] italic">Leaderboard</span>
                <div className="flex-1 h-[2px] bg-[#a0aec0]/50" />
              </div>

              {/* Friends List */}
              <div className="space-y-2">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="bg-gradient-to-b from-[#edf2f7] to-[#e2e8f0] p-3 rounded-2xl border-[3px] border-[#a0aec0] flex items-center justify-between shadow-md transition-transform active:scale-[0.98]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-white overflow-hidden border-2 border-[#718096] shadow-inner">
                            {friend.profilePhotoUrl ? (
                              <img src={friend.profilePhotoUrl} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl text-[#a0aec0]">👤</div>
                            )}
                          </div>
                          <div className="absolute top-0 left-0 bg-[#48bb78] w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-[#2d3748] font-black italic uppercase text-lg leading-tight tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
                              {friend.name}
                            </span>
                          </div>
                          <p className="text-[#718096] font-bold text-[10px] uppercase tracking-wider italic leading-none">
                            {friend.age} YRS • MOGGER
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-[#a0aec0]/20 px-3 py-2 rounded-xl border border-[#a0aec0]/30">
                        <span className="text-xl mr-2 drop-shadow-sm">🏆</span>
                        <span className="text-[#2d3748] font-black italic text-xl tracking-tighter">
                          {Math.round(friend.trophyScore || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-black/5 rounded-3xl border-4 border-dashed border-[#a0aec0]/30">
                    <div className="text-5xl mb-4 grayscale opacity-30 drop-shadow-lg">🤝</div>
                    <p className="text-xs font-black text-[#4a5568]/40 uppercase italic tracking-[0.2em] px-10 leading-relaxed">
                      No friends yet. Add some to start your climb!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};