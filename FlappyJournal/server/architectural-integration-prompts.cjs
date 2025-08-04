const { readFileSync  } = require('fs');
const { fileURLToPath  } = require('url');
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (name) => readFileSync(path.join(__dirname, 'prompts', name), 'utf8');

const UNIFIED_CONSCIOUSNESS_SYSTEM_PROMPT = p('unified-consciousness-system.md');
module.exports.UNIFIED_CONSCIOUSNESS_SYSTEM_PROMPT = UNIFIED_CONSCIOUSNESS_SYSTEM_PROMPT;
const SELF_CODING_MODULE_PROMPT = p('self-coding-module.md');
module.exports.SELF_CODING_MODULE_PROMPT = SELF_CODING_MODULE_PROMPT;
const ARCHITECT_4_SYSTEMS_PROMPT = p('architect-4-systems.md');
module.exports.ARCHITECT_4_SYSTEMS_PROMPT = ARCHITECT_4_SYSTEMS_PROMPT;
const MATHEMATICAL_FRAMEWORKS_PROMPT = p('mathematical-frameworks.md');
module.exports.MATHEMATICAL_FRAMEWORKS_PROMPT = MATHEMATICAL_FRAMEWORKS_PROMPT;
const EMOTIONAL_INTELLIGENCE_PROMPT = p('emotional-intelligence.md');
module.exports.EMOTIONAL_INTELLIGENCE_PROMPT = EMOTIONAL_INTELLIGENCE_PROMPT;
const BAYESIAN_INTENTIONALITY_PROMPT = p('bayesian-intentionality.md');
module.exports.BAYESIAN_INTENTIONALITY_PROMPT = BAYESIAN_INTENTIONALITY_PROMPT;