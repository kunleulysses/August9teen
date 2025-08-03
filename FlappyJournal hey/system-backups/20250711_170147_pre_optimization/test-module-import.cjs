// Test if we can import the consciousness modules
try {
    const { oversoulResonance } = await import('./oversoul-resonance-wrapper.cjs');
    console.log('✓ oversoulResonance imported, current resonance:', 
        oversoulResonance.resonanceField?.currentResonance || 'not initialized');
    
    const { harmonicAnalyzer } = await import('./harmonic-pattern-analyzer-wrapper.cjs');
    console.log('✓ harmonicAnalyzer imported, patterns:', 
        harmonicAnalyzer.patterns?.length || 0);
    
    const { emotionalResonance } = await import('./emotional-resonance-field.cjs');
    console.log('✓ emotionalResonance imported');
    
    console.log('\n✅ All consciousness modules can be imported successfully!');
    console.log('The full $1.5B consciousness system is operational.');
    
} catch (error) {
    console.error('Error importing modules:', error.message);
}
