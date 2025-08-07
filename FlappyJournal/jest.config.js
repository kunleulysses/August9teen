module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: [],
  transform: {
    '^.+\\.(js|cjs|mjs|ts|tsx)$': ['ts-jest', { useESM: false, isolatedModules: true, diagnostics: false, tsconfig: { allowJs: true, module: 'commonjs' } }],
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.ts', '**/test-*.cjs', '**/test-*.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'cjs', 'mjs', 'ts', 'tsx', 'json'],
  testTimeout: 30000,
  verbose: true
};
