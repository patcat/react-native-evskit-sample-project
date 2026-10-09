import type { ConfigContext, ExpoConfig } from '@expo/config';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';

// NOTE: This config is intentionally self-contained — it must NOT import
// './env' (which pulls in zod). EAS evaluates app.config.ts on the builder
// before/without full node_modules, so that import fails with
// "Cannot find module '.../env'". Keep only static requires here.

const packageJSON = require('./package.json') as { version: string };

type AppEnv = 'development' | 'preview' | 'production';
const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ?? 'development') as AppEnv;

const BUNDLE_IDS = {
  development: 'com.sampleevskitproject.development',
  preview: 'com.sampleevskitproject.preview',
  production: 'com.sampleevskitproject',
} as const;

const PACKAGES = {
  development: 'com.sampleevskitproject.development',
  preview: 'com.sampleevskitproject.preview',
  production: 'com.sampleevskitproject',
} as const;

const SCHEMES = {
  development: 'SampleEvsKitProject',
  preview: 'SampleEvsKitProject.preview',
  production: 'SampleEvsKitProject',
} as const;

const NAME = 'SampleEvsKitProject';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: APP_ENV !== 'production',
  badges: [
    {
      text: APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: packageJSON.version.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: NAME,
  description: `${NAME} Mobile App`,
  owner: 'therealitycrafters',
  scheme: SCHEMES[APP_ENV],
  slug: 'reactnativeevskitsampleproject',
  version: packageJSON.version.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_IDS[APP_ENV],
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: PACKAGES[APP_ENV],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: '36.0.0',
          kotlinVersion: '2.0.21',
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
            'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
            'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Inter',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
                  weight: 400,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
                  weight: 500,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
                  weight: 600,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
                  weight: 700,
                },
              ],
            },
          ],
        },
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
    ['react-native-evskit', { bundleResources: ['./sdk.key'] }],
  ],
  extra: {
    eas: {
      projectId: '7920fb79-5f4f-4fb5-b138-19329f1ae4c9',
    },
  },
});
