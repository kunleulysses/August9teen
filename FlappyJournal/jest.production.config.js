export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(js|cjs|mjs|ts|tsx)$': ['ts-jest', { useESM: true, isolatedModules: true, diagnostics: false, tsconfig: { allowJs: true, module: 'esnext' } }],
  },
  testMatch: [
    '**/__tests__/integration/system.spec.js',
    '**/__tests__/eventSign.spec.js',
    '**/__tests__/sigil/leveldb-adapter.spec.ts',
    '**/__tests__/storage/circuit.spec.ts',
    '**/__tests__/storage/rbac.spec.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['js', 'cjs', 'mjs', 'ts', 'tsx', 'json'],
  testTimeout: 30000,
  verbose: true,
  collectCoverageFrom: [
    'server/consciousness/SigilEngine.js',
    'server/consciousness/persistence/*.cjs',
    'server/sigil-api.cjs',
    'server/index.cjs',
    'server/auth/jwtMiddleware.js',
    'server/middleware/validateSchema.js',
    'server/monitoring/alertManager.js',
    'server/utils/circuitBreaker.cjs'
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};