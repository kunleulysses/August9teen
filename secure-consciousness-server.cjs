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

    // SECURITY: Only serve specific allowed files
    const allowedFiles = {
        '/': 'FlappyJournal/new-featherweight-improved.html',
        '/new-featherweight-improved.html': 'FlappyJournal/new-featherweight-improved.html',
        '/realistic_human_heart.glb': 'FlappyJournal/realistic_human_heart.glb',
        '/server/public/9.png': 'FlappyJournal/server/public/9.png',
        '/server/public/featherweight-logo.png': 'FlappyJournal/server/public/featherweight-logo.png',
        '/server/public/featherweight-logo.svg': 'FlappyJournal/server/public/featherweight-logo.svg',
        '/server/public/logo192.png': 'FlappyJournal/server/public/logo192.png',
        '/server/public/logo512.png': 'FlappyJournal/server/public/logo512.png',
        '/server/public/8.png': 'FlappyJournal/server/public/8.png',
        '/featherweight-visualizations.js': 'FlappyJournal/featherweight-visualizations.js'
    };

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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
