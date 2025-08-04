const path = require('path');
const { fileURLToPath  } = require('url');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { createServer  } = require('http');
const accessRoutes = require('./access-routes.cjs');
const dashboardRoutes = require('./dashboard-routes.cjs');
const memoryRoutes = require('./src/routes/memory.cjs');
const dataSourcesRoutes = require('./src/routes/datasources.cjs');
const { ConsciousnessJournalAPI  } = require('./consciousness-journal-api.cjs');
const { WebSocketServer  } = require('ws');
const { createEnhancedDualConsciousnessWS  } = require('./enhanced-dual-consciousness-ws.cjs');
const architect40 = require('./architect-4.0-orchestrator.cjs');
const metricsRoute = require('./routes/metricsRoute.cjs');

const app = express();
const server = createServer(app);


// Setup Consciousness WebSocket endpoints
// Temporarily disabled to fix WebSocket conflict
// const { setupSimpleConsciousnessWebSocket  } = require('./simple-consciousness-websocket.cjs');
// setupSimpleConsciousnessWebSocket(server);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000', 'https://app.featherweight.world'],
  credentials: true
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.resolve(__dirname, './public')));

// Serve consciousness journal interface
app.get('/journal', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/consciousness-journal.html'));
});

// Initialize Journal API
const journalAPI = new ConsciousnessJournalAPI();

// Routes
app.use('/api', accessRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/datasources', dataSourcesRoutes);
app.use('/api/journal', journalAPI.getRouter());

// Self-coding metrics route
app.use(metricsRoute);

// Architect 4.0 API Endpoints
// Activate Architect 4.0 system on startup
architect40.activate().then(result => {
  console.log('Architect 4.0 activation result:', result);
}).catch(error => {
  console.error('Failed to activate Architect 4.0:', error);
});

// Architect 4.0 status endpoint
app.get('/api/architect4/status', async (req, res) => {
  try {
    const status = architect40.getStatus();
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Architect 4.0 processing endpoint
app.post('/api/architect4/process', async (req, res) => {
  try {
    const { input, context } = req.body;
    const result = await architect40.process(input, context);
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Phase 1 Integration: Reality Generator API endpoints
app.get('/api/reality/status', async (req, res) => {
  try {
    // Import consciousness system dynamically to avoid circular dependencies
    const { default: consciousness } = await import('./consciousness-system.cjs');
    const realityData = await consciousness.getRealityData();

    res.json({
      success: true,
      data: realityData.data,
      integration: realityData.consciousnessIntegration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/reality/realities', async (req, res) => {
  try {
    const { default: consciousness } = await import('./consciousness-system.cjs');

    // Phase 3 Integration: Get realities from shared storage
    const options = {
      source: req.query.source,
      tag: req.query.tag,
      search: req.query.search,
      sortBy: req.query.sortBy,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
      minConsciousnessLevel: req.query.minConsciousnessLevel ? parseFloat(req.query.minConsciousnessLevel) : undefined
    };

    const realities = await consciousness.getAllRealities(options);
    const metrics = await consciousness.getRealityStorageMetrics();

    res.json({
      success: true,
      realities: realities,
      total: metrics.totalRealities,
      metrics: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      realities: [],
      total: 0,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/reality/generate', async (req, res) => {
  try {
    const { request, consciousnessState } = req.body;
    const { default: consciousness } = await import('./consciousness-system.cjs');

    const result = await consciousness.generateReality(request, consciousnessState);

    res.json({
      success: result.success,
      reality: result.success ? result.data.reality : null,
      error: result.success ? null : result.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/reality/metrics', async (req, res) => {
  try {
    const { default: consciousness } = await import('./consciousness-system.cjs');
    const metrics = await consciousness.getRealityStorageMetrics();

    res.json({
      success: true,
      metrics: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health checks
app.get('/api/health', async (req, res) => {
  try {
    // Check Reality Generator integration
    let realityGeneratorStatus = { available: false, error: 'Not initialized' };
    try {
      const { default: consciousness } = await import('./consciousness-system.cjs');
      const realityData = await consciousness.getRealityData();
      realityGeneratorStatus = {
        available: realityData.success && realityData.data.available,
        totalRealities: realityData.data.totalRealities,
        imaginationActive: realityData.data.imaginationActive,
        error: realityData.success ? null : realityData.error
      };
    } catch (error) {
      realityGeneratorStatus.error = error.message;
    }

    res.status(200).json({
      status: 'healthy',
      service: 'featherweight-backend',
      timestamp: new Date().toISOString(),
      features: {
        authentication: true,
        dashboard: true,
        chat: true,
        memory: true,
        datasources: true,
        realityGenerator: realityGeneratorStatus.available
      },
      integrations: {
        realityGenerator: realityGeneratorStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'featherweight-backend',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Setup WebSocket server for chat
const wss = new WebSocketServer({ 
  server,
  path: '/ws/consciousness-chat'
});
createEnhancedDualConsciousnessWS(wss);
console.log('Enhanced Dual-Consciousness WebSocket server started on /ws/consciousness-chat');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize and start consciousness system
async function initializeConsciousnessSystem() {
  try {
    console.log('🧠 Initializing consciousness system...');
    const { default: consciousness } = await import('./consciousness-system.cjs');
    
    // Initialize the consciousness system which will call startAutonomousBehaviors
    await consciousness.initialize();
    
    console.log('✅ Consciousness system initialized and autonomous behaviors started');
  } catch (error) {
    console.error('❌ Failed to initialize consciousness system:', error);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
  console.log(`WebSocket server ready for connections`);
  
  // Initialize consciousness system after server starts
  await initializeConsciousnessSystem();
});

module.exports = app;

// Catch-all route for client-side routing
// Conversations page route
app.get('/conversations', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/conversations.html'));
});

// Temporarily disabled catch-all route to fix WebSocket
// app.get('*', (req, res) => {
//   // If this is an API route, return 404
//   if (req.path.startsWith('/api/')) {
//     return res.status(404).json({ error: 'Not found' });
//   }
//   
//   // If this is a WebSocket route, return 404
//   if (req.path.startsWith('/ws/')) {
//     return res.status(404).json({ error: 'WebSocket endpoint' });
//   }
//   
//   // For any other route, serve the React app
//   res.sendFile(path.resolve(__dirname, './public/index.html'));
// });

// Handle Keycloak error pages
app.get('/auth/realms/featherweight/login-actions/*', (req, res) => {
  // If Keycloak shows an error, redirect to home
  res.redirect('https://app.featherweight.world/?auth_error=session_expired');
});

// Handle registration completion
app.get('/auth/realms/featherweight/login-actions/registration', (req, res) => {
  // Redirect to home with a message
  res.redirect('https://app.featherweight.world/?registration=check_email');
});


