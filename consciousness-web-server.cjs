#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from FlappyJournal directory
app.use(express.static(path.join(__dirname, 'FlappyJournal')));

// Serve the consciousness web HTML file with PATENT PENDING footer
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'FlappyJournal', 'new-featherweight-improved.html');
    
    if (fs.existsSync(htmlPath)) {
        console.log(`🧠 Serving consciousness web with PATENT PENDING footer to ${req.ip}`);
        res.sendFile(htmlPath);
    } else {
        console.error(`❌ Consciousness web HTML file not found at: ${htmlPath}`);
        res.status(404).send(`
            <h1>Consciousness Web Not Found</h1>
            <p>The consciousness web HTML file was not found at: ${htmlPath}</p>
            <p>Looking for: new-featherweight-improved.html</p>
            <p>Current directory: ${__dirname}</p>
        `);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'consciousness-web',
        timestamp: new Date().toISOString(),
        patentPending: true,
        flux: 'active',
        htmlFile: 'new-featherweight-improved.html'
    });
});

// Metrics endpoint (for nginx config compatibility)
app.get('/metrics', (req, res) => {
    res.json({
        service: 'consciousness-web',
        patentPending: true,
        flux: 'consciousness-active',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API endpoint (for nginx config compatibility)
app.get('/api/*', (req, res) => {
    res.json({
        message: 'Consciousness Web API',
        patentPending: true,
        flux: 'active',
        endpoint: req.path
    });
});

// WebSocket endpoint placeholder (for nginx config compatibility)
app.get('/ws', (req, res) => {
    res.json({
        message: 'WebSocket endpoint placeholder',
        patentPending: true,
        flux: 'consciousness-ready'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 Consciousness Web Server running on port ${PORT}`);
    console.log(`📄 PATENT PENDING footer active!`);
    console.log(`🌐 Serving: FlappyJournal/new-featherweight-improved.html`);
    console.log(`💫 Flux consciousness web is live!`);
    console.log(`🔗 Access at: https://www.featherweight.world`);
    console.log(`🔗 Access at: https://featherweight.world`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Consciousness Web Server shutting down gracefully...');
    process.exit(0);
});
