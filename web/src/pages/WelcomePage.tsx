import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

interface WelcomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      const success = await loginWithGoogle(credentialResponse.credential);
      
      if (!success) {
        throw new Error('Google login failed');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-8">Berkeley Goggles</h3>
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-7xl font-bold text-white">🥽</span>
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
            
            {/* Google OAuth Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-black text-sm text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="w-full">
              {isLoading ? (
                <div className="w-full py-3 px-4 bg-gray-800 border border-gray-600 rounded-lg text-center">
                  <span className="text-gray-300">Signing in with Google...</span>
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  text="signin"
                  width="100%"
                  theme="outline"
                />
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              Entertainment purposes only. Must be 18+.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-gray-600">
          Berkeley Goggles • Privacy First
        </p>
      </footer>
    </div>
  );
};