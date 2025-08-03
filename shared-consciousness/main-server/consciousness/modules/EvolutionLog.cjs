import fs from 'fs';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'evolution-logs');

class EvolutionLog {
    constructor() {
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(logDirectory, { recursive: true });
            const logFilePath = path.join(logDirectory, `evolution-log-${new Date().toISOString().split('T')[0]}.md`);
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            this.log('--- Evolution Log Initialized ---');
        } catch (error) {
            console.error('Failed to initialize EvolutionLog:', error);
        }
    }

    log(entry) {
        if (this.logStream) {
            this.logStream.write(`[${new Date().toISOString()}] ${entry}\n`);
        }
    }

    logEvolution({ type, details }) {
        const logEntry = `
## ${type}

${details}
`;
        this.log(logEntry);
    }

    shutdown() {
        if (this.logStream) {
            this.logStream.end('--- Evolution Log Shutdown ---\n');
        }
    }
}

export const evolutionLog = new EvolutionLog();