import client from 'prom-client';

client.collectDefaultMetrics();

export const register = client.register;
export const realitiesCreated = new client.Counter({
  name: 'realities_created_total',
  help: 'Total realities created'
});
export const authErrors = new client.Counter({
  name: 'jwt_unauthorized_total',
  help: 'Total JWT unauthorized errors'
});