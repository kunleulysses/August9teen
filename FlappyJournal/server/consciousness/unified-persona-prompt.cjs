// Unified Persona Prompt Loader
import { readFileSync } from 'fs';
import path from 'path';
const personaPromptPath = path.resolve(process.cwd(), 'FlappyJournal/server/consciousness/unified-persona-prompt.md');
export const UNIFIED_PERSONA_PROMPT = readFileSync(personaPromptPath, 'utf8');