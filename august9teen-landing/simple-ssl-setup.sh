#!/bin/bash

echo "🔒 Setting up HTTPS for August9teen.com..."

# Install Certbot
echo "📦 Installing Certbot..."
apt update
apt install -y certbot

# Create HTTPS server
echo "📝 Creating HTTPS server..."
cat > https-server.js << 'EOF'
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

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
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
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
        console.log('🌐 Your website is now secure at: https://august9teen.com');
    });
} catch (error) {
    console.log('⚠️  SSL certificates not found. Running HTTP only.');
    console.log('💡 Run: sudo certbot certonly --standalone -d august9teen.com');
}

// HTTP server (port 80)
httpServer.listen(80, '0.0.0.0', () => {
    console.log('🌐 HTTP server running on port 80 (redirects to HTTPS)');
});

// Fallback HTTP server (port 3001)
const fallbackServer = http.createServer(handleRequest);
fallbackServer.listen(PORT, '0.0.0.0', () => {
    console.log('🌐 Fallback HTTP server running on port', PORT);
    console.log('📱 Access URLs:');
    console.log(`   HTTP:  http://localhost:${PORT}`);
    console.log(`   HTTPS: https://august9teen.com`);
});
EOF

echo "✅ HTTPS server created!"
echo ""
echo "🔧 Next steps:"
echo "1. Point your domain august9teen.com to this VPS IP: 170.187.142.88"
echo "2. Run: sudo certbot certonly --standalone -d august9teen.com"
echo "3. Start the HTTPS server: node https-server.js" 