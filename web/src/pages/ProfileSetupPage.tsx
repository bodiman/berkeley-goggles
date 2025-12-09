import React, { useState } from 'react';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';
import { useAuth } from '../contexts/AuthContext';
import type { UploadProgress } from '../services/photoUpload';
// TODO: Import from shared package once workspace is properly configured
interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
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
    console.log('📷 ProfileSetup: Photo captured:', {
      hasBlob: !!capture.blob,
      hasDataUrl: !!capture.dataUrl,
      hasUploadResult: !!capture.uploadResult,
      uploadResult: capture.uploadResult,
      timestamp: capture.timestamp
    });
    setCapturedPhoto(capture);
    setCurrentStep('terms');
  };

  const handlePhotoCaptureError = (errorMessage: string) => {
    console.error('📷 ProfileSetup: Photo capture error:', errorMessage);
    setError(errorMessage);
  };

  const handleTermsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!capturedPhoto) {
      setError('Please take a profile photo');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('👤 ProfileSetup: Starting profile setup with data:', {
        formData,
        capturedPhoto: {
          hasBlob: !!capturedPhoto.blob,
          hasUploadResult: !!capturedPhoto.uploadResult,
          uploadResultUrl: capturedPhoto.uploadResult?.url
        }
      });

      const profileData: UserProfileSetup = {
        ...formData,
        // If photo was uploaded to R2, use the URL, otherwise use the blob for upload
        ...(capturedPhoto.uploadResult?.url 
          ? { photoUrl: capturedPhoto.uploadResult.url }
          : { photo: capturedPhoto.blob }
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
          </div>
        )}

        {/* Terms Step */}
        {currentStep === 'terms' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Almost Done!</h2>
              <p className="text-gray-400">Ready to complete your profile setup</p>
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