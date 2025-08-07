export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(js|cjs|mjs|ts|tsx)$': ['ts-jest', { useESM: true, isolatedModules: true, diagnostics: false, tsconfig: { allowJs: true, module: 'esnext' } }],
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.ts', '**/__tests__/**/*.spec.js', '**/test-*.cjs', '**/test-*.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleFileExtensions: ['js', 'cjs', 'mjs', 'ts', 'tsx', 'json'],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'server/**/*.{js,cjs,ts}',
    'server/consciousness/**/*.{js,cjs,ts}',
    'server/sigil-*.{js,cjs}',
    'server/metrics/sigilMetrics.cjs',
    '!**/*.test.*',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
