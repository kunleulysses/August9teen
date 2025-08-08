function isNumberIn01(x) {
  return typeof x === 'number' && x >= 0 && x <= 1;
}

function validateConsciousnessState(state) {
  if (state == null || typeof state !== 'object') return false;
  const { phi, coherence, awareness } = state;
  if (phi != null && typeof phi !== 'number') return false;
  if (coherence != null && !isNumberIn01(coherence)) return false;
  if (awareness != null && !isNumberIn01(awareness)) return false;
  return true;
}

function validateQuantumFieldParameters(params) {
  if (params == null || typeof params !== 'object') return false;
  // Allow free-form but optionally enforce known numeric bounds if present
  const { fieldStrength, quantumFrequency, quantumCoherence, fieldDimensions } = params;
  if (fieldStrength != null && typeof fieldStrength !== 'number') return false;
  if (quantumFrequency != null && typeof quantumFrequency !== 'number') return false;
  if (quantumCoherence != null && !isNumberIn01(quantumCoherence)) return false;
  if (fieldDimensions != null && (!Number.isInteger(fieldDimensions) || fieldDimensions <= 0 || fieldDimensions > 64)) return false;
  return true;
}

function validateResonanceParameters(params) {
  if (params == null || typeof params !== 'object') return false;
  const { amplificationFactor, baseFrequency } = params;
  if (amplificationFactor != null && (typeof amplificationFactor !== 'number' || amplificationFactor <= 0)) return false;
  if (baseFrequency != null && (typeof baseFrequency !== 'number' || baseFrequency <= 0)) return false;
  return true;
}

module.exports = {
  validateConsciousnessState,
  validateQuantumFieldParameters,
  validateResonanceParameters,
};

