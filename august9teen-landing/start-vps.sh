#!/bin/bash

echo "🌐 Starting August9teen website on VPS..."

# Get VPS IP addresses
echo "🔍 Getting VPS network information..."
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "Could not determine public IP")
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "Could not determine local IP")

echo "📊 VPS Network Information:"
echo "   Public IP: $PUBLIC_IP"
echo "   Local IP: $LOCAL_IP"

# Try to find an available port
for port in 3001 3002 3003 8080 8081 8082; do
    if ! timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
        echo "✅ Found available port: $port"
        echo ""
        echo "🚀 Starting August9teen website..."
        echo ""
        
        # Create server with the specific port
        cat > vps-server.js << EOF
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = $port;

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

const server = http.createServer((req, res) => {
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
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('🌐 August9teen website is now LIVE!');
    console.log('');
    console.log('📱 Access URLs:');
    console.log('   Local:  http://localhost:$port');
    console.log('   VPS IP: http://$LOCAL_IP:$port');
    if [ "$PUBLIC_IP" != "Could not determine public IP" ]; then
        console.log('   Public: http://$PUBLIC_IP:$port');
    fi
    console.log('');
    console.log('🔒 Make sure port $port is open in your VPS firewall!');
    console.log('🛑 Press Ctrl+C to stop the server');
});
EOF

        node vps-server.js
        rm vps-server.js
        exit 0
    fi
done

echo "❌ No available ports found. Try manually:"
echo "   PORT=8085 node server.js" 