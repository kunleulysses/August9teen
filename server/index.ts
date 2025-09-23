import '../shared/secretBootstrap';
import './common/tracing.cjs';
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { addConversationRoutes } from "./add-conversation-routes";
import { startEmailProcessor } from "./email-processor";
import { startEmailScheduler } from "./scheduler";
import { initUnifiedChatWS } from "./unified-chat-ws";
import { startUserEraseWorker } from "./user-eraser";
import rateLimit from 'express-rate-limit';
import SnapshotService from './consciousness/persistence/SnapshotService.cjs';
// Bootstrap the production Universal Consciousness runtime (spiral memory + protocol)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const universalConsciousness = require('./consciousness/bootstrapUniversalConsciousness.cjs');
const { spiralMemory } = universalConsciousness;
import { getStore } from './common/storeFactory.cjs';

// Initialize the central event bus and 100 Hz SystemTicker early
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./consciousness/core/ConsciousnessEventBus.cjs');
// Wire up the minimal Turn Director for the mobile turn-by-turn loop
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./consciousness/game/TurnDirector.cjs');
// Ensure game tables exist
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./consciousness/game/initGameTables.cjs');
// Start pre-gen cache scheduler
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./consciousness/game/preGen.cjs').startScheduler();
// Bridge game memory events into the production spiral memory engine
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./consciousness/game/SpiralMemoryBridge.cjs');

import { Registry, collectDefaultMetrics } from 'prom-client';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function getJetStreamPending() {
  try {
    if (typeof globalThis.getJetStreamPending === 'function') {
      return await globalThis.getJetStreamPending();
    }
  } catch {
    /* ignore */
  }
  return 0;
}

app.use(async (_req, res, next) => {
  const pending = await getJetStreamPending();
  const mem = process.memoryUsage();
  const heapRatio = mem.heapUsed / mem.heapTotal;
  if (pending > 10000 || heapRatio > 0.8) {
    res.set('Retry-After', '1');
    return res.status(429).send('overloaded');
  }
  next();
});

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

  // Visual genome for autonomous/evolving web visuals
  app.get('/api/game/visuals', (_req, res) => {
    try {
      // Deterministic-ish daily seed
      const now = new Date();
      const daySeed = Number(String(now.getUTCFullYear()) + String(now.getUTCMonth() + 1).padStart(2, '0') + String(now.getUTCDate()).padStart(2, '0'));
      // Optionally allow query overrides later (e.g., ?seed=...)
      const seed = daySeed;
      // Simple palette sets; client can evolve/shift hues in runtime
      const palettes = [
        ['#0b0d10','#1e2a38','#2a78ff','#89ffa1','#ffd289'],
        ['#0d1117','#161b22','#238636','#3fb950','#a5d6ff'],
        ['#0b1017','#152132','#27AE60','#9B59B6','#F1C40F'],
        ['#0e1420','#1b2433','#ff8a00','#ff3d81','#7afcff'],
      ];
      const palette = palettes[seed % palettes.length];
      const shapes = ['spiral','waves','orbs','lissajous'];
      const baseShape = shapes[seed % shapes.length];
      const genome = {
        seed,
        palette,
        baseShape,
        speedFactor: 0.7,
        density: 0.6,
        wander: 0.35,
        evolveEveryMs: 30000,
      };
      res.json({ ok: true, genome });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Asset manifest for pixel art (served to mobile clients)
  app.get('/api/game/assets', (_req, res) => {
    // Default sample manifest; place your PNGs under public/images/pixel/
    const base = '/images/pixel';
    // Attempt to inject an autonomous companion from the VisualAutonomyEngine
    let autoCompanion: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getAutonomousSpriteManifest } = require('./consciousness/game/VisualAutonomyEngine.cjs');
      autoCompanion = getAutonomousSpriteManifest();
    } catch {}

    // Attempt to inject autonomous biomes
    let autoBackgrounds: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getAutonomousBiomeManifest } = require('./consciousness/game/BiomeAutonomyEngine.cjs');
      autoBackgrounds = getAutonomousBiomeManifest();
    } catch {}

    res.json({
      ok: true,
      manifest: {
        companions: {
          autonomous: autoCompanion ? { idle: autoCompanion } : undefined,
          flappy: {
            idle: {
              sheet: `/images/flappy-avatar.png`,
              frameWidth: 512,
              frameHeight: 512,
              frames: 1,
              columns: 1,
              fps: 1
            }
          },
          nyx: {
            idle: {
              sheet: `${base}/companion/nyx_idle_sheet.png`,
              frameWidth: 32,
              frameHeight: 32,
              frames: 6,
              columns: 6,
              fps: 6
            },
            walk: {
              sheet: `${base}/companion/nyx_walk_sheet.png`,
              frameWidth: 32,
              frameHeight: 32,
              frames: 8,
              columns: 8,
              fps: 8
            },
            run: {
              sheet: `${base}/companion/nyx_run_sheet.png`,
              frameWidth: 32,
              frameHeight: 32,
              frames: 8,
              columns: 8,
              fps: 10
            }
          }
        },
        items: {
          apple: { icon: `${base}/items/apple.png` },
          ball: { icon: `${base}/items/ball.png` }
        },
        areas: {
          town: { icon: `${base}/areas/town.png` },
          forest: { icon: `${base}/areas/forest.png` },
          beach: { icon: `${base}/areas/beach.png` },
          mountains: { icon: `${base}/areas/mountains.png` }
        },
        backgrounds: autoBackgrounds && Object.keys(autoBackgrounds).length ? autoBackgrounds : {
          town: { sky: `${base}/backgrounds/town_sky.png`, mid: `${base}/backgrounds/town_mid.png`, fore: `${base}/backgrounds/town_fore.png` },
          forest: { sky: `${base}/backgrounds/forest_sky.png`, mid: `${base}/backgrounds/forest_mid.png`, fore: `${base}/backgrounds/forest_fore.png` },
          beach: { sky: `${base}/backgrounds/beach_sky.png`, mid: `${base}/backgrounds/beach_mid.png`, fore: `${base}/backgrounds/beach_fore.png` },
          mountains: { sky: `${base}/backgrounds/mountains_sky.png`, mid: `${base}/backgrounds/mountains_mid.png`, fore: `${base}/backgrounds/mountains_fore.png` },
        }
      }
    });
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

// Serve /game assets with no-store to avoid stale caches in proxies/browsers
app.use(
  '/game',
  express.static(path.join(process.cwd(), 'public', 'game'), {
    setHeaders: (res) => {
      try {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } catch {}
    },
  })
);

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
  // Persist and restore the actual spiral memory engine's map
  const spiralMemoryMap: Map<any, any> = (spiralMemory?.spiralMemory as Map<any, any>)
    || (spiralMemory?.memorySpiral as Map<any, any>)
    || new Map();
  const store = getStore();
  const snapshotService = new SnapshotService(spiralMemoryMap, store);
  await snapshotService.restoreIfEmpty();
  if (typeof spiralMemory?.rebuildResonanceIndex === 'function') {
    spiralMemory.rebuildResonanceIndex();
  } else if (typeof spiralMemory?.rebuildSpiralStats === 'function') {
    await spiralMemory.rebuildSpiralStats().catch((err: Error) => {
      log('Spiral memory stats rebuild failed: ' + err.message);
    });
  }
  snapshotService.start();

  // First register main routes which includes auth setup
  const server = await registerRoutes(app);
  
  // Then register conversation routes after auth is configured
  addConversationRoutes(app);

  // Initialize unified chat websocket streaming
  initUnifiedChatWS(server);

  // Initialize enhanced game websocket (/ws/game) with consciousness integration
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initGameWS, getGameMetrics } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
  initGameWS(server);
  // Start UI auto-canary (progressively enables UI flags and ramps canaryPct)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const startAutoCanary = require('./consciousness/ui/AutoCanary.cjs');
    startAutoCanary(enhancedGameWS);
  } catch {}

  // Start the autonomous visual engine (procedural sprite sheets)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { startVisualAutonomyEngine } = require('./consciousness/game/VisualAutonomyEngine.cjs');
    startVisualAutonomyEngine();
  } catch {}

  // Start autonomous biome engine (procedural backgrounds)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { startBiomeAutonomyEngine } = require('./consciousness/game/BiomeAutonomyEngine.cjs');
    startBiomeAutonomyEngine();
  } catch {}
  app.get('/api/game/metrics', authenticateMetrics, (_req, res) => {
    try {
      res.json({ ok: true, metrics: getGameMetrics() });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Feature flags admin (secured via x-api-key like /metrics)
  app.get('/api/game/flags', authenticateMetrics, (_req, res) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      res.json({
        ok: true,
        flags: {
          mobileHeartbeatHz: (enhancedGameWS as any).mobileHeartbeatHz,
          contentDensity: (enhancedGameWS as any).contentDensity,
          eventPacingMs: (enhancedGameWS as any).eventPacingMs,
          battleXpTransferPct: (enhancedGameWS as any).battleXpTransferPct,
          battleCooldownMs: (enhancedGameWS as any).battleCooldownMs,
          sanctuaryBaseThreshold: (enhancedGameWS as any).sanctuaryBaseThreshold,
          sanctuaryPerLevelIncrement: (enhancedGameWS as any).sanctuaryPerLevelIncrement,
        }
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.put('/api/game/flags', authenticateMetrics, express.json(), (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const allowed = ['mobileHeartbeatHz', 'contentDensity', 'eventPacingMs', 'battleXpTransferPct', 'battleCooldownMs', 'sanctuaryBaseThreshold', 'sanctuaryPerLevelIncrement', 'canaryPct'];
      const body = req.body || {};
      for (const k of Object.keys(body)) {
        if (!allowed.includes(k)) continue;
        (enhancedGameWS as any)[k] = body[k];
      }
      // Recompute derived values
      if (typeof (enhancedGameWS as any).mobileHeartbeatHz === 'number' && (enhancedGameWS as any).mobileHeartbeatHz > 0) {
        (enhancedGameWS as any).mobileHeartbeatMinInterval = Math.max(250, Math.floor(1000 / (enhancedGameWS as any).mobileHeartbeatHz));
      }
      // Reschedule world event timer if pacing/density changed
      if ('eventPacingMs' in body || 'contentDensity' in body) {
        try { (enhancedGameWS as any).rescheduleWorldEventTimer(); } catch {}
      }
      // Record to flags history
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { pool } = require('./db');
        pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify(body), 'api', `flags update from ${req.ip}`]).catch(() => {});
      } catch {}
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.get('/api/game/flags/history', authenticateMetrics, async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      const { rows } = await pool.query('SELECT id, flags, applied_by, note, created_at FROM game_flags_history ORDER BY created_at DESC LIMIT 50');
      res.json({ ok: true, history: rows });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.get('/api/game/flags/status', authenticateMetrics, async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const status = {
        canaryPct: (enhancedGameWS as any).canaryPct || 0,
        trialEventPacingMs: (enhancedGameWS as any).trialEventPacingMs || null,
        trialContentDensity: (enhancedGameWS as any).trialContentDensity || null,
        trialActiveUntil: (enhancedGameWS as any).trialActiveUntil || null,
        trialStartAvgSessionSec: (enhancedGameWS as any).trialStartAvgSessionSec || null,
      };
      res.json({ ok: true, status });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // UI telemetry summary (basic, from memory)
  app.get('/api/ui/telemetry/summary', async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const metrics = (enhancedGameWS as any).uiMetrics || { windowStart: Date.now(), counts: {} };
      res.json({ ok: true, summary: { windowStart: metrics.windowStart, counts: metrics.counts, canaryPct: (enhancedGameWS as any).canaryPct } });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // UI proposals API (admin; secured via x-api-key like /metrics)
  type UiProposal = { id?: number; flags?: Record<string, any>; rationale?: string; status?: string; applied_by?: string; created_at?: string };

  app.get('/api/ui/proposals', authenticateMetrics, async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const mem = (enhancedGameWS as any).uiProposals || [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { pool } = require('./db');
        const { rows } = await pool.query('SELECT id, flags, rationale, status, applied_by, created_at FROM game_ui_proposals ORDER BY created_at DESC LIMIT 100');
        return res.json({ ok: true, proposals: rows });
      } catch {
        return res.json({ ok: true, proposals: mem });
      }
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.post('/api/ui/proposals', authenticateMetrics, express.json(), async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as UiProposal;
      const flags = (body.flags || {}) as Record<string, any>;
      const rationale = String(body.rationale || '');
      // Apply flags behind canary immediately
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      (enhancedGameWS as any).uiFlags = { ...(enhancedGameWS as any).uiFlags || {}, ...flags };
      // Broadcast to current canary sessions
      try {
        for (const [ws, ci] of (enhancedGameWS as any).clients || []) {
          if (ws?.readyState === 1 && ci?.canary) ws.send(JSON.stringify({ type: 'ui:flags', flags: (enhancedGameWS as any).uiFlags }));
        }
      } catch {}
      let id: number | undefined = undefined;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { pool } = require('./db');
        const ins = await pool.query('INSERT INTO game_ui_proposals (flags, rationale, status, applied_by) VALUES ($1,$2,$3,$4) RETURNING id', [JSON.stringify(flags), rationale, 'applied_canary', 'api']);
        id = ins?.rows?.[0]?.id;
      } catch {
        // Keep in-memory fallbacks
        (enhancedGameWS as any).uiProposals = (enhancedGameWS as any).uiProposals || [];
        (enhancedGameWS as any).uiProposals.unshift({ id: Date.now(), flags, rationale, status: 'applied_canary', applied_by: 'api', created_at: new Date().toISOString() });
        id = Date.now();
      }
      return res.json({ ok: true, id, status: 'applied_canary', flags });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.put('/api/ui/proposals/:id/apply', authenticateMetrics, express.json(), async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ ok: false, error: 'invalid id' });
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      let flags: any = undefined;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { pool } = require('./db');
        const { rows } = await pool.query('SELECT flags FROM game_ui_proposals WHERE id=$1', [id]);
        flags = rows?.[0]?.flags || undefined;
      } catch {}
      if (!flags) {
        const mem = (enhancedGameWS as any).uiProposals || [];
        const p = mem.find((x: any) => Number(x.id) === id);
        flags = p?.flags;
      }
      if (!flags) return res.status(404).json({ ok: false, error: 'proposal not found' });
      (enhancedGameWS as any).uiFlags = { ...(enhancedGameWS as any).uiFlags || {}, ...flags };
      try {
        for (const [ws] of (enhancedGameWS as any).clients || []) {
          if (ws?.readyState === 1) ws.send(JSON.stringify({ type: 'ui:flags', flags: (enhancedGameWS as any).uiFlags }));
        }
      } catch {}
      return res.json({ ok: true, applied: true, flags });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Public profile endpoint for web client (read-only)
  // Optional JWT gating for profile; enable by setting ENABLE_PROFILE_JWT=true and JWT_PUBLIC_KEY_PATH/aud/iss
  const enableProfileJwt = String(process.env.ENABLE_PROFILE_JWT || 'false').toLowerCase() === 'true';
  const profileHandlers: Array<any> = [];
  try {
    if (enableProfileJwt) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { authMiddleware } = require('./api/auth.cjs');
      profileHandlers.push(authMiddleware);
    }
  } catch {}

  app.get('/api/game/profile/:playerId', ...profileHandlers, async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      const playerId = String(req.params.playerId);
      const playerQ = pool.query('SELECT id, username, level, coins, created_at FROM game_players WHERE id = $1', [playerId]);
      const companionQ = pool.query('SELECT id, name, level, experience, mood, hunger, energy, happiness, updated_at FROM game_companions WHERE player_id = $1 ORDER BY updated_at DESC LIMIT 1', [playerId]);
      const sanctQ = pool.query('SELECT level, xp, ascended, legendary, legendary_at, updated_at FROM game_sanctuaries WHERE player_id = $1', [playerId]);
      const invQ = pool.query('SELECT item_id, name, type, quantity, metadata, created_at FROM game_inventory WHERE player_id = $1 ORDER BY created_at DESC LIMIT 50', [playerId]);
      const battlesQ = pool.query('SELECT winner_player, loser_player, winner_session, loser_session, xp_transferred, created_at FROM game_battles WHERE winner_player = $1 OR loser_player = $1 ORDER BY created_at DESC LIMIT 10', [playerId]);
      const [playerR, companionR, sanctR, invR, battlesR] = await Promise.all([playerQ, companionQ, sanctQ, invQ, battlesQ]);
      const player = playerR.rows[0] || null;
      if (!player) return res.status(404).json({ ok: false, error: 'player_not_found' });
      const companion = companionR.rows[0] || null;
      const sanctuary = sanctR.rows[0] || null;
      const inventory = invR.rows.map((r: any) => ({ id: r.item_id, name: r.name, type: r.type, quantity: Number(r.quantity||1), metadata: r.metadata, created_at: r.created_at }));
      const battles = (battlesR.rows || []).map((r: any) => ({ youWon: r.winner_player === playerId, xp: Number(r.xp_transferred||0), when: r.created_at }));
      return res.json({ ok: true, player, companion, sanctuary, inventory, battles });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Online sessions for a given player (for direct challenge)
  app.get('/api/game/player_sessions/:playerId', ...profileHandlers, async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const pid = String(req.params.playerId);
      const sessions: string[] = [];
      try {
        for (const [ws, ci] of (enhancedGameWS as any).clients || []) {
          if (ws && ws.readyState === 1 && ci?.player?.id === pid) sessions.push(ci.id);
        }
      } catch {}
      return res.json({ ok: true, sessions });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Map session id to player info for Spectate HUD
  app.get('/api/game/session/:sessionId', async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const sid = String(req.params.sessionId);
      let info: any = null;
      try {
        for (const [, ci] of (enhancedGameWS as any).clients || []) {
          if (ci?.id === sid) {
            info = {
              sessionId: sid,
              playerId: ci?.player?.id || null,
              username: ci?.player?.username || null,
              area: ci?.player?.currentArea || null,
            };
            break;
          }
        }
      } catch {}
      if (!info) return res.status(404).json({ ok: false, error: 'not_found' });
      return res.json({ ok: true, info });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.put('/api/game/flags/trial', authenticateMetrics, express.json(), async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const { action } = req.body || {};
      if (action === 'commit') {
        const patch: any = {};
        if ((enhancedGameWS as any).trialEventPacingMs) { (enhancedGameWS as any).eventPacingMs = (enhancedGameWS as any).trialEventPacingMs; patch.eventPacingMs = (enhancedGameWS as any).eventPacingMs; }
        if ((enhancedGameWS as any).trialContentDensity) { (enhancedGameWS as any).contentDensity = (enhancedGameWS as any).trialContentDensity; patch.contentDensity = (enhancedGameWS as any).contentDensity; }
        (enhancedGameWS as any).trialEventPacingMs = null;
        (enhancedGameWS as any).trialContentDensity = null;
        (enhancedGameWS as any).trialActiveUntil = null;
        (enhancedGameWS as any).trialStartAvgSessionSec = null;
        try { (enhancedGameWS as any).rescheduleWorldEventTimer(); } catch {}
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { pool } = require('./db');
          await pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify(patch), 'api', 'trial-commit manual']);
        } catch {}
        return res.json({ ok: true, patch });
      }
      if (action === 'cancel') {
        (enhancedGameWS as any).trialEventPacingMs = null;
        (enhancedGameWS as any).trialContentDensity = null;
        (enhancedGameWS as any).trialActiveUntil = null;
        (enhancedGameWS as any).trialStartAvgSessionSec = null;
        try { (enhancedGameWS as any).rescheduleWorldEventTimer(); } catch {}
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { pool } = require('./db');
          await pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify({}), 'api', 'trial-cancel manual']);
        } catch {}
        return res.json({ ok: true });
      }
      res.status(400).json({ ok: false, error: 'invalid action' });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.get('/api/game/flags/diff', authenticateMetrics, async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      const id = req.query.id as string;
      const against = (req.query.against as string) || 'current';
      if (!id) return res.status(400).json({ ok: false, error: 'id required' });
      const { rows } = await pool.query('SELECT flags FROM game_flags_history WHERE id = $1', [id]);
      if (!rows[0]) return res.status(404).json({ ok: false, error: 'not found' });
      const A = rows[0].flags || {};
      let B: any = {};
      if (against === 'current') {
        B = {
          mobileHeartbeatHz: (enhancedGameWS as any).mobileHeartbeatHz,
          contentDensity: (enhancedGameWS as any).contentDensity,
          eventPacingMs: (enhancedGameWS as any).eventPacingMs,
          battleXpTransferPct: (enhancedGameWS as any).battleXpTransferPct,
          battleCooldownMs: (enhancedGameWS as any).battleCooldownMs,
          sanctuaryBaseThreshold: (enhancedGameWS as any).sanctuaryBaseThreshold,
          sanctuaryPerLevelIncrement: (enhancedGameWS as any).sanctuaryPerLevelIncrement,
          canaryPct: (enhancedGameWS as any).canaryPct,
        };
      } else {
        const { rows: r2 } = await pool.query('SELECT flags FROM game_flags_history WHERE id = $1', [against]);
        if (!r2[0]) return res.status(404).json({ ok: false, error: 'against not found' });
        B = r2[0].flags || {};
      }
      const diff = computeDiff(A, B);
      res.json({ ok: true, diff });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  // Abilities registry endpoints (secured)
  app.get('/api/game/abilities', authenticateMetrics, async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      res.json({ ok: true, abilities: (enhancedGameWS as any).abilities || {} });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.get('/api/game/proposals', authenticateMetrics, async (_req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      const { rows } = await pool.query('SELECT id, ability_id, before, after, reason, status, applied_by, created_at FROM game_code_proposals ORDER BY created_at DESC LIMIT 50');
      res.json({ ok: true, proposals: rows });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.put('/api/game/abilities', authenticateMetrics, express.json(), async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      const { id, patch, reason, apply } = (req.body || {}) as any;
      if (!id || typeof patch !== 'object') return res.status(400).json({ ok: false, error: 'id and patch required' });
      const abilities = (enhancedGameWS as any).abilities || {};
      const cur = abilities[id];
      if (!cur) return res.status(404).json({ ok: false, error: 'ability not found' });

      // Sanitize patch
      const safe = sanitizeAbilityPatch(patch);
      const after = applyAbilityPatch(cur, safe, false); // compute preview
      // Store proposal
      const ins = await pool.query('INSERT INTO game_code_proposals (ability_id, before, after, reason, status, applied_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id', [id, JSON.stringify(cur), JSON.stringify(after), String(reason || ''), apply ? 'applied' : 'proposed', apply ? 'api' : null]);
      const proposalId = ins.rows[0]?.id;
      // Apply live if requested
      if (apply) {
        (enhancedGameWS as any).abilities[id] = applyAbilityPatch(cur, safe, true);
        try {
          await pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify({ abilityId: id, patch: safe }), 'api', 'ability-apply']);
        } catch {}
      }
      res.json({ ok: true, proposalId, ability: (enhancedGameWS as any).abilities[id] });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  app.put('/api/game/proposals/:id', authenticateMetrics, express.json(), async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { enhancedGameWS } = require('./consciousness/game/EnhancedGameWebSocket.cjs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { pool } = require('./db');
      const id = Number(req.params.id);
      const { action } = (req.body || {}) as any;
      if (!id || action !== 'apply') return res.status(400).json({ ok: false, error: 'invalid request' });
      const { rows } = await pool.query('SELECT ability_id, after FROM game_code_proposals WHERE id = $1', [id]);
      if (!rows[0]) return res.status(404).json({ ok: false, error: 'not found' });
      const abilityId = rows[0].ability_id;
      const after = rows[0].after || {};
      const abilities = (enhancedGameWS as any).abilities || {};
      if (!abilities[abilityId]) return res.status(404).json({ ok: false, error: 'ability not found' });
      (enhancedGameWS as any).abilities[abilityId] = after;
      await pool.query('UPDATE game_code_proposals SET status = $1, applied_by = $2 WHERE id = $3', ['applied', 'api', id]);
      try { await pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify({ abilityId, appliedProposalId: id }), 'api', 'ability-apply-proposal']); } catch {}
      res.json({ ok: true, ability: after });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });

  function sanitizeAbilityPatch(p: any) {
    const out: any = {};
    if (typeof p.cooldownMs === 'number') out.cooldownMs = clamp(p.cooldownMs, 5000, 300000);
    if (typeof p.energyCost === 'number') out.energyCost = clamp(p.energyCost, 0, 100);
    if (p.buff && typeof p.buff === 'object') out.buff = { ...p.buff };
    if (out.buff) {
      if (typeof out.buff.value === 'number') out.buff.value = clamp(out.buff.value, 1, 200);
      if (typeof out.buff.durationMs === 'number') out.buff.durationMs = clamp(out.buff.durationMs, 1000, 300000);
      if (typeof out.buff.kind === 'string' && !['attack','defense'].includes(out.buff.kind)) delete out.buff.kind;
    }
    if (p.groupBuff && typeof p.groupBuff === 'object') out.groupBuff = { ...p.groupBuff };
    if (out.groupBuff) {
      if (typeof out.groupBuff.value === 'number') out.groupBuff.value = clamp(out.groupBuff.value, 1, 200);
      if (typeof out.groupBuff.durationMs === 'number') out.groupBuff.durationMs = clamp(out.groupBuff.durationMs, 1000, 300000);
      if (typeof out.groupBuff.kind === 'string' && !['attack','defense'].includes(out.groupBuff.kind)) delete out.groupBuff.kind;
    }
    if (p.fx && typeof p.fx === 'object') out.fx = { ...p.fx };
    if (out.fx) {
      if (typeof out.fx.amplitude === 'number') out.fx.amplitude = clamp(out.fx.amplitude, 0.1, 1.5);
      if (typeof out.fx.durationMs === 'number') out.fx.durationMs = clamp(out.fx.durationMs, 200, 10000);
      if (typeof out.fx.color === 'string') out.fx.color = out.fx.color;
      if (typeof out.fx.type === 'string') out.fx.type = out.fx.type;
    }
    return out;
  }

  function applyAbilityPatch(cur: any, patch: any, mutate: boolean) {
    const base = mutate ? cur : JSON.parse(JSON.stringify(cur));
    if (typeof patch.cooldownMs === 'number') base.cooldownMs = patch.cooldownMs;
    if (typeof patch.energyCost === 'number') base.energyCost = patch.energyCost;
    if (patch.buff) base.buff = { ...(base.buff || {}), ...patch.buff };
    if (patch.groupBuff) base.groupBuff = { ...(base.groupBuff || {}), ...patch.groupBuff };
    if (patch.fx) base.fx = { ...(base.fx || {}), ...patch.fx };
    return base;
  }

  function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

  function computeDiff(a: any, b: any) {
    const added: any[] = [];
    const removed: any[] = [];
    const changed: any[] = [];
    const keys = new Set<string>([...Object.keys(a || {}), ...Object.keys(b || {})]);
    for (const k of keys) {
      const av = a[k];
      const bv = b[k];
      if (av === undefined && bv !== undefined) removed.push({ key: k, from: undefined, to: bv });
      else if (av !== undefined && bv === undefined) added.push({ key: k, from: av, to: undefined });
      else if (JSON.stringify(av) !== JSON.stringify(bv)) changed.push({ key: k, from: av, to: bv });
    }
    return { added, removed, changed };
  }

  // Initialize Game Integration Module to bridge reality generator, spiral memory, and resonance
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const GameIntegrationModule = require('./consciousness/game/GameIntegrationModule.cjs');
    const gameIntegration = new GameIntegrationModule();
    await gameIntegration.initialize();
  } catch (e) {
    log('GameIntegrationModule init failed (non-fatal): ' + (e as any)?.message);
  }

  // Push registration (lightweight; no auth, but low risk)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { registerToken } = require('./consciousness/notifications/PushService.cjs');
    const pushLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
    app.post('/api/push/register', pushLimiter, express.json(), async (req: Request, res: Response) => {
      const { sessionId, token, platform } = (req.body || {}) as any;
      if (!sessionId || !token) return res.status(400).json({ ok: false, error: 'sessionId and token required' });
      const ok = await registerToken(String(sessionId), String(token), platform ? String(platform) : undefined);
      return res.json({ ok });
    });
  } catch {}

  // Lightweight Redis pub/sub bridge for zone events (optional)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const eventBus = require('./consciousness/core/ConsciousnessEventBus.cjs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Redis = require('ioredis');
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    const rsub = new Redis(redisUrl);
    const rpub = new Redis(redisUrl);

    // Fan-in from Redis → EventBus
    rsub.psubscribe('zone:*', () => {});
    rsub.on('pmessage', (_pattern: string, channel: string, message: string) => {
      let data: any = message;
      try { data = JSON.parse(message); } catch {}
      eventBus.emit('zone:event', { channel, data, ts: Date.now() });
    });

    // Fan-out from EventBus → Redis (publish explicit zone messages)
    eventBus.on('zone:publish', (msg: { channel: string; event: any }) => {
      if (!msg || !msg.channel) return;
      const payload = typeof msg.event === 'string' ? msg.event : JSON.stringify(msg.event);
      rpub.publish(msg.channel, payload);
    });
  } catch {
    // Redis optional
  }

  // Friendly alias: /gamedemo serves the browser demo UI
  app.get('/gamedemo', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'game-demo.html'));
  });

  // Friendly alias: /game serves the generative web client
  app.get('/game', (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'game', 'index.html'));
  });

  // Lightweight demo login to issue RS256 JWT (for local testing)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { loginRoute } = require('./api/auth.cjs');
    app.post('/api/game/login', express.json(), (req: Request, res: Response) => loginRoute(req as any, res as any));
  } catch {}

  // Admin: configure Gemini API key at runtime (secured via the same x-api-key as /metrics)
  app.get('/api/admin/gemini-key', authenticateMetrics, (_req: Request, res: Response) => {
    const val = process.env.GEMINI_API_KEY || '';
    const last4 = val ? val.slice(-4) : null;
    res.json({ ok: true, configured: !!val, last4 });
  });
  app.post('/api/admin/gemini-key', authenticateMetrics, express.json(), (req: Request, res: Response) => {
    try {
      const { apiKey } = (req.body || {}) as any;
      if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
        return res.status(400).json({ ok: false, error: 'invalid apiKey' });
      }
      process.env.GEMINI_API_KEY = apiKey.trim();
      try {
        // Notify runtime modules that may cache keys
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const eventBus = require('./consciousness/core/ConsciousnessEventBus.cjs');
        eventBus.emit('config:update', { provider: 'gemini', apiKeyUpdated: true, at: Date.now() });
      } catch {}
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e?.message || 'failed' });
    }
  });
  
  // Start the email processor for background processing of email queue
  startEmailProcessor();
  
  // Start the scheduler for daily inspiration emails
  startEmailScheduler();

  // Start worker to erase user data
  startUserEraseWorker();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
