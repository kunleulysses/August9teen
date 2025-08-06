const crypto = require('crypto');
const seedrandom = require('seedrandom');

let rng = seedrandom();

function initializeRandomness(seed = Date.now().toString(), overrideGlobal = true) {
  rng = seedrandom(seed.toString());
  if (overrideGlobal) global.Math.random = rng;
}

function random() {
  return rng();
}

function secureUUID() {
  return crypto.randomUUID();
}

function secureId(prefix = 'id') {
  return `${prefix}_${secureUUID()}`;
}

function traceId() {
  return secureUUID();
}

module.exports = {
  initializeRandomness,
  random,
  secureUUID,
  secureId,
  traceId,
};