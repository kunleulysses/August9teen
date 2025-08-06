const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

const mockEventBus = new EventEmitter();
jest.mock('../server/consciousness/core/ConsciousnessEventBus.cjs', () => ({
  __esModule: true,
  default: mockEventBus
}));

// Mock refactoring system to avoid heavy dependencies
jest.mock('../server/consciousness/modules/AutonomousCodeRefactoringSystem.cjs', () => {
  return function() {
    return { startAutonomousRefactoring: jest.fn() };
  };
});

jest.mock('../server/consciousness/sigil-based-code-authenticator.cjs', () => {
  return function() {
    return {
      embedConsciousnessSigil: async (code) => ({
        consciousnessAuthenticated: true,
        authenticatedCode: code,
        sigil: { symbol: 'mock' },
        codeDNA: { sequence: 'mock' }
      })
    };
  };
});

process.env.METRICS_ENABLED = 'false';
jest.setTimeout(15000);

describe('SelfCodingModule', () => {
  const logDir = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'self-coding-logs');
  let module;

  beforeAll(async () => {
    // ensure a clean log directory before tests
    await fs.promises.rm(logDir, { recursive: true, force: true });
  });

  afterAll(() => {
    if (module && module.autonomousRefactoring && module.autonomousRefactoring.refactoringTimer) {
      clearInterval(module.autonomousRefactoring.refactoringTimer);
    }
    if (module) {
      module.shutdown();
    }
    const { selfCodingLog } = require('../server/consciousness/modules/SelfCodingLog.cjs');
    selfCodingLog.shutdown();
  });

  test('generates code, writes logs, and emits integration events', async () => {
    const SelfCodingModule = require('../server/consciousness/modules/SelfCodingModule.cjs');
    module = new SelfCodingModule();
    await new Promise(resolve => setTimeout(resolve, 10));

    // disable autonomous refactoring to avoid timers
    if (module.autonomousRefactoring) {
      module.autonomousRefactoring.startAutonomousRefactoring = jest.fn();
    }

    const eventPromise = new Promise(resolve => {
      mockEventBus.once('code:generation:complete', resolve);
    });

    const result = await module.handleCodeGeneration({
      moduleId: 'test-module',
      template: 'function',
      requirements: 'Return a greeting',
      purpose: 'unit-test',
      language: 'javascript',
      description: 'Generate a simple hello world function for testing'
    });

    expect(result.success).toBe(true);
    expect(result.code).toContain('helloWorld');

    const eventData = await eventPromise;
    expect(eventData.moduleId).toBe('test-module');

    // allow log stream to flush
    await new Promise(resolve => setTimeout(resolve, 50));
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `self-coding-log-${today}.md`);
    expect(fs.existsSync(logFile)).toBe(true);
    const logContent = fs.readFileSync(logFile, 'utf8');
    expect(logContent).toMatch(/Code Generation/);
  });
});
