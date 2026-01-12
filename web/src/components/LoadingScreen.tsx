import React, { useState, useEffect } from 'react';
import { ShaderAnimation } from './ui/shader-animation';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200); // Small delay after finishing
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo and Name */}
        <div className="mb-12 text-center animate-in fade-in zoom-in duration-1000">
          <div className="text-8xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🥽</div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Berkeley <span className="text-blue-400">Goggles</span>
          </h1>
        </div>

        {/* Loading Bar Container */}
        <div className="w-64 h-4 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {/* Animated Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%] animate-shimmer transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Text */}
        <div className="mt-3">
          <p className="text-blue-200 font-black italic uppercase tracking-widest text-[10px] animate-pulse">
            Syncing Rankings... {Math.round(progress)}%
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
