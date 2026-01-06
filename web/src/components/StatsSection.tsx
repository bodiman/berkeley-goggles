import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';

interface PhotoStats {
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
    lastUpdated?: string;
  };
  context: {
    totalRankedPhotos: number;
    rankPosition: number;
  };
}

interface StatsSectionProps {
  className?: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PhotoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiRequest(`/api/rankings/my-stats?userId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.error || 'Failed to load stats');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getPercentileDescription = (percentile: number) => {
    if (percentile >= 90) return 'Exceptional';
    if (percentile >= 75) return 'Above Average';
    if (percentile >= 50) return 'Average';
    if (percentile >= 25) return 'Below Average';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-400">Loading stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center text-red-400">
          <p>Failed to load stats</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Active Photo</h3>
          <p className="text-gray-400 text-sm mb-4">
            Upload a photo and set it as active to see your ranking stats
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Upload Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-1">Ranking Stats</h3>
        <p className="text-gray-400 text-sm">Your current photo performance</p>
      </div>

      {/* Photo Preview */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={stats.photo.url.startsWith('http') 
                ? stats.photo.url 
                : `http://localhost:3001/api/user/photo/${stats.photo.url.split('/').pop()}`}
              alt="Your active photo"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">Active Photo</h4>
            <p className="text-gray-400 text-sm">
              Uploaded {new Date(stats.photo.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-6">
        {/* Percentile Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-white mb-1">
            {Math.round(stats.performance.currentPercentile)}th
          </div>
          <div className="text-blue-400 font-medium mb-2">Percentile</div>
          <div className="text-sm text-gray-400">
            {getPercentileDescription(stats.performance.currentPercentile)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Rank #{stats.context.rankPosition} of {stats.context.totalRankedPhotos} active photos
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{stats.performance.totalComparisons}</div>
            <div className="text-xs text-gray-400">Total Ratings</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{stats.performance.winRate}%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Wins</span>
            <span className="text-white font-medium">{stats.performance.wins}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Losses</span>
            <span className="text-white font-medium">{stats.performance.losses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Confidence</span>
            <span className={`font-medium capitalize ${getConfidenceColor(stats.performance.confidence)}`}>
              {stats.performance.confidence}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Trend</span>
            <span className="text-white font-medium">
              {getTrendIcon(stats.performance.trend)} {stats.performance.trend}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        {stats.performance.lastUpdated && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Last updated {new Date(stats.performance.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Confidence Explanation */}
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            {stats.performance.confidence === 'low' && 'Get more ratings to improve confidence'}
            {stats.performance.confidence === 'medium' && 'Moderately confident in your ranking'}
            {stats.performance.confidence === 'high' && 'High confidence in your ranking'}
          </p>
        </div>
      </div>
    </div>
  );
};