export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  stats: UserStats;
  profileComplete: boolean;
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  location: Location;
  photos: any[]; // Will be typed as Photo[] when imported
  bio?: string;
}

export interface UserPreferences {
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  comparisonSettings: ComparisonSettings;
}

export interface UserStats {
  totalVotes: number;
  comparisonsGiven: number;
  streak: number;
  weeklyChange: number;
  achievements: Achievement[];
}

export interface Location {
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PrivacySettings {
  dataRetention: {
    deleteAfterInactive: number;
    exportDataRequest: boolean;
    deleteAccountRequest: boolean;
  };
  sharingControls: {
    blurFaceUntilConsent: boolean;
    restrictByLocation: boolean;
    optOutOfLeaderboards: boolean;
    limitDemographicData: boolean;
  };
  marketingConsent: {
    emailMarketing: boolean;
    pushNotifications: boolean;
    personalizedAds: boolean;
    dataAnalytics: boolean;
  };
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  rankingUpdates: boolean;
  newComparisons: boolean;
  achievements: boolean;
}

export interface ComparisonSettings {
  dailyLimit: number;
  skipPenalty: boolean;
  qualityFilter: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'engagement' | 'consistency' | 'milestone' | 'social';
}

export interface UserRegistration {
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female';
  location: Location;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface ProfileUpdate {
  bio?: string;
  location?: Location;
  preferences?: Partial<UserPreferences>;
}

export interface UserProfileSetup {
  name: string;
  age: number;
  gender: 'male' | 'female';
  photo?: File | Blob;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

export interface CameraCapture {
  blob: Blob;
  dataUrl: string;
  timestamp: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  profilePhoto?: string;
  profileComplete: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface AppNavigationState {
  currentTab: 'profile' | 'play' | 'matched';
  profileSetupComplete: boolean;
  isAuthenticated: boolean;
}