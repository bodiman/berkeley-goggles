import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { MatchedPage } from './pages/MatchedPage';
import { BottomNavigation } from './components/BottomNavigation';
import './index.css';

type AuthPageType = 'welcome' | 'login' | 'register' | 'forgot-password';

const AppContent: React.FC = () => {
  const { user, navigationState, isLoading } = useAuth();
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPageType>('welcome');

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
    const handleNavigateToLogin = () => setCurrentAuthPage('login');
    const handleNavigateToRegister = () => setCurrentAuthPage('register');
    const handleNavigateToWelcome = () => setCurrentAuthPage('welcome');
    const handleNavigateToForgotPassword = () => setCurrentAuthPage('forgot-password');

    switch (currentAuthPage) {
      case 'login':
        return (
          <LoginPage
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToWelcome={handleNavigateToWelcome}
            onNavigateToForgotPassword={handleNavigateToForgotPassword}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToWelcome={handleNavigateToWelcome}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onNavigateToLogin={handleNavigateToLogin}
          />
        );
      case 'welcome':
      default:
        return (
          <WelcomePage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        );
    }
  }

  // Authenticated but profile not complete - show setup
  if (!navigationState.profileSetupComplete) {
    return <ProfileSetupPage />;
  }

  // Authenticated with complete profile - show main app
  return (
    <div className="min-h-screen bg-black">
      {navigationState.currentTab === 'profile' && <ProfilePage />}
      {navigationState.currentTab === 'play' && <ComparisonPage />}
      {navigationState.currentTab === 'matched' && <MatchedPage />}
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