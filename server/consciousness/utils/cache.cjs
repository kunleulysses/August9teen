const { LRUCache } = require('lru-cache');

const ONE_HOUR = 1000 * 60 * 60;

const scenesCache = new LRUCache({ max: 5000, ttl: ONE_HOUR });
const pathsCache = new LRUCache({ max: 20000, ttl: ONE_HOUR });
const fieldsCache = new LRUCache({ max: 20000, ttl: ONE_HOUR });

module.exports = { scenesCache, pathsCache, fieldsCache };
