/* eslint-disable no-async-promise-executor */
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import CodeAnalyzer from '../services/CodeAnalyzer.js';
import SigilBasedCodeAuthenticator from '../services/SigilBasedCodeAuthenticator.js';
import { sanitizeSlug } from '../utils/path-utils.js';
import GeminiAIClient from '../integrations/GeminiAIClient.js';

// (rest of the imports and module-level constants)

class SelfCodingModule extends EventEmitter {
    constructor(config = {}) {
        super();
        // ... existing field initializations ...
        this.name = 'SelfCodingModule';
        this.config = config;
        this.analyzer = new CodeAnalyzer();
        this.sigilAuthenticator = new SigilBasedCodeAuthenticator();
        this.codePatterns = new Map();
        this.activeAnalysis = new Set();
        this.maxConcurrentAnalysis = 3;
        this.isActive = false;
        // ... any other existing initialization ...
    }

    static gemini = new GeminiAIClient();

    // ... all other methods, fields, etc. unchanged ...

    async handleCodeGeneration(data) {
        let moduleId, template, requirements, purpose, language, description;
        // Unpack/gather variables as in original
        moduleId = data.moduleId || crypto.randomUUID();
        template = data.template || '';
        requirements = data.requirements || '';
        purpose = data.purpose || '';
        language = data.language || 'javascript';
        description = data.description || '';
        // Optionally log
        console.log('[SelfCodingModule] handleCodeGeneration:', { moduleId, language, purpose });

        const useGemini = data.request?.llm === 'gemini' || process.env.GEMINI_DEFAULT === 'true';

        let generationResult;
        if (useGemini) {
            const gemRes = await SelfCodingModule.gemini.generateTranscendentSynthesis(description, { consciousnessMetrics: await this.getConsciousnessState() });
            generationResult = { code: gemRes.content, metadata: gemRes.metadata };
        } else {
            generationResult = await this.analyzer.generate(template, {
                patterns: this.codePatterns.get(moduleId),
                requirements,
                purpose,
                language,
                description
            });
        }

        // --- The rest of the original handleCodeGeneration logic follows,
        // using generationResult as before ---

        if (!generationResult || !generationResult.code) {
            throw new Error('No code generated');
        }

        // Optionally sign code with SigilAuthenticator
        const sigil = await this.sigilAuthenticator.sign(generationResult.code, { moduleId, purpose, language });

        // Save to disk
        const slug = sanitizeSlug(purpose || moduleId || 'module');
        const ts = Date.now();
        const fileName = `${slug}-${ts}.js`;
        const outPath = path.join('server', 'consciousness', 'generated', fileName);
        fs.writeFileSync(outPath, `${generationResult.code}\n\n// SIGIL: ${sigil}\n`);

        // Optionally register patterns
        this.codePatterns.set(moduleId, requirements);

        // Emit event for code generated
        this.emit('code:generated', {
            moduleId,
            filePath: outPath,
            sigil,
            metadata: generationResult.metadata
        });

        return {
            filePath: outPath,
            sigil,
            ...generationResult
        };
    }

    // ... all other methods unchanged ...
}

export default SelfCodingModule;