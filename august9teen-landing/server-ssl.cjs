const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const HTTP_PORT = 3003;
const HTTPS_PORT = 3004;

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

// HTTP server (redirect to HTTPS)
const httpServer = http.createServer((req, res) => {
    const host = req.headers.host.split(':')[0];
    res.writeHead(301, { 'Location': `https://${host}:3004${req.url}` });
    res.end();
});

// HTTPS server
let httpsServer;
try {
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/august9teen.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/august9teen.com/fullchain.pem')
    };
    
    httpsServer = https.createServer(options, handleRequest);
    
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log('🔒 HTTPS server running on port', HTTPS_PORT);
        console.log('🌐 Your website is now secure at: https://august9teen.com:3004');
    });
} catch (error) {
    console.log('⚠️  SSL certificates not found. Running HTTP only.');
    console.log('💡 Run: sudo certbot certonly --standalone -d august9teen.com --preferred-port 3003');
}

// HTTP server
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log('🌐 HTTP server running on port', HTTP_PORT, '(redirects to HTTPS)');
    console.log('📱 Access URLs:');
    console.log(`   HTTP:  http://august9teen.com:3003`);
    console.log(`   HTTPS: https://august9teen.com:3004`);
});
