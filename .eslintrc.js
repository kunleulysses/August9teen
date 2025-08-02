const selfcoding = require('./.eslintrc-selfcoding.json');
const modules = require('./.eslintrc.modules.json');

module.exports = {
  ...selfcoding,
  overrides: [
    ...(selfcoding.overrides || []),
    ...(modules.overrides || [])
  ]
};