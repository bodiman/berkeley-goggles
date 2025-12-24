import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { MatchedPage } from './pages/MatchedPage';
import { LeaguePage } from './pages/LeaguePage';
import { BottomNavigation } from './components/BottomNavigation';
import './index.css';

const AppContent: React.FC = () => {
  const { user, navigationState, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-black">
      {/* Keep all tab components mounted to preserve state */}
      <div className={navigationState.currentTab === 'league' ? 'block' : 'hidden'}>
        <LeaguePage />
      </div>
      <div className={navigationState.currentTab === 'profile' ? 'block' : 'hidden'}>
        <ProfilePage />
      </div>
      <div className={navigationState.currentTab === 'play' ? 'block' : 'hidden'}>
        <ComparisonPage />
      </div>
      <div className={navigationState.currentTab === 'matched' ? 'block' : 'hidden'}>
        <MatchedPage />
      </div>
      <BottomNavigation />
    </div>
  );
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.warn('VITE_GOOGLE_CLIENT_ID not found in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;