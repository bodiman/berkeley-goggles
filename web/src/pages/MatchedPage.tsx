import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';

interface MatchedUser {
  id: string;
  name: string;
  profilePhotoUrl?: string;
  currentPercentile: number;
  totalComparisons: number;
  confidence: 'low' | 'medium' | 'high';
}

export const MatchedPage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches on component mount
  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user?.id]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiRequest(`/api/matches/get-matches?userId=${user?.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      
      if (data.success) {
        setMatches(data.matches || []);
      } else {
        setError(data.error || 'Failed to fetch matches');
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setError('Failed to fetch matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'High confidence';
      case 'medium': return 'Medium confidence';
      case 'low': return 'Low confidence';
      default: return 'Unknown confidence';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Finding your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur border-b border-gray-800 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold">Your Matches</h1>
          <p className="text-sm text-gray-400 mt-1">
            People who fall within your percentile range
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-4 pb-20">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchMatches}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {matches.length === 0 && !error ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-600 mb-4"
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
            <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
            <p className="text-gray-400 mb-4">
              Try rating more photos to find people in your percentile range.
            </p>
            <p className="text-sm text-gray-500">
              You can adjust your matching range in your profile settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                {/* Profile Photo */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800">
                    {match.profilePhotoUrl ? (
                      <img
                        src={match.profilePhotoUrl}
                        alt={`${match.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">{match.name}</h3>
                  
                  {/* Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Percentile:</span>
                      <span className="text-blue-400 font-medium">
                        {Math.round(match.currentPercentile)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Comparisons:</span>
                      <span className="text-white">{match.totalComparisons}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Confidence:</span>
                      <span className={getConfidenceColor(match.confidence)}>
                        {getConfidenceText(match.confidence)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};