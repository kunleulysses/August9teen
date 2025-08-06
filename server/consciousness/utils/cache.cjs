const LRU = require('lru-cache');

const ONE_HOUR = 1000 * 60 * 60;

const scenesCache = new LRU({ max: 5000, ttl: ONE_HOUR });
const pathsCache = new LRU({ max: 20000, ttl: ONE_HOUR });
const fieldsCache = new LRU({ max: 20000, ttl: ONE_HOUR });

module.exports = { scenesCache, pathsCache, fieldsCache };
