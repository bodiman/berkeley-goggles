import React, { useState, useEffect, useCallback } from 'react';
import { LoveWelcomePage, LoveQuestionnairePage, LoveComparisonPage, LovePhotoUploadPage } from '../pages/love';
import { apiRequest, API_ENDPOINTS } from '../config/api';

interface LoveUser {
  id: string;
  name: string;
  email?: string;
}

interface LoveStatus {
  questionnaireCompleted: boolean;
  comparisonsCompleted: number;
  comparisonsRequired: number;
  onboardingComplete: boolean;
}

type LoveFlowStep = 'welcome' | 'questionnaire' | 'comparison' | 'photo-upload' | 'complete';

export const LoveAppContent: React.FC = () => {
  const [user, setUser] = useState<LoveUser | null>(null);
  const [status, setStatus] = useState<LoveStatus | null>(null);
  const [currentStep, setCurrentStep] = useState<LoveFlowStep>('welcome');
  const [isLoading, setIsLoading] = useState(true);
  const [isContinueRanking, setIsContinueRanking] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('love-berkeley-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          await checkLoveStatus(userData.id);
        }
      } catch (error) {
        console.error('Failed to initialize love auth:', error);
        localStorage.removeItem('love-berkeley-user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check love onboarding status
  const checkLoveStatus = useCallback(async (userId: string) => {
    try {
      const response = await apiRequest(`/api/love/status/${userId}`);
      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
        determineStep(data.status);
      }
    } catch (error) {
      console.error('Failed to check love status:', error);
    }
  }, []);

  // Determine which step to show based on status
  const determineStep = (status: LoveStatus) => {
    if (status.onboardingComplete) {
      setCurrentStep('complete');
    } else if (!status.questionnaireCompleted) {
      setCurrentStep('questionnaire');
    } else {
      setCurrentStep('comparison');
    }
  };

  // Handle Google login
  const handleLogin = async (firebaseIdToken: string): Promise<boolean> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.auth.google, {
        method: 'POST',
        body: JSON.stringify({
          firebaseIdToken,
          loveSource: 'love', // Mark as love user
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.success && data.user) {
        const loveUser: LoveUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        };

        setUser(loveUser);
        localStorage.setItem('love-berkeley-user', JSON.stringify(loveUser));

        // Check love status to determine next step
        await checkLoveStatus(loveUser.id);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Love login failed:', error);
      return false;
    }
  };

  // Handle questionnaire complete
  const handleQuestionnaireComplete = () => {
    setCurrentStep('photo-upload');
    if (user) {
      checkLoveStatus(user.id);
    }
  };

  // Handle comparison complete
  const handleComparisonComplete = () => {
    setIsContinueRanking(false);
    setCurrentStep('complete');
  };

  // Handle photo upload complete
  const handlePhotoUploadComplete = () => {
    setCurrentStep('comparison');
  };

  // Handle continue ranking (return to comparison)
  const handleContinueRanking = () => {
    setIsContinueRanking(true);
    setCurrentStep('comparison');
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Welcome / Login
  if (!user || currentStep === 'welcome') {
    return <LoveWelcomePage onLogin={handleLogin} />;
  }

  // Questionnaire
  if (currentStep === 'questionnaire') {
    return (
      <LoveQuestionnairePage
        userId={user.id}
        onComplete={handleQuestionnaireComplete}
      />
    );
  }

  // Comparison
  if (currentStep === 'comparison') {
    return (
      <LoveComparisonPage
        userId={user.id}
        onComplete={handleComparisonComplete}
        isContinueRanking={isContinueRanking}
      />
    );
  }

  // Photo Upload
  if (currentStep === 'photo-upload') {
    return (
      <LovePhotoUploadPage
        userId={user.id}
        onComplete={handlePhotoUploadComplete}
      />
    );
  }

  // Complete
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-inset" style={{
      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
    }}>
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/30 mb-6">
          <span className="text-5xl">💕</span>
        </div>

        <h1 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
          Thank You!
        </h1>

        <p className="text-white/90 text-lg mb-8">
          We'll let you know as soon as we find a match!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleContinueRanking}
            className="w-full bg-white text-purple-600 py-4 px-6 rounded-2xl font-bold shadow-xl hover:bg-gray-50 transition-colors"
          >
            Continue Ranking
          </button>

          <button
            onClick={() => window.close()}
            className="w-full bg-white/15 text-white py-4 px-6 rounded-2xl font-semibold border border-white/20 hover:bg-white/25 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 px-6 py-4 text-center">
        <p className="text-xs text-white/40 font-medium tracking-wide">
          Love@Berkeley
        </p>
      </footer>
    </div>
  );
};
