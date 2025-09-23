const { validate } = require('./validation.cjs');

const NPC_SCHEMA = 'https://flappyjournal.dev/schema/game/npc.json';
const QUEST_SCHEMA = 'https://flappyjournal.dev/schema/game/quest.json';
const ITEM_SCHEMA = 'https://flappyjournal.dev/schema/game/item.json';
const MOMENT_SCHEMA = 'https://flappyjournal.dev/schema/game/moment.json';

const EV_ZONE_JOIN = 'https://flappyjournal.dev/schema/game/zone/join.json';
const EV_ZONE_LEAVE = 'https://flappyjournal.dev/schema/game/zone/leave.json';
const EV_NPC_STATE = 'https://flappyjournal.dev/schema/game/npc/state.json';
const EV_QUEST_UPDATE = 'https://flappyjournal.dev/schema/game/quest/update.json';
const EV_LOOT_MINTED = 'https://flappyjournal.dev/schema/game/loot/minted.json';

const ALLOW_EVENTS = new Set(['zone:join', 'zone:leave', 'npc:state', 'quest:update', 'loot:minted']);

function validateNPC(data) { validate(NPC_SCHEMA, data); return true; }
function validateQuest(data) { validate(QUEST_SCHEMA, data); return true; }
function validateItem(data) { validate(ITEM_SCHEMA, data); return true; }
function validateMoment(data) { validate(MOMENT_SCHEMA, data); return true; }

function validateByType(type, payload) {
  switch (type) {
    case 'zone:join':
      validate(EV_ZONE_JOIN, payload); return true;
    case 'zone:leave':
      validate(EV_ZONE_LEAVE, payload); return true;
    case 'npc:state':
      validate(EV_NPC_STATE, payload); return true;
    case 'quest:update':
      validate(EV_QUEST_UPDATE, payload); return true;
    case 'loot:minted':
      validate(EV_LOOT_MINTED, payload); return true;
    default:
      throw new Error('UnsupportedEvent:' + type);
  }
}

function autoValidate(channel, payload) {
  try {
    const type = payload && typeof payload === 'object' ? payload.type : undefined;
    if (!type || !ALLOW_EVENTS.has(type)) {
      throw new Error('InvalidEventType');
    }
    return validateByType(type, payload);
  } catch (e) {
    e.message = '[SchemaValidation] ' + e.message;
    throw e;
  }
}

module.exports = {
  validateNPC,
  validateQuest,
  validateItem,
  validateMoment,
  validateByType,
  autoValidate,
  ALLOW_EVENTS,
};
