/** jest.config.cjs  — merged clean 2025-08-05 */
module.exports = {
  // Default test environment
  testEnvironment: 'node',

  // ES-module support
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: { 'ts-jest': { useESM: true } },

  // Transform rules
  transform: {
    '^.+\\.(ts|tsx)$': [
      'babel-jest',
      { presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'] }
    ],
    '^.+\\.(js|jsx)$': [
      'babel-jest',
      { presets: ['@babel/preset-env', '@babel/preset-react'] }
    ]
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'cjs'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^FlappyJournal/(.*)$': '<rootDir>/FlappyJournal/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub'
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  silent: true,

  /* ---------- Coverage ---------- */
  collectCoverage: true,
  collectCoverageFrom: [
    // Detailed Spiral-Memory coverage (upstream)
    'FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs',
    'FlappyJournal/server/consciousness/core/SpiralMemoryFacade.cjs',
    'FlappyJournal/server/consciousness/core/ConsciousnessEventBus.cjs',
    'FlappyJournal/server/consciousness/core/utils/*.cjs',
    'FlappyJournal/server/consciousness/core/security/*.{cjs,ts}',
    'server/consciousness/**reality*',

    // Broad catch-all (stashed)
    'FlappyJournal/server/**/*.cjs',

    // Exclusions
    '!**/*.test.*',
    '!**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov', 'html'],
  coverageThreshold: { global: { lines: 80 } },

  /* ---------- Test patterns ---------- */
  testMatch: [
    // Upstream detailed glob
    '**/__tests__/**/*.(ts|tsx|js|jsx|cjs)',
    '**/*.(test|spec).(ts|tsx|js|jsx|cjs)',

    // Stashed simpler glob + specific FlappyJournal suite
    '**/__tests__/**/*.(spec|test).[jt]s?(x)',
    '**/FlappyJournal/__tests__/**/*.spec.js'
  ],

  /* ---------- Ignore paths ---------- */
  modulePathIgnorePatterns: [
    '<rootDir>/FlappyJournal hey/',
    '<rootDir>/FlappyJournal/demo-portal.backup.20250706_223211/',
    '<rootDir>/FlappyJournal/system-backups/',
    '<rootDir>/demo-portal.backup.20250706_223211/'
  ],
  transformIgnorePatterns: ['node_modules/(?!(p-map)/)'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/governance/',
    '<rootDir>/FlappyJournal/featherweight-app/',
    '<rootDir>/__tests__/spiral/flaky/',
    '<rootDir>/__tests__/helpers/'
  ]
};