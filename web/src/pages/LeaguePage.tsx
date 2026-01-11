import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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

interface LeagueLeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    age: number;
    location: string | null;
    profilePhotoUrl: string | null;
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
    minElo: number;
    maxElo: number;
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
  const [isLoadingLeagueLeaderboard, setIsLoadingLeagueLeaderboard] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-league' | 'info'>('my-league');
  const [selectedPlayer, setSelectedPlayer] = useState<LeagueLeaderboardEntry | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserLeague();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
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
      } else {
        // Default to first league for new users
        setUserLeague({
          currentLeague: allLeagues[0],
          progressToNext: 0,
          eloFromPreviousLeague: 0,
          eloToNextLeague: allLeagues[0].maxElo
        });
      }
    } catch (error) {
      console.error('Failed to fetch user league:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };


  const fetchLeagueLeaderboard = async () => {
    if (!user?.id) return;
    
    const leagueId = userLeague?.currentLeague.id || allLeagues[0].id;

    try {
      setIsLoadingLeagueLeaderboard(true);
      const response = await apiRequest(`/api/rankings/league-leaderboard?userId=${user.id}&leagueId=${leagueId}&limit=20`);
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
    { id: 'cooked-1', name: 'Cooked 1', tier: 1, category: 'cooked', minElo: 0, maxElo: 240, color: '#7F1D1D', description: 'Starting your journey' },
    { id: 'cooked-2', name: 'Cooked 2', tier: 2, category: 'cooked', minElo: 240, maxElo: 480, color: '#B91C1C', description: 'Finding your style' },
    { id: 'chopped-1', name: 'Chopped 1', tier: 1, category: 'chopped', minElo: 480, maxElo: 720, color: '#C2410C', description: 'Getting competitive' },
    { id: 'chopped-2', name: 'Chopped 2', tier: 2, category: 'chopped', minElo: 720, maxElo: 960, color: '#F97316', description: 'Proving your worth' },
    { id: 'chuzz-1', name: 'Chuzz 1', tier: 1, category: 'chuzz', minElo: 960, maxElo: 1200, color: '#A16207', description: 'Above average' },
    { id: 'chuzz-2', name: 'Chuzz 2', tier: 2, category: 'chuzz', minElo: 1200, maxElo: 1440, color: '#EAB308', description: 'Making waves' },
    { id: 'mid-1', name: 'Mid 1', tier: 1, category: 'mid', minElo: 1440, maxElo: 1680, color: '#16A34A', description: 'Solid performance' },
    { id: 'mid-2', name: 'Mid 2', tier: 2, category: 'mid', minElo: 1680, maxElo: 1920, color: '#4ADE80', description: 'Approaching excellence' },
    { id: 'huzz-1', name: 'Huzz 1', tier: 1, category: 'huzz', minElo: 1920, maxElo: 2160, color: '#0EA5E9', description: 'Elite territory' },
    { id: 'huzz-2', name: 'Huzz 2', tier: 2, category: 'huzz', minElo: 2160, maxElo: 2400, color: '#6366F1', description: 'Nearing legendary status' },
    { id: 'ultimate-champion', name: 'Ultimate Champion', tier: 1, category: 'ultimate', minElo: 2400, maxElo: Infinity, color: '#9333EA', description: 'The pinnacle of achievement' },
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

      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex-shrink-0 z-10">
        <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
          LEAGUE
        </h1>
      </header>

      {/* Tab Navigation */}
      <div className="px-6 mt-4 z-10">
        <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('my-league')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'my-league'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'info'
                ? 'bg-white text-blue-700 shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All Leagues
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 relative z-10" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        minHeight: 0,
        paddingBottom: '100px',
      }}>
        <div className="max-w-md mx-auto space-y-6">
          
          {activeTab === 'my-league' && (
            <>
              {/* League Header Card */}
              {isLoadingUser ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 text-center">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60 font-black uppercase tracking-widest text-xs">Identifying League...</p>
                </div>
              ) : userLeague ? (
                <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/30 shadow-2xl text-center transform transition-transform hover:scale-102">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-xl"
                    style={{ 
                      backgroundColor: userLeague.currentLeague.color,
                      boxShadow: `0 0 30px ${userLeague.currentLeague.color}66`
                    }}
                  >
                    <span className="text-white font-black text-4xl drop-shadow-lg">
                      {userLeague.currentLeague.tier}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
                    {userLeague.currentLeague.name}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                    <p className="text-blue-100/80 font-black text-[10px] uppercase tracking-[0.2em]">
                      {userLeague.currentLeague.id === 'ultimate-champion' 
                        ? `${userLeague.currentLeague.minElo}+ Trophies` 
                        : `${userLeague.currentLeague.minElo} - ${userLeague.currentLeague.maxElo} Trophies`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 backdrop-blur-xl rounded-[2rem] p-8 border border-red-500/20 text-center">
                  <p className="text-red-300 font-black uppercase tracking-widest text-xs">Failed to load league</p>
                </div>
              )}

              {/* Leaderboard List */}
              <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">Leaderboard</h3>
                  <div className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest">Top 20 Players</div>
                </div>
                
                {isLoadingLeagueLeaderboard ? (
                  <div className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Loading rankings...</p>
                  </div>
                ) : leagueLeaderboard.length > 0 ? (
                  <div className="space-y-3">
                    {leagueLeaderboard.map((entry) => (
                      <button
                        type="button"
                        key={entry.user.id}
                        onClick={() => setSelectedPlayer(entry)}
                        className={`w-full group flex items-center space-x-4 p-4 rounded-[1.5rem] transition-all duration-300 hover:scale-[1.03] ${
                          entry.isCurrentUser 
                            ? 'bg-blue-500/30 border-2 border-white/50 shadow-lg' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {/* Rank with Badge */}
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          <span className={`text-xl font-black ${
                            entry.rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 
                            entry.rank === 2 ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]' :
                            entry.rank === 3 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]' :
                            'text-white/40'
                          }`}>
                            {entry.rank === 1 ? '🥇' : 
                             entry.rank === 2 ? '🥈' :
                             entry.rank === 3 ? '🥉' :
                             entry.rank}
                          </span>
                        </div>

                        {/* Bigger Profile Photo */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={entry.user.profilePhotoUrl || entry.photo.url}
                            alt={entry.user.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md group-hover:border-white/40 transition-colors"
                          />
                          {entry.isCurrentUser && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-900" />
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0 text-left flex items-center">
                          <h4 
                            className={`font-black uppercase tracking-tight text-sm ${
                              entry.isCurrentUser ? 'text-white' : 'text-white/90'
                            }`}
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {entry.user.name.split(' ')[0]}
                          </h4>
                        </div>

                        {/* Prominent Trophies */}
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center justify-end space-x-1">
                            <span className="text-white font-black text-lg">
                              {Math.round(entry.stats.trophyScore)}
                            </span>
                            <span className="text-lg">🏆</span>
                          </div>
                          <div className={`text-[8px] font-black uppercase tracking-widest ${
                            entry.stats.winRate > 50 ? 'text-green-400' : 'text-blue-200/40'
                          }`}>
                            {Math.round(entry.stats.winRate)}% Win Rate
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10">
                    <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">No competitors yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'info' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl space-y-4">
              <h3 className="text-lg font-black text-white tracking-tight uppercase px-2 mb-2">League Progression</h3>
              
              <div className="space-y-3">
                {allLeagues.slice().reverse().map((league) => {
                  const isCurrentLeague = userLeague?.currentLeague.id === league.id;
                  return (
                    <div
                      key={league.id}
                      className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                        isCurrentLeague 
                          ? 'bg-blue-500/20 border-2 border-white/40 shadow-lg' 
                          : 'bg-white/5 border border-white/5'
                      }`}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: league.color }}
                      >
                        <span className="text-white font-black text-xl">
                          {league.tier}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-black text-sm uppercase tracking-tight">
                            {league.name}
                          </h4>
                          {isCurrentLeague && (
                            <span className="bg-white text-blue-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 font-black text-[9px] uppercase tracking-widest mt-1">
                          {league.id === 'ultimate-champion' ? `${league.minElo}+ Trophies` : `${league.minElo} - ${league.maxElo} Trophies`}
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
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPlayer(null);
            }
          }}
        >
          <div className="w-full max-w-sm bg-gray-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-transform hover:scale-125"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center space-y-6">
              {/* Player Photo */}
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl blur opacity-75"></div>
                <img
                  src={selectedPlayer.user.profilePhotoUrl || selectedPlayer.photo.url}
                  alt={selectedPlayer.user.name}
                  className="relative w-48 h-48 rounded-3xl object-cover border-4 border-white shadow-2xl"
                />
              </div>

              {/* Player Info */}
              <div>
                <h4 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
                  {selectedPlayer.user.name.split(' ')[0]}
                </h4>
                <div className="flex items-center justify-center space-x-2 text-white/60 font-black text-xs uppercase tracking-widest">
                  <span>{selectedPlayer.user.age} YRS</span>
                  <span>•</span>
                  <span>{selectedPlayer.user.location || 'UC BERKELEY'}</span>
                </div>
              </div>

              {/* League & Rank */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1">LEAGUE RANK</div>
                  <div className="text-2xl font-black text-white tracking-tighter">#{selectedPlayer.rank}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1">CURRENT LEAGUE</div>
                  <div className="text-sm font-black text-white uppercase tracking-tight">{userLeague?.currentLeague.name}</div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1">TROPHIES</div>
                  <div className="text-2xl font-black text-blue-400 tracking-tighter flex items-center justify-center space-x-1">
                    <span>{Math.round(selectedPlayer.stats.trophyScore)}</span>
                    <span className="text-xl">🏆</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1">WIN RATE</div>
                  <div className="text-2xl font-black text-green-400 tracking-tighter">{Math.round(selectedPlayer.stats.winRate)}%</div>
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                <div className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1">TOTAL BATTLES</div>
                <div className="text-xl font-black text-white">{selectedPlayer.stats.totalComparisons}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};