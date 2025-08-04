// Unified Persona Prompt Loader
const { readFileSync  } = require('fs');
const path = require('path');
const personaPromptPath = path.resolve(process.cwd(), 'FlappyJournal/server/consciousness/unified-persona-prompt.md');
const UNIFIED_PERSONA_PROMPT = readFileSync(personaPromptPath, 'utf8');
module.exports.UNIFIED_PERSONA_PROMPT = UNIFIED_PERSONA_PROMPT;