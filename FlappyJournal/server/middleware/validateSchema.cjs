const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

const sigilCreateSchema = {
  $id: 'https://sigildna.dev/schemas/sigil-create.json',
  type: 'object',
  properties: {
    data: { type: 'object', minProperties: 1, additionalProperties: true },
    consciousnessState: {
      type: 'object',
      properties: {
        phi: { type: 'number', minimum: 0, maximum: 10 },
        coherence: { type: 'number', minimum: 0, maximum: 1 },
        awareness: { type: 'number', minimum: 0, maximum: 1 },
        resonance: { type: 'number', minimum: 0, maximum: 1 }
      },
      required: ['phi', 'coherence', 'awareness'],
      additionalProperties: false
    },
    metadata: {
      type: 'object',
      properties: {
        source: { type: 'string', maxLength: 100 },
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        tags: { type: 'array', items: { type: 'string', maxLength: 50 }, maxItems: 10 }
      },
      additionalProperties: true
    }
  },
  required: ['data'],
  additionalProperties: false
};

const sigilVerifySchema = {
  $id: 'https://sigildna.dev/schemas/sigil-verify.json',
  type: 'object',
  properties: {
    sigilId: { type: 'string', pattern: '^sigil_[a-zA-Z0-9]{10,}$' },
    signature: { type: 'string', minLength: 32, maxLength: 128 },
    data: { type: 'object' }
  },
  required: ['sigilId', 'signature', 'data'],
  additionalProperties: false
};

const sigilMatchSchema = {
  $id: 'https://sigildna.dev/schemas/sigil-match.json',
  type: 'object',
  properties: {
    dnaPattern: { type: 'array', items: { type: 'number' }, minItems: 1, maxItems: 1000 },
    topN: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    threshold: { type: 'number', minimum: 0, maximum: 1, default: 0.5 }
  },
  required: ['dnaPattern'],
  additionalProperties: false
};

const validateSigilCreate = ajv.compile(sigilCreateSchema);
const validateSigilVerify = ajv.compile(sigilVerifySchema);
const validateSigilMatch = ajv.compile(sigilMatchSchema);

function validateSchema(validator) {
  return function(req, res, next) {
    const valid = validator(req.body);
    if (!valid) {
      const errors = validator.errors.map(error => ({
        field: error.instancePath || error.schemaPath,
        message: error.message,
        rejectedValue: error.data,
        allowedValues: error.schema
      }));
      req.log && req.log.warn({ errors, body: req.body, endpoint: req.path }, 'Schema validation failed');
      return res.status(400).json({
        error: 'Invalid request payload',
        code: 'SCHEMA_VALIDATION_FAILED',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
}

const validateSigilCreatePayload = validateSchema(validateSigilCreate);
const validateSigilVerifyPayload = validateSchema(validateSigilVerify);
const validateSigilMatchPayload = validateSchema(validateSigilMatch);

function getSchemaDocumentation() {
  return { create: sigilCreateSchema, verify: sigilVerifySchema, match: sigilMatchSchema };
}

function validateData(data, validator) {
  const valid = validator(data);
  return { valid, errors: valid ? [] : validator.errors };
}

module.exports = {
  validateSigilCreatePayload,
  validateSigilVerifyPayload,
  validateSigilMatchPayload,
  validateSchema,
  getSchemaDocumentation,
  validateData,
  schemas: { create: sigilCreateSchema, verify: sigilVerifySchema, match: sigilMatchSchema }
};

