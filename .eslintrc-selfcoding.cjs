import js from '@eslint/js';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    ignores: ['**/node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      sonarjs,
    },
    rules: {
      'complexity': ['error', 10],
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
    },
  },
  js.configs.recommended,
];
