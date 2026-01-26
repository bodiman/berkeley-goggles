import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

interface LoveWelcomePageProps {
  onLogin: (firebaseIdToken: string) => Promise<boolean>;
}

export const LoveWelcomePage: React.FC<LoveWelcomePageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let firebaseIdToken: string;

      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle();
        console.log('Native Firebase Auth result:', result.user?.email);
        const tokenResult = await FirebaseAuthentication.getIdToken();
        firebaseIdToken = tokenResult.token;
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Web Firebase Auth result:', result.user.email);
        firebaseIdToken = await result.user.getIdToken();
      }

      const success = await onLogin(firebaseIdToken);
      if (!success) {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col safe-area-inset" style={{
      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    }}>
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-md mx-auto text-center">
          {/* Heart Logo */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30">
              <span className="text-5xl">💕</span>
            </div>
          </div>

          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-4">
            Love<span className="text-pink-200">@Berkeley</span>
          </h1>

          <p className="text-white/90 text-lg mb-8 font-medium">
            Help us understand what Berkeley women find attractive.
            <br />
            <span className="text-pink-200">Quick questionnaire + 25 comparisons.</span>
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-white/90 text-xs font-semibold">100% Anonymous</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white/90 text-xs font-semibold">5 Min Total</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white/90 text-xs font-semibold">Shape Dating</div>
            </div>
          </div>

          {/* Authentication */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="w-full py-4 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-center">
                <span className="text-white/80 font-medium">Signing in...</span>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Get Started with Google
              </button>
            )}

            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <p className="text-xs text-white/50 leading-relaxed text-center font-medium">
              By continuing, you agree to help improve Berkeley dating
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center relative z-10">
        <p className="text-xs text-white/40 font-medium tracking-wide">
          Love@Berkeley
        </p>
      </footer>
    </div>
  );
};
