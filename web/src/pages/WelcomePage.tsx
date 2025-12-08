import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Demo login for testing
      const success = await login('demo@elocheck.app', 'demo123');
      
      if (!success) {
        throw new Error('Demo login failed');
      }
    } catch (err) {
      console.error('Demo login failed:', err);
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">EC</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Elo Check</h1>
            <p className="text-xl text-gray-400">
              Scientific Beauty Ranking
            </p>
          </div>

          {/* Description */}
          <div className="mb-12 space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Get your scientifically-calculated attractiveness percentile through peer comparisons.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>📊</span>
                <span>Bradley-Terry Model</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔬</span>
                <span>Peer Rated</span>
              </div>
            </div>
          </div>

          {/* Authentication Options */}
          <div className="space-y-4">
            {/* Primary CTA - Sign Up */}
            <button
              onClick={onNavigateToRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors"
            >
              Create Account
            </button>
            
            {/* Secondary CTA - Log In */}
            <button
              onClick={onNavigateToLogin}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors"
            >
              Log In
            </button>
            
            {/* Demo Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-black text-sm text-gray-500">Or try demo</span>
              </div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900/50 disabled:cursor-not-allowed text-gray-300 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Starting Demo...' : 'Continue as Guest'}
            </button>
            
            {error && (
              <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              This app is for entertainment purposes only.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-gray-600">
          Built with privacy in mind • No data selling • Open source
        </p>
      </footer>
    </div>
  );
};