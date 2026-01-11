import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { MatchedPage } from './pages/MatchedPage';
import { LeaguePage } from './pages/LeaguePage';
import { InvitePage } from './pages/InvitePage';
import { BottomNavigation } from './components/BottomNavigation';
import { LoadingScreen } from './components/LoadingScreen';
import './index.css';

// Helper to extract invite ID from URL
const getInviteIdFromUrl = (): string | null => {
  const path = window.location.pathname;
  const match = path.match(/^\/invite\/([^/]+)$/);
  return match ? match[1] : null;
};

const AppContent: React.FC = () => {
  const { user, navigationState, isLoading } = useAuth();
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [hasShownInitialLoading, setHasShownInitialLoading] = useState(false);
  const [inviteId, setInviteId] = useState<string | null>(() => getInviteIdFromUrl());

  // Trigger loading screen on successful login
  useEffect(() => {
    if (navigationState.isAuthenticated && !hasShownInitialLoading && !isLoading) {
      setShowLoadingBar(true);
      setHasShownInitialLoading(true);
    }
  }, [navigationState.isAuthenticated, hasShownInitialLoading, isLoading]);

  // Handle invite link - show InvitePage if we have an invite ID
  if (inviteId) {
    return (
      <InvitePage
        inviterId={inviteId}
        onComplete={() => {
          setInviteId(null);
          window.history.replaceState({}, '', '/');
        }}
      />
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
  return (
    <div className="relative w-full h-screen h-dvh overflow-hidden">
      {/* Keep all tab components mounted to preserve state */}
      <div className={`absolute inset-0 ${navigationState.currentTab === 'league' ? 'block' : 'hidden'}`}>
        <LeaguePage />
      </div>
      <div className={`absolute inset-0 ${navigationState.currentTab === 'profile' ? 'block' : 'hidden'}`}>
        <ProfilePage />
      </div>
      <div className={`absolute inset-0 ${navigationState.currentTab === 'play' ? 'block' : 'hidden'}`}>
        <ComparisonPage />
      </div>
      <div className={`absolute inset-0 ${navigationState.currentTab === 'matched' ? 'block' : 'hidden'}`}>
        <MatchedPage />
      </div>
      <BottomNavigation />
    </div>
  );
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Debug: Log the client ID to console
  console.log('🔍 Google Client ID Debug:', {
    clientId: googleClientId || 'NOT SET',
    clientIdLength: googleClientId?.length || 0,
    envVar: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    allEnvVars: Object.keys(import.meta.env).filter(key => key.includes('GOOGLE') || key.includes('CLIENT'))
  });
  
  if (!googleClientId) {
    console.warn('⚠️ VITE_GOOGLE_CLIENT_ID not found in environment variables');
    console.warn('💡 Make sure you have web/.env.local file with VITE_GOOGLE_CLIENT_ID set');
  } else {
    console.log('✅ Google Client ID loaded:', googleClientId.substring(0, 20) + '...');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;