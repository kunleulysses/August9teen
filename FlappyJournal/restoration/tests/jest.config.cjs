module.exports = {
  "testEnvironment": "node",
  "rootDir": "../../",
  "preset": null,
  "extensionsToTreatAsEsm": [".js"],
  "globals": {
    "NODE_ENV": "test"
  },
  "transform": {},
  "testMatch": [
    "**/restoration/tests/**/*.test.cjs",
    "**/restoration/tests/**/*.spec.cjs"
  ],
  "collectCoverageFrom": [
    "server/consciousness/**/*.cjs",
    "restoration/**/*.cjs",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/backups/**"
  ],
  "coverageDirectory": "restoration/tests/coverage",
  "coverageReporters": [
    "text",
    "lcov",
    "html"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "setupFilesAfterEnv": [
    "<rootDir>/restoration/tests/setup.cjs"
  ],
  "testTimeout": 30000,
  "verbose": true,
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};