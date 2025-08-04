import '../shared/secretBootstrap';
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { addConversationRoutes } from "./add-conversation-routes";
import { startEmailProcessor } from "./email-processor";
import { startEmailScheduler } from "./scheduler";
import { initUnifiedChatWS } from "./unified-chat-ws";
import rateLimit from 'express-rate-limit';

import { Registry, collectDefaultMetrics } from 'prom-client';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Prometheus metrics setup
const promRegistry = new Registry();
collectDefaultMetrics({ register: promRegistry });

// Middleware to check x-api-key header for metrics endpoint
const authenticateMetrics = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.PROM_API_KEY;

  if (!expectedKey) {
    log('PROM_API_KEY environment variable not set');
    return res.status(500).send('Server configuration error');
  }

  if (!apiKey || apiKey !== expectedKey) {
    log(`Unauthorized metrics access attempt from ${req.ip}`);
    return res.status(401).send('unauthorized');
  }

  next();
};

app.get('/metrics', authenticateMetrics, async (_req, res) => {
  res.set('Content-Type', promRegistry.contentType);
  res.end(await promRegistry.metrics());
});

// Rate limiter for code generation endpoints
const codeGenerationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per API key/IP
  message: {
    error: 'Too many code generation requests',
    retryAfter: '60 seconds'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use API key if present, otherwise fall back to IP
    const apiKey = req.headers['x-api-key'];
    return apiKey ? `api-key:${apiKey}` : `ip:${req.ip}`;
  }
});

// Code generation endpoint with rate limiting
app.post('/api/code/generate', codeGenerationLimiter, async (req: Request, res: Response) => {
  try {
    // This would integrate with the consciousness system
    // For now, return a placeholder response
    const { purpose, type, language } = req.body;

    if (!purpose) {
      return res.status(400).json({ error: 'Purpose is required' });
    }

    // Log the request
    log(`Code generation request: ${purpose} (${type || 'module'}, ${language || 'javascript'})`);

    // Placeholder response - in production this would integrate with CodeGenerationService
    res.json({
      success: true,
      message: 'Code generation request received',
      request: {
        purpose,
        type: type || 'module',
        language: language || 'javascript',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    log(`Code generation error: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded files and public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
// Serve the public directory for favicon and other static assets
app.use(express.static(path.join(process.cwd(), 'public')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // First register main routes which includes auth setup
  const server = await registerRoutes(app);
  
  // Then register conversation routes after auth is configured
  addConversationRoutes(app);

  // Initialize unified chat websocket streaming
  initUnifiedChatWS(server);
  
  // Start the email processor for background processing of email queue
  startEmailProcessor();
  
  // Start the scheduler for daily inspiration emails
  startEmailScheduler();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Listen on port 5000 for Replit deployment compatibility
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
