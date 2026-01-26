import React, { useState, useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Initialize Firebase
import './config/firebase';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { MatchedPage } from './pages/MatchedPage';
import { LeaguePage } from './pages/LeaguePage';
import { InvitePage } from './pages/InvitePage';
import { BottomNavigation } from './components/BottomNavigation';
import { SwipeablePages } from './components/SwipeablePages';
import { LoadingScreen } from './components/LoadingScreen';
import { LoveAppContent } from './components/LoveAppContent';
import './index.css';

// Determine which app to show based on domain and path
const shouldShowLoveApp = (): boolean => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Production: loveatberkeley.net always shows Love app
  if (hostname.includes('loveatberkeley')) {
    return true;
  }

  // Production: berkeleygoggles.net never shows Love app
  if (hostname.includes('berkeleygoggles')) {
    return false;
  }

  // Localhost/dev: use path-based routing (/love)
  return pathname.startsWith('/love');
};

// Helper to check if we're on an invite path and extract token
const getInviteInfo = (): { isInvitePath: boolean; token: string | null } => {
  const path = window.location.pathname;
  console.log('🎫 App: Current pathname:', path);

  // Check if we're on any invite path
  const isInvitePath = path.startsWith('/invite');

  // Extract token if present
  const match = path.match(/^\/invite\/([^/]+)$/);
  const token = match ? match[1] : null;

  console.log('🎫 App: isInvitePath:', isInvitePath, 'token:', token);
  return { isInvitePath, token };
};

const AppContent: React.FC = () => {
  const { user, navigationState, isLoading } = useAuth();
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [hasShownInitialLoading, setHasShownInitialLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState(() => getInviteInfo());

  // Trigger loading screen on successful login
  useEffect(() => {
    if (navigationState.isAuthenticated && !hasShownInitialLoading && !isLoading) {
      setShowLoadingBar(true);
      setHasShownInitialLoading(true);
    }
  }, [navigationState.isAuthenticated, hasShownInitialLoading, isLoading]);

  // Handle invite link - show InvitePage if we're on an invite path
  if (inviteInfo.isInvitePath) {
    // If we have a token, validate it via InvitePage
    if (inviteInfo.token) {
      return (
        <InvitePage
          inviteToken={inviteInfo.token}
          onComplete={() => {
            setInviteInfo({ isInvitePath: false, token: null });
            window.history.replaceState({}, '', '/');
          }}
        />
      );
    }

    // No token found - show invalid invite error
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wide mb-2">
            Invalid Invite Link
          </h2>
          <p className="text-white/80 text-sm mb-6">
            This invite link is invalid or has expired. Please ask your friend to send you a new one.
          </p>
          <button
            type="button"
            onClick={() => {
              setInviteInfo({ isInvitePath: false, token: null });
              window.history.replaceState({}, '', '/');
            }}
            className="bg-white text-blue-700 font-black py-3 px-8 rounded-xl uppercase tracking-wide shadow-lg hover:bg-blue-50 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show artificial loading bar for 5 seconds
  if (showLoadingBar) {
    return <LoadingScreen onComplete={() => setShowLoadingBar(false)} />;
  }

  // Not authenticated - show authentication flow
  if (!navigationState.isAuthenticated || !user) {
    return <WelcomePage />;
  }

  // Authenticated but profile not complete - show setup
  if (!navigationState.profileSetupComplete) {
    return <ProfileSetupPage />;
  }

  // Authenticated with complete profile - show main app
  const pages = [
    { id: 'league' as const, component: <LeaguePage /> },
    { id: 'play' as const, component: <ComparisonPage /> },
    { id: 'matched' as const, component: <MatchedPage /> },
    { id: 'profile' as const, component: <ProfilePage /> },
  ];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '100dvh' }}>
      <SwipeablePages pages={pages} />
      <BottomNavigation />
    </div>
  );
};

function App() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#00000000' });
    }
  }, []);

  // Check if this should show Love@Berkeley app
  if (shouldShowLoveApp()) {
    return <LoveAppContent />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;