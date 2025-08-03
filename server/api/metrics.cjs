const client = require('prom-client');

client.collectDefaultMetrics();

const register = client.register;
const realitiesCreated = new client.Counter({
  name: 'realities_created_total',
  help: 'Total realities created'
});
const authErrors = new client.Counter({
  name: 'jwt_unauthorized_total',
  help: 'Total JWT unauthorized errors'
});
const crnTicks = new client.Counter({
  name: 'crn_ticks_total',
  help: 'Total CRN tick executions'
});
const saqrnTicks = new client.Counter({
  name: 'saqrn_ticks_total',
  help: 'Total SAQRN tick executions'
});

module.exports = { register, realitiesCreated, authErrors, crnTicks, saqrnTicks };