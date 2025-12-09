import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, API_ENDPOINTS } from '../config/api';
// TODO: Import from shared package once workspace is properly configured
interface AuthUser {
  id: string;
  name: string;
  email?: string;
  profilePhoto?: string;
  profileComplete: boolean;
  createdAt: Date;
  lastActive: Date;
}

interface AppNavigationState {
  currentTab: 'profile' | 'play' | 'matched';
  profileSetupComplete: boolean;
  isAuthenticated: boolean;
}

interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
  photo?: File | Blob;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  navigationState: AppNavigationState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (registrationData: UserRegistrationData) => Promise<boolean>;
  logout: () => void;
  setupProfile: (profileData: UserProfileSetup) => Promise<boolean>;
  updateUserName: (name: string) => Promise<boolean>;
  updateUserPhoto: (photoBlob: Blob) => Promise<boolean>;
  updateNavigationTab: (tab: 'profile' | 'play' | 'matched') => void;
}

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
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
        const storedUser = localStorage.getItem('berkeley-goggles-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Convert date strings back to Date objects
          const userWithDates: AuthUser = {
            ...userData,
            createdAt: new Date(userData.createdAt),
            lastActive: new Date(userData.lastActive),
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
        localStorage.removeItem('berkeley-goggles-user');
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
        localStorage.setItem('berkeley-goggles-user', JSON.stringify(user));
        
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
        localStorage.setItem('berkeley-goggles-user', JSON.stringify(user));
        
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
    localStorage.removeItem('elo-check-user');
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
        agreedToTerms: profileData.agreedToTerms,
        agreedToPrivacy: profileData.agreedToPrivacy,
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

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const updateUserPhoto = async (photoBlob: Blob): Promise<boolean> => {
    try {
      if (!user) return false;

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('photo', photoBlob, 'profile-photo.jpg');

      const response = await fetch('/api/user/photo', {
        method: 'POST',
        body: formData,
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
      console.error('Photo update failed:', error);
      return false;
    }
  };

  const updateNavigationTab = (tab: 'profile' | 'play' | 'matched') => {
    setNavigationState(prev => ({
      ...prev,
      currentTab: tab,
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      navigationState,
      isLoading,
      login,
      register,
      logout,
      setupProfile,
      updateUserName,
      updateUserPhoto,
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