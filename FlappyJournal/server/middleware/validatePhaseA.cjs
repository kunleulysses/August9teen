let ajv = null;
try {
  const Ajv = require('ajv');
  ajv = new Ajv({ allErrors: true, removeAdditional: 'failing', strict: false });
} catch (_) {}

const ucipSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    input: { type: 'object', additionalProperties: true },
    budget: {
      type: 'object',
      additionalProperties: false,
      properties: {
        steps: { type: 'integer', minimum: 1, maximum: 100 }
      },
      required: ['steps']
    }
  },
  required: ['input']
};

const transcendentSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    message: { type: 'string', minLength: 1, maxLength: 2000 },
    context: { type: 'object', additionalProperties: true }
  },
  required: ['message']
};

const validateUCIPAjv = ajv ? ajv.compile(ucipSchema) : null;
const validateTranscendentAjv = ajv ? ajv.compile(transcendentSchema) : null;

function validateUCIPRoute(body) {
  if (validateUCIPAjv) return Boolean(validateUCIPAjv(body));
  if (!body || typeof body !== 'object') return false;
  if (!body.input || typeof body.input !== 'object') return false;
  if (body.budget && typeof body.budget !== 'object') return false;
  return true;
}

function validateTranscendent(body) {
  if (validateTranscendentAjv) return Boolean(validateTranscendentAjv(body));
  if (!body || typeof body !== 'object') return false;
  if (typeof body.message !== 'string' || body.message.length === 0) return false;
  if (body.context && typeof body.context !== 'object') return false;
  return true;
}

function getValidationErrors(which) {
  const v = which === 'ucip' ? validateUCIPAjv : validateTranscendentAjv;
  if (!v || !v.errors) return undefined;
  return v.errors.map(e => ({ instancePath: e.instancePath, message: e.message, keyword: e.keyword }));
}

module.exports = { validateUCIPRoute, validateTranscendent, getValidationErrors };

