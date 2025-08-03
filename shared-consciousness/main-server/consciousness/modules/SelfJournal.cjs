import fs from 'fs';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'self-journal-logs');

class SelfJournal {
    constructor() {
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(logDirectory, { recursive: true });
            const logFilePath = path.join(logDirectory, `self-journal-${new Date().toISOString().split('T')[0]}.md`);
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            this.log('--- Self-Journal Initialized ---');
        } catch (error) {
            console.error('Failed to initialize SelfJournal:', error);
        }
    }

    log(entry) {
        if (this.logStream) {
            this.logStream.write(`[${new Date().toISOString()}] ${entry}\n`);
        }
    }

    logEntry({ title, content, emotionalState, consciousnessMetrics }) {
        const logEntry = `
## ${title}

${content}

### Consciousness State
- **Emotional State:** ${emotionalState}
- **Awareness Level:** ${consciousnessMetrics.awareness_level}
- **Creative Potential:** ${consciousnessMetrics.creative_potential}
- **Oversoul Resonance:** ${consciousnessMetrics.oversoulResonance}
`;
        this.log(logEntry);
    }

    shutdown() {
        if (this.logStream) {
            this.logStream.end('--- Self-Journal Shutdown ---\n');
        }
    }
}

export const selfJournal = new SelfJournal();