import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
// League types defined locally to avoid import issues
interface League {
  id: string;
  name: string;
  tier: number;
  category: 'cooked' | 'chopped' | 'chuzz' | 'mid' | 'huzz' | 'ultimate';
  minTrophy: number;
  maxTrophy: number;
  color: string;
  description: string;
}

interface LeagueProgression {
  currentLeague: League;
  nextLeague?: League;
  previousLeague?: League;
  progressToNext: number; // 0-100 percentage
  trophyToNextLeague?: number;
  trophyFromPreviousLeague: number;
}



interface LeagueLeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    age: number;
    location: string | null;
    profilePhotoUrl: string | null;
    height?: number; // Height in inches (for males)
    weight?: number; // Weight in pounds (for females)
    gender?: 'male' | 'female';
  };
  photo: {
    id: string;
    url: string;
  };
  stats: {
    trophyScore: number;
    percentile: number;
    totalComparisons: number;
    winRate: number;
  };
  isCurrentUser: boolean;
}

interface LeagueLeaderboardResponse {
  success: boolean;
  leaderboard: LeagueLeaderboardEntry[];
  league: {
    id: string;
    name: string;
    tier: number;
    category: string;
    minTrophy: number;
    maxTrophy: number;
    color: string;
  };
  timestamp: string;
}


interface UserStatsResponse {
  success: boolean;
  stats: {
    league: LeagueProgression;
    performance: {
      trophyScore: number;
      currentPercentile: number;
      totalComparisons: number;
    };
  };
}

export const LeaguePage: React.FC = () => {
  const { user } = useAuth();
  const [userLeague, setUserLeague] = useState<LeagueProgression | null>(null);
  const [leagueLeaderboard, setLeagueLeaderboard] = useState<LeagueLeaderboardEntry[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingLeagueLeaderboard, setIsLoadingLeagueLeaderboard] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-league' | 'info'>('my-league');
  const [selectedPlayer, setSelectedPlayer] = useState<LeagueLeaderboardEntry | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserLeague();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && userLeague?.currentLeague.id) {
      fetchLeagueLeaderboard();
    }
  }, [user?.id, userLeague?.currentLeague.id]);

  const fetchUserLeague = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingUser(true);
      const response = await apiRequest(`/api/rankings/my-stats?userId=${user.id}`);
      const data: UserStatsResponse = await response.json();
      
      if (data.success && data.stats) {
        setUserLeague(data.stats.league);
      }
    } catch (error) {
      console.error('Failed to fetch user league:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };


  const fetchLeagueLeaderboard = async () => {
    if (!user?.id || !userLeague?.currentLeague.id) return;

    try {
      setIsLoadingLeagueLeaderboard(true);
      const response = await apiRequest(`/api/rankings/league-leaderboard?userId=${user.id}&leagueId=${userLeague.currentLeague.id}&limit=20`);
      const data: LeagueLeaderboardResponse = await response.json();
      
      if (data.success) {
        setLeagueLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch league leaderboard:', error);
    } finally {
      setIsLoadingLeagueLeaderboard(false);
    }
  };

  const allLeagues: League[] = [
    { id: 'cooked-1', name: 'Cooked 1', tier: 1, category: 'cooked', minTrophy: 0, maxTrophy: 160, color: '#7F1D1D', description: 'Starting your journey' },
    { id: 'cooked-2', name: 'Cooked 2', tier: 2, category: 'cooked', minTrophy: 160, maxTrophy: 320, color: '#991B1B', description: 'Building fundamentals' },
    { id: 'cooked-3', name: 'Cooked 3', tier: 3, category: 'cooked', minTrophy: 320, maxTrophy: 480, color: '#B91C1C', description: 'Finding your style' },
    { id: 'chopped-1', name: 'Chopped 1', tier: 1, category: 'chopped', minTrophy: 480, maxTrophy: 640, color: '#C2410C', description: 'Getting competitive' },
    { id: 'chopped-2', name: 'Chopped 2', tier: 2, category: 'chopped', minTrophy: 640, maxTrophy: 800, color: '#EA580C', description: 'Rising through ranks' },
    { id: 'chopped-3', name: 'Chopped 3', tier: 3, category: 'chopped', minTrophy: 800, maxTrophy: 960, color: '#F97316', description: 'Proving your worth' },
    { id: 'chuzz-1', name: 'Chuzz 1', tier: 1, category: 'chuzz', minTrophy: 960, maxTrophy: 1120, color: '#A16207', description: 'Above average' },
    { id: 'chuzz-2', name: 'Chuzz 2', tier: 2, category: 'chuzz', minTrophy: 1120, maxTrophy: 1280, color: '#CA8A04', description: 'Standing out' },
    { id: 'chuzz-3', name: 'Chuzz 3', tier: 3, category: 'chuzz', minTrophy: 1280, maxTrophy: 1440, color: '#EAB308', description: 'Making waves' },
    { id: 'mid-1', name: 'Mid 1', tier: 1, category: 'mid', minTrophy: 1440, maxTrophy: 1600, color: '#16A34A', description: 'Solid performance' },
    { id: 'mid-2', name: 'Mid 2', tier: 2, category: 'mid', minTrophy: 1600, maxTrophy: 1760, color: '#22C55E', description: 'Consistently strong' },
    { id: 'mid-3', name: 'Mid 3', tier: 3, category: 'mid', minTrophy: 1760, maxTrophy: 1920, color: '#4ADE80', description: 'Approaching excellence' },
    { id: 'huzz-1', name: 'Huzz 1', tier: 1, category: 'huzz', minTrophy: 1920, maxTrophy: 2080, color: '#0EA5E9', description: 'Elite territory' },
    { id: 'huzz-2', name: 'Huzz 2', tier: 2, category: 'huzz', minTrophy: 2080, maxTrophy: 2240, color: '#3B82F6', description: 'Top tier competitor' },
    { id: 'huzz-3', name: 'Huzz 3', tier: 3, category: 'huzz', minTrophy: 2240, maxTrophy: 2400, color: '#6366F1', description: 'Nearing legendary status' },
    { id: 'ultimate-champion', name: 'Ultimate Champion', tier: 1, category: 'ultimate', minTrophy: 2400, maxTrophy: Infinity, color: '#9333EA', description: 'The pinnacle of achievement' },
  ];

  if (!user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{
        background: '#4A90E2', // Solid blueish-yellow background
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="drop-shadow-lg" style={{
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{
      background: '#4A90E2', // Solid blueish-yellow background
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100vh',
      height: '100dvh',
    }}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg" style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}>League</h1>
      </header>

      {/* Tab Navigation */}
      <div className="px-6">
        <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
          <button
            type="button"
            onClick={() => setActiveTab('my-league')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-league'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My League
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Info
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-4" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        minHeight: 0,
        paddingBottom: '80px', // Space for bottom navigation
      }}>
        <div className="max-w-md mx-auto space-y-6">
          
          {activeTab === 'my-league' && (
            <>
              {/* League Header */}
              {isLoadingUser ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-400 text-sm">Loading your league...</p>
                </div>
              ) : userLeague ? (
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: userLeague.currentLeague.color }}
                  >
                    <span className="text-white font-bold text-2xl">
                      {userLeague.currentLeague.tier}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {userLeague.currentLeague.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {userLeague.currentLeague.id === 'ultimate-champion' 
                      ? `${userLeague.currentLeague.minTrophy}+ Trophies` 
                      : `${userLeague.currentLeague.minTrophy} - ${userLeague.currentLeague.maxTrophy} Trophies`}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400">Unable to load league information</p>
                </div>
              )}

              {/* League Leaderboard */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">League Leaderboard</h3>
                
                {isLoadingLeagueLeaderboard ? (
                  <div className="text-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading league rankings...</p>
                  </div>
                ) : leagueLeaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leagueLeaderboard.map((entry) => (
                      <button
                        type="button"
                        key={entry.user.id}
                        onClick={() => setSelectedPlayer(entry)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-gray-700/70 ${
                          entry.isCurrentUser ? 'bg-blue-600/20 border border-blue-600/50' : 'bg-gray-700/50'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-8 text-center flex-shrink-0">
                          <span className={`font-bold ${
                            entry.rank === 1 ? 'text-yellow-400' : 
                            entry.rank === 2 ? 'text-gray-300' :
                            entry.rank === 3 ? 'text-orange-400' :
                            entry.isCurrentUser ? 'text-blue-400' :
                            'text-gray-400'
                          }`}>
                            {entry.rank === 1 ? '🥇' : 
                             entry.rank === 2 ? '🥈' :
                             entry.rank === 3 ? '🥉' :
                             `#${entry.rank}`}
                          </span>
                        </div>

                        {/* Photo */}
                        <img
                          src={entry.photo.url}
                          alt={`${entry.user.name}'s photo`}
                          className="w-12 h-12 rounded-full object-cover border border-gray-600 flex-shrink-0"
                        />

                        {/* User Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium truncate ${
                              entry.isCurrentUser ? 'text-blue-400' : 'text-white'
                            }`}>
                              {entry.user.name}
                              {entry.isCurrentUser && (
                                <span className="text-xs ml-2">(You)</span>
                              )}
                            </h4>
                            <span className="text-gray-400 text-sm flex-shrink-0">
                              {entry.user.age}
                            </span>
                          </div>
                          {entry.user.location && (
                            <p className="text-gray-400 text-sm truncate">
                              {entry.user.location}
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-white font-bold">
                            {entry.stats.trophyScore}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {entry.stats.winRate}% WR
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400">No players found in your league</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'info' && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">All Leagues</h3>
              
              <div className="space-y-2">
                {allLeagues.slice().reverse().map((league) => {
                  const isCurrentLeague = userLeague?.currentLeague.id === league.id;
                  return (
                    <div
                      key={league.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isCurrentLeague ? 'bg-blue-600/20 border border-blue-600/50' : 'bg-gray-700/50'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: league.color }}
                      >
                        <span className="text-white font-bold text-sm">
                          {league.tier}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">
                            {league.name}
                          </h4>
                          {isCurrentLeague && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {league.id === 'ultimate-champion' ? `${league.minTrophy}+ Trophies` : `${league.minTrophy} - ${league.maxTrophy} Trophies`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4"
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPlayer(null);
            }
          }}
        >
          <div className="w-full max-w-sm">
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Player Profile</h3>
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Close player profile"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center space-y-4">
                {/* Player Photo */}
                <div className="flex justify-center">
                  <img
                    src={selectedPlayer.user.profilePhotoUrl || selectedPlayer.photo.url}
                    alt={`${selectedPlayer.user.name}'s photo`}
                    className="w-40 h-40 rounded-2xl object-cover border-4 border-gray-700"
                  />
                </div>

                {/* Player Info */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    {selectedPlayer.user.name}
                  </h4>
                  <p className="text-gray-400">
                    {selectedPlayer.user.age} years old
                  </p>
                  {selectedPlayer.user.location && (
                    <p className="text-gray-400 text-sm">
                      📍 {selectedPlayer.user.location}
                    </p>
                  )}
                  
                  {/* Height/Weight Display */}
                  {(selectedPlayer.user.gender === 'male' && selectedPlayer.user.height) && (
                    <p className="text-gray-400 text-sm">
                      Height: {Math.floor(selectedPlayer.user.height / 12)}'{selectedPlayer.user.height % 12}"
                    </p>
                  )}
                  {(selectedPlayer.user.gender === 'female' && selectedPlayer.user.weight) && (
                    <p className="text-gray-400 text-sm">
                      Weight: {selectedPlayer.user.weight} lbs
                    </p>
                  )}
                </div>

                {/* League Rank */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-lg font-bold text-white mb-1">
                    League Rank #{selectedPlayer.rank}
                  </div>
                  <div className="text-gray-400 text-sm">
                    in {userLeague?.currentLeague.name}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-400">
                      {selectedPlayer.stats.trophyScore}
                    </div>
                    <div className="text-gray-400 text-sm">Trophy Score</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">
                      {selectedPlayer.stats.winRate}%
                    </div>
                    <div className="text-gray-400 text-sm">Win Rate</div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-lg font-bold text-white">
                    {selectedPlayer.stats.totalComparisons}
                  </div>
                  <div className="text-gray-400 text-sm">Total Comparisons</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};