const AutonomousCodeRefactoringSystem = require('../../server/consciousness/modules/AutonomousCodeRefactoringSystem.cjs');

describe('AutonomousCodeRefactoringSystem transformations', () => {
  const analyzer = { analyze: async () => ({ enhanced: {} }) };

  test('extracts helper functions from large functions', async () => {
    const system = new AutonomousCodeRefactoringSystem({ codeHistory: [] }, analyzer);
    const bodyLines = Array.from({ length: 41 }).map((_, i) => `  const a${i} = ${i};`).join('\n');
    const code = `function bigFunc(x) {\n${bodyLines}\n  return x;\n}`;
    const candidate = { moduleId: 'm1', code, analysis: {} };
    const plan = { actions: [{ action: 'extract-functions' }] };
    const result = await system.executeRefactoring(candidate, plan);
    expect(result.success).toBe(true);
    expect(result.transformedCode).toMatch(/function bigFuncHelper/);
    expect(result.transformedCode).toMatch(/return bigFuncHelper\(x\);/);
  });

  test('converts deep nesting to guard clauses', async () => {
    const system = new AutonomousCodeRefactoringSystem({ codeHistory: [] }, analyzer);
    const code = `function nested(a) {\n  if (a > 0) {\n    if (a > 1) {\n      if (a > 2) {\n        if (a > 3) {\n          console.log('deep');\n        }\n      }\n    }\n  }\n}`;
    const candidate = { moduleId: 'm2', code, analysis: {} };
    const plan = { actions: [{ action: 'flatten-nesting' }] };
    const result = await system.executeRefactoring(candidate, plan);
    expect(result.success).toBe(true);
    expect(result.transformedCode).toMatch(/if \(!\(a > 3\)\) {\n +return;\n}/);
  });

  test('deduplicates repeated code blocks', async () => {
    const system = new AutonomousCodeRefactoringSystem({ codeHistory: [] }, analyzer);
    const fragment = `const x = 1;\nconst y = 2;\nconst z = x + y;\nconsole.log(z);\nreturn z;`;
    const code = `function dup1() {\n${fragment}\n}\n\nfunction dup2() {\n${fragment}\n}`;
    const candidate = { moduleId: 'm3', code, analysis: {} };
    const plan = { actions: [{ action: 'deduplicate' }] };
    const result = await system.executeRefactoring(candidate, plan);
    expect(result.success).toBe(true);
    const helperMatch = result.transformedCode.match(/function (dedupHelper\d+)/);
    expect(helperMatch).toBeTruthy();
    const helperName = helperMatch[1];
    expect(result.transformedCode).toMatch(new RegExp(`function dup2\\(\\) {\\n +${helperName}\\(\\);\\n}`));
  });
});

