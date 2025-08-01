module.exports = {
  testEnvironment: 'node',
  // Ignore pino-pretty noise in tests
  silent: true,
  // Add custom Jest config as needed
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "server/**/*.js",
    "!server/common/tracing.js",
    "!**/node_modules/**",
    "!**/tests/**",
  ],
};