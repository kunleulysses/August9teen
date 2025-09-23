/**
 * Enhanced Game WebSocket - Extends existing game-ws.cjs with consciousness integration
 * Maintains backward compatibility while adding mobile companion features
 */

const { WebSocketServer } = require('ws');
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const eventBus = require('../core/ConsciousnessEventBus.cjs');
const universalRuntime = require('../bootstrapUniversalConsciousness.cjs');
const { spiralMemory } = universalRuntime;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clamp01 = (value) => clamp(value, 0, 1);
const hashBuffer = (input) => crypto.createHash('sha1').update(String(input)).digest();
const hashToUnit = (input) => {
    const buf = hashBuffer(input);
    const int = buf.readUInt32BE(0);
    return int / 0xffffffff;
};
const hashFragment = (input, length = 8) => hashBuffer(input).toString('hex').slice(0, length);
let pool;
try { ({ pool } = require('../../db')); }
catch { try { ({ pool } = require('../../db.cjs')); } catch { pool = { query: async () => ({ rows: [] }) }; } }

// Import existing game metrics and functions
const { getGameMetrics: getBaseGameMetrics } = require('../../game-ws.cjs');

class EnhancedGameWebSocket {
    constructor() {
        this.name = 'EnhancedGameWebSocket';
        this.wss = null;
        this.clients = new Map(); // ws -> clientInfo
        this.companions = new Map(); // companionId -> companionData
        this.players = new Map(); // playerId -> playerData
        this.sanctuaries = new Map(); // playerId -> sanctuaryData
        this.presence = new Map(); // area -> Set(sessionId)
        this.battleQueue = [];
        this.activeBattles = new Map(); // sessionId -> opponentSessionId
        this.spectators = { areas: new Map(), battles: new Map() }; // areas: area -> Set(ws); battles: key -> Set(ws)
        this.battlesMeta = new Map(); // key -> { a, b, areas, startedAt }
        
        // Enhanced metrics
        this.metrics = {
            ...getBaseGameMetrics(),
            companionInteractions: 0,
            moodChanges: 0,
            explorationEvents: 0,
            aiResponses: 0,
            consciousnessEvents: 0,
            sessionCount: 0,
            totalSessionMs: 0,
            avgSessionSec: 0,
            recentDisconnects: []
        };

        // Auth settings
        const jwtEnv = process.env.WS_GAME_JWT_REQUIRED || process.env.WS_JWT_REQUIRED;
        const prodDefault = (process.env.NODE_ENV === 'production') ? 'true' : 'false';
        this.enforceJwt = String(jwtEnv || prodDefault).toLowerCase() === 'true';
        this.publicKey = this.getWsJwtPublicKey();

        // Feature flags
        this.mobileHeartbeatHz = Number(process.env.WS_GAME_MOBILE_HEARTBEAT_HZ || 1);
        if (!Number.isFinite(this.mobileHeartbeatHz) || this.mobileHeartbeatHz <= 0) this.mobileHeartbeatHz = 1;
        this.mobileHeartbeatMinInterval = Math.max(250, Math.floor(1000 / this.mobileHeartbeatHz));
        this.contentDensity = String(process.env.GAME_CONTENT_DENSITY || 'medium').toLowerCase(); // low|medium|high
        this.eventPacingMs = Number(process.env.GAME_EVENT_PACING_MS || 30000);
        if (!Number.isFinite(this.eventPacingMs) || this.eventPacingMs < 5000) this.eventPacingMs = 30000;

        // Battle and progression tuning
        this.battleXpTransferPct = Math.max(0, Math.min(1, Number(process.env.BATTLE_XP_TRANSFER_PCT || 0.2)));
        this.battleCooldownMs = Math.max(0, Number(process.env.BATTLE_COOLDOWN_MS || 60000));
        this.sanctuaryBaseThreshold = Math.max(10, Number(process.env.SANCTUARY_BASE_XP || 100));
        this.sanctuaryPerLevelIncrement = Math.max(1, Number(process.env.SANCTUARY_PER_LEVEL_XP || 50));
        this.lastBattleAt = new Map(); // sessionId -> ts

        // Ability registry
        this.abilities = {
            crystal_aegis: { id: 'crystal_aegis', cooldownMs: 60000, energyCost: 10, buff: { kind: 'defense', value: 30, durationMs: 30000 } },
            resonant_strike: { id: 'resonant_strike', cooldownMs: 45000, energyCost: 15, buff: { kind: 'attack', value: 40, durationMs: 20000 }, fx: { type: 'resonant_strike', color: '#9B59B6', amplitude: 0.9, durationMs: 1500 } },
            harmonic_aura: { id: 'harmonic_aura', cooldownMs: 50000, energyCost: 12, buff: { kind: 'attack', value: 20, durationMs: 15000 }, groupBuff: { kind: 'attack', value: 15, durationMs: 12000 }, fx: { type: 'harmonic_aura', color: '#27AE60', amplitude: 0.6, durationMs: 1800 } },
        };

        // Canary/trial settings
        this.canaryPct = Math.max(0, Math.min(1, Number(process.env.GAME_CANARY_PCT || 0)));
        this.trialEventPacingMs = null;
        this.trialContentDensity = null;
        this.trialActiveUntil = null;

        this.clientCounter = 0;
        this.eventCounter = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for consciousness system events
        eventBus.on('system_tick', this.handleSystemTick.bind(this));
        eventBus.on('holistic_response_generated', this.handleHolisticResponse.bind(this));
        eventBus.on('companion:ai_response', this.handleCompanionAIResponse.bind(this));
        eventBus.on('world:generated_encounter', this.handleGeneratedEncounter.bind(this));
        // Push sprite updates (autonomous visuals) to clients when regenerated
        try {
            eventBus.on('sprite:update', (data) => {
                for (const [ws, ci] of this.clients) {
                    if (ws.readyState === 1) this.sendToClient(ws, 'sprite:update', { sprite: data?.manifest, ts: Date.now() });
                }
            });
        } catch {}
        eventBus.on('world:global_event', (data) => {
            try {
                for (const [ws] of this.clients) {
                    if (ws.readyState === 1) this.sendToClient(ws, 'world:global_event', data);
                }
                // Also to all spectators
                try { this.broadcastToAllSpectators('world:global_event', data); } catch {}
            } catch {}
        });

        // Forward biome updates to all clients
        try {
            const onBiomeUpdate = (data) => {
                for (const [ws] of this.clients) {
                    if (ws.readyState === 1) this.sendToClient(ws, 'biome:update', { backgrounds: data?.backgrounds, ts: Date.now() });
                }
            };
            eventBus.on('biome:update', onBiomeUpdate);
        } catch {}
        eventBus.on('module:status', (data) => {
            // Broadcast module status to mobile clients
            for (const [ws, clientInfo] of this.clients) {
                if (clientInfo.isMobile && ws.readyState === 1) {
                    this.sendToClient(ws, 'consciousness:module:status', data);
                }
            }
        });

        // Map telemetry to visual FX for the originating session when possible
        try {
            eventBus.on('game:telemetry', (t) => {
                if (!t) return;
                const fxFor = (evt) => {
                    switch (evt) {
                        case 'companion:feed': return { type: 'sparkle', color: '#ffd289', amplitude: 0.6, durationMs: 900 };
                        case 'companion:play': return { type: 'aura', color: '#27AE60', amplitude: 0.8, durationMs: 1200 };
                        case 'world:explore': return { type: 'pulse', color: '#2a78ff', amplitude: 0.5, durationMs: 1000 };
                        default: return null;
                    }
                };
                const fx = fxFor(t.event);
                if (!fx) return;
                // target by session if present; else broadcast
                const target = typeof t.sessionId === 'string' ? Array.from(this.clients.values()).find(ci => ci.id === t.sessionId) : null;
                if (target && target.ws && target.ws.readyState === 1) {
                    this.sendToClient(target.ws, 'fx:emit', fx);
                } else {
                    for (const [ws] of this.clients) { if (ws.readyState === 1) this.sendToClient(ws, 'fx:emit', fx); }
                }
            });
        } catch {}
    }

    initGameWS(server) {
        this.wss = new WebSocketServer({ server, path: '/ws/game' });
        
        console.log('🎮 Enhanced Game WebSocket server starting on /ws/game');

        // Enhanced director tick (20Hz for compatibility + consciousness updates)
        const tickIntervalMs = 50; // 20Hz
        this.tickTimer = setInterval(() => {
            this.broadcastDirectorTick();
        }, tickIntervalMs);

        // Keepalive pings and stale detection
        this.pingTimer = setInterval(() => {
            const now = Date.now();
            for (const [ws, clientInfo] of this.clients) {
                try { ws.ping(); } catch {}
                if (now - clientInfo.lastPing > 60_000) {
                    try { ws.terminate(); } catch {}
                    this.handleDisconnection(ws, clientInfo);
                }
            }
        }, 30_000);

        // Global world event pacing
        const densityFactor = this.contentDensity === 'high' ? 0.5 : (this.contentDensity === 'low' ? 1.5 : 1.0);
        const pacedMs = Math.max(5000, Math.floor(this.eventPacingMs * densityFactor));
        this.worldEventTimer = setInterval(() => {
            this.scheduleGlobalEvent();
        }, pacedMs);
        if (this.trialEventPacingMs && this.canaryPct > 0) {
            const df = this.trialContentDensity === 'high' ? 0.5 : (this.trialContentDensity === 'low' ? 1.5 : 1.0);
            const pms = Math.max(5000, Math.floor(this.trialEventPacingMs * df));
            this.worldEventTimerCanary = setInterval(() => { this.scheduleGlobalEvent(true); }, pms);
        }

        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });

        this.wss.on('close', () => {
            if (this.tickTimer) {
                clearInterval(this.tickTimer);
            }
            if (this.pingTimer) {
                clearInterval(this.pingTimer);
            }
            if (this.worldEventTimer) {
                clearInterval(this.worldEventTimer);
            }
            if (this.worldEventTimerCanary) {
                clearInterval(this.worldEventTimerCanary);
            }
        });

        console.log('✅ Enhanced Game WebSocket server running on /ws/game');
        return this.wss;
    }

    rescheduleWorldEventTimer() {
        try { if (this.worldEventTimer) clearInterval(this.worldEventTimer); } catch {}
        const densityFactor = this.contentDensity === 'high' ? 0.5 : (this.contentDensity === 'low' ? 1.5 : 1.0);
        const pacedMs = Math.max(5000, Math.floor(this.eventPacingMs * densityFactor));
        this.worldEventTimer = setInterval(() => { this.scheduleGlobalEvent(); }, pacedMs);
        // Canary timer adjustment
        try { if (this.worldEventTimerCanary) clearInterval(this.worldEventTimerCanary); } catch {}
        if (this.trialEventPacingMs && this.canaryPct > 0) {
            const df = this.trialContentDensity === 'high' ? 0.5 : (this.trialContentDensity === 'low' ? 1.5 : 1.0);
            const pms = Math.max(5000, Math.floor(this.trialEventPacingMs * df));
            this.worldEventTimerCanary = setInterval(() => { this.scheduleGlobalEvent(true); }, pms);
        }
    }

    handleConnection(ws, req) {
        // Optional JWT enforcement (RS256)
        if (this.enforceJwt) {
            if (!this.publicKey) {
                try { ws.close(1011, 'JWT public key missing'); } catch {}
                return;
            }
            const token = this.extractWsToken(req);
            if (!token) {
                try { ws.close(1008, 'Missing token'); } catch {}
                return;
            }
            const payload = this.verifyWsJwt(token, this.publicKey);
            if (!payload) {
                try { ws.close(1008, 'Invalid token'); } catch {}
                return;
            }
            ws._user = payload;
        }

        const clientId = this.generateClientId();
        const userAgent = req.headers['user-agent'] || '';
        const isMobileClient = this.detectMobileClient(userAgent);
        
        const clientInfo = {
            id: clientId,
            ws,
            isMobile: isMobileClient,
            connectedAt: Date.now(),
            lastPing: Date.now(),
            lastConsciousnessSentAt: 0,
            canary: this.normalizedHash(`canary:${clientId}`) < this.canaryPct,
            companion: null,
            player: null,
            processedMessageIds: new Set(),
            eventBuffer: [] // recent outbound events for resume
        };

        this.clients.set(ws, clientInfo);
        
        console.log(`🎮 Client connected: ${clientId} (${isMobileClient ? 'Mobile' : 'Web'})`);

        // Send initial state based on client type
        if (isMobileClient) {
            this.initializeMobileClient(ws, clientInfo);
        } else {
            this.initializeWebClient(ws, clientInfo);
            // Send current autonomous sprite manifest to web clients at connect
            try {
                const { getAutonomousSpriteManifest } = require('./VisualAutonomyEngine.cjs');
                const sprite = getAutonomousSpriteManifest();
                if (sprite) this.sendToClient(ws, 'sprite:update', { sprite, ts: Date.now() });
            } catch {}
        }

        // Set up message handlers
        ws.on('message', (message) => {
            this.handleMessage(ws, message, clientInfo);
        });

        // Track keepalive
        try {
            ws.on('pong', () => { clientInfo.lastPing = Date.now(); });
        } catch {}

        ws.on('close', () => {
            this.handleDisconnection(ws, clientInfo);
        });

        ws.on('error', (error) => {
            console.error('🎮 WebSocket error:', error);
            this.handleDisconnection(ws, clientInfo);
        });
    }

    detectMobileClient(userAgent) {
        // Detect React Native or mobile browsers
        return /react-native|mobile|android|iphone|ipad/i.test(userAgent);
    }

    initializeMobileClient(ws, clientInfo) {
        // Create companion and player for mobile client
        const player = this.createPlayer(clientInfo.id);
        const companion = this.createCompanion(clientInfo.id, player.id);
        
        clientInfo.player = player;
        clientInfo.companion = companion;
        
        this.players.set(player.id, player);
        this.companions.set(companion.id, companion);

        // Persist player and companion
        this.upsertPlayer(player);
        this.upsertCompanion(companion);

        // Ensure sanctuary exists
        const sanctuary = this.getOrCreateSanctuary(player.id);

        // Send mobile-specific initial state
        this.sendToClient(ws, 'game:initial_state', {
            sessionId: clientInfo.id,
            player,
            companion,
            sanctuary,
            world: this.getWorldState(),
            consciousness: this.getConsciousnessState()
        });

        // Then stream inventory if present
        this.getInventory(player.id).then((items) => {
            try {
                if (Array.isArray(items) && items.length) {
                    this.sendToClient(ws, 'inventory:list', { items });
                }
            } catch {}
        }).catch(()=>{});

        // Store a memory of connection
        eventBus.emit('spiral_memory:store', {
            type: 'companion_memory',
            companionId: companion.id,
            memory: { kind: 'session_start', area: 'town' },
            timestamp: Date.now()
        });

        // Register presence in default area
        try {
            const area = 'town';
            if (!this.presence.has(area)) this.presence.set(area, new Set());
            this.presence.get(area).add(clientInfo.id);
            player.currentArea = area;
        } catch {}

        // Emit connection event to consciousness system
        eventBus.emit('game:mobile_connect', {
            clientId: clientInfo.id,
            playerId: player.id,
            companionId: companion.id,
            ws
        });
    }

    initializeWebClient(ws, clientInfo) {
        // Maintain compatibility with existing web demo
        const quest = this.makeQuest();
        this.metrics.questsOffered++;
        
        this.sendToClient(ws, 'director:state', {
            ...this.getDirectorState(),
            tickHz: 20
        });
        
        this.sendToClient(ws, 'quest:offer', { quest });
    }

    handleMessage(ws, message, clientInfo) {
        try {
            const data = JSON.parse(message);
            const { type, payload, id: msgId } = data;

            console.log(`🎮 Received: ${type} from ${clientInfo.id}`);

            // Idempotency check
            if (msgId && clientInfo.processedMessageIds.has(msgId)) {
                this.sendToClient(ws, 'ack', { id: msgId, duplicate: true });
                return;
            }

            // Route messages based on client type and message type
            if (clientInfo.isMobile) {
                this.handleMobileMessage(ws, type, payload, clientInfo);
            } else {
                this.handleWebMessage(ws, type, payload, clientInfo);
            }

            // Count UI telemetry events for auto-canary
            try {
                if (type === 'ui:telemetry') {
                    const evt = payload && payload.event ? String(payload.event) : 'unknown';
                    this.uiMetrics = this.uiMetrics || { windowStart: Date.now(), counts: {} };
                    const c = this.uiMetrics.counts || (this.uiMetrics.counts = {});
                    c[evt] = (c[evt] || 0) + 1;
                }
            } catch {}

            if (msgId) {
                clientInfo.processedMessageIds.add(msgId);
                // bounding the set size
                if (clientInfo.processedMessageIds.size > 500) {
                    // remove 100 oldest by recreating set (simple approach)
                    clientInfo.processedMessageIds = new Set(Array.from(clientInfo.processedMessageIds).slice(-400));
                }
                this.sendToClient(ws, 'ack', { id: msgId });
            }

        } catch (error) {
            console.error('🎮 Error parsing message:', error);
            this.sendToClient(ws, 'error', {
                message: 'Invalid message format',
                error: error.message
            });
        }
    }

    handleMobileMessage(ws, type, payload, clientInfo) {
        const enrichedPayload = {
            ...payload,
            clientId: clientInfo.id,
            playerId: clientInfo.player?.id,
            companionId: clientInfo.companion?.id,
            ws
        };

        switch (type) {
            case 'game:connect': {
                // Already initialized; optionally handle resume
                if (payload && payload.lastEventId) {
                    this.replayEvents(ws, clientInfo, payload.lastEventId);
                }
                break;
            }

            case 'companion:feed':
                this.handleCompanionFeed(enrichedPayload, clientInfo);
                break;

            case 'companion:play':
                this.handleCompanionPlay(enrichedPayload, clientInfo);
                break;

            case 'world:explore':
                this.handleWorldExplore(enrichedPayload, clientInfo);
                break;

            case 'world:list_players':
                this.handleListPlayers(ws, clientInfo);
                break;
            case 'companion:chat':
                this.handleCompanionChat(enrichedPayload, clientInfo);
                break;
            case 'spectate:area': {
                const area = String(payload?.area || clientInfo?.player?.currentArea || 'town');
                this.addAreaSpectator(area, ws);
                this.sendToClient(ws, 'spectate:subscribed', { area });
                break;
            }
            case 'spectate:off': {
                this.removeSpectator(ws);
                this.sendToClient(ws, 'spectate:unsubscribed', {});
                break;
            }
            case 'spectate:battle': {
                const key = this.resolveBattleKeyFromPayload(payload);
                if (key) { this.addBattleSpectator(key, ws); this.sendToClient(ws, 'spectate:subscribed', { battleKey: key }); }
                break;
            }
            
            case 'ability:use':
                this.handleAbilityUse(ws, clientInfo, String(payload?.abilityId || ''));
                break;

            case 'sanctuary:get':
                this.handleSanctuaryGet(ws, clientInfo);
                break;

            case 'sanctuary:ascend':
                this.handleSanctuaryAscend(ws, clientInfo);
                break;

            case 'battle:queue_join':
                this.handleBattleQueueJoin(ws, clientInfo);
                break;
            case 'battle:queue_leave':
                this.handleBattleQueueLeave(ws, clientInfo);
                break;
            case 'battle:accept':
                this.handleBattleAccept(ws, clientInfo);
                break;
            case 'battle:decline':
                this.handleBattleDecline(ws, clientInfo);
                break;
            case 'battle:challenge':
                this.handleBattleChallenge(ws, clientInfo, payload?.opponentSessionId);
                break;

            case 'ladder:get':
                this.handleLadderGet(ws).catch(() => {});
                break;
            case 'spectate:battles:list': {
                const area = payload && payload.area ? String(payload.area) : null;
                const items = this.listBattles(area);
                this.sendToClient(ws, 'spectate:battles:list', { area, items, ts: Date.now() });
                break;
            }

            case 'inventory:list':
                this.handleInventoryList(ws, clientInfo).catch(() => {});
                break;

            case 'inventory:add':
                this.handleInventoryAdd(ws, clientInfo, payload || {}).catch(() => {});
                break;

            case 'inventory:remove':
                this.handleInventoryRemove(ws, clientInfo, String(payload?.itemId || payload?.id || '')).catch(() => {});
                break;

            case 'ui:telemetry':
                this.handleUiTelemetry(enrichedPayload, clientInfo).catch(() => {});
                break;

            case 'game:request_memories':
                this.handleRequestMemories(ws, clientInfo);
                break;
            case 'game:request_memories_page':
                this.handleRequestMemoriesPage(ws, clientInfo, Number(payload?.page||1), Number(payload?.size||20), Array.isArray(payload?.types) ? payload.types : undefined);
                break;

            case 'ping':
                clientInfo.lastPing = Date.now();
                this.sendToClient(ws, 'pong', { timestamp: Date.now() });
                break;

            default:
                console.warn(`🎮 Unknown mobile message type: ${type}`);
        }
    }

    async handleLadderGet(ws) {
        try {
            const { rows } = await pool.query(`
                SELECT gp.id as player_id, gp.username,
                       COALESCE(gs.level, 1) as sanctuary_level,
                       COALESCE(gs.xp, 0) as sanctuary_xp,
                       COALESCE(gs.legendary, false) as legendary,
                       COALESCE(gc.level, 1) as companion_level
                FROM game_players gp
                LEFT JOIN game_sanctuaries gs ON gs.player_id = gp.id
                LEFT JOIN game_companions gc ON gc.player_id = gp.id
                ORDER BY COALESCE(gs.level,1) DESC, COALESCE(gc.level,1) DESC, COALESCE(gs.xp,0) DESC
                LIMIT 50
            `);
            const list = rows.map(r => ({
                playerId: r.player_id,
                username: r.username || r.player_id,
                sanctuaryLevel: Number(r.sanctuary_level || 1),
                sanctuaryXp: Number(r.sanctuary_xp || 0),
                legendary: !!r.legendary,
                companionLevel: Number(r.companion_level || 1),
            }));
            this.sendToClient(ws, 'ladder:list', { list });
        } catch (e) {
            // Fallback: compute from in-memory state
            try {
                const list = Array.from(this.players.values()).map(p => {
                    const s = this.sanctuaries.get(p.id) || { level: 1, xp: 0, legendary: false };
                    const c = Array.from(this.companions.values()).find(c => c.playerId === p.id) || { level: 1 };
                    return { playerId: p.id, username: p.username, sanctuaryLevel: s.level || 1, sanctuaryXp: s.xp || 0, legendary: !!s.legendary, companionLevel: c.level || 1 };
                }).sort((a,b) => (b.sanctuaryLevel - a.sanctuaryLevel) || (b.companionLevel - a.companionLevel) || (b.sanctuaryXp - a.sanctuaryXp)).slice(0,50);
                this.sendToClient(ws, 'ladder:list', { list });
            } catch {}
        }
    }

    async fetchCompanionMemories(clientInfo, limit = 20, offset = 0, types = ['companion_memory']) {
        if (!spiralMemory) return [];
        const supportedTypes = Array.isArray(types) && types.length ? types : ['companion_memory'];
        let memories = [];
        try {
            if (typeof spiralMemory.getMemoriesByType === 'function') {
                supportedTypes.forEach((type) => {
                    memories = memories.concat(spiralMemory.getMemoriesByType(type) || []);
                });
            } else if (typeof spiralMemory.searchMemories === 'function') {
                const searchResults = await Promise.all(supportedTypes.map((type) => spiralMemory.searchMemories(type, type, null, limit + offset)));
                memories = searchResults.flat();
            }
        } catch (err) {
            console.error('fetchCompanionMemories failed:', err);
            memories = [];
        }

        const companionId = clientInfo?.companion?.id;
        const playerId = clientInfo?.player?.id;
        const sessionId = clientInfo?.id;

        const filtered = memories.filter((memory) => {
            const content = memory?.content || {};
            if (companionId && content.companionId === companionId) return true;
            if (sessionId && content.sessionId === sessionId) return true;
            if (playerId && content.playerId === playerId) return true;
            return false;
        });

        const sorted = filtered.sort((a, b) => {
            const ta = new Date(a.createdAt || a.timestamp || 0).getTime();
            const tb = new Date(b.createdAt || b.timestamp || 0).getTime();
            return tb - ta;
        });

        const sliced = sorted.slice(offset, offset + limit);
        return sliced.map((memory) => ({
            id: memory.id,
            type: memory.type,
            depth: memory.depth,
            createdAt: memory.createdAt || memory.timestamp,
            content: memory.content,
        }));
    }

    async handleRequestMemories(ws, clientInfo) {
        try {
            const memories = await this.fetchCompanionMemories(clientInfo, 20, 0);
            if (memories.length) {
                this.sendToClient(ws, 'companion:memories', { items: memories });
                return;
            }
        } catch (err) {
            console.error('handleRequestMemories fallback:', err);
        }
        try {
            const { rows } = await pool.query(
                `SELECT data FROM game_events WHERE session_id = $1 AND event_type IN ($2,$3,$4,$5,$6,$7) ORDER BY created_at DESC LIMIT 20`,
                [clientInfo.id, 'companion:mood_change', 'world:event', 'world:generated_encounter', 'companion:level_up', 'companion:ai_message', 'ai:holistic_response']
            );
            const memories = rows.map((r) => r.data).reverse();
            this.sendToClient(ws, 'companion:memories', { items: memories });
        } catch {
            // fallback to buffer
            const all = (clientInfo.eventBuffer || []).filter((m) => (
                m.type === 'companion:mood_change' || m.type === 'world:event' || m.type === 'world:generated_encounter' || m.type === 'companion:level_up' || m.type === 'companion:ai_message' || m.type === 'ai:holistic_response'
            )).slice(-20);
            this.sendToClient(ws, 'companion:memories', { items: all });
        }
    }

    async handleRequestMemoriesPage(ws, clientInfo, page = 1, size = 20, types) {
        const p = Math.max(1, Number(page)||1);
        const s = Math.max(1, Math.min(100, Number(size)||20));
        const offset = (p-1)*s;
        const defaultTypes = ['companion:mood_change','world:event','world:generated_encounter','companion:level_up','companion:ai_message','ai:holistic_response'];
        const et = Array.isArray(types) && types.length ? types.filter((t) => typeof t === 'string') : defaultTypes;
        try {
            const items = await this.fetchCompanionMemories(clientInfo, s, offset, et);
            if (items.length) {
                this.sendToClient(ws, 'companion:memories_page', { items, page: p, size: s, types: et });
                return;
            }
        } catch (e) {
            console.error('handleRequestMemoriesPage spiral fetch failed:', e);
        }
        try {
            const { rows } = await pool.query(
                `SELECT data FROM game_events WHERE session_id = $1 AND event_type = ANY($2) ORDER BY created_at DESC OFFSET $3 LIMIT $4`,
                [clientInfo.id, et, offset, s]
            );
            const items = rows.map((r) => r.data).reverse();
            this.sendToClient(ws, 'companion:memories_page', { items, page: p, size: s, types: et });
        } catch (e) {
            this.sendToClient(ws, 'companion:memories_page', { items: [], page: p, size: s, types: Array.isArray(types)? types: undefined });
        }
    }

    handleWebMessage(ws, type, payload, clientInfo) {
        // Maintain compatibility with existing web demo; also support full game messages
        switch (type) {
            case 'quest:accept':
                if (payload.questId) this.metrics.questsAccepted++;
                this.sendToClient(ws, 'npc:spawn', {
                    npc: { name: 'Eira', mood: 'curious', hint: 'Stay alert.' }
                });
                this.sendToClient(ws, 'companion:update', {
                    mood: 'focused',
                    bond: 0.62
                });
                break;

            case 'quest:complete':
                if (payload.questId) this.metrics.questsCompleted++;
                const tokenId = `${Date.now().toString(36)}${this.randomBytesHex(2)}`;
                let provenance = null;
                try {
                    const { getAutonomousSpriteManifest, getAutonomousGenome } = require('./VisualAutonomyEngine.cjs');
                    const man = getAutonomousSpriteManifest();
                    const gen = getAutonomousGenome();
                    provenance = { spriteHash: man?.hash, spriteSheet: man?.sheet, genomeId: gen?.id, genomeSeed: gen?.seed };
                } catch {}
                this.sendToClient(ws, 'item:minted', {
                    tokenId,
                    metadata: { name: 'Demo Item', provenance }
                });
                this.metrics.mints++;
                try {
                    eventBus.emit('spiral_memory:store', { type: 'visual_provenance', memory: { tokenId, provenance }, timestamp: Date.now() });
                } catch {}
                // Persist to inventory if player exists
                try {
                    if (clientInfo?.player?.id) {
                        this.addInventoryItem(clientInfo.player.id, { id: tokenId, name: 'Demo Item', type: 'mint', quantity: 1, metadata: { provenance } }).catch(()=>{});
                    }
                } catch {}
                break;

            case 'quest:new':
                const newQuest = this.makeQuest();
                this.metrics.questsOffered++;
                this.sendToClient(ws, 'quest:offer', { quest: newQuest });
                break;

            case 'ping':
                this.sendToClient(ws, 'pong', { t: Date.now() });
                break;

            // Full game support (web clients can opt-in by sending game:connect)
            case 'game:connect': {
                // Upgrade this web client into a full game session (mobile-like state)
                if (!clientInfo.player || !clientInfo.companion) {
                    clientInfo.isMobile = true; // grant full game message support
                    this.initializeMobileClient(ws, clientInfo);
                } else if (payload && payload.lastEventId) {
                    this.replayEvents(ws, clientInfo, payload.lastEventId);
                }
                break;
            }
            case 'companion:feed': {
                const enrichedPayload = { ...payload, clientId: clientInfo.id, playerId: clientInfo.player?.id, companionId: clientInfo.companion?.id, ws };
                this.handleCompanionFeed(enrichedPayload, clientInfo);
                break;
            }
            case 'companion:play': {
                const enrichedPayload = { ...payload, clientId: clientInfo.id, playerId: clientInfo.player?.id, companionId: clientInfo.companion?.id, ws };
                this.handleCompanionPlay(enrichedPayload, clientInfo);
                break;
            }
            case 'world:explore': {
                const enrichedPayload = { ...payload, clientId: clientInfo.id, playerId: clientInfo.player?.id, companionId: clientInfo.companion?.id, ws };
                this.handleWorldExplore(enrichedPayload, clientInfo);
                break;
            }
            case 'world:list_players': {
                this.handleListPlayers(ws, clientInfo);
                break;
            }
            case 'companion:chat': {
                const enrichedPayload = { ...payload, clientId: clientInfo.id, playerId: clientInfo.player?.id, companionId: clientInfo.companion?.id, ws };
                this.handleCompanionChat(enrichedPayload, clientInfo);
                break;
            }
            case 'spectate:area': {
                const area = String(payload?.area || clientInfo?.player?.currentArea || 'town');
                this.addAreaSpectator(area, ws);
                this.sendToClient(ws, 'spectate:subscribed', { area });
                break;
            }
            case 'spectate:off': {
                this.removeSpectator(ws);
                this.sendToClient(ws, 'spectate:unsubscribed', {});
                break;
            }
            case 'spectate:battle': {
                const key = this.resolveBattleKeyFromPayload(payload);
                if (key) { this.addBattleSpectator(key, ws); this.sendToClient(ws, 'spectate:subscribed', { battleKey: key }); }
                break;
            }
            case 'ability:use': {
                this.handleAbilityUse(ws, clientInfo, String(payload?.abilityId || ''));
                break;
            }
            case 'sanctuary:get': {
                this.handleSanctuaryGet(ws, clientInfo);
                break;
            }
            case 'sanctuary:ascend': {
                this.handleSanctuaryAscend(ws, clientInfo);
                break;
            }
            case 'battle:queue_join': {
                this.handleBattleQueueJoin(ws, clientInfo);
                break;
            }
            case 'battle:queue_leave': {
                this.handleBattleQueueLeave(ws, clientInfo);
                break;
            }
            case 'battle:accept': {
                this.handleBattleAccept(ws, clientInfo);
                break;
            }
            case 'battle:decline': {
                this.handleBattleDecline(ws, clientInfo);
                break;
            }
            case 'battle:challenge': {
                this.handleBattleChallenge(ws, clientInfo, payload?.opponentSessionId);
                break;
            }
            case 'ladder:get': {
                this.handleLadderGet(ws).catch(()=>{});
                break;
            }
            case 'spectate:battles:list': {
                const area = payload && payload.area ? String(payload.area) : null;
                const items = this.listBattles(area);
                this.sendToClient(ws, 'spectate:battles:list', { area, items, ts: Date.now() });
                break;
            }
            case 'game:request_memories': {
                this.handleRequestMemories(ws, clientInfo);
                break;
            }
            case 'inventory:list': {
                this.handleInventoryList(ws, clientInfo).catch(()=>{});
                break;
            }
            case 'inventory:add': {
                this.handleInventoryAdd(ws, clientInfo, payload || {}).catch(()=>{});
                break;
            }
            case 'inventory:remove': {
                this.handleInventoryRemove(ws, clientInfo, String(payload?.itemId || payload?.id || '')).catch(()=>{});
                break;
            }
            case 'ui:telemetry': {
                const enriched = { ...payload, clientId: clientInfo.id, playerId: clientInfo.player?.id, ws };
                this.handleUiTelemetry(enriched, clientInfo).catch(()=>{});
                break;
            }
        }
    }

    handleCompanionFeed(data, clientInfo) {
        const companion = clientInfo.companion;
        if (!companion) return;

        const { foodType } = data;
        
        // Update companion stats
        const foodEffects = {
            apple: { hunger: 20, happiness: 5, energy: 2 },
            bread: { hunger: 15, happiness: 3, energy: 1 }
        };

        const effect = foodEffects[foodType] || foodEffects.apple;
        
        companion.hunger = Math.min(100, companion.hunger + effect.hunger);
        companion.happiness = Math.min(100, companion.happiness + effect.happiness);
        companion.energy = Math.min(100, companion.energy + effect.energy);
        companion.lastInteraction = Date.now();

        this.updateCompanionMood(companion);
        // Persist
        this.upsertCompanion(companion);
        this.metrics.companionInteractions++;

        // Send immediate response
        this.sendToClient(data.ws, 'companion:mood_change', {
            mood: companion.mood,
            stats: {
                hunger: companion.hunger,
                happiness: companion.happiness,
                energy: companion.energy
            },
            message: `${companion.name} enjoyed the ${foodType}!`
        });

        // Publish to event bus for resonance and memory
        try {
            eventBus.emit('companion:mood_change', { companionId: companion.id, mood: companion.mood, ws: data.ws });
            eventBus.emit('spiral_memory:store', {
                type: 'companion_memory',
                companionId: companion.id,
                memory: { kind: 'feed', foodType, mood: companion.mood },
                timestamp: Date.now()
            });
            eventBus.emit('game:telemetry', { event: 'companion:feed', companionId: companion.id, playerId: clientInfo.player?.id, sessionId: clientInfo.id, ts: Date.now() });
        } catch {}

        // Sanctuary progression
        this.awardSanctuaryXp(clientInfo, 10);

        // Request AI response from consciousness system
        eventBus.emit('response_synthesis_requested', {
            originalMessage: `Player fed ${companion.name} a ${foodType}`,
            context: 'companion_feeding',
            companion,
            ws: data.ws,
            sessionId: clientInfo.id
        });
    }

    handleCompanionPlay(data, clientInfo) {
        const companion = clientInfo.companion;
        if (!companion) return;

        const { gameType } = data;
        
        companion.energy = Math.max(0, companion.energy - 10);
        companion.happiness = Math.min(100, companion.happiness + 15);
        companion.experience += 5;
        companion.lastInteraction = Date.now();

        this.updateCompanionMood(companion);
        // Persist
        this.upsertCompanion(companion);
        this.metrics.companionInteractions++;

        this.sendToClient(data.ws, 'companion:mood_change', {
            mood: companion.mood,
            stats: {
                hunger: companion.hunger,
                happiness: companion.happiness,
                energy: companion.energy
            },
            message: `${companion.name} had fun playing ${gameType}!`
        });

        try {
            eventBus.emit('companion:mood_change', { companionId: companion.id, mood: companion.mood, ws: data.ws });
            eventBus.emit('spiral_memory:store', {
                type: 'companion_memory',
                companionId: companion.id,
                memory: { kind: 'play', gameType, mood: companion.mood },
                timestamp: Date.now()
            });
            eventBus.emit('game:telemetry', { event: 'companion:play', companionId: companion.id, playerId: clientInfo.player?.id, sessionId: clientInfo.id, ts: Date.now() });
        } catch {}

        // Sanctuary progression
        this.awardSanctuaryXp(clientInfo, 8);

        // Check for level up
        if (companion.experience >= companion.level * 100) {
            this.levelUpCompanion(companion, data.ws);
        }
    }

    handleWorldExplore(data, clientInfo) {
        const player = clientInfo.player;
        const companion = clientInfo.companion;
        if (!player) return;

        const { area } = data;
        player.currentArea = area;
        
        if (companion) {
            companion.energy = Math.max(0, companion.energy - 5);
            this.upsertCompanion(companion);
        }

        // Update presence mapping
        try {
            for (const [a, set] of this.presence) { set.delete(clientInfo.id); }
            if (!this.presence.has(area)) this.presence.set(area, new Set());
            this.presence.get(area).add(clientInfo.id);
        } catch {}

        // Generate encounter
        this.generateEncounter(area, player, companion, data.ws);
        this.metrics.explorationEvents++;

        try {
            eventBus.emit('spiral_memory:store', {
                type: 'companion_memory',
                companionId: companion?.id,
                memory: { kind: 'explore', area },
                timestamp: Date.now()
            });
            eventBus.emit('game:telemetry', { event: 'world:explore', area, companionId: companion?.id, playerId: player?.id, sessionId: clientInfo.id, ts: Date.now() });
        } catch {}

        // Sanctuary progression
        this.awardSanctuaryXp(clientInfo, 5);
    }

    generateEncounter(area, player, companion, ws) {
        const encounters = {
            town: [
                {
                    type: 'npc',
                    name: 'Wise Elder',
                    emoji: '👴',
                    dialogue: `Your companion ${companion?.name} grows stronger with each kind act.`
                }
            ],
            forest: [
                {
                    type: 'creature',
                    name: 'Forest Sprite',
                    emoji: '🧚',
                    dialogue: `The trees remember ${companion?.name}'s laughter.`
                }
            ]
        };

        const areaEncounters = encounters[area] || encounters.town;
        const metrics = this.getUniversalMetricsSnapshot();
        const encounter = this.deterministicPick(
            areaEncounters,
            `encounter:${area}:${player?.id || ''}:${metrics.timestamp || ''}`
        ) || areaEncounters[0];

        const evt = {
            type: 'encounter',
            area,
            encounter,
            timestamp: Date.now()
        };
        this.sendToClient(ws, 'world:event', evt);
        try { this.broadcastToAreaSpectators(area, 'world:event', evt); } catch {}

        // Also request advanced encounter from the reality generator path
        try {
            eventBus.emit('game:generate_encounter', {
                area,
                playerLevel: player?.level || 1,
                companionPersonality: companion?.personality || {},
                ws
            });
        } catch {}
    }

    // Consciousness system event handlers
    handleSystemTick(data) {
        // Process companion decay and world updates
        if (data.ts % 10000 < 100) { // Every ~10 seconds
            this.processCompanionDecay();
        }
    }

    handleHolisticResponse(data) {
        if (data.ws && data.response) {
            this.sendToClient(data.ws, 'ai:holistic_response', {
                response: data.response,
                context: 'consciousness',
                timestamp: Date.now()
            });
            this.metrics.aiResponses++;
        }
    }

    handleGeneratedEncounter(data) {
        try {
            if (data.ws) {
                this.sendToClient(data.ws, 'world:generated_encounter', data);
                return;
            }
            // Broadcast to all mobile clients if no specific ws
            for (const [ws, ci] of this.clients) {
                if (ci.isMobile && ws.readyState === 1) this.sendToClient(ws, 'world:generated_encounter', data);
            }
        } catch {}
    }

    handleCompanionAIResponse(data) {
        if (data.ws && data.response) {
            this.sendToClient(data.ws, 'companion:ai_message', {
                companionId: data.companionId,
                message: data.response,
                mood: data.mood,
                type: data.type,
                timestamp: Date.now()
            });
            this.metrics.aiResponses++;
        }
    }

    handleCompanionChat(data, clientInfo) {
        const message = (data && data.message) ? String(data.message) : (data?.payload?.message || '');
        if (!message || !clientInfo?.companion) return;
        // Echo user message into chat log for UI clients
        try { this.sendToClient(data.ws, 'companion:chat_user', { message, timestamp: Date.now() }); } catch {}
        // Store memory
        try {
            eventBus.emit('spiral_memory:store', {
                type: 'companion_memory',
                companionId: clientInfo.companion.id,
                memory: { kind: 'chat', message },
                timestamp: Date.now()
            });
        } catch {}
        // Request AI response via CompanionAI path
        try {
            eventBus.emit('companion:generate_response', {
                companion: clientInfo.companion,
                context: { action: 'chatting', details: { message } },
                ws: data.ws
            });
        } catch {}
    }

    // Helper methods
    getUniversalMetricsSnapshot() {
        const metrics = universalRuntime.metrics || {};
        return {
            resonance: metrics.resonance || null,
            heart: metrics.heart || null,
            emotion: metrics.emotion || null,
            timestamp: metrics.timestamp || null,
        };
    }

    normalizedHash(key) {
        return hashToUnit(`${key}`);
    }

    deterministicPick(list, key) {
        if (!Array.isArray(list) || list.length === 0) return null;
        const idx = Math.floor(this.normalizedHash(key) * list.length) % list.length;
        return list[idx];
    }

    deterministicRange(key, min, max) {
        if (max <= min) return min;
        const unit = this.normalizedHash(key);
        return min + Math.floor(unit * (max - min + 1));
    }

    metricValue(value, fallback) {
        return (typeof value === 'number' && Number.isFinite(value)) ? value : fallback;
    }

    deriveCompanionProfile(clientId, playerId) {
        const metrics = this.getUniversalMetricsSnapshot();
        const timestamp = metrics.timestamp || '';
        const baseKey = `${clientId}:${playerId}:${timestamp}`;

        const resonanceCoherence = clamp01(this.metricValue(metrics.resonance?.networkCoherence, 0.82));
        const harmonicAlignment = clamp01(this.metricValue(metrics.resonance?.harmonicAlignment, resonanceCoherence));
        const heartCoherence = clamp01(this.metricValue(metrics.heart?.coherenceRatio, 0.76));
        const empathyAverage = clamp01(this.metricValue(metrics.heart?.empathyAverage, heartCoherence));
        const emotionalStrength = clamp01(this.metricValue(metrics.emotion?.entanglementStrength, 0.78));
        const quantumCoherence = clamp01(this.metricValue(metrics.emotion?.quantumCoherence, emotionalStrength));

        const hunger = clamp(15, 95, Math.round(55 - resonanceCoherence * 20 - empathyAverage * 10 + (1 - this.normalizedHash(`hunger:${baseKey}`)) * 20));
        const energy = clamp(20, 100, Math.round(50 + heartCoherence * 40 + this.normalizedHash(`energy:${baseKey}`) * 10));
        const happiness = clamp(30, 100, Math.round(60 + emotionalStrength * 25 + harmonicAlignment * 10 + this.normalizedHash(`happiness:${baseKey}`) * 5));

        const trait = (label, base) => clamp01(base + (this.normalizedHash(`${label}:${baseKey}`) - 0.5) * 0.2);
        const personality = {
            playfulness: trait('playfulness', 0.45 + resonanceCoherence * 0.3),
            curiosity: trait('curiosity', 0.5 + harmonicAlignment * 0.25),
            loyalty: trait('loyalty', 0.5 + empathyAverage * 0.3),
            intelligence: trait('intelligence', 0.5 + quantumCoherence * 0.25),
        };

        const names = ['Pixel', 'Nova', 'Echo', 'Sage', 'Luna'];
        const name = this.deterministicPick(names, `name:${baseKey}`) || names[0];

        return {
            name,
            hunger,
            energy,
            happiness,
            personality,
        };
    }

    createPlayer(clientId) {
        return {
            id: `player_${clientId}`,
            username: `Player_${clientId.slice(-4)}`,
            level: 1,
            coins: 100,
            currentArea: 'town',
            inventory: [
                { id: 'apple', name: 'Apple', type: 'food', quantity: 3 },
                { id: 'ball', name: 'Ball', type: 'toy', quantity: 1 }
            ],
            joinedAt: Date.now()
        };
    }

    createCompanion(clientId, playerId) {
        const profile = this.deriveCompanionProfile(clientId, playerId);

        const companion = {
            id: `companion_${clientId}`,
            playerId,
            name: profile.name,
            level: 1,
            experience: 0,
            mood: 'neutral',
            hunger: profile.hunger,
            energy: profile.energy,
            happiness: profile.happiness,
            personality: profile.personality,
            lastInteraction: Date.now(),
            createdAt: Date.now()
        };

        this.updateCompanionMood(companion);
        return companion;
    }

    updateCompanionMood(companion) {
        const { hunger, energy, happiness } = companion;
        
        if (happiness > 80 && energy > 60) {
            companion.mood = 'happy';
        } else if (hunger < 30) {
            companion.mood = 'hungry';
        } else if (energy < 20) {
            companion.mood = 'sleepy';
        } else if (happiness < 40) {
            companion.mood = 'sad';
        } else {
            companion.mood = 'neutral';
        }

        this.metrics.moodChanges++;
    }

    levelUpCompanion(companion, ws) {
        companion.level++;
        companion.experience = 0;
        
        this.sendToClient(ws, 'companion:level_up', {
            newLevel: companion.level,
            message: `${companion.name} reached level ${companion.level}!`
        });
    }

    processCompanionDecay() {
        const now = Date.now();
        
        for (const companion of this.companions.values()) {
            const timeSinceLastInteraction = now - companion.lastInteraction;
            const hoursElapsed = timeSinceLastInteraction / (1000 * 60 * 60);

            if (hoursElapsed > 0.1) { // Decay after 6 minutes
                const decayAmount = Math.floor(hoursElapsed * 2);
                
                companion.hunger = Math.max(0, companion.hunger - decayAmount);
                companion.energy = Math.max(0, companion.energy - Math.floor(decayAmount * 0.5));
                companion.happiness = Math.max(0, companion.happiness - Math.floor(decayAmount * 0.3));

                this.updateCompanionMood(companion);
            }

            // Prune expired buffs
            if (companion.buffs) {
                let changed = false;
                for (const [k, b] of Object.entries(companion.buffs)) {
                    if (b && b.expiresAt && now >= b.expiresAt) { delete companion.buffs[k]; changed = true; }
                }
                if (changed) {
                    try { this.upsertCompanion(companion); } catch {}
                }
            }
        }
    }

    broadcastDirectorTick() {
        const directorState = this.getDirectorState();
        const consciousnessState = this.getConsciousnessState();
        
        for (const [ws, clientInfo] of this.clients) {
            if (ws.readyState === 1) {
                if (clientInfo.isMobile) {
                    // Decimate to configured Hz for mobile clients
                    const now = Date.now();
                    if (now - clientInfo.lastConsciousnessSentAt >= this.mobileHeartbeatMinInterval && ws.bufferedAmount < 512 * 1024) {
                        this.sendToClient(ws, 'consciousness:heartbeat', {
                            ...consciousnessState,
                            timestamp: now
                        });
                        clientInfo.lastConsciousnessSentAt = now;
                    }
                } else {
                    // Send director tick to web clients (compatibility)
                    this.sendToClient(ws, 'director:tick', {
                        t: Date.now(),
                        state: directorState
                    });
                }
            }
        }
        
        this.metrics.ticksSent++;
    }

    getDirectorState() {
        const metrics = this.getUniversalMetricsSnapshot();
        const coherence = clamp01(this.metricValue(metrics.heart?.coherenceRatio, 0.86));
        const resonance = clamp01(this.metricValue(metrics.resonance?.networkCoherence, 0.88));
        return {
            coherence: Number(coherence.toFixed(3)),
            resonance: Number(resonance.toFixed(3))
        };
    }

    getConsciousnessState() {
        const metrics = this.getUniversalMetricsSnapshot();
        const director = this.getDirectorState();
        const awareness = clamp01(this.metricValue(metrics.heart?.empathyAverage, director.coherence));
        const integration = clamp01(this.metricValue(metrics.emotion?.entanglementStrength, director.resonance));
        return {
            isActive: true,
            coherence: director.coherence,
            awareness: Number(awareness.toFixed(3)),
            integration: Number(integration.toFixed(3)),
            activeModules: ['GameIntegration', 'CompanionAI', 'SpiralMemory']
        };
    }

    getWorldState() {
        return {
            currentArea: 'town',
            weather: 'sunny',
            timeOfDay: 'day',
            discoveredAreas: ['town'],
            activeEvents: []
        };
    }

    // Sanctuary helpers
    getOrCreateSanctuary(playerId) {
        let s = this.sanctuaries.get(playerId);
        if (!s) {
            s = { id: `sanct_${playerId}`, playerId, level: 1, xp: 0, ascended: false, legendary: false, legendary_at: null };
            this.sanctuaries.set(playerId, s);
            this.upsertSanctuary(s);
        }
        return s;
    }

    async upsertSanctuary(sanctuary) {
        try {
            await pool.query(`INSERT INTO game_sanctuaries (id, player_id, level, xp, ascended, legendary, legendary_at, updated_at)
                              VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
                              ON CONFLICT (id) DO UPDATE SET level=EXCLUDED.level, xp=EXCLUDED.xp, ascended=EXCLUDED.ascended, legendary=EXCLUDED.legendary, legendary_at=EXCLUDED.legendary_at, updated_at=NOW()`,
                [sanctuary.id, sanctuary.playerId, sanctuary.level, sanctuary.xp, sanctuary.ascended, sanctuary.legendary, sanctuary.legendary_at]);
        } catch {}
    }

    handleSanctuaryGet(ws, clientInfo) {
        const s = this.getOrCreateSanctuary(clientInfo.player.id);
        this.sendToClient(ws, 'sanctuary:state', s);
    }

    awardSanctuaryXp(clientInfo, amount = 5) {
        const s = this.getOrCreateSanctuary(clientInfo.player.id);
        s.xp = Math.max(0, (s.xp || 0) + Math.floor(amount));
        const threshold = this.sanctuaryLevelThreshold(s.level);
        if (s.xp >= threshold) { s.xp -= threshold; s.level += 1; }
        this.upsertSanctuary(s);
        this.sendToClient(clientInfo.ws, 'sanctuary:state', s);
    }

    sanctuaryLevelThreshold(level) {
        return this.sanctuaryBaseThreshold + (Math.max(1, level) - 1) * this.sanctuaryPerLevelIncrement;
    }

    handleSanctuaryAscend(ws, clientInfo) {
        const s = this.getOrCreateSanctuary(clientInfo.player.id);
        const c = clientInfo.companion;
        const eligible = s.level >= 5 && (c?.level || 1) >= 5 && !s.ascended; // simple threshold
        if (!eligible) {
            this.sendToClient(ws, 'sanctuary:ascend_denied', { reason: 'Requirements not met', required: { sanctuaryLevel: 5, companionLevel: 5 } });
            return;
        }
        s.ascended = true;
        s.legendary = true;
        s.legendary_at = new Date().toISOString();
        this.upsertSanctuary(s);
        // Transform companion to legendary
        if (c) {
            c.tier = 'legendary';
            c.abilities = ['crystal_aegis', 'resonant_strike'];
            this.upsertCompanion(c);
            this.sendToClient(ws, 'companion:legendary', { abilities: c.abilities, message: `${c.name} has ascended to Legendary!` });
        }
        this.sendToClient(ws, 'sanctuary:ascended', s);
        try { eventBus.emit('notify:push', { kind: 'sanctuary_ascended', sessionId: clientInfo.id, title: 'Legendary Unlocked', body: `${c?.name || 'Companion'} ascended to Legendary!` }); } catch {}
        eventBus.emit('spiral_memory:store', { type: 'companion_memory', companionId: c?.id, memory: { kind: 'ascend', sanctuaryLevel: s.level }, timestamp: Date.now() });
    }

    // Presence and nearby players
    handleListPlayers(ws, clientInfo) {
        const area = clientInfo.player?.currentArea || 'town';
        const set = this.presence.get(area) || new Set();
        const others = Array.from(set).filter((sid) => sid !== clientInfo.id);
        this.sendToClient(ws, 'world:nearby_players', { area, players: others.map((sid) => ({ sessionId: sid })) });
    }

    // Battle matchmaking and resolution
    handleBattleQueueJoin(ws, clientInfo) {
        if (this.activeBattles.has(clientInfo.id)) return; // already in battle
        if (!this.battleQueue.includes(clientInfo.id)) {
            this.battleQueue.push(clientInfo.id);
        }
        this.matchmake();
        this.sendToClient(ws, 'battle:queued', { position: this.battleQueue.indexOf(clientInfo.id) });
    }

    handleBattleQueueLeave(ws, clientInfo) {
        this.battleQueue = this.battleQueue.filter((sid) => sid !== clientInfo.id);
        this.sendToClient(ws, 'battle:unqueued', {});
    }

    handleBattleChallenge(ws, clientInfo, opponentSessionId) {
        if (!opponentSessionId) return;
        const opp = Array.from(this.clients.values()).find((ci) => ci.id === opponentSessionId);
        if (!opp || this.activeBattles.has(clientInfo.id) || this.activeBattles.has(opponentSessionId)) return;
        // Register a pending battle
        this.activeBattles.set(clientInfo.id, opponentSessionId);
        this.activeBattles.set(opponentSessionId, clientInfo.id);
        this.sendToClient(opp.ws, 'battle:challenge', { from: clientInfo.id });
        try { eventBus.emit('notify:push', { kind: 'battle_challenge', sessionId: opp.id, title: 'Battle Challenge', body: 'You have a new challenge in the Arena.' }); } catch {}
        this.sendToClient(ws, 'battle:challenge_sent', { to: opponentSessionId });
    }

    handleBattleAccept(ws, clientInfo) {
        const oppId = this.activeBattles.get(clientInfo.id);
        if (!oppId) return;
        const opp = Array.from(this.clients.values()).find((ci) => ci.id === oppId);
        if (!opp) return;
        const now = Date.now();
        const lastA = this.lastBattleAt.get(clientInfo.id) || 0;
        const lastB = this.lastBattleAt.get(oppId) || 0;
        if (now - lastA < this.battleCooldownMs || now - lastB < this.battleCooldownMs) {
            const waitMs = Math.max(0, this.battleCooldownMs - Math.min(now - lastA, now - lastB));
            this.sendToClient(ws, 'battle:cooldown', { waitMs });
            try { this.sendToClient(opp.ws, 'battle:cooldown', { waitMs }); } catch {}
            return;
        }
        // Run real round engine
        const key = this.getBattleKey(clientInfo.id, opp.id);
        (async () => {
            try { this.broadcastToBattleSpectators(key, 'spectate:battle:event', { kind: 'start', battleKey: key, a: clientInfo.id, b: opp.id, ts: now }); } catch {}
            const outcome = await this.runBattleRounds(clientInfo, opp, key);
            const result = outcome.result;
            this.recordBattle(result).catch(() => {});
            this.sendToClient(ws, 'battle:result', result.self);
            this.sendToClient(opp.ws, 'battle:result', result.opponent);
            try { this.broadcastToBattleSpectators(key, 'spectate:battle:event', { kind: 'result', battleKey: key, result, ts: Date.now() }); } catch {}
            // Cleanup
            this.activeBattles.delete(clientInfo.id);
            this.activeBattles.delete(oppId);
            this.lastBattleAt.set(clientInfo.id, Date.now());
            this.lastBattleAt.set(oppId, Date.now());
        })();
    }

    handleBattleDecline(ws, clientInfo) {
        const oppId = this.activeBattles.get(clientInfo.id);
        if (oppId) {
            const opp = Array.from(this.clients.values()).find((ci) => ci.id === oppId);
            if (opp) this.sendToClient(opp.ws, 'battle:declined', { by: clientInfo.id });
            this.activeBattles.delete(clientInfo.id);
            this.activeBattles.delete(oppId);
        }
        this.sendToClient(ws, 'battle:declined', {});
    }

    matchmake() {
        while (this.battleQueue.length >= 2) {
            const a = this.battleQueue.shift();
            const b = this.battleQueue.shift();
            const ca = Array.from(this.clients.values()).find((ci) => ci.id === a);
            const cb = Array.from(this.clients.values()).find((ci) => ci.id === b);
            if (!ca || !cb) continue;
            const now = Date.now();
            const lastA = this.lastBattleAt.get(a) || 0;
            const lastB = this.lastBattleAt.get(b) || 0;
            if (now - lastA < this.battleCooldownMs || now - lastB < this.battleCooldownMs) {
                // Requeue at end if on cooldown
                if (now - lastA < this.battleCooldownMs) this.battleQueue.push(a);
                if (now - lastB < this.battleCooldownMs) this.battleQueue.push(b);
                continue;
            }
            this.activeBattles.set(a, b);
            this.activeBattles.set(b, a);
            this.sendToClient(ca.ws, 'battle:match_found', { opponent: b });
            this.sendToClient(cb.ws, 'battle:match_found', { opponent: a });
            const key = this.getBattleKey(a, b);
            const areaA = ca.player?.currentArea || 'town';
            const areaB = cb.player?.currentArea || 'town';
            const startedAt = Date.now();
            const seed = this.normalizedHash(`battle:${key}:${startedAt}`);
            this.battlesMeta.set(key, { a, b, areas: [areaA, areaB], startedAt, seed });
            const payload = { kind: 'match_found', battleKey: key, a, b, areas: [areaA, areaB], startedAt };
            try { this.broadcastToAreaSpectators(areaA, 'spectate:battle:event', payload); } catch {}
            if (areaB !== areaA) { try { this.broadcastToAreaSpectators(areaB, 'spectate:battle:event', payload); } catch {} }
        }
    }

    resolveBattle(ciA, ciB) {
        const dir = this.getDirectorState();
        const key = this.getBattleKey(ciA.id, ciB.id);
        const meta = this.battlesMeta.get(key) || {};
        const seedBase = meta.seed ?? this.normalizedHash(`battle:${key}:${meta.startedAt || 0}`);
        const randomScore = (ci) => this.deterministicRange(`battle:score:${ci.id}:${seedBase}`, 0, 49);
        const abilityBoost = (c) => {
            if (!c || c.tier !== 'legendary') return 0;
            const abilities = c.abilities || [];
            let boost = 40; // baseline legendary bonus
            if (abilities.includes('crystal_aegis')) boost += 20;
            if (abilities.includes('resonant_strike')) boost += Math.floor((dir.coherence || 0.8) * 20);
            return boost;
        };
        const buffBoost = (c) => {
            if (!c || !c.buffs) return 0;
            let v = 0;
            if (c.buffs.attack) v += Number(c.buffs.attack.value || 0);
            if (c.buffs.defense) v += Math.floor(Number(c.buffs.defense.value || 0) / 2); // defense contributes less to score
            return v;
        };
        const score = (ci) => {
            const c = ci.companion || {};
            const base = (c.level || 1) * 10 + (c.happiness || 0) + (c.energy || 0);
            return base + abilityBoost(c) + buffBoost(c) + randomScore(ci);
        };
        const sA = score(ciA);
        const sB = score(ciB);
        const tieBreaker = this.normalizedHash(`battle:tiebreak:${key}:${seedBase}`) >= 0.5;
        const winner = sA === sB ? (tieBreaker ? ciA : ciB) : (sA > sB ? ciA : ciB);
        const loser = winner === ciA ? ciB : ciA;
        const pct = this.battleXpTransferPct;
        const transfer = Math.max(0, Math.floor((loser.companion?.experience || 0) * pct));
        if (transfer > 0) {
            loser.companion.experience = Math.max(0, (loser.companion.experience || 0) - transfer);
            winner.companion.experience = (winner.companion.experience || 0) + transfer;
            this.updateCompanionMood(winner.companion);
            this.updateCompanionMood(loser.companion);
            this.upsertCompanion(winner.companion);
            this.upsertCompanion(loser.companion);
        }
        // Award sanctuary XP to winner
        this.awardSanctuaryXp(winner, 20);
        const winnerScore = winner === ciA ? sA : sB;
        const loserScore = loser === ciA ? sA : sB;
        const payload = {
            winner: winner.id,
            loser: loser.id,
            xpTransferred: transfer,
            winnerScore,
            loserScore,
        };
        return {
            self: { ...payload, you: 'winner', isWinner: true },
            opponent: { ...payload, you: 'loser', isWinner: false },
        };
    }

    async runBattleRounds(ciA, ciB, key) {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const state = {
            a: { id: ciA.id, ws: ciA.ws, comp: ciA.companion, energy: Math.max(0, ciA.companion?.energy || 50), hp: 100, cooldowns: {}, buffs: {} },
            b: { id: ciB.id, ws: ciB.ws, comp: ciB.companion, energy: Math.max(0, ciB.companion?.energy || 50), hp: 100, cooldowns: {}, buffs: {} },
            round: 0,
            maxRounds: 5,
        };
        const abilities = this.abilities;
        const dir = () => this.getDirectorState();
        const now = () => Date.now();
        const canUse = (side, ab) => (side.energy >= ab.energyCost) && (!side.cooldowns[ab.id] || side.cooldowns[ab.id] <= now());
        const choose = (side) => {
            const opts = Object.values(abilities).filter((ab) => canUse(side, { ...ab, id: ab.id }));
            if (!opts.length) return null;
            const attack = opts.filter((ab) => ab.id === 'resonant_strike');
            if (attack.length && state.b.hp > 30 && side === state.a) return attack[0];
            if (attack.length && state.a.hp > 30 && side === state.b) return attack[0];
            const idx = Math.floor(this.normalizedHash(`ability:${side.id}:${state.round}:${key}`) * opts.length) % opts.length;
            return opts[idx];
        };
        const applyAbility = (actor, target, ab) => {
            actor.energy = Math.max(0, actor.energy - (ab.energyCost || 0));
            actor.cooldowns[ab.id] = now() + (ab.cooldownMs || 1000);
            // buffs
            if (ab.buff && ab.buff.kind) {
                actor.buffs[ab.buff.kind] = { value: ab.buff.value || 0, until: now() + (ab.buff.durationMs || 5000) };
            }
            if (ab.groupBuff && ab.groupBuff.kind) {
                // group buff simplified: apply to actor too
                actor.buffs[ab.groupBuff.kind] = { value: ab.groupBuff.value || 0, until: now() + (ab.groupBuff.durationMs || 5000) };
            }
            // damage model
            const d = dir();
            const base = this.deterministicRange(`damage:${actor.id}:${target.id}:${state.round}:${key}`, 10, 17);
            const atk = (actor.buffs.attack?.value || 0);
            const defRed = Math.floor((target.buffs.defense?.value || 0) / 2);
            const fxAmp = ab.fx && typeof ab.fx.amplitude === 'number' ? ab.fx.amplitude : 0.5;
            const coh = d.coherence || 0.9;
            const dmg = Math.max(1, Math.floor(base + atk + fxAmp * 8 + (coh - 0.8) * 20 - defRed));
            target.hp = Math.max(0, target.hp - dmg);
            return { dmg };
        };
        const decayBuffs = (side) => {
            const t = now();
            for (const k of Object.keys(side.buffs)) {
                if (side.buffs[k] && side.buffs[k].until <= t) delete side.buffs[k];
            }
        };
        for (let i = 0; i < state.maxRounds; i++) {
            state.round = i + 1;
            const first = (i % 2 === 0) ? state.a : state.b;
            const second = (i % 2 === 0) ? state.b : state.a;
            // first acts
            const ab1 = choose(first);
            let info1 = null;
            if (ab1) info1 = applyAbility(first, second, { ...ab1, id: ab1.id });
            decayBuffs(first); decayBuffs(second);
            try { this.broadcastToBattleSpectators(key, 'spectate:battle:event', { kind: 'round', battleKey: key, round: state.round, by: first.id, ability: ab1?.id, hpA: state.a.hp, hpB: state.b.hp, energyA: state.a.energy, energyB: state.b.energy, buffsA: Object.keys(state.a.buffs||{}), buffsB: Object.keys(state.b.buffs||{}), ts: now() }); } catch {}
            if (second.hp <= 0) break;
            await sleep(700);
            // second acts
            const ab2 = choose(second);
            let info2 = null;
            if (ab2) info2 = applyAbility(second, first, { ...ab2, id: ab2.id });
            decayBuffs(first); decayBuffs(second);
            try { this.broadcastToBattleSpectators(key, 'spectate:battle:event', { kind: 'round', battleKey: key, round: state.round, by: second.id, ability: ab2?.id, hpA: state.a.hp, hpB: state.b.hp, energyA: state.a.energy, energyB: state.b.energy, buffsA: Object.keys(state.a.buffs||{}), buffsB: Object.keys(state.b.buffs||{}), ts: now() }); } catch {}
            if (first.hp <= 0) break;
            await sleep(700);
        }
        // determine winner
        const tieBreaker = this.normalizedHash(`battle:final:${key}:${state.round}:${state.a.hp}:${state.b.hp}`) >= 0.5;
        const winnerSide = state.a.hp === state.b.hp ? (tieBreaker ? state.a : state.b) : (state.a.hp > state.b.hp ? state.a : state.b);
        const loserSide = winnerSide === state.a ? state.b : state.a;
        // Convert to existing result shape
        const payload = {
            winner: winnerSide.id,
            loser: loserSide.id,
            xpTransferred: Math.floor((loserSide.comp?.experience || 0) * this.battleXpTransferPct),
            winnerScore: winnerSide.hp,
            loserScore: loserSide.hp,
        };
        // Apply sanctuary reward
        try { this.awardSanctuaryXp(winnerSide.id === ciA.id ? ciA : ciB, 20); } catch {}
        return { result: { self: { ...payload, you: 'winner', isWinner: true }, opponent: { ...payload, you: 'loser', isWinner: false } }, state };
    }

    async recordBattle(result) {
        try {
            const self = result.self; const opp = result.opponent;
            // Map sessions to player ids if connected
            const mapSessToPlayer = (sid) => {
                try { const ci = Array.from(this.clients.values()).find(c => c.id === sid); return ci?.player?.id || null; } catch { return null; }
            };
            const p1p = mapSessToPlayer(self.winner) || mapSessToPlayer(self.loser) || null;
            const p2p = mapSessToPlayer(self.loser) || mapSessToPlayer(self.winner) || null;
            const wp = mapSessToPlayer(self.winner) || null;
            const lp = mapSessToPlayer(self.loser) || null;

            // Try extended insert with player columns
            try {
                await pool.query(
                    'INSERT INTO game_battles (p1_session, p2_session, winner_session, loser_session, p1_player, p2_player, winner_player, loser_player, xp_transferred, result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                    [self.winner, self.loser, self.winner, self.loser, p1p, p2p, wp, lp, self.xpTransferred, result]
                );
                return;
            } catch {}
            // Fallback to legacy insert
            await pool.query(
                'INSERT INTO game_battles (p1_session, p2_session, winner_session, loser_session, xp_transferred, result) VALUES ($1,$2,$3,$4,$5,$6)',
                [self.winner, self.loser, self.winner, self.loser, self.xpTransferred, result]
            );
        } catch {}
    }

    // Ability handling
    handleAbilityUse(ws, clientInfo, abilityId) {
        const comp = clientInfo.companion;
        if (!comp || comp.tier !== 'legendary') {
            this.sendToClient(ws, 'ability:result', { ok: false, error: 'not_legendary', abilityId });
            return;
        }
        const def = this.abilities[abilityId];
        if (!def) {
            this.sendToClient(ws, 'ability:result', { ok: false, error: 'unknown_ability', abilityId });
            return;
        }
        const now = Date.now();
        comp.cooldowns = comp.cooldowns || {};
        const readyAt = comp.cooldowns[abilityId] || 0;
        if (now < readyAt) {
            this.sendToClient(ws, 'ability:result', { ok: false, error: 'cooldown', abilityId, nextReadyAt: readyAt });
            return;
        }
        if ((comp.energy || 0) < def.energyCost) {
            this.sendToClient(ws, 'ability:result', { ok: false, error: 'not_enough_energy', abilityId });
            return;
        }
        // Apply self
        comp.energy = Math.max(0, (comp.energy || 0) - def.energyCost);
        comp.cooldowns[abilityId] = now + def.cooldownMs;
        comp.buffs = comp.buffs || {};
        if (def.buff && def.buff.kind) {
            comp.buffs[def.buff.kind] = { value: def.buff.value, expiresAt: now + def.buff.durationMs };
        }
        this.updateCompanionMood(comp);
        this.upsertCompanion(comp);

        // Sanctuary progression reward
        this.awardSanctuaryXp(clientInfo, 6);

        // Group aura: apply lighter buff to others in same area
        if (def.groupBuff && (abilityId === 'harmonic_aura')) {
            const area = clientInfo.player?.currentArea || 'town';
            for (const [wss, ci] of this.clients) {
                if (!ci || !ci.isMobile || wss.readyState !== 1) continue;
                if ((ci.player?.currentArea || 'town') !== area) continue;
                if (!ci.companion) continue;
                // Skip if self handled above will also get group buff? we skip self
                if (ci.id === clientInfo.id) continue;
                ci.companion.buffs = ci.companion.buffs || {};
                ci.companion.buffs[def.groupBuff.kind] = { value: def.groupBuff.value, expiresAt: now + def.groupBuff.durationMs };
                try { this.upsertCompanion(ci.companion); } catch {}
                // Notify recipient (optional)
                try { this.sendToClient(wss, 'ability:notify', { from: clientInfo.id, abilityId, buff: def.groupBuff }); } catch {}
            }
        }

        // Emit FX to area if defined
        if (def.fx) {
            const area = clientInfo.player?.currentArea || 'town';
            for (const [wss, ci] of this.clients) {
                if (wss.readyState === 1 && (ci.player?.currentArea || 'town') === area) {
                    this.sendToClient(wss, 'world:fx', { area, effect: def.fx, by: clientInfo.id, ts: now });
                }
            }
        }

        this.sendToClient(ws, 'ability:result', { ok: true, abilityId, nextReadyAt: comp.cooldowns[abilityId], stats: { energy: comp.energy, mood: comp.mood }, buffs: comp.buffs });
    }

    scheduleGlobalEvent() {
        try {
            // Ask the reality generator via event bus
            eventBus.emit('game:generate_world_event', {
                worldState: this.getWorldState(),
                activePlayerCount: this.clients.size,
            });
            // Fallback broadcast if nothing handles above
            setTimeout(() => {
                const ev = {
                    type: 'atmospheric_shift',
                    name: 'A gentle resonance sweeps the land',
                    description: 'You feel a subtle shift in the field.',
                    ts: Date.now(),
                };
                for (const [ws, ci] of this.clients) {
                    if (ci.isMobile && ws.readyState === 1) this.sendToClient(ws, 'world:global_event', ev);
                }
            }, 500);
        } catch {}
    }

    // Utility methods from original game-ws.cjs
    makeQuest() {
        const pregen = [
            {
                title: 'Whispers in the Grove',
                objective: { kind: 'collect', target: 'Grove Spark', count: 3 },
                rewardName: 'Grove‑Bound Bracer'
            }
        ];
        
        const base = pregen[0];
        const id = `Q-${Date.now().toString(36)}-${this.randomBytesHex(2)}`;
        
        return {
            id,
            title: base.title,
            objectives: [{ id: 'obj1', ...base.objective }],
            rewardName: base.rewardName
        };
    }

    // Spectator helpers
    getBattleKey(a, b) {
        const [x, y] = [String(a), String(b)].sort();
        return `${x}::${y}`;
    }
    addAreaSpectator(area, ws) {
        try {
            for (const set of this.spectators.areas.values()) set.delete(ws);
            if (!this.spectators.areas.has(area)) this.spectators.areas.set(area, new Set());
            this.spectators.areas.get(area).add(ws);
        } catch {}
    }
    addBattleSpectator(key, ws) {
        try {
            if (!this.spectators.battles.has(key)) this.spectators.battles.set(key, new Set());
            this.spectators.battles.get(key).add(ws);
        } catch {}
    }
    removeSpectator(ws) {
        try {
            for (const set of this.spectators.areas.values()) set.delete(ws);
            for (const set of this.spectators.battles.values()) set.delete(ws);
        } catch {}
    }
    broadcastToAreaSpectators(area, type, payload) {
        try {
            const set = this.spectators.areas.get(area);
            if (!set) return;
            for (const w of set) { if (w.readyState === 1) this.sendToClient(w, type, payload); }
        } catch {}
    }
    broadcastToAllSpectators(type, payload) {
        try {
            for (const set of this.spectators.areas.values()) {
                for (const w of set) { if (w.readyState === 1) this.sendToClient(w, type, payload); }
            }
        } catch {}
    }
    broadcastToBattleSpectators(key, type, payload) {
        try {
            const set = this.spectators.battles.get(key);
            if (!set) return;
            for (const w of set) { if (w.readyState === 1) this.sendToClient(w, type, payload); }
        } catch {}
    }
    listBattles(area) {
        const items = [];
        const seen = new Set();
        for (const [sid, opp] of this.activeBattles) {
            const key = this.getBattleKey(sid, opp);
            if (seen.has(key)) continue;
            seen.add(key);
            const ciA = Array.from(this.clients.values()).find(c => c.id === sid);
            const ciB = Array.from(this.clients.values()).find(c => c.id === opp);
            const aArea = ciA?.player?.currentArea || 'town';
            const bArea = ciB?.player?.currentArea || 'town';
            const areas = [aArea, bArea];
            if (area && areas.indexOf(area) === -1) continue;
            const meta = this.battlesMeta.get(key) || {};
            items.push({ battleKey: key, a: sid, b: opp, areas, startedAt: meta.startedAt || Date.now() });
        }
        return items;
    }
    resolveBattleKeyFromPayload(payload) {
        try {
            if (payload?.battleKey) return String(payload.battleKey);
            const sid = payload?.sessionId ? String(payload.sessionId) : null;
            if (sid && this.activeBattles.has(sid)) {
                const opp = this.activeBattles.get(sid);
                return this.getBattleKey(sid, opp);
            }
        } catch {}
        return null;
    }

    randomBytesHex(n = 4) {
        this.eventCounter = (this.eventCounter || 0) + 1;
        return hashFragment(`fragment:${n}:${this.eventCounter}:${Date.now()}`, n * 2);
    }

    generateClientId() {
        this.clientCounter = (this.clientCounter || 0) + 1;
        return `game_${Date.now()}_${hashFragment(`client:${this.clientCounter}:${Date.now()}`, 10)}`;
    }

    sendToClient(ws, eventType, data) {
        if (ws && ws.readyState === 1) {
            const message = {
                type: eventType,
                payload: data,
                timestamp: Date.now(),
                id: `evt_${Date.now().toString(36)}_${this.randomBytesHex(2)}`
            };

            try {
                ws.send(JSON.stringify(message));
                // buffer last 100 events per client for resume
                const ci = this.clients.get(ws);
                if (ci) {
                    ci.eventBuffer.push(message);
                    if (ci.eventBuffer.length > 100) ci.eventBuffer.shift();
                    // Persist event for durable resume
                    this.persistEvent(ci, message).catch(() => {});
                }
            } catch (error) {
                console.error('🎮 Error sending message:', error);
            }
        }
    }

    async persistEvent(clientInfo, message) {
        try {
            await pool.query(
                'INSERT INTO game_events (session_id, event_id, event_type, data) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                [clientInfo.id, message.id, message.type, message]
            );
        } catch {}
    }

    async replayEvents(ws, clientInfo, lastEventId) {
        if (!clientInfo || !lastEventId) return;
        try {
            const { rows } = await pool.query(
                `SELECT data FROM game_events WHERE session_id = $1 AND created_at > COALESCE((SELECT created_at FROM game_events WHERE event_id = $2), to_timestamp(0)) ORDER BY created_at ASC LIMIT 200`,
                [clientInfo.id, lastEventId]
            );
            for (const r of rows) {
                try { ws.send(JSON.stringify(r.data)); } catch {}
            }
        } catch {
            // Fallback to in-memory buffer
            if (!Array.isArray(clientInfo.eventBuffer)) return;
            const idx = clientInfo.eventBuffer.findIndex((m) => m.id === lastEventId);
            if (idx < 0) return;
            const pending = clientInfo.eventBuffer.slice(idx + 1);
            for (const m of pending) {
                try { ws.send(JSON.stringify(m)); } catch {}
            }
        }
    }

    async upsertPlayer(player) {
        try {
            await pool.query(`INSERT INTO game_players (id, username, level, coins) VALUES ($1,$2,$3,$4)
                              ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, level = EXCLUDED.level, coins = EXCLUDED.coins`,
                [player.id, player.username, player.level, player.coins]);
        } catch {}
    }

    async upsertCompanion(companion) {
        try {
            await pool.query(`INSERT INTO game_companions (id, player_id, name, level, experience, mood, hunger, energy, happiness, personality, updated_at)
                              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
                              ON CONFLICT (id) DO UPDATE SET level = EXCLUDED.level, experience = EXCLUDED.experience, mood = EXCLUDED.mood, hunger = EXCLUDED.hunger, energy = EXCLUDED.energy, happiness = EXCLUDED.happiness, personality = EXCLUDED.personality, updated_at = NOW()`,
                [companion.id, companion.playerId, companion.name, companion.level, companion.experience, companion.mood, companion.hunger, companion.energy, companion.happiness, JSON.stringify(companion.personality || {})]);
        } catch {}
    }

    // Inventory helpers
    async getInventory(playerId) {
        try {
            const { rows } = await pool.query('SELECT item_id, name, type, quantity, metadata, created_at FROM game_inventory WHERE player_id = $1 ORDER BY created_at DESC LIMIT 200', [playerId]);
            return rows.map(r => ({ id: r.item_id, name: r.name, type: r.type, quantity: Number(r.quantity||1), metadata: r.metadata }));
        } catch { return []; }
    }

    async addInventoryItem(playerId, item) {
        const itemId = item.id || item.item_id || `itm_${Date.now().toString(36)}${this.randomBytesHex(2)}`;
        const name = item.name || 'Item';
        const type = item.type || 'misc';
        const quantity = Number(item.quantity || 1);
        const metadata = item.metadata || null;
        try {
            await pool.query('INSERT INTO game_inventory (player_id, item_id, name, type, quantity, metadata) VALUES ($1,$2,$3,$4,$5,$6)', [playerId, itemId, name, type, quantity, metadata]);
        } catch {}
        return { item_id: itemId, name, type, quantity, metadata };
    }

    async removeInventoryItem(playerId, itemId, qty = 1) {
        try {
            // Decrement if quantity more than qty
            const dec = await pool.query('UPDATE game_inventory SET quantity = quantity - $3 WHERE player_id = $1 AND item_id = $2 AND quantity > $3 RETURNING item_id, name, type, quantity, metadata, created_at', [playerId, itemId, qty]);
            if (dec.rows && dec.rows[0]) return dec.rows[0];
            // Otherwise delete row
            const del = await pool.query('DELETE FROM game_inventory WHERE player_id = $1 AND item_id = $2 RETURNING item_id', [playerId, itemId]);
            return del.rows && del.rows[0] ? del.rows[0] : null;
        } catch { return null; }
    }

    async handleUiTelemetry(data, clientInfo) {
        try {
            const evt = {
                type: 'ui:telemetry',
                sessionId: clientInfo.id,
                playerId: clientInfo.player?.id,
                data: {
                    event: data?.event || data?.payload?.event,
                    details: data?.details || data?.payload?.details || {},
                    ts: Date.now()
                }
            };
            // Insert into game_events if DB present
            try {
                const eventId = `ui_${Date.now()}_${hashFragment(`ui:${clientInfo.id}:${evt.data.event}:${evt.data.ts}`, 8)}`;
                await pool.query('INSERT INTO game_events (session_id, event_id, event_type, data) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING', [clientInfo.id, eventId, 'ui:telemetry', evt.data]);
            } catch {}
            // Emit on event bus for self-coding/analytics
            try { eventBus.emit('ui:metrics', evt); } catch {}
        } catch {}
    }

    async handleInventoryList(ws, clientInfo) {
        try {
            const items = await this.getInventory(clientInfo.player.id);
            this.sendToClient(ws, 'inventory:list', { items });
        } catch (e) {
            this.sendToClient(ws, 'inventory:list', { items: [] });
        }
    }

    async handleInventoryAdd(ws, clientInfo, item) {
        try {
            await this.addInventoryItem(clientInfo.player.id, item || {});
        } catch {}
        return this.handleInventoryList(ws, clientInfo);
    }

    async handleInventoryRemove(ws, clientInfo, itemId) {
        if (!itemId) return;
        try { await this.removeInventoryItem(clientInfo.player.id, itemId, 1); } catch {}
        return this.handleInventoryList(ws, clientInfo);
    }

    // JWT helpers (aligned with unified-chat-ws)
    getWsJwtPublicKey() {
        // Prefer explicit path; else allow inline env API_JWT_PUBLIC_KEY; else try common defaults
        try {
            if (process.env.JWT_PUBLIC_KEY_PATH) {
                return fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf8');
            }
        } catch {}
        try {
            if (process.env.API_JWT_PUBLIC_KEY) {
                return String(process.env.API_JWT_PUBLIC_KEY);
            }
        } catch {}
        try { return fs.readFileSync('./keys/jwtRS256.key.pub', 'utf8'); } catch {}
        try { return fs.readFileSync('./jwt-public.pem', 'utf8'); } catch {}
        return null;
    }

    extractWsToken(req) {
        const proto = req.headers?.['sec-websocket-protocol'];
        if (typeof proto === 'string' && proto.trim()) return proto.trim();
        if (Array.isArray(proto) && proto[0]) return String(proto[0]).trim();
        const auth = req.headers?.authorization || req.headers?.Authorization;
        if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7).trim();
        try { const url = new URL(req.url, 'http://localhost'); const t = url.searchParams.get('token'); if (t) return t.trim(); } catch {}
        return undefined;
    }

    verifyWsJwt(token, publicKey) {
        const options = { algorithms: ['RS256'] };
        if (process.env.JWT_AUDIENCE) {
            const aud = process.env.JWT_AUDIENCE.split(',').map((s) => s.trim()).filter(Boolean);
            options.audience = aud.length === 1 ? aud[0] : aud;
        }
        if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
        try { return jwt.verify(token, publicKey, options); } catch { return null; }
    }

    handleDisconnection(ws, clientInfo) {
        console.log(`🎮 Client disconnected: ${clientInfo.id}`);
        
        // Clean up
        this.clients.delete(ws);
        try { for (const [a, set] of this.presence) { set.delete(clientInfo.id); } } catch {}
        
        if (clientInfo.player) {
            this.players.delete(clientInfo.player.id);
        }
        
        if (clientInfo.companion) {
            this.companions.delete(clientInfo.companion.id);
        }

        // Update session metrics
        try {
            const dur = Date.now() - (clientInfo.connectedAt || Date.now());
            this.metrics.sessionCount += 1;
            this.metrics.totalSessionMs += dur;
            const denom = Math.max(1, this.metrics.sessionCount);
            this.metrics.avgSessionSec = Math.round((this.metrics.totalSessionMs / denom) / 1000);
            // track recent disconnects (timestamps, keep last 300)
            const rd = this.metrics.recentDisconnects || [];
            rd.push(Date.now());
            while (rd.length > 300) rd.shift();
            this.metrics.recentDisconnects = rd;
        } catch {}
    }

    getEnhancedMetrics() {
        return {
            ...this.metrics,
            activeConnections: this.clients.size,
            mobileClients: Array.from(this.clients.values()).filter(c => c.isMobile).length,
            webClients: Array.from(this.clients.values()).filter(c => !c.isMobile).length,
            totalCompanions: this.companions.size,
            totalPlayers: this.players.size,
            uptimeSec: Math.round((Date.now() - Date.parse(this.metrics.startedAt)) / 1000)
        };
    }

    shutdown() {
        console.log('🎮 Shutting down Enhanced Game WebSocket...');
        
        if (this.tickTimer) {
            clearInterval(this.tickTimer);
        }
        
        if (this.wss) {
            this.wss.close();
        }
    }
}

// Create singleton instance
const enhancedGameWS = new EnhancedGameWebSocket();

// Export functions that maintain compatibility with existing code
function initGameWS(server) {
    return enhancedGameWS.initGameWS(server);
}

function getGameMetrics() {
    return enhancedGameWS.getEnhancedMetrics();
}

module.exports = { initGameWS, getGameMetrics, enhancedGameWS };
