import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import ScrollMorphHero from '../components/ui/scroll-morph-hero';

interface TopPick {
  id: string;
  userId: string;
  name: string;
  url: string;
  rank: number;
  voteCount: number;
}

interface HottestRecapPageProps {
  onClose: () => void;
}

export const HottestRecapPage: React.FC<HottestRecapPageProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [topPicks, setTopPicks] = useState<TopPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPicks = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await apiRequest(`/api/comparisons/top-picks?userId=${user.id}&limit=20`);
        const data = await response.json();

        if (data.success) {
          setTopPicks(data.topPicks);
        } else {
          setError(data.error || 'Failed to load your top picks');
        }
      } catch (err) {
        console.error('Failed to fetch top picks:', err);
        setError('Failed to load your top picks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPicks();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold">Loading your hottest picks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <p className="text-xl font-bold mb-4">Oops!</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Transform topPicks to the format expected by ScrollMorphHero
  const images = topPicks.map((pick) => ({
    id: pick.id,
    url: pick.url.startsWith('http')
      ? pick.url
      : `${window.location.origin}/api/user/photo/${pick.url.split('/').pop()}`,
    name: pick.name,
    rank: pick.rank,
  }));

  return (
    <div className="fixed inset-0 z-50">
      <ScrollMorphHero
        images={images}
        title="Your Hottest Picks"
        subtitle={`Your top ${topPicks.length} most voted people on Berkeley Goggles`}
        onClose={onClose}
      />
    </div>
  );
};

export default HottestRecapPage;
