module.exports = {
  dependencies: {
    // Skip Firebase native modules on iOS only. Android keeps Firebase as-is.
    '@react-native-firebase/app': {
      platforms: {
        ios: null,
      },
    },
    '@react-native-firebase/messaging': {
      platforms: {
        ios: null,
      },
    },
  },
};
