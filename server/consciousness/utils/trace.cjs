const { AsyncLocalStorage } = require('node:async_hooks');

const als = new AsyncLocalStorage();

function runWithTraceId(traceId, fn) {
  return als.run({ traceId }, fn);
}

function getTraceId() {
  const store = als.getStore();
  return store?.traceId;
}

module.exports = {
    als,
    runWithTraceId,
    getTraceId
};