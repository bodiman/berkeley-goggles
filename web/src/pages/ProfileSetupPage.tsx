import React, { useState } from 'react';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';
import { useAuth } from '../contexts/AuthContext';
import type { UploadProgress } from '../services/photoUpload';
// TODO: Import from shared package once workspace is properly configured
interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height?: number; // Height in inches (for males)
  weight?: number; // Weight in pounds (for females)
  photo?: File | Blob;
  photoUrl?: string; // R2 CDN URL if already uploaded
}

interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
  uploadResult?: {
    id: string;
    url: string;
    thumbnailUrl?: string;
  };
}

export const ProfileSetupPage: React.FC = () => {
  const { setupProfile, logout, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<'name' | 'photo' | 'terms'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserProfileSetup>({
    name: '',
    age: 18,
    gender: 'male',
  });
  
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapture | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [hasSkippedPhoto, setHasSkippedPhoto] = useState(false);

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
    
    // Validate height/weight based on gender
    if (formData.gender === 'male') {
      if (!formData.height || formData.height < 60 || formData.height > 84) {
        setError('Height is required for males and must be between 5\'0" and 7\'0"');
        return;
      }
    } else if (formData.gender === 'female') {
      if (!formData.weight || formData.weight < 80 || formData.weight > 300) {
        setError('Weight is required for females and must be between 80 and 300 lbs');
        return;
      }
    }
    
    setError(null);
    setCurrentStep('photo');
  };

  const handlePhotoCapture = (capture: CameraCapture) => {
    console.log('📷 ProfileSetup: Photo captured:', {
      hasBlob: !!capture.blob,
      hasDataUrl: !!capture.dataUrl,
      hasUploadResult: !!capture.uploadResult,
      uploadResult: capture.uploadResult,
      timestamp: capture.timestamp
    });
    setCapturedPhoto(capture);
    // Don't auto-advance to terms step - wait for user confirmation
  };

  const handleUsePhoto = () => {
    setCurrentStep('terms');
  };

  const handlePhotoCaptureError = (errorMessage: string) => {
    console.error('📷 ProfileSetup: Photo capture error:', errorMessage);
    setError(errorMessage);
  };

  const handleSkipPhoto = () => {
    setHasSkippedPhoto(true);
    setCurrentStep('terms');
  };

  const handleTermsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow submission without photo if user explicitly skipped
    if (!capturedPhoto && !hasSkippedPhoto) {
      setError('Please take a profile photo or skip this step');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('👤 ProfileSetup: Starting profile setup with data:', {
        formData,
        capturedPhoto: capturedPhoto ? {
          hasBlob: !!capturedPhoto.blob,
          hasUploadResult: !!capturedPhoto.uploadResult,
          uploadResultUrl: capturedPhoto.uploadResult?.url
        } : { skipped: true }
      });

      const profileData: UserProfileSetup = {
        ...formData,
        // Only add photo data if user didn't skip the photo step
        ...(capturedPhoto && capturedPhoto.uploadResult?.url 
          ? { photoUrl: capturedPhoto.uploadResult.url }
          : capturedPhoto 
          ? { photo: capturedPhoto.blob }
          : {}
        ),
      };

      console.log('👤 ProfileSetup: Calling setupProfile with:', profileData);
      const success = await setupProfile(profileData);
      
      if (!success) {
        throw new Error('Failed to setup profile');
      }

      console.log('✅ ProfileSetup: Profile setup completed successfully');
      
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
      // Reset skip state if going back to photo step
      setHasSkippedPhoto(false);
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
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'male', weight: undefined }))}
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
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'female', height: undefined }))}
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

              {/* Height input for males */}
              {formData.gender === 'male' && (
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-white mb-2">
                    Height <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={Math.floor((formData.height || 70) / 12)}
                      onChange={(e) => {
                        const feet = parseInt(e.target.value);
                        const inches = (formData.height || 70) % 12;
                        setFormData(prev => ({ ...prev, height: feet * 12 + inches }));
                      }}
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 3 }, (_, i) => i + 5).map(feet => (
                        <option key={feet} value={feet}>{feet} ft</option>
                      ))}
                    </select>
                    <select
                      value={(formData.height || 70) % 12}
                      onChange={(e) => {
                        const feet = Math.floor((formData.height || 70) / 12);
                        const inches = parseInt(e.target.value);
                        setFormData(prev => ({ ...prev, height: feet * 12 + inches }));
                      }}
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: 12 }, (_, i) => i).map(inches => (
                        <option key={inches} value={inches}>{inches} in</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Height will be displayed in photo comparisons</p>
                </div>
              )}

              {/* Weight input for females */}
              {formData.gender === 'female' && (
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-white mb-2">
                    Weight <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="weight"
                      min="80"
                      max="300"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || undefined }))}
                      placeholder="Enter weight"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">lbs</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Weight will be displayed in photo comparisons</p>
                </div>
              )}

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
              onUsePhoto={handleUsePhoto}
              className="mb-6"
              userId={user?.id}
              autoUpload={true}
              onUploadProgress={setUploadProgress}
            />

            {/* Upload Progress Display */}
            {uploadProgress && (
              <div className="mt-4 p-4 bg-gray-800/80 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Uploading to cloud storage...</span>
                  <span className="text-white text-sm">{uploadProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Skip Photo Option */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-black text-sm text-gray-500">Or</span>
                </div>
              </div>
              
              <button
                onClick={handleSkipPhoto}
                className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Skip Photo for Now
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ You won't be able to rate others or be rated without a photo
              </p>
            </div>
          </div>
        )}

        {/* Terms Step */}
        {currentStep === 'terms' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Almost Done!</h2>
              <p className="text-gray-400">Ready to complete your profile setup</p>
            </div>

            {capturedPhoto ? (
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
            ) : hasSkippedPhoto ? (
              <div className="mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mx-auto border-4 border-gray-600">
                  <span className="text-4xl text-gray-500">👤</span>
                </div>
                <p className="text-center text-gray-400 mt-2">
                  Hello, {formData.name}!
                </p>
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                  <p className="text-yellow-400 text-sm text-center">
                    ⚠️ Without a photo, you won't be able to participate in ratings or see your ranking stats until you add one later.
                  </p>
                </div>
              </div>
            ) : null}

            {error && (
              <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleTermsSubmit}
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};