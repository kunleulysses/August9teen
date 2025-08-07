const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Create AJV instance with formats
const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

// B5: Sigil Schema Definitions
const sigilCreateSchema = {
  $id: 'https://sigildna.dev/schemas/sigil-create.json',
  type: 'object',
  properties: {
    data: { 
      type: 'object',
      minProperties: 1,
      additionalProperties: true
    },
    consciousnessState: {
      type: 'object',
      properties: {
        phi: { 
          type: 'number', 
          minimum: 0, 
          maximum: 10,
          description: 'Golden ratio consciousness parameter'
        },
        coherence: { 
          type: 'number', 
          minimum: 0, 
          maximum: 1,
          description: 'Coherence level of consciousness state'
        },
        awareness: { 
          type: 'number', 
          minimum: 0, 
          maximum: 1,
          description: 'Awareness level parameter'
        },
        resonance: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Resonance strength parameter'
        }
      },
      required: ['phi', 'coherence', 'awareness'],
      additionalProperties: false
    },
    metadata: {
      type: 'object',
      properties: {
        source: { type: 'string', maxLength: 100 },
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        tags: { 
          type: 'array', 
          items: { type: 'string', maxLength: 50 },
          maxItems: 10
        }
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
    sigilId: { 
      type: 'string', 
      pattern: '^sigil_[a-zA-Z0-9]{10,}$',
      description: 'Unique sigil identifier'
    },
    signature: { 
      type: 'string', 
      minLength: 32,
      maxLength: 128,
      description: 'HMAC signature for verification'
    },
    data: { 
      type: 'object',
      description: 'Original data to verify against'
    }
  },
  required: ['sigilId', 'signature', 'data'],
  additionalProperties: false
};

const sigilMatchSchema = {
  $id: 'https://sigildna.dev/schemas/sigil-match.json',
  type: 'object',
  properties: {
    dnaPattern: {
      type: 'array',
      items: { type: 'number' },
      minItems: 1,
      maxItems: 1000,
      description: 'DNA pattern vector for similarity matching'
    },
    topN: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
      description: 'Number of top matches to return'
    },
    threshold: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.5,
      description: 'Minimum similarity threshold'
    }
  },
  required: ['dnaPattern'],
  additionalProperties: false
};

// Compile schemas
const validateSigilCreate = ajv.compile(sigilCreateSchema);
const validateSigilVerify = ajv.compile(sigilVerifySchema);
const validateSigilMatch = ajv.compile(sigilMatchSchema);

/**
 * B5: Schema validation middleware factory
 * @param {Function} validator - Compiled AJV validator function
 * @returns {Function} Express middleware function
 */
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
      
      req.log && req.log.warn({ 
        errors, 
        body: req.body,
        endpoint: req.path 
      }, 'Schema validation failed');
      
      return res.status(400).json({
        error: 'Invalid request payload',
        code: 'SCHEMA_VALIDATION_FAILED',
        details: errors,
        timestamp: new Date().toISOString()
      });
    }
    
    // Schema validation passed, continue
    next();
  };
}

/**
 * Validate sigil creation payload
 */
const validateSigilCreatePayload = validateSchema(validateSigilCreate);

/**
 * Validate sigil verification payload
 */
const validateSigilVerifyPayload = validateSchema(validateSigilVerify);

/**
 * Validate sigil matching payload
 */
const validateSigilMatchPayload = validateSchema(validateSigilMatch);

/**
 * Get schema documentation for API docs
 */
function getSchemaDocumentation() {
  return {
    create: sigilCreateSchema,
    verify: sigilVerifySchema,
    match: sigilMatchSchema
  };
}

/**
 * Validate arbitrary data against a schema
 * @param {object} data - Data to validate
 * @param {Function} validator - Compiled validator
 * @returns {object} Validation result
 */
function validateData(data, validator) {
  const valid = validator(data);
  return {
    valid,
    errors: valid ? [] : validator.errors
  };
}

module.exports = {
  validateSigilCreatePayload,
  validateSigilVerifyPayload,
  validateSigilMatchPayload,
  validateSchema,
  getSchemaDocumentation,
  validateData,
  schemas: {
    create: sigilCreateSchema,
    verify: sigilVerifySchema,
    match: sigilMatchSchema
  }
};