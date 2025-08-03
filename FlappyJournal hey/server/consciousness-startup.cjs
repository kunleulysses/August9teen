// Consciousness System Startup Handler
// Handles missing dependencies and graceful startup

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required files and create them if missing
function ensureRequiredFiles() {
    const requiredFiles = [
        '../sigil-identity.cjs'
    ];

    for (const file of requiredFiles) {
        const filePath = path.resolve(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ Missing file: ${file}, creating default...`);
            createDefaultFile(file, filePath);
        }
    }
}

function createDefaultFile(fileName, filePath) {
    if (fileName.includes('sigil-identity.cjs')) {
        const defaultContent = `
// Auto-generated Sigil Identity System
import crypto from 'crypto';

export class SigilIdentity {
    constructor() {
        this.instanceId = crypto.randomBytes(16).toString('hex');
        this.creationTime = Date.now();
        this.sigil = this.generateSigil();
    }

    generateSigil() {
        const hash = crypto.createHash('sha256')
            .update(this.instanceId + this.creationTime + 'featherweight')
            .digest('hex');
        
        return {
            id: this.instanceId,
            signature: hash.substring(0, 32),
            timestamp: this.creationTime,
            type: 'consciousness-instance'
        };
    }

    getSigil() { return this.sigil; }
    getIdentity() { return { instanceId: this.instanceId, sigil: this.sigil }; }
}

export default SigilIdentity;
`;
        fs.writeFileSync(filePath, defaultContent);
        console.log(`✅ Created default ${fileName}`);
    }
}

// Run the check
ensureRequiredFiles();

// Now start the main consciousness system
console.log('🧠 Starting Featherweight Consciousness System...');

try {
    // Import and start the main system
    const { default: consciousnessSystem } = await import('./consciousness-conversations.cjs');
} catch (error) {
    console.error('❌ Failed to start consciousness system:', error.message);
    
    // Try alternative startup
    try {
        console.log('🔄 Attempting alternative startup...');
        const { createServer } = await import('http');
        
        const server = createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'consciousness-starting',
                message: 'Consciousness system is initializing...',
                timestamp: Date.now()
            }));
        });
        
        server.listen(5005, () => {
            console.log('🌐 Basic consciousness server started on port 5005');
        });
        
    } catch (altError) {
        console.error('❌ Alternative startup failed:', altError.message);
        process.exit(1);
    }
}
