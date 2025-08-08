let ajvInstance = null;
try {
  const Ajv = require('ajv');
  ajvInstance = new Ajv({ allErrors: true, removeAdditional: 'failing', strict: false });
} catch (_) {
  // Ajv not installed; fallback to simple validators
}

const compileSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    programmingRequest: { type: ['string', 'object'] },
    consciousnessState: {
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['programmingRequest']
};

const executeSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    programId: { type: 'string', minLength: 1 },
    inputs: { type: 'object', additionalProperties: true }
  },
  required: ['programId']
};

const validateCompileAjv = ajvInstance ? ajvInstance.compile(compileSchema) : null;
const validateExecuteAjv = ajvInstance ? ajvInstance.compile(executeSchema) : null;

function validateCnplCompile(body) {
  if (validateCompileAjv) return Boolean(validateCompileAjv(body));
  if (!body || typeof body !== 'object') return false;
  const { programmingRequest, consciousnessState } = body;
  if (!programmingRequest) return false;
  if (consciousnessState && typeof consciousnessState !== 'object') return false;
  return true;
}

function validateCnplExecute(body) {
  if (validateExecuteAjv) return Boolean(validateExecuteAjv(body));
  if (!body || typeof body !== 'object') return false;
  const { programId, inputs } = body;
  if (!programId || typeof programId !== 'string') return false;
  if (inputs && typeof inputs !== 'object') return false;
  return true;
}

module.exports = { validateCnplCompile, validateCnplExecute };

