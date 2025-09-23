const { db } = require('../../db');
const schema = require('@shared/schema');

async function saveTurn(rec) {
  try {
    await db.insert(schema.turns).values(rec);
  } catch (e) {
    // ignore db failures in MVP
  }
}

async function saveMoment(rec) {
  try {
    await db.insert(schema.moments).values(rec);
  } catch (e) {
    // ignore db failures in MVP
  }
}

module.exports = { saveTurn, saveMoment };
