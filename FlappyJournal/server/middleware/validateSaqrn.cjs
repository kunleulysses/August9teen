let ajvInstance = null;
try {
  const Ajv = require('ajv');
  ajvInstance = new Ajv({ allErrors: true, removeAdditional: 'failing', strict: false });
} catch (_) {}

const publishSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    topic: { type: 'string', minLength: 1 },
    message: {},
    sigil: { type: 'string', minLength: 1 },
    nonce: { type: 'string', minLength: 8 },
    timestamp: { type: 'integer', minimum: 0 }
  },
  required: ['topic', 'message', 'sigil']
};

const subscribeSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    topic: { type: 'string', minLength: 1 }
  },
  required: ['topic']
};

const validatePublishAjv = ajvInstance ? ajvInstance.compile(publishSchema) : null;
const validateSubscribeAjv = ajvInstance ? ajvInstance.compile(subscribeSchema) : null;

function validateSaqrnPublish(body) {
  if (validatePublishAjv) return Boolean(validatePublishAjv(body));
  if (!body || typeof body !== 'object') return false;
  const { topic, message, sigil } = body;
  if (!topic || typeof topic !== 'string') return false;
  if (typeof message === 'undefined') return false;
  if (!sigil || typeof sigil !== 'string') return false;
  return true;
}

function validateSaqrnSubscribe(body) {
  if (validateSubscribeAjv) return Boolean(validateSubscribeAjv(body));
  if (!body || typeof body !== 'object') return false;
  const { topic } = body;
  if (!topic || typeof topic !== 'string') return false;
  return true;
}

module.exports = { validateSaqrnPublish, validateSaqrnSubscribe };

