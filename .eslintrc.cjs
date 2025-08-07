const selfcoding = require('./.eslintrc-selfcoding.json');
const modules = require('./.eslintrc.modules.json');

module.exports = {
  ...selfcoding,
  overrides: [
    ...(selfcoding.overrides || []),
    ...(modules.overrides || []),
    // Stricter rules for generated outputs and PR artifacts
    {
      files: [
        '**/server/generated/**/*.cjs',
        'artifacts/selfcoding-pr/**/*.cjs'
      ],
      rules: {
        'no-console': ['error'],
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-process-exit': 'error',
        'no-restricted-imports': ['error', {
          paths: ['fs', 'child_process', 'net', 'http', 'https', 'ws', 'tls', 'dgram']
        }],
        'no-restricted-modules': ['error', {
          paths: ['fs', 'child_process', 'net', 'http', 'https', 'ws', 'tls', 'dgram']
        }]
      }
    }
  ]
};
