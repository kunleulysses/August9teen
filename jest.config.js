module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/__tests__/spiral/**/*.spec.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "FlappyJournal/server/consciousness/core/SpiralMemory*.ts",
    "FlappyJournal/server/consciousness/core/utils/MinHeap.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};