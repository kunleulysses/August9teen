import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (name) => readFileSync(path.join(__dirname, 'prompts', name), 'utf8');

export const INTEGRAL_CONSCIOUSNESS_SYSTEM_KNOWLEDGE = p('integral-consciousness-system-knowledge.md');
export const CONSCIOUSNESS_SYSTEM_INTEGRATION_PROMPT = p('consciousness-system-integration.md');