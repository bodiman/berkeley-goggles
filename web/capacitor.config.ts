import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.berkeleygoggles.app',
  appName: 'Berkeley Goggles',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
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
    StatusBar: {
      overlaysWebView: true,
      backgroundColor: '#00000000',
      style: 'DARK',
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },
};

export default config;
