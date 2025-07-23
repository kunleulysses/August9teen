const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

function handleRequest(req, res) {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

// Create self-signed certificate
console.log('🔐 Creating self-signed certificate...');
const { execSync } = require('child_process');
try {
    execSync('openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=august9teen.com"', { stdio: 'inherit' });
    console.log('✅ Certificate created!');
} catch (error) {
    console.log('❌ Failed to create certificate. Running HTTP only.');
}

// HTTPS server
try {
    const options = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem')
    };
    
    const httpsServer = https.createServer(options, handleRequest);
    
    httpsServer.listen(PORT, '0.0.0.0', () => {
        console.log('🔒 HTTPS server running on port', PORT);
        console.log('🌐 Your website is now accessible at:');
        console.log(`   HTTPS: https://august9teen.com:${PORT}`);
        console.log(`   HTTPS: https://170.187.142.88:${PORT}`);
        console.log('');
        console.log('⚠️  Note: Self-signed certificate will show a warning.');
        console.log('   Click "Advanced" → "Proceed to august9teen.com (unsafe)"');
        console.log('');
        console.log('🛑 Press Ctrl+C to stop the server');
    });
} catch (error) {
    console.log('❌ HTTPS failed. Starting HTTP server...');
    
    const httpServer = http.createServer(handleRequest);
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log('🌐 HTTP server running on port', PORT);
        console.log('📱 Access URLs:');
        console.log(`   HTTP: http://august9teen.com:${PORT}`);
        console.log(`   HTTP: http://170.187.142.88:${PORT}`);
        console.log('');
        console.log('🛑 Press Ctrl+C to stop the server');
    });
} 