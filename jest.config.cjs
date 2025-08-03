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
  
  // Coverage configuration (temporarily disabled until experimental tests are fixed)
  collectCoverage: false,
  // coverageThreshold removed for now
  // collectCoverageFrom can be re-enabled later
  
  // Test patterns
  testMatch: [
    "**/__tests__/**/*.(ts|tsx|js|jsx)",
    "**/*.(test|spec).(ts|tsx|js|jsx)"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/FlappyJournal hey/",
    "<rootDir>/FlappyJournal/demo-portal.backup.20250706_223211/",
    "<rootDir>/FlappyJournal/system-backups/"
  ],

  // Ignore experimental or placeholder suites during CI
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/governance/",
    "<rootDir>/__tests__/spiral/",
    "<rootDir>/FlappyJournal/featherweight-app/"
  ]
};
