import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.berkeleygoggles.app',
  appName: 'Berkeley Goggles',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    scheme: 'Berkeley Goggles',
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '683730085300-rf9g73ca25lh2e6gq1qih6lhd0sm9331.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
