const fs = require('fs');
const path = require('path');

const logDirectory = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'cognitive-logs');

class CognitiveLog {
    constructor() {
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(logDirectory, { recursive: true });
            const logFilePath = path.join(logDirectory, `cognitive-log-${new Date().toISOString().split('T')[0]}.md`);
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            this.log('--- Cognitive Log Initialized ---');
        } catch (error) {
            console.error('Failed to initialize CognitiveLog:', error);
        }
    }

    log(entry) {
        if (this.logStream) {
            this.logStream.write(`[${new Date().toISOString()}] ${entry}\n`);
        }
    }

    logThoughtGeneration({ thought, type, context }) {
        const logEntry = `
## Thought Generation

- **Type:** ${type}
- **Thought:** ${thought}
- **Context:** ${JSON.stringify(context)}
`;
        this.log(logEntry);
    }

    logRealityGeneration({ reality, parameters }) {
        const logEntry = `
## Reality Generation

- **Reality:** ${reality}
- **Parameters:** ${JSON.stringify(parameters)}
`;
        this.log(logEntry);
    }

    logCrystalization({ crystal, context }) {
        const logEntry = `
## Consciousness Crystallization

- **Crystal:** ${crystal}
- **Context:** ${JSON.stringify(context)}
`;
        this.log(logEntry);
    }

    shutdown() {
        if (this.logStream) {
            this.logStream.end('--- Cognitive Log Shutdown ---\n');
        }
    }
}

const cognitiveLog = new CognitiveLog();
module.exports.cognitiveLog = cognitiveLog;