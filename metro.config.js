const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// The evskit package is now an npm dependency (@therealitycrafters/react-native-evskit);
// no extra watch folders or node_modules paths needed.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
});
