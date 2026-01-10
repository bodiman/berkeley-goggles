import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

interface WelcomePageProps {}

export const WelcomePage: React.FC<WelcomePageProps> = () => {
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

  console.log(
    "GOOGLE CLIENT ID (runtime):",
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  );


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
            {/* Google OAuth Option */}
            
            <div className="w-full">
              {isLoading ? (
                <div className="w-full py-3 px-4 bg-gray-800 border border-gray-600 rounded-lg text-center">
                  <span className="text-gray-300">Signing in with Google...</span>
                </div>
              ) : (
                <div style={{width: '100%'}}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    text="signin"
                    theme="outline"
                  />
                </div>
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