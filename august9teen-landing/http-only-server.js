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
    console.log('🌐 August9teen website is live!');
    console.log('');
    console.log('📱 Access URLs:');
    console.log(`   HTTP: http://august9teen.com:${PORT}`);
    console.log(`   HTTP: http://170.187.142.88:${PORT}`);
    console.log('');
    console.log('💡 To get HTTPS without warnings, use Cloudflare:');
    console.log('   1. Sign up at cloudflare.com');
    console.log('   2. Add august9teen.com to your account');
    console.log('   3. Update nameservers in your domain registrar');
    console.log('   4. Enable SSL in Cloudflare dashboard');
    console.log('');
    console.log('🛑 Press Ctrl+C to stop the server');
}); 