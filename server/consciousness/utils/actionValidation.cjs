const { validate } = require('./validation.cjs');

const SCHEMA = 'https://flappyjournal.dev/schema/game/turn/action.json';

function validateTurnAction(obj) {
  validate(SCHEMA, obj);
  return true;
}

module.exports = { validateTurnAction };

