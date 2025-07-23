const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

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
    console.log(`   Local:  http://localhost:${PORT}`);
    console.log(`   VPS IP: http://170.187.142.88:${PORT}`);
    console.log(`   Public: http://2600:3c02::2000:ccff:fe0a:e717:${PORT}`);
    console.log('');
    console.log(`🔒 Make sure port ${PORT} is open in your VPS firewall!`);
    console.log('🛑 Press Ctrl+C to stop the server');
}); 