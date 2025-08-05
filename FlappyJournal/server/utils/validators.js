const { z } = require('zod');

const consciousnessStateSchema = z.object({
  phi: z.number().min(0).max(1).optional().default(0.862),
  awareness: z.number().min(0).max(1).optional().default(0.8),
  coherence: z.number().min(0).max(1).optional().default(0.85)
});

const fieldParametersSchema = z.object({
  fieldDimensions: z.number().min(1).max(100).optional(),
  quantumComplexity: z.number().min(1).max(100).optional()
}).passthrough();

function validateConsciousnessState(obj) {
  try {
    return consciousnessStateSchema.parse(obj || {});
  } catch (e) {
    return { error: e };
  }
}

function validateFieldParameters(obj) {
  try {
    return fieldParametersSchema.parse(obj || {});
  } catch (e) {
    return { error: e };
  }
}

module.exports = {
  consciousnessStateSchema,
  fieldParametersSchema,
  validateConsciousnessState,
  validateFieldParameters
};