const { randomUUID: nodeRandomUUID, createHash } = require('crypto');
const { v4: uuidv4 } = require('uuid');

function generateId() {
  return typeof nodeRandomUUID === 'function' ? nodeRandomUUID() : uuidv4();
}

function generateHash(input) {
  return createHash('sha256').update(input).digest('hex');
}

module.exports = { generateId, generateHash };