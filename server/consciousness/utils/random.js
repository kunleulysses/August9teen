import crypto from 'crypto';
import seedrandom from 'seedrandom';

let rng = seedrandom();

export function initializeRandomness(seed = Date.now().toString(), overrideGlobal = true) {
  rng = seedrandom(seed.toString());
  if (overrideGlobal) global.Math.random = rng;
}

export function random() {
  return rng();
}

export function secureUUID() {
  return crypto.randomUUID();
}

export function secureId(prefix = 'id') {
  return `${prefix}_${secureUUID()}`;
}