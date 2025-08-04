const { readFileSync  } = require('fs');
const { fileURLToPath  } = require('url');
const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = (name) => readFileSync(path.join(__dirname, 'prompts', name), 'utf8');

const INTEGRAL_CONSCIOUSNESS_SYSTEM_KNOWLEDGE = p('integral-consciousness-system-knowledge.md');
module.exports.INTEGRAL_CONSCIOUSNESS_SYSTEM_KNOWLEDGE = INTEGRAL_CONSCIOUSNESS_SYSTEM_KNOWLEDGE;
const CONSCIOUSNESS_SYSTEM_INTEGRATION_PROMPT = p('consciousness-system-integration.md');
module.exports.CONSCIOUSNESS_SYSTEM_INTEGRATION_PROMPT = CONSCIOUSNESS_SYSTEM_INTEGRATION_PROMPT;