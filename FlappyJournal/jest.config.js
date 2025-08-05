module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|cjs|mjs|ts|tsx)$': ['ts-jest', { useESM: true, isolatedModules: true, diagnostics: false, tsconfig: { allowJs: true, module: 'commonjs' } }],
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  resolver: './__tests__/resolver.js',
};