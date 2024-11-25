module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
  
    // Ensure axios and other node_modules are excluded from transformation
    transformIgnorePatterns: [
      '/node_modules/(?!axios|jwt-decode)/',  // Make sure to include all necessary packages you need (like jwt-decode)
    ],
  
    transform: {},  // Don't use babel transformation
  
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy', // if you're using styles
    },
  };