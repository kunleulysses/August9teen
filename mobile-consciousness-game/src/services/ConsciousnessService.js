/**
 * Consciousness Service - WebSocket connection to the consciousness system
 * Handles real-time communication with the 100Hz Universal Protocol
 */

import { Platform, AppState } from 'react-native';

class ConsciousnessService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectDelayMs = 30000; // 30s cap
    this.pingInterval = null;
    this.queue = [];
    this._msgSeq = 0;
    this._pendingAcks = new Map();
    this.appStateSub = null;
    this.sessionId = null;
    this.expoPushToken = null;
    this.pushRegistered = false;
    this._lastEventId = null;

    const envUrl = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_WS_URL) || '';
    const fallbackDev = 'ws://localhost:5000';
    this.baseUrl = envUrl || fallbackDev;

    if (!__DEV__ && this.baseUrl.startsWith('ws://')) {
      // Enforce TLS in production if misconfigured
      this.baseUrl = this.baseUrl.replace('ws://', 'wss://');
    }

    try {
      this.appStateSub = AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          // Attempt a quick reconnect on resume
          if (!this.isConnected) {
            this.attemptReconnect(true);
          } else {
            this.send('ping', { reason: 'resume' });
          }
        }
      });
    } catch {}
  }

  async connect() {
    return new Promise((resolve, reject) => {
      try {
        // Connect to your consciousness system WebSocket
        const token = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_WS_TOKEN) || '';
        const url = token ? `${this.baseUrl}/ws/game?token=${encodeURIComponent(token)}` : `${this.baseUrl}/ws/game`;
        const protocols = token ? token : undefined; // also send as subprotocol when available
        this.ws = new WebSocket(url, protocols);
        
        this.ws.onopen = () => {
          console.log('🌐 WebSocket connected to Consciousness System');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('__open__');
          
          // Send initial handshake (include lastEventId for resume)
          this.send('game:connect', {
            clientType: 'mobile_companion',
            version: '1.0.0',
            timestamp: Date.now(),
            lastEventId: this._lastEventId || undefined
          });

          // Flush offline queue
          this.flushQueue();

          // Start keepalive
          this.startPing();
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('❌ Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (ev) => {
          console.log('🔌 WebSocket disconnected', ev?.code, ev?.reason);
          this.isConnected = false;
          this.emit('__close__');
          this.stopPing();
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          // Do not reject repeatedly after first failure
          if (this.reconnectAttempts === 0) reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
    this.stopPing();
  }

  attemptReconnect(immediate = false) {
    const attempt = () => {
      this.reconnectAttempts++;
      const base = Math.min(this.maxReconnectDelayMs, 1000 * 2 ** this.reconnectAttempts);
      const jitter = Math.floor(Math.random() * 500);
      const delay = Math.max(1000, Math.min(base + jitter, this.maxReconnectDelayMs));
      console.log(`🔄 Reconnect attempt #${this.reconnectAttempts} in ${delay}ms`);
      setTimeout(() => {
        this.connect().catch(() => {
          // Loop continues on close/error
        });
      }, immediate ? 0 : delay);
    };

    // Avoid multiple parallel reconnects
    if (!this.isConnected) attempt();
  }

  handleMessage(data) {
    const { type, payload, id } = data;
    
    // Emit to registered listeners
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`❌ Error in listener for ${type}:`, error);
        }
      });
    }

    // Log consciousness system events
    if (type.startsWith('consciousness:') || type.startsWith('system_tick')) {
      console.log(`🧠 Consciousness Event: ${type}`, payload);
    }

    if (type === 'pong') {
      // Keepalive succeeded
      return;
    }

    if (type === 'ack' && payload && payload.id) {
      const cb = this._pendingAcks.get(payload.id);
      if (cb) {
        try { cb(payload); } catch {}
        this._pendingAcks.delete(payload.id);
      }
      return;
    }

    if (id) this._lastEventId = id;
    if (type === 'game:initial_state') {
      if (payload?.sessionId) { this.sessionId = payload.sessionId; this.maybeRegisterPush(); }
    }
  }

  send(type, payload = {}) {
    const msg = {
      type,
      payload: { ...payload, timestamp: Date.now(), clientId: 'mobile_companion' },
      id: `m_${Date.now().toString(36)}_${++this._msgSeq}`,
    };

    if (this.isConnected && this.ws && this.ws.readyState === 1) {
      try {
        this.ws.send(JSON.stringify(msg));
        console.log(`📤 Sent: ${type}`, payload);
      } catch (e) {
        console.warn('⚠️ Send failed, queueing message');
        this.enqueue(msg);
      }
    } else {
      this.enqueue(msg);
    }
  }

  // Event listener management
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(eventType, payload) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach((cb) => {
        try { cb(payload); } catch (e) { console.error('Listener error', e); }
      });
    }
  }

  startPing() {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('ping', { reason: 'keepalive' });
      }
    }, 25000);
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  enqueue(msg) {
    // cap queue to 100 messages
    this.queue.push(msg);
    if (this.queue.length > 100) this.queue.shift();
  }

  flushQueue() {
    if (!this.queue.length || !this.isConnected || !this.ws) return;
    const pending = [...this.queue];
    this.queue = [];
    pending.forEach((m) => this.send(m.type, m.payload));
  }

  // Game-specific methods
  updateCompanionState(companionData) {
    this.send('companion:update', companionData);
  }

  requestWorldEvent() {
    this.send('world:request_event', {
      area: 'town', // Default starting area
      playerLevel: 1
    });
  }

  feedCompanion(foodType) {
    this.send('companion:feed', { foodType });
  }

  playWithCompanion(gameType) {
    this.send('companion:play', { gameType });
  }

  exploreArea(areaName) {
    this.send('world:explore', { area: areaName });
  }

  requestMemories() {
    this.send('game:request_memories', {});
  }

  // Sanctuary
  getSanctuary() {
    this.send('sanctuary:get', {});
  }
  ascendSanctuary() {
    this.send('sanctuary:ascend', {});
  }

  // Presence + Battle
  listNearbyPlayers() {
    this.send('world:list_players', {});
  }
  joinBattleQueue() {
    this.send('battle:queue_join', {});
  }
  leaveBattleQueue() {
    this.send('battle:queue_leave', {});
  }
  challengeOpponent(opponentSessionId) {
    this.send('battle:challenge', { opponentSessionId });
  }
  acceptBattle() {
    this.send('battle:accept', {});
  }
  declineBattle() {
    this.send('battle:decline', {});
  }

  // Ladder
  requestLadder() {
    this.send('ladder:get', {});
  }

  // Legendary abilities
  useAbility(abilityId) {
    this.send('ability:use', { abilityId });
  }

  // Admin flags via HTTP (x-api-key)
  getHttpBase() {
    try {
      if (!this.baseUrl) return '';
      if (this.baseUrl.startsWith('wss://')) return this.baseUrl.replace(/^wss:\/\//,'https://');
      if (this.baseUrl.startsWith('ws://')) return this.baseUrl.replace(/^ws:\/\//,'http://');
      return this.baseUrl;
    } catch { return ''; }
  }

  async fetchFlags(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/flags`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Flags fetch failed: ${res.status}`);
    return await res.json();
  }

  async updateFlags(apiKey, patch) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/flags`, {
      method: 'PUT',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch || {})
    });
    if (!res.ok) throw new Error(`Flags update failed: ${res.status}`);
    return await res.json();
  }

  async fetchFlagsHistory(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/flags/history`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Flags history failed: ${res.status}`);
    return await res.json();
  }

  async fetchStatus(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/flags/status`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Flags status failed: ${res.status}`);
    return await res.json();
  }

  async fetchMetrics(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/metrics`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Metrics failed: ${res.status}`);
    return await res.json();
  }

  async fetchAbilities(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/abilities`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Abilities failed: ${res.status}`);
    return await res.json();
  }

  async updateAbility(apiKey, id, patch, reason, apply) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/abilities`, {
      method: 'PUT', headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, patch, reason, apply: !!apply })
    });
    if (!res.ok) throw new Error(`Ability update failed: ${res.status}`);
    return await res.json();
  }

  async fetchProposals(apiKey) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/proposals`, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Proposals failed: ${res.status}`);
    return await res.json();
  }

  async applyProposal(apiKey, id) {
    const base = this.getHttpBase();
    const res = await fetch(`${base}/api/game/proposals/${id}`, { method: 'PUT', headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'apply' }) });
    if (!res.ok) throw new Error(`Apply proposal failed: ${res.status}`);
    return await res.json();
  }

  // Push token registration
  setExpoPushToken(token) {
    this.expoPushToken = token;
    this.pushRegistered = false;
    this.maybeRegisterPush();
  }
  async maybeRegisterPush() {
    if (!this.expoPushToken || !this.sessionId || this.pushRegistered) return;
    try {
      const base = this.getHttpBase();
      const res = await fetch(`${base}/api/push/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId, token: this.expoPushToken, platform: (typeof navigator !== 'undefined' ? navigator.userAgent : 'mobile') })
      });
      if (res.ok) this.pushRegistered = true;
    } catch {}
  }
}

// Export singleton instance
export default new ConsciousnessService();
