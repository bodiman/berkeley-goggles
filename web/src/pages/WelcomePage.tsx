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
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-8">Berkeley Goggles</h3>
          {/* Bouncing Goggles Animation Box */}
          <div className="mb-8">
            <div
              className="mx-auto rounded-2xl overflow-hidden relative"
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