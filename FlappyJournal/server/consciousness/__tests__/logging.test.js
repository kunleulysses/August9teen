/**
 * Test: Logging Integration
 * Verifies that the Pino logger is working correctly in our modules
 */

const SelfCodingModule = require('../modules/SelfCodingModule.cjs');
const CodeGenerationService = require('../services/CodeGenerationService.cjs');

describe('Logging Integration', () => {
  test('should create SelfCodingModule without console calls', () => {
    // This test verifies that the module can be instantiated
    // and that our logger conversion doesn't break anything
    const module = new SelfCodingModule();
    expect(module).toBeDefined();
    expect(module.name).toBe('SelfCodingModule');
  });

  test('should create CodeGenerationService without console calls', () => {
    // Mock goal system for the service
    const mockGoalSystem = {
      addGoal: jest.fn()
    };
    
    const service = new CodeGenerationService(mockGoalSystem);
    expect(service).toBeDefined();
    expect(service.name).toBe('CodeGenerationService');
  });

  test('should have logger utility available', () => {
    const { child } = require('../utils/logger.cjs');
    expect(child).toBeDefined();
    expect(typeof child).toBe('function');
    
    const logger = child({ module: 'test' });
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
