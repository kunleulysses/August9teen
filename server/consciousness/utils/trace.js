import { AsyncLocalStorage } from 'node:async_hooks';
export const als = new AsyncLocalStorage();
export function runWithTraceId(traceId, fn) {
  return als.run({ traceId }, fn);
}
export function getTraceId() {
  const store = als.getStore();
  return store?.traceId;
}