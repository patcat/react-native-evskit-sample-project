const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// Include the parent directory so Metro can resolve/watch the
// symlinked `react-native-evskit` package (linked via `link:../react-native-evskit`)
config.watchFolders = [path.resolve(__dirname, '..')];

// Ensure dependencies (react, expo-modules-core, etc.) imported by the
// linked `react-native-evskit` package resolve correctly
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '..', 'react-native-evskit', 'node_modules'),
  path.resolve(__dirname, '..', 'node_modules'),
];

module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
});
