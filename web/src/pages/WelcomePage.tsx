import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import choskiImg from '../assets/choski.jpg';
import oskimaxImg from '../assets/oskimax.png';
import gogglesImg from '../assets/goggles.svg';

interface WelcomePageProps {}

const BOX_SIZE = 320;
const GOGGLES_SIZE = 320;
const MASK_RADIUS = 45;
const LENS_SPACING = 100; // Distance between lens centers
const LENS_OFFSET_X = 0; // Shift lenses horizontally
const LENS_OFFSET_Y = -50; // Shift lenses vertically
const BOUNCE_SPEED = 2;
const VELOCITY_SCALE = 0.65; // Scale factor for bounce velocity (increase for faster, decrease for slower)

export const WelcomePage: React.FC<WelcomePageProps> = () => {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bouncing goggles state - randomize starting position and velocity
  const [position, setPosition] = useState(() => ({
    x: Math.random() * (BOX_SIZE - GOGGLES_SIZE),
    y: Math.random() * (BOX_SIZE - GOGGLES_SIZE),
  }));
  const velocityRef = useRef({
    x: BOUNCE_SPEED * VELOCITY_SCALE * (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4),
    y: BOUNCE_SPEED * VELOCITY_SCALE * (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4),
  });
  const animationRef = useRef<number>();

  const animate = useCallback(() => {
    // Calculate bounds based on the actual lens positions (not just the emoji)
    // Right edge of right lens from position: GOGGLES_SIZE/2 + LENS_OFFSET_X + LENS_SPACING/2 + MASK_RADIUS
    // Left edge of left lens from position: GOGGLES_SIZE/2 + LENS_OFFSET_X - LENS_SPACING/2 - MASK_RADIUS
    const rightEdgeOffset = GOGGLES_SIZE / 2 + LENS_OFFSET_X + LENS_SPACING / 2 + MASK_RADIUS;
    const leftEdgeOffset = GOGGLES_SIZE / 2 + LENS_OFFSET_X - LENS_SPACING / 2 - MASK_RADIUS;
    const topEdgeOffset = GOGGLES_SIZE / 2 + LENS_OFFSET_Y - MASK_RADIUS;
    const bottomEdgeOffset = GOGGLES_SIZE / 2 + LENS_OFFSET_Y + MASK_RADIUS;

    const minX = -leftEdgeOffset;
    const maxX = BOX_SIZE - rightEdgeOffset;
    const minY = -topEdgeOffset;
    const maxY = BOX_SIZE - bottomEdgeOffset;

    setPosition((prev) => {
      let newX = prev.x + velocityRef.current.x;
      let newY = prev.y + velocityRef.current.y;

      if (newX <= minX || newX >= maxX) {
        velocityRef.current.x *= -1;
        newX = Math.max(minX, Math.min(newX, maxX));
      }
      if (newY <= minY || newY >= maxY) {
        velocityRef.current.y *= -1;
        newY = Math.max(minY, Math.min(newY, maxY));
      }

      return { x: newX, y: newY };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Calculate lens positions (two circles side by side)
  const centerX = position.x + GOGGLES_SIZE / 2 + LENS_OFFSET_X;
  const centerY = position.y + GOGGLES_SIZE / 2 + LENS_OFFSET_Y;
  const leftLensX = centerX - LENS_SPACING / 2;
  const rightLensX = centerX + LENS_SPACING / 2;

  // Handle Google login using Firebase Auth (platform-aware)
  const handleGoogleLogin = async () => {
    console.log('🔵 Google button clicked - using Firebase Auth');
    setIsLoading(true);
    setError(null);

    try {
      let firebaseIdToken: string;

      if (Capacitor.isNativePlatform()) {
        // Native platforms: use Capacitor Firebase Authentication plugin
        console.log('🔵 Using native Firebase Auth');
        const result = await FirebaseAuthentication.signInWithGoogle();
        console.log('🔵 Native Firebase Auth result:', result.user?.email);

        // Get the ID token from the native result
        const tokenResult = await FirebaseAuthentication.getIdToken();
        firebaseIdToken = tokenResult.token;
      } else {
        // Web platform: use Firebase Web SDK with popup
        console.log('🔵 Using web Firebase Auth');
        const result = await signInWithPopup(auth, googleProvider);
        console.log('🔵 Web Firebase Auth result:', result.user.email);
        firebaseIdToken = await result.user.getIdToken();
      }

      // Send to backend for verification and user creation/login
      const success = await loginWithGoogle(firebaseIdToken);
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
    <div className="min-h-screen flex flex-col safe-area-inset">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-8">
            Berkeley <span className="text-blue-300">Goggles</span>
          </h1>
          {/* Bouncing Goggles Animation Box */}
          <div className="mb-8">
            <div
              className="mx-auto rounded-[2rem] overflow-hidden relative border border-white/20 shadow-2xl"
              style={{ width: BOX_SIZE, height: BOX_SIZE }}
            >
              {/* Choski background */}
              <img
                src={choskiImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Oskimax revealed through left lens */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `circle(${MASK_RADIUS}px at ${leftLensX}px ${centerY}px)`,
                }}
              >
                <img
                  src={oskimaxImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {/* Oskimax revealed through right lens */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `circle(${MASK_RADIUS}px at ${rightLensX}px ${centerY}px)`,
                }}
              >
                <img
                  src={oskimaxImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {/* Oskimax revealed through connecting rectangle (top 3/4) */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(${centerY - MASK_RADIUS}px ${BOX_SIZE - rightLensX}px ${BOX_SIZE - (centerY - MASK_RADIUS + MASK_RADIUS * 1.5)}px ${leftLensX}px)`,
                }}
              >
                <img
                  src={oskimaxImg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Bouncing goggles */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: position.x,
                  top: position.y,
                  width: GOGGLES_SIZE,
                  height: GOGGLES_SIZE,
                }}
              >
                <img
                  src={gogglesImg}
                  alt="Goggles"
                  className="w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          </div>

          {/* Authentication Options */}
          <div className="space-y-4">
            {/* Google OAuth Option */}
            <div className="w-full flex justify-center">
              {isLoading ? (
                <div className="w-full py-3 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-center">
                  <span className="text-white/80 font-medium">Signing in with Google...</span>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <p className="text-xs text-white/40 leading-relaxed text-center font-medium">
              Dev Build v0.1.0-alpha
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center relative z-10">
        <p className="text-xs text-white/30 font-medium tracking-wide">
          Berkeley Goggles • Privacy First
        </p>
      </footer>
    </div>
  );
};