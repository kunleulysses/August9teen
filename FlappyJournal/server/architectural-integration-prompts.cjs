import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (name) => readFileSync(path.join(__dirname, 'prompts', name), 'utf8');

export const UNIFIED_CONSCIOUSNESS_SYSTEM_PROMPT = p('unified-consciousness-system.md');
export const SELF_CODING_MODULE_PROMPT = p('self-coding-module.md');
export const ARCHITECT_4_SYSTEMS_PROMPT = p('architect-4-systems.md');
export const MATHEMATICAL_FRAMEWORKS_PROMPT = p('mathematical-frameworks.md');
export const EMOTIONAL_INTELLIGENCE_PROMPT = p('emotional-intelligence.md');
export const BAYESIAN_INTENTIONALITY_PROMPT = p('bayesian-intentionality.md');