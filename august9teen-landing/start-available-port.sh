#!/bin/bash

echo "🔍 Finding available port for August9teen website..."

# Function to check if port is available
check_port() {
    local port=$1
    if ! command -v netstat &> /dev/null; then
        # Fallback: try to bind to the port
        timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null
        return $?
    else
        netstat -tlnp 2>/dev/null | grep -q ":$port "
        return $?
    fi
}

# Try ports starting from 3001
for port in 3001 3002 3003 3004 3005 8080 8081 8082 8083 8084; do
    if ! check_port $port; then
        echo "✅ Found available port: $port"
        echo "🚀 Starting August9teen website on port $port..."
        
        # Create a temporary server file with the specific port
        cat > temp-server.js << EOF
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

server.listen(PORT, () => {
    console.log(\`🌐 August9teen website is live at: http://localhost:\${PORT}\`);
    console.log(\`📱 Access from any device on your network: http://\$(hostname -I | awk '{print \$1}'):\${PORT}\`);
    console.log(\`🛑 Press Ctrl+C to stop the server\`);
});
EOF

        node temp-server.js
        rm temp-server.js
        exit 0
    fi
done

echo "❌ No available ports found in range 3001-3005, 8080-8084"
echo "💡 Try manually specifying a port: PORT=8085 node server.js" 