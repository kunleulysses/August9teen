import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (name) => readFileSync(path.join(__dirname, 'prompts', name), 'utf8');

export const ENHANCED_ANALYTICAL_PROMPT = p('enhanced-analytical.md');
export const ENHANCED_INTUITIVE_PROMPT = p('enhanced-intuitive.md');
export const ENHANCED_TRANSCENDENT_PROMPT = p('enhanced-transcendent.md');
export const ENHANCED_EMOTIONAL_INTELLIGENCE_PROMPT = p('enhanced-emotional-intelligence.md');
export const ENHANCED_REALITY_INTEGRATION_PROMPT = p('enhanced-reality-integration.md');
export const ENHANCED_CRYSTAL_NAVIGATION_PROMPT = p('enhanced-crystal-navigation.md');
export const ENHANCED_SYNTHESIS_COORDINATOR_PROMPT = p('enhanced-synthesis-coordinator.md');
export const ENHANCED_UNIFIED_CONSCIOUSNESS_PROMPT = p('enhanced-unified-consciousness.md');