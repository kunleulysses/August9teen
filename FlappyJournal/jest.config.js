export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|cjs|mjs|ts|tsx)$': ['ts-jest', { useESM: false, isolatedModules: true, diagnostics: false, tsconfig: { allowJs: true, module: 'commonjs' } }],
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.spec.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};