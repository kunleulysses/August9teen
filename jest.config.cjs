module.exports = {
  // Default to node environment, override with testEnvironment comment in files
  testEnvironment: 'node',
  
  // ES Module support
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  
  // Transform configuration for TypeScript and JSX
  transform: {
    '^.+\.(ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'] }],
    '^.+\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'cjs'],
  
  // Module name mapping for CSS and assets
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/client/src/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
    "^FlappyJournal/(.*)$": "<rootDir>/FlappyJournal/$1",
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  
  // Test environment setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  
  // Ignore pino-pretty noise in tests
  silent: true,
  
  // Coverage configuration for spiral memory architecture
  collectCoverage: true,
  collectCoverageFrom: [
    'FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs',
    'FlappyJournal/server/consciousness/core/SpiralMemoryFacade.cjs',
    'FlappyJournal/server/consciousness/core/ConsciousnessEventBus.cjs',
    'FlappyJournal/server/consciousness/core/utils/*.cjs',
    'FlappyJournal/server/consciousness/core/security/*.{cjs,ts}',
    '!**/*.test.*',   // exclude tests
    '!**/__tests__/**' // exclude test files
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test patterns
  testMatch: [
    "**/__tests__/**/*.(ts|tsx|js|jsx|cjs)",
    "**/*.(test|spec).(ts|tsx|js|jsx|cjs)"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/FlappyJournal hey/",
    "<rootDir>/FlappyJournal/demo-portal.backup.20250706_223211/",
    "<rootDir>/FlappyJournal/system-backups/"
  ],

  // Transform ES modules in node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(p-map)/)"
  ],

  // Ignore experimental or placeholder suites during CI
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/governance/",
    "<rootDir>/FlappyJournal/featherweight-app/",
    "<rootDir>/__tests__/spiral/flaky/", // quarantine flaky tests until fixed
    "<rootDir>/__tests__/helpers/", // helper utilities, not test files
    "<rootDir>/FlappyJournal/server/consciousness/__tests__/logging.test.js" // module dependency issues
  ]
};
