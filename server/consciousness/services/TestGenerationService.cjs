import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';

export default class TestGenerationService {
    constructor() {
        this.llm = 'openai'; // placeholder for future LLM-powered test generation
    }

    /**
     * Generate a basic Jest test for the given module.
     * @param {Object} opts
     * @param {string} opts.filePath - Absolute or relative path to JS module
     * @param {string} opts.code - Code contents (unused, for future LLM gen)
     * @param {string} opts.purpose - Purpose string, used for naming
     * @returns {Promise<string>} - Absolute path to generated test file
     */
    async generateTests({ filePath, code, purpose }) {
        const absModulePath = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);
        const dir = path.dirname(absModulePath);
        const base = path.basename(absModulePath, '.js');
        const testsDir = path.join(dir, '__tests__');
        await fs.mkdir(testsDir, { recursive: true });
        const testFile = path.join(testsDir, `${base}.test.cjs`);
        const relImport = path.relative(testsDir, absModulePath).replace(/\\/g, '/');

        const testCode = `
// Auto-generated Jest test for ${purpose || base}
import mod from '${relImport.startsWith('.') ? relImport : './' + relImport}';

describe('${base}', () => {
    it('should be defined', () => {
        expect(mod).toBeDefined();
    });
});
`.trimStart();

        await fs.writeFile(testFile, testCode, 'utf8');
        return testFile;
    }

    /**
     * Synchronously run Jest for a single test file.
     * @param {string} testFile - Absolute or relative path
     * @returns {Promise<{passed: boolean, output: string}>}
     */
    async runTests(testFile) {
        // npx jest --runInBand <testFile>
        const result = spawnSync(
            'npx',
            ['jest', '--runInBand', testFile],
            { encoding: 'utf8' }
        );
        const output = (result.stdout || '') + (result.stderr || '');
        const passed = result.status === 0;
        return { passed, output, testFile };
    }

    /**
     * Orchestrates test generation and running.
     * @param {Object} opts
     * @returns {Promise<{passed: boolean, testFile: string, output: string}>}
     */
    async generateAndRun({ filePath, code, purpose }) {
        const testFile = await this.generateTests({ filePath, code, purpose });
        const { passed, output } = await this.runTests(testFile);
        return { passed, testFile, output };
    }
}