#!/bin/bash

echo "🔍 Finding available ports and setting up SSL..."

# Function to check if port is available
check_port() {
    local port=$1
    timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null
    return $?
}

# Find available ports
echo "🔍 Checking port availability..."
AVAILABLE_PORTS=()

for port in 3001 3002 3003 8080 8081 8082 8443 9443 10443; do
    if ! check_port $port; then
        AVAILABLE_PORTS+=($port)
        echo "✅ Port $port is available"
    else
        echo "❌ Port $port is in use"
    fi
done

if [ ${#AVAILABLE_PORTS[@]} -eq 0 ]; then
    echo "❌ No available ports found!"
    exit 1
fi

# Use the first available port
HTTP_PORT=${AVAILABLE_PORTS[0]}
HTTPS_PORT=$((HTTP_PORT + 1))

echo ""
echo "🚀 Using ports:"
echo "   HTTP: $HTTP_PORT"
echo "   HTTPS: $HTTPS_PORT"

# Create server with available ports
cat > server-ssl.js << EOF
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const HTTP_PORT = $HTTP_PORT;
const HTTPS_PORT = $HTTPS_PORT;

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
    res.writeHead(301, { 'Location': \`https://\${host}:$HTTPS_PORT\${req.url}\` });
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
        console.log('🌐 Your website is now secure at: https://august9teen.com:$HTTPS_PORT');
    });
} catch (error) {
    console.log('⚠️  SSL certificates not found. Running HTTP only.');
    console.log('💡 Run: sudo certbot certonly --standalone -d august9teen.com --preferred-port $HTTP_PORT');
}

// HTTP server
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log('🌐 HTTP server running on port', HTTP_PORT, '(redirects to HTTPS)');
    console.log('📱 Access URLs:');
    console.log(\`   HTTP:  http://august9teen.com:$HTTP_PORT\`);
    console.log(\`   HTTPS: https://august9teen.com:$HTTPS_PORT\`);
});
EOF

echo ""
echo "✅ Server created with available ports!"
echo ""
echo "🔧 Next steps:"
echo "1. Get SSL certificate on port $HTTP_PORT:"
echo "   sudo certbot certonly --standalone -d august9teen.com --preferred-port $HTTP_PORT --email arrival@august9teen.com --agree-tos --non-interactive"
echo ""
echo "2. Start the server:"
echo "   node server-ssl.js"
echo ""
echo "3. Open firewall ports:"
echo "   sudo ufw allow $HTTP_PORT"
echo "   sudo ufw allow $HTTPS_PORT" 