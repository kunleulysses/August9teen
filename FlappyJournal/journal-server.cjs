// Simple server for testing the consciousness journal interface
const express = require('express');
const { createServer  } = require('http');
const path = require('path');
const { fileURLToPath  } = require('url');
const { ConsciousnessJournalAPI  } = require('./server/consciousness-journal-api.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Initialize Journal API
const journalAPI = new ConsciousnessJournalAPI();

// Middleware
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'server/public')));

// Routes
app.use('/api/journal', journalAPI.getRouter());

// Serve consciousness journal interface
app.get('/journal', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'server/public/consciousness-journal.html'));
});

// Serve consciousness dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'server/public/consciousness-dashboard.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'consciousness-journal',
    timestamp: new Date().toISOString(),
    features: {
      journal: true,
      api: true,
      search: true,
      evolution: true
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/journal');
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🧠 Consciousness Journal Server running on port ${PORT}`);
  console.log(`📔 Journal interface: http://localhost:${PORT}/journal`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔌 API endpoints: http://localhost:${PORT}/api/journal/*`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down journal server...');
  server.close(() => {
    console.log('✅ Journal server stopped');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down journal server...');
  server.close(() => {
    console.log('✅ Journal server stopped');
    process.exit(0);
  });
});
