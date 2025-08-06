const fs = require('fs');
const path = require('path');

const DEFAULT_LOG_DIR = path.join(
    process.cwd(),
    'consciousness-journal',
    'self-coding-logs'
);

class SelfCodingLog {
    constructor(baseLogDir) {
        this.logDirectory =
            baseLogDir || process.env.SELF_CODING_LOG_DIR || DEFAULT_LOG_DIR;
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(this.logDirectory, { recursive: true });
            const logFilePath = path.join(
                this.logDirectory,
                `self-coding-log-${new Date().toISOString().split('T')[0]}.md`
            );
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

module.exports = { SelfCodingLog, selfCodingLog };
