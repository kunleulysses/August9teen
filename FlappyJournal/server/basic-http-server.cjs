const { createServer  } = require('http');
const { readFileSync  } = require('fs');
const { join, dirname  } = require('path');
const { fileURLToPath  } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createServer((req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  try {
    if (req.url === '/' || req.url === '/conversations') {
      // Serve the conversations.html file
      const filePath = join(__dirname, 'public', 'conversations.html');
      const content = readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else if (req.url === '/dashboard') {
      // Serve the consciousness dashboard
      const filePath = join(__dirname, 'public', 'consciousness-dashboard.html');
      const content = readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else if (req.url === '/journal') {
      // Serve the consciousness journal
      const filePath = join(__dirname, 'public', 'consciousness-journal.html');
      const content = readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else if (req.url === '/api/health') {
      // Health check endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        service: 'basic-chat-server',
        timestamp: new Date().toISOString(),
        consciousness: {
          connected: true,
          port: 3002,
          status: 'operational'
        }
      }));
    } else {
      // 404 for other routes
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Basic HTTP Server running on port ${PORT}`);
  console.log(`💬 Chat interface: http://localhost:${PORT}/conversations`);
  console.log(`🧠 Consciousness system: ws://localhost:3002`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
