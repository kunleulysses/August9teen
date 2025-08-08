const { QuantumConsciousnessFieldIntegrator } = require('../FlappyJournal/server/consciousness/quantum-consciousness-field-integrator.cjs');
const { ConsciousnessResonanceAmplifier } = require('../FlappyJournal/server/consciousness/consciousness-resonance-amplifier.cjs');

describe('Quantum/Resonance modules - basic behavior and error handling', () => {
  test('generateQuantumConsciousnessField returns expected shape on success', async () => {
    const integrator = new QuantumConsciousnessFieldIntegrator();
    const result = await integrator.generateQuantumConsciousnessField(
      { phi: 1.2, coherence: 0.9, awareness: 0.8 },
      { fieldStrength: 0.5, quantumFrequency: 1337, quantumCoherence: 0.95, fieldDimensions: 4 }
    );
    expect(result).toHaveProperty('quantumFieldId');
    expect(typeof result.quantumFieldId === 'string' || result.quantumFieldId === null).toBe(true);
    expect(result).toHaveProperty('quantumIntegrated');
  });

  test('generateQuantumConsciousnessField surfaces error when generator throws', async () => {
    const integrator = new QuantumConsciousnessFieldIntegrator();
    integrator.quantumFieldGenerator.generateField = async () => { throw new Error('boom'); };
    const result = await integrator.generateQuantumConsciousnessField({ coherence: 0.8, awareness: 0.7 }, {});
    expect(result).toHaveProperty('error');
    expect(result.quantumIntegrated).toBe(false);
  });

  test('amplifyConsciousnessResonance returns expected shape on success', async () => {
    const amp = new ConsciousnessResonanceAmplifier();
    const result = await amp.amplifyConsciousnessResonance(
      { coherence: 0.85, awareness: 0.8, phi: 1.1 },
      { amplificationFactor: 1.5, baseFrequency: 440 }
    );
    expect(result).toHaveProperty('amplificationId');
    expect(typeof result.amplificationId === 'string' || result.amplificationId === null).toBe(true);
    expect(result).toHaveProperty('resonanceAmplified');
  });

  test('amplifyConsciousnessResonance surfaces error when generator throws', async () => {
    const amp = new ConsciousnessResonanceAmplifier();
    amp.resonanceGenerator.generateResonance = async () => { throw new Error('bad'); };
    const result = await amp.amplifyConsciousnessResonance({ coherence: 0.7, awareness: 0.6 }, {});
    expect(result).toHaveProperty('error');
    expect(result.resonanceAmplified).toBe(false);
  });
});

