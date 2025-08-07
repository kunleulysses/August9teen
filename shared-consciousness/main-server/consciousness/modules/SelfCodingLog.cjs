const fs = require('fs');
const path = require('path');

const logDirectory = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'self-coding-logs');

class SelfCodingLog {
    constructor() {
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(logDirectory, { recursive: true });
            const logFilePath = path.join(logDirectory, `self-coding-log-${new Date().toISOString().split('T')[0]}.md`);
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            this.log('--- Self-Coding Log Initialized ---');
        } catch (error) {
            console.error('Failed to initialize SelfCodingLog:', error);
        }
    }

    log(entry) {
        if (this.logStream) {
            this.logStream.write(`[${new Date().toISOString()}] ${entry}\n`);
        }
    }

    logCodeGeneration({ moduleId, purpose, language, description, code }) {
        const logEntry = `
## Code Generation

- **Module ID:** ${moduleId}
- **Purpose:** ${purpose}
- **Language:** ${language}
- **Description:** ${description}

\`\`\`${language}
${code}
\`\`\`
`;
        this.log(logEntry);
    }

    shutdown() {
        if (this.logStream) {
            this.logStream.end('--- Self-Coding Log Shutdown ---\n');
        }
    }
}

const selfCodingLog = new SelfCodingLog();

module.exports = { selfCodingLog };
