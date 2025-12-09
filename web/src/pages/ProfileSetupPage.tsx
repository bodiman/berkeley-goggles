import React, { useState } from 'react';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';
import { useAuth } from '../contexts/AuthContext';
// TODO: Import from shared package once workspace is properly configured
interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
  photo?: File | Blob;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
}

export const ProfileSetupPage: React.FC = () => {
  const { setupProfile, logout } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<'name' | 'photo' | 'terms'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserProfileSetup>({
    name: '',
    age: 18,
    gender: 'male',
    agreedToTerms: false,
    agreedToPrivacy: false,
  });
  
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapture | null>(null);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters)');
      return;
    }
    if (formData.age < 18) {
      setError('You must be at least 18 years old');
      return;
    }
    setError(null);
    setCurrentStep('photo');
  };

  const handlePhotoCapture = (capture: CameraCapture) => {
    setCapturedPhoto(capture);
    setCurrentStep('terms');
  };

  const handlePhotoCaptureError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleTermsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
      setError('Please accept the terms and privacy policy to continue');
      return;
    }

    if (!capturedPhoto) {
      setError('Please take a profile photo');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const profileData: UserProfileSetup = {
        ...formData,
        photo: capturedPhoto.blob,
      };

      const success = await setupProfile(profileData);
      
      if (!success) {
        throw new Error('Failed to setup profile');
      }
      
      // Success handled by AuthContext navigation update
    } catch (err) {
      console.error('Profile setup error:', err);
      setError('Failed to setup your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep === 'photo') {
      setCurrentStep('name');
    } else if (currentStep === 'terms') {
      setCurrentStep('photo');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col safe-area-inset">
      {/* Header */}
      <header className="px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          {currentStep !== 'name' ? (
            <button
              onClick={goBack}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              ← Sign out
            </button>
          )}
          <h1 className="text-2xl font-bold text-white">Profile Setup</h1>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            Sign out
          </button>
        </div>
        
        {/* Progress Indicator */}
        <div className="mt-4 flex space-x-2">
          <div className={`flex-1 h-1 rounded ${currentStep === 'name' ? 'bg-blue-500' : 'bg-blue-500'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'photo' || currentStep === 'terms' ? 'bg-blue-500' : 'bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'terms' ? 'bg-blue-500' : 'bg-gray-700'}`} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Name Step */}
        {currentStep === 'name' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
              <p className="text-gray-400">Let's set up your profile to get started</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="given-name"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-white mb-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  min="18"
                  max="99"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                    className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                      formData.gender === 'male'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                    className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                      formData.gender === 'female'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {/* Photo Step */}
        {currentStep === 'photo' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Take Your Photo</h2>
              <p className="text-gray-400">This helps others recognize you in rankings</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <CameraCaptureComponent
              onCapture={handlePhotoCapture}
              onError={handlePhotoCaptureError}
              className="mb-6"
            />
          </div>
        )}

        {/* Terms Step */}
        {currentStep === 'terms' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Almost Done!</h2>
              <p className="text-gray-400">Please review and accept our terms</p>
            </div>

            {capturedPhoto && (
              <div className="mb-6">
                <img
                  src={capturedPhoto.dataUrl}
                  alt="Your profile photo"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-600"
                />
                <p className="text-center text-gray-400 mt-2">
                  Hello, {formData.name}!
                </p>
              </div>
            )}

            <form onSubmit={handleTermsSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                    className="w-5 h-5 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    I agree to the <span className="text-blue-400 underline">Terms of Service</span> and understand that this app is for entertainment purposes only.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToPrivacy}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToPrivacy: e.target.checked }))}
                    className="w-5 h-5 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    I agree to the <span className="text-blue-400 underline">Privacy Policy</span> and consent to photo processing for ranking purposes.
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};