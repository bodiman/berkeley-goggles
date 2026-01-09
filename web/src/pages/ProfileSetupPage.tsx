import React, { useState } from 'react';
import { CameraCaptureComponent } from '../components/CameraCaptureComponent';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
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
  
  const [currentStep, setCurrentStep] = useState<'name' | 'photo' | 'friends' | 'terms'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserProfileSetup>({
    name: '',
    age: 18,
    gender: 'male', // Default, will be overwritten by AI
  });
  
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapture | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [hasSkippedPhoto, setHasSkippedPhoto] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiDetectedGender, setAiDetectedGender] = useState<'male' | 'female' | null>(null);

  // Friends step state
  const [contactsText, setContactsText] = useState('');
  const [matchedFriends, setMatchedFriends] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

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
    // Don't auto-advance to terms step - wait for user confirmation
  };

  const handleUsePhoto = async () => {
    if (!capturedPhoto) return;

    setIsAiAnalyzing(true);
    setError(null);

    try {
      // Create form data for the detection API
      const formData = new FormData();
      if (capturedPhoto.uploadResult?.url) {
        formData.append('photoUrl', capturedPhoto.uploadResult.url);
      } else {
        formData.append('photo', capturedPhoto.blob);
      }

      const response = await apiRequest('/api/user/detect-gender', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      });

      const data = await response.json();
      if (data.success) {
        setAiDetectedGender(data.detectedGender);
        setFormData(prev => ({ ...prev, gender: data.detectedGender }));
        setCurrentStep('friends');
      } else {
        throw new Error(data.error || 'AI failed to analyze photo');
      }
    } catch (err) {
      console.error('AI Gender Detection error:', err);
      setError('AI could not determine gender from this photo. Please try a clearer shot.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handlePhotoCaptureError = (errorMessage: string) => {
    console.error('📷 ProfileSetup: Photo capture error:', errorMessage);
    setError(errorMessage);
  };

  const handleSkipPhoto = () => {
    setHasSkippedPhoto(true);
    setCurrentStep('friends');
  };

  const handleSyncContacts = async () => {
    if (!contactsText.trim()) {
      setError('Please enter some emails to find friends');
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Extract emails from text
      const emails = contactsText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
      
      if (emails.length === 0) {
        throw new Error('No valid emails found. Make sure to include @berkeley.edu emails!');
      }

      const response = await apiRequest('/api/friends/match-contacts', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          contacts: emails,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMatchedFriends(data.matches);
        setSyncedCount(data.matches.length);
      } else {
        throw new Error(data.error || 'Failed to match contacts');
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to find friends. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      const response = await apiRequest('/api/friends/request', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          friendId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMatchedFriends(prev => prev.map(f => 
          f.id === friendId ? { ...f, friendshipStatus: 'pending', isInitiator: true } : f
        ));
      }
    } catch (err) {
      console.error('Friend request error:', err);
    }
  };

  const handleFriendsNext = () => {
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
    } else if (currentStep === 'friends') {
      setCurrentStep('photo');
    } else if (currentStep === 'terms') {
      // Reset skip state if going back from terms
      setHasSkippedPhoto(false);
      setCurrentStep('friends');
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
          <div className={`flex-1 h-1 rounded ${currentStep === 'photo' || currentStep === 'friends' || currentStep === 'terms' ? 'bg-blue-500' : 'bg-gray-700'}`} />
          <div className={`flex-1 h-1 rounded ${currentStep === 'friends' || currentStep === 'terms' ? 'bg-blue-500' : 'bg-gray-700'}`} />
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

            {/* AI Analysis State */}
            {isAiAnalyzing && (
              <div className="mt-4 p-6 bg-blue-600/20 border-2 border-blue-500/50 rounded-2xl animate-pulse">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">AI Analyzing Photo</h3>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Identifying gender & biological traits...</p>
                </div>
              </div>
            )}

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

        {/* Friends Step */}
        {currentStep === 'friends' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Find Your Friends</h2>
              <p className="text-gray-400">Challenge your friends to MOG battles and see who ranks higher!</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Address Book Sync
                </label>
                <div className="p-4 bg-gray-800 border border-gray-600 rounded-lg">
                  <p className="text-sm text-gray-300 mb-4">
                    Paste emails of friends you want to find on the app (comma or space separated). 
                    We'll match them against our directory.
                  </p>
                  <textarea
                    value={contactsText}
                    onChange={(e) => setContactsText(e.target.value)}
                    placeholder="friend1@berkeley.edu, friend2@berkeley.edu..."
                    className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSyncContacts}
                    disabled={isSyncing}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Contacts'}
                  </button>
                </div>
              </div>

              {matchedFriends.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold flex items-center">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                      {syncedCount}
                    </span>
                    Friends Found
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {matchedFriends.map(friend => (
                      <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-white/10">
                            {friend.profilePhotoUrl ? (
                              <img src={friend.profilePhotoUrl} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                {friend.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{friend.name}</p>
                            <p className="text-gray-500 text-xs">{friend.email}</p>
                          </div>
                        </div>
                        
                        {friend.friendshipStatus === 'none' ? (
                          <button
                            onClick={() => handleAddFriend(friend.id)}
                            className="bg-white text-black px-3 py-1 rounded-lg text-xs font-black hover:bg-gray-200 transition-colors"
                          >
                            ADD
                          </button>
                        ) : (
                          <span className="text-blue-400 text-xs font-bold uppercase">
                            {friend.friendshipStatus === 'pending' ? (friend.isInitiator ? 'Requested' : 'Wants to add you') : 'Friends'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleFriendsNext}
                className="w-full btn-primary"
              >
                Continue
              </button>
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
                <p className="text-center text-gray-400 mt-4">
                  Hello, {formData.name}!
                </p>
                {aiDetectedGender && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center space-x-3">
                    <span className="text-2xl">{aiDetectedGender === 'male' ? '🕺' : '💃'}</span>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none">AI Detected</p>
                      <p className="text-lg font-black text-white uppercase tracking-tighter">{aiDetectedGender}</p>
                    </div>
                  </div>
                )}
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