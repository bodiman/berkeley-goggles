import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
// TODO: Import from shared package once workspace is properly configured
interface AuthUser {
  id: string;
  name: string;
  email?: string;
  profilePhoto?: string;
  age?: number;
  height?: number; // Height in inches (for males)
  weight?: number; // Weight in pounds (for females)
  gender?: 'male' | 'female';
  bio?: string;
  profileComplete: boolean;
  createdAt: Date;
  lastActive: Date;
}

interface AppNavigationState {
  currentTab: 'league' | 'play' | 'matched' | 'profile';
  profileSetupComplete: boolean;
  isAuthenticated: boolean;
}

interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height?: number; // Height in inches (for males)
  weight?: number; // Weight in pounds (for females)
  photo?: File | Blob;
  photoUrl?: string; // R2 CDN URL if already uploaded
}

interface UserProfileData {
  name?: string;
  age?: number;
  gender?: 'male' | 'female';
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  height?: number; // Height in inches
  weight?: number; // Weight in pounds
}

interface AuthContextType {
  user: AuthUser | null;
  navigationState: AppNavigationState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  register: (registrationData: UserRegistrationData) => Promise<boolean>;
  logout: () => void;
  setupProfile: (profileData: UserProfileSetup) => Promise<boolean>;
  updateUserName: (name: string) => Promise<boolean>;
  updateUserPhoto: (photoData: { blob?: Blob; r2Url?: string; r2ThumbnailUrl?: string }) => Promise<boolean>;
  updateProfile: (profileData: UserProfileData) => Promise<boolean>;
  refreshUser: () => Promise<boolean>;
  updateNavigationTab: (tab: 'league' | 'play' | 'matched' | 'profile') => void;
}

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navigationState, setNavigationState] = useState<AppNavigationState>({
    currentTab: 'profile',
    profileSetupComplete: false,
    isAuthenticated: false,
  });

  // Check for existing auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('elo-check-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Convert date strings back to Date objects and fix relative photo URLs
          const userWithDates: AuthUser = {
            ...userData,
            createdAt: new Date(userData.createdAt),
            lastActive: new Date(userData.lastActive),
            // Fix relative photo URLs from localStorage by converting to absolute URLs
            profilePhoto: userData.profilePhoto && !userData.profilePhoto.startsWith('http') 
              ? `https://berkeley-goggles-production.up.railway.app${userData.profilePhoto}`
              : userData.profilePhoto,
          };
          setUser(userWithDates);
          setNavigationState(prev => ({
            ...prev,
            isAuthenticated: true,
            profileSetupComplete: userData.profileComplete,
            currentTab: userData.profileComplete ? 'play' : 'profile',
          }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('elo-check-user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use the API helper for proper configuration
      const response = await apiRequest(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const user: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };
        
        setUser(user);
        localStorage.setItem('elo-check-user', JSON.stringify(user));
        
        setNavigationState(prev => ({
          ...prev,
          isAuthenticated: true,
          profileSetupComplete: user.profileComplete,
          currentTab: user.profileComplete ? 'play' : 'profile',
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.auth.google, {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const user: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl,
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };
        
        setUser(user);
        localStorage.setItem('elo-check-user', JSON.stringify(user));
        
        setNavigationState(prev => ({
          ...prev,
          isAuthenticated: true,
          profileSetupComplete: user.profileComplete,
          currentTab: user.profileComplete ? 'play' : 'profile',
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    }
  };

  const register = async (registrationData: UserRegistrationData): Promise<boolean> => {
    try {
      // Use the API helper for proper configuration
      const response = await apiRequest(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const user: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };
        
        setUser(user);
        localStorage.setItem('elo-check-user', JSON.stringify(user));
        
        setNavigationState(prev => ({
          ...prev,
          isAuthenticated: true,
          profileSetupComplete: user.profileComplete,
          currentTab: user.profileComplete ? 'play' : 'profile',
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Remove both possible localStorage keys for safety
    localStorage.removeItem('elo-check-user');
    localStorage.removeItem('berkeley-goggles-user');
    setNavigationState({
      currentTab: 'profile',
      profileSetupComplete: false,
      isAuthenticated: false,
    });
  };

  const setupProfile = async (profileData: UserProfileSetup): Promise<boolean> => {
    try {
      if (!user) return false;

      // Prepare form data for upload
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('profileData', JSON.stringify({
        name: profileData.name,
        age: profileData.age,
        gender: profileData.gender,
        height: profileData.height,
        weight: profileData.weight,
      }));
      
      if (profileData.photo) {
        formData.append('photo', profileData.photo, 'profile-photo.jpg');
      }

      // Upload to backend
      const response = await apiRequest('/api/user/setup', {
        method: 'POST',
        body: formData, // Don't set Content-Type, let browser set it for multipart/form-data
        headers: {}, // Clear headers to let browser set Content-Type for FormData
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const updatedUser: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };

        setUser(updatedUser);
        localStorage.setItem('elo-check-user', JSON.stringify(updatedUser));

        setNavigationState(prev => ({
          ...prev,
          profileSetupComplete: true,
          currentTab: 'play',
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Profile setup failed:', error);
      return false;
    }
  };

  const updateUserName = async (name: string): Promise<boolean> => {
    try {
      if (!user) return false;

      const response = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const updatedUser: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };

        setUser(updatedUser);
        localStorage.setItem('elo-check-user', JSON.stringify(updatedUser));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Name update failed:', error);
      return false;
    }
  };

  const updateUserPhoto = async (photoData: { blob?: Blob; r2Url?: string; r2ThumbnailUrl?: string }): Promise<boolean> => {
    try {
      if (!user) return false;

      if (photoData.r2Url) {
        // New flow: Use R2 URL
        const response = await apiRequest('/api/user/photo', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            r2PhotoUrl: photoData.r2Url,
            r2ThumbnailUrl: photoData.r2ThumbnailUrl,
          }),
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        
        console.log('Photo update response:', data);
        
        if (data.success && data.user) {
          const updatedUser: AuthUser = {
            ...data.user,
            profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
            createdAt: new Date(data.user.createdAt),
            lastActive: new Date(data.user.lastActive),
          };
          
          console.log('Updated user with photo:', updatedUser);

          setUser(updatedUser);
          localStorage.setItem('elo-check-user', JSON.stringify(updatedUser));

          return true;
        }

        return false;
      } else if (photoData.blob) {
        // Legacy flow: File upload
        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('photo', photoData.blob, 'profile-photo.jpg');

        const response = await apiRequest('/api/user/photo', {
          method: 'POST',
          body: formData,
          headers: {}, // Clear headers to let browser set Content-Type for FormData
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        
        console.log('Photo update response:', data);
        
        if (data.success && data.user) {
          const updatedUser: AuthUser = {
            ...data.user,
            profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
            createdAt: new Date(data.user.createdAt),
            lastActive: new Date(data.user.lastActive),
          };
          
          console.log('Updated user with photo:', updatedUser);

          setUser(updatedUser);
          localStorage.setItem('elo-check-user', JSON.stringify(updatedUser));

          return true;
        }

        return false;
      } else {
        console.error('No photo blob or R2 URL provided');
        return false;
      }
    } catch (error) {
      console.error('Photo update failed:', error);
      return false;
    }
  };

  const updateNavigationTab = (tab: 'league' | 'play' | 'matched' | 'profile') => {
    setNavigationState(prev => ({
      ...prev,
      currentTab: tab,
    }));
  };

  const updateProfile = async (profileData: UserProfileData): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      const response = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          userId: user.id,
          ...profileData,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.success && data.user) {
        const updatedUser: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };
        
        setUser(updatedUser);
        localStorage.setItem('elo-check-user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      const response = await apiRequest(`/api/user/profile?userId=${user.id}`);
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.success && data.user) {
        const refreshedUser: AuthUser = {
          ...data.user,
          profilePhoto: data.user.profilePhotoUrl, // Map backend field to frontend field
          createdAt: new Date(data.user.createdAt),
          lastActive: new Date(data.user.lastActive),
        };
        
        setUser(refreshedUser);
        localStorage.setItem('elo-check-user', JSON.stringify(refreshedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      navigationState,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      setupProfile,
      updateUserName,
      updateUserPhoto,
      updateProfile,
      refreshUser,
      updateNavigationTab,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};