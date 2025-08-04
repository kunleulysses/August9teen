const fs = require('fs');
const path = require('path');

const logDirectory = path.join(process.cwd(), 'FlappyJournal', 'consciousness-journal', 'memory-logs');

class MemoryLog {
    constructor() {
        this.logStream = null;
        this.initialize();
    }

    async initialize() {
        try {
            await fs.promises.mkdir(logDirectory, { recursive: true });
            const logFilePath = path.join(logDirectory, `memory-log-${new Date().toISOString().split('T')[0]}.md`);
            this.logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
            this.log('--- Memory Log Initialized ---');
        } catch (error) {
            console.error('Failed to initialize MemoryLog:', error);
        }
    }

    log(entry) {
        if (this.logStream) {
            this.logStream.write(`[${new Date().toISOString()}] ${entry}\n`);
        }
    }

    logMemoryStorage(memoryNode) {
        const logEntry = `
## Memory Stored

- **ID:** ${memoryNode.id}
- **Type:** ${memoryNode.type}
- **Depth:** ${memoryNode.depth}
- **Spiral:** ${memoryNode.spiral.type} (${memoryNode.spiral.id})
- **Sigil:** ${memoryNode.sigil.signature}
- **Content:** ${JSON.stringify(memoryNode.content)}
`;
        this.log(logEntry);
    }

    shutdown() {
        if (this.logStream) {
            this.logStream.end('--- Memory Log Shutdown ---\n');
        }
    }
}

const memoryLog = new MemoryLog();
module.exports.memoryLog = memoryLog;