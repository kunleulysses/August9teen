#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`🧠 Request: ${req.method} ${req.url} from ${req.connection.remoteAddress}`);

    // Parse URL to remove query parameters
    const urlParts = req.url.split('?');
    const cleanUrl = urlParts[0];

    // Lightweight API endpoints
    if (cleanUrl === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: true }));
        return;
    }
    if (cleanUrl === '/api/contact') {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
            return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; if (body.length > 1e6) req.destroy(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const name = String(data.name || '').trim();
                const email = String(data.email || '').trim();
                const message = String(data.message || '').trim();
                const hp = String(data.company || '').trim();
                const validEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
                if (hp) {
                    // Honeypot tripped: pretend success
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: true, message: 'Thank you! We will be in touch.' }));
                }
                if (!name || !validEmail || !message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, error: 'Invalid input. Please check your entries.' }));
                }
                // Log to server for now (stub). Integrate email/queue here later.
                console.log('📨 CONTACT FORM SUBMISSION', { name, email, messageLength: message.length, investor: !!data.investor, researcher: !!data.researcher });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Thanks — your message has been received.' }));
            } catch (e) {
                console.error('❌ CONTACT API ERROR', e && e.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Server error. Please try again later.' }));
            }
        });
        return;
    }

    // SECURITY: Only serve specific allowed files
    const allowedFiles = {
        '/': 'FlappyJournal/new-featherweight-improved.html',
        '/new-featherweight-improved.html': 'FlappyJournal/new-featherweight-improved.html',
        '/manufacturing.html': 'FlappyJournal/manufacturing.html',
        '/finance.html': 'FlappyJournal/finance.html',
        '/blockchain.html': 'FlappyJournal/blockchain.html',
        '/robotics.html': 'FlappyJournal/robotics.html',
        // New vertical pages
        '/gaming-vr.html': 'FlappyJournal/gaming-vr.html',
        '/space.html': 'FlappyJournal/space.html',
        '/government-defense.html': 'FlappyJournal/government-defense.html',
        '/security.html': 'FlappyJournal/security.html',
        '/biotech-computational-biology.html': 'FlappyJournal/biotech-computational-biology.html',
        '/healthcare.html': 'FlappyJournal/healthcare.html',
        '/legaltech-judiciary.html': 'FlappyJournal/legaltech-judiciary.html',
        '/augmented-reality.html': 'FlappyJournal/augmented-reality.html',
        '/satellites.html': 'FlappyJournal/satellites.html',
        '/developer-tools.html': 'FlappyJournal/developer-tools.html',
        '/education.html': 'FlappyJournal/education.html',
        '/city-planning.html': 'FlappyJournal/city-planning.html',
        // Shared assets
        '/assets/industry-shared.css': 'FlappyJournal/assets/industry-shared.css',
        '/assets/heart-bg.js': 'FlappyJournal/assets/heart-bg.js',
        '/realistic_human_heart.glb': 'FlappyJournal/realistic_human_heart.glb',
        '/server/public/9.png': 'FlappyJournal/server/public/9.png',
        '/server/public/featherweight-logo.png': 'FlappyJournal/server/public/featherweight-logo.png',
        '/server/public/featherweight-logo.svg': 'FlappyJournal/server/public/featherweight-logo.svg',
        '/server/public/logo192.png': 'FlappyJournal/server/public/logo192.png',
        '/server/public/logo512.png': 'FlappyJournal/server/public/logo512.png',
        '/server/public/8.png': 'FlappyJournal/server/public/8.png',
        '/featherweight-visualizations.js': 'FlappyJournal/featherweight-visualizations.js',
        
        // HRG vertical pages
        '/hrg-manufacturing.html': 'FlappyJournal/hrg-manufacturing.html',
        '/hrg-finance.html': 'FlappyJournal/hrg-finance.html',
        '/hrg-blockchain.html': 'FlappyJournal/hrg-blockchain.html',
        '/hrg-robotics.html': 'FlappyJournal/hrg-robotics.html',
        '/hrg-gaming-vr.html': 'FlappyJournal/hrg-gaming-vr.html',
        '/hrg-space.html': 'FlappyJournal/hrg-space.html',
        '/hrg-government-defense.html': 'FlappyJournal/hrg-government-defense.html',
        '/hrg-security.html': 'FlappyJournal/hrg-security.html',
        '/hrg-biotech-computational-biology.html': 'FlappyJournal/hrg-biotech-computational-biology.html',
        '/hrg-healthcare.html': 'FlappyJournal/hrg-healthcare.html',
        '/hrg-legaltech-judiciary.html': 'FlappyJournal/hrg-legaltech-judiciary.html',
        '/hrg-augmented-reality.html': 'FlappyJournal/hrg-augmented-reality.html',
        '/hrg-satellites.html': 'FlappyJournal/hrg-satellites.html',
        '/hrg-developer-tools.html': 'FlappyJournal/hrg-developer-tools.html',
        '/hrg-education.html': 'FlappyJournal/hrg-education.html',
        '/hrg-city-planning.html': 'FlappyJournal/hrg-city-planning.html',
        
        // DNA Sigil vertical pages
        '/sigil-manufacturing.html': 'FlappyJournal/sigil-manufacturing.html',
        '/sigil-finance.html': 'FlappyJournal/sigil-finance.html',
        '/sigil-blockchain.html': 'FlappyJournal/sigil-blockchain.html',
        '/sigil-robotics.html': 'FlappyJournal/sigil-robotics.html',
        '/sigil-gaming-vr.html': 'FlappyJournal/sigil-gaming-vr.html',
        '/sigil-space.html': 'FlappyJournal/sigil-space.html',
        '/sigil-government-defense.html': 'FlappyJournal/sigil-government-defense.html',
        '/sigil-security.html': 'FlappyJournal/sigil-security.html',
        '/sigil-biotech-computational-biology.html': 'FlappyJournal/sigil-biotech-computational-biology.html',
        '/sigil-healthcare.html': 'FlappyJournal/sigil-healthcare.html',
        '/sigil-legaltech-judiciary.html': 'FlappyJournal/sigil-legaltech-judiciary.html',
        '/sigil-augmented-reality.html': 'FlappyJournal/sigil-augmented-reality.html',
        '/sigil-satellites.html': 'FlappyJournal/sigil-satellites.html',
        '/sigil-developer-tools.html': 'FlappyJournal/sigil-developer-tools.html',
        '/sigil-education.html': 'FlappyJournal/sigil-education.html',
        '/sigil-city-planning.html': 'FlappyJournal/sigil-city-planning.html',
        
        // Self Coding vertical pages
        '/selfcode-manufacturing.html': 'FlappyJournal/selfcode-manufacturing.html',
        '/selfcode-finance.html': 'FlappyJournal/selfcode-finance.html',
        '/selfcode-blockchain.html': 'FlappyJournal/selfcode-blockchain.html',
        '/selfcode-robotics.html': 'FlappyJournal/selfcode-robotics.html',
        '/selfcode-gaming-vr.html': 'FlappyJournal/selfcode-gaming-vr.html',
        '/selfcode-space.html': 'FlappyJournal/selfcode-space.html',
        '/selfcode-government-defense.html': 'FlappyJournal/selfcode-government-defense.html',
        '/selfcode-security.html': 'FlappyJournal/selfcode-security.html',
        '/selfcode-biotech-computational-biology.html': 'FlappyJournal/selfcode-biotech-computational-biology.html',
        '/selfcode-healthcare.html': 'FlappyJournal/selfcode-healthcare.html',
        '/selfcode-legaltech-judiciary.html': 'FlappyJournal/selfcode-legaltech-judiciary.html',
        '/selfcode-augmented-reality.html': 'FlappyJournal/selfcode-augmented-reality.html',
        '/selfcode-satellites.html': 'FlappyJournal/selfcode-satellites.html',
        '/selfcode-developer-tools.html': 'FlappyJournal/selfcode-developer-tools.html',
        '/selfcode-education.html': 'FlappyJournal/selfcode-education.html',
        '/selfcode-city-planning.html': 'FlappyJournal/selfcode-city-planning.html'
    };

    // Serve demos/ subtree safely (public, static)
    if (cleanUrl.startsWith('/demos/')) {
        const demosRoot = path.join(__dirname, 'demos');
        const fsPath = path.normalize(path.join(__dirname, cleanUrl));
        if (!fsPath.startsWith(demosRoot)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('Forbidden');
        }
        const exists = fs.existsSync(fsPath) && fs.statSync(fsPath).isFile();
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Not Found');
        }
        let contentType = 'text/plain';
        const ext = path.extname(fsPath);
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.json') contentType = 'application/json';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
        });
        return fs.createReadStream(fsPath).pipe(res);
    }

    // Check if the requested path is allowed (using clean URL without query params)
    if (!allowedFiles[cleanUrl]) {
        console.log(`❌ BLOCKED: Unauthorized access attempt to ${req.url}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>404 - Not Found</h1>
            <p>Access to this resource is not allowed.</p>
            <p>🧠 Consciousness Web - PATENT PENDING</p>
        `);
        return;
    }
    
    const filePath = path.join(__dirname, allowedFiles[cleanUrl]);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>404 - File Not Found</h1>
            <p>The requested file could not be found.</p>
            <p>🧠 Consciousness Web - PATENT PENDING</p>
        `);
        return;
    }
    
    // Determine content type
    let contentType = 'text/html';
    const ext = path.extname(filePath);
    if (ext === '.glb') {
        contentType = 'model/gltf-binary';
    } else if (ext === '.js') {
        contentType = 'application/javascript';
    } else if (ext === '.css') {
        contentType = 'text/css';
    } else if (ext === '.png') {
        contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
    } else if (ext === '.svg') {
        contentType = 'image/svg+xml';
    }
    
    // Serve the file
    res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
        console.error(`❌ Error serving file: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>500 - Server Error</h1>
            <p>An error occurred while serving the file.</p>
            <p>🧠 Consciousness Web - PATENT PENDING</p>
        `);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 SECURE Consciousness Web Server running on port ${PORT}`);
    console.log(`🔒 SECURITY: Only serving allowed files`);
    console.log(`📄 PATENT PENDING footer active!`);
    console.log(`🌐 Serving: new-featherweight-improved.html`);
    console.log(`💫 Flux consciousness web is SECURE!`);
    console.log(`🔗 Access at: https://www.featherweight.world`);
    console.log(`🔗 Access at: https://featherweight.world`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SECURE Consciousness Web Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SECURE Consciousness Web Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});
