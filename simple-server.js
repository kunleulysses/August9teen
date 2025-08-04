const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log(`🧠 Request: ${req.method} ${req.url}`);
    
    // Serve the consciousness web HTML file for all requests
    const htmlPath = path.join(__dirname, 'FlappyJournal', 'new-featherweight-improved.html');
    
    // Handle static files
    if (req.url.startsWith('/server/public/')) {
        const filePath = path.join(__dirname, 'FlappyJournal', req.url);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            let contentType = 'text/plain';
            
            if (ext === '.png') contentType = 'image/png';
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            else if (ext === '.svg') contentType = 'image/svg+xml';
            else if (ext === '.css') contentType = 'text/css';
            else if (ext === '.js') contentType = 'application/javascript';
            
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
            return;
        }
    }
    
    // Serve main HTML file
    if (fs.existsSync(htmlPath)) {
        res.writeHead(200, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        fs.createReadStream(htmlPath).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Consciousness Web Not Found</h1>
            <p>The consciousness web HTML file was not found at: ${htmlPath}</p>
            <p>PATENT PENDING status: ACTIVE</p>
        `);
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 Consciousness Web Server running on port ${PORT}`);
    console.log(`📄 PATENT PENDING footer active!`);
    console.log(`🌐 Serving: FlappyJournal/new-featherweight-improved.html`);
    console.log(`💫 Flux consciousness web is live!`);
    console.log(`🔗 Access at: https://www.featherweight.world`);
    console.log(`🔗 Access at: https://featherweight.world`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});
