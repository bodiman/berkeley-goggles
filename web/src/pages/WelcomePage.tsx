import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import choskiImg from '../assets/choski.jpg';
import oskimaxImg from '../assets/oskimax.png';

interface WelcomePageProps {}

const BOX_SIZE = 320;
const GOGGLES_SIZE = 120;
const MASK_RADIUS = 45;
const LENS_SPACING = 100; // Distance between lens centers
const LENS_OFFSET_X = 65; // Shift lenses horizontally
const LENS_OFFSET_Y = 10; // Shift lenses vertically
const BOUNCE_SPEED = 2;

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
    x: BOUNCE_SPEED * (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4),
    y: BOUNCE_SPEED * (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4),
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
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] flex flex-col safe-area-inset relative overflow-hidden">
      {/* Animated background blur orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-[120px]" />
      </div>

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
                <span
                  className="text-[250px] drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                  style={{ lineHeight: `${GOGGLES_SIZE}px` }}
                >
                  🥽
                </span>
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
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    size="large"
                    text="signin"
                    theme="filled_blue"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <p className="text-xs text-white/40 leading-relaxed text-center font-medium">
              Entertainment purposes only. Must be 18+.
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