const { createServer  } = require('http');

console.log('🧪 Testing simple server...');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from simple server!');
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
});
