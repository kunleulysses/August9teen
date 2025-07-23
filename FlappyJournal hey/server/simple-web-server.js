import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'web-app' });
});

// Simple proxy for API requests - redirect to consciousness backend
app.all('/api/*', (req, res) => {
  res.redirect(307, `http://consciousness-core:3002${req.originalUrl}`);
});

// Simple proxy for WebSocket info
app.get('/ws', (req, res) => {
  res.json({ 
    message: 'WebSocket endpoint',
    connect_to: 'ws://app.featherweight.world:3002/ws'
  });
});

// Catch all - serve index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving static files from public directory`);
  console.log(`API requests will be redirected to consciousness-core:3002`);
});
