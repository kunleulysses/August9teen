#!/bin/bash

echo "🚀 Deploying August9teen Landing Page..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the august9teen-landing directory."
    exit 1
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js found. Starting HTTP server..."
    
    # Create a simple server script
    cat > server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

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

server.listen(PORT, () => {
    console.log(`🌐 August9teen website is live at: http://localhost:${PORT}`);
    console.log(`📱 Access from any device on your network: http://$(hostname -I | awk '{print $1}'):${PORT}`);
    console.log(`🛑 Press Ctrl+C to stop the server`);
});
EOF

    # Start the server
    node server.js

elif command -v python3 &> /dev/null; then
    echo "✅ Python3 found. Starting HTTP server..."
    python3 -m http.server 3000
    
elif command -v python &> /dev/null; then
    echo "✅ Python found. Starting HTTP server..."
    python -m SimpleHTTPServer 3000
    
else
    echo "❌ Error: Neither Node.js nor Python found. Please install one of them."
    echo "💡 You can install Node.js with: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi 