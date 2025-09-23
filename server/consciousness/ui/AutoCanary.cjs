/*
 * AutoCanary - progressively enables UI improvements (flags) for a subset of sessions,
 * monitors basic UI telemetry, and ramps canary percentage when stable.
 */

module.exports = function startAutoCanary(enhancedGameWS) {
  try {
    const eventBus = require('../core/ConsciousnessEventBus.cjs');
    const startPct = Number(process.env.UI_CANARY_START || 0.05);
    const stepPct = Number(process.env.UI_CANARY_STEP || 0.20);
    const maxPct = Number(process.env.UI_CANARY_MAX || 1.0);
    const intervalMs = Number(process.env.UI_CANARY_INTERVAL_MS || 120000); // 2 minutes

    // Initialize canary PCT non-destructively
    if (typeof enhancedGameWS.canaryPct !== 'number' || enhancedGameWS.canaryPct < startPct) {
      enhancedGameWS.canaryPct = startPct;
    }

    // UI flags to try in canary first
    enhancedGameWS.uiFlags = enhancedGameWS.uiFlags || {
      primaryColor: '#6c5ce7',
      chatEnterToSend: true,
      tightTabs: true,
      accentGlow: true,
    };

    // In-memory UI metrics (populated by EnhancedGameWebSocket.handleUiTelemetry)
    enhancedGameWS.uiMetrics = enhancedGameWS.uiMetrics || { windowStart: Date.now(), counts: {} };

    // Broadcast flags to canary sessions periodically
    const broadcastFlags = () => {
      const flags = enhancedGameWS.uiFlags;
      for (const [ws, ci] of enhancedGameWS.clients) {
        if (ws.readyState !== 1) continue;
        if (ci.canary) {
          try { ws.send(JSON.stringify({ type: 'ui:flags', flags })); } catch {}
        }
      }
    };
    broadcastFlags();

    // Reduce: evaluate stability and ramp canary
    const evaluateAndRamp = () => {
      try {
        const now = Date.now();
        const metrics = enhancedGameWS.uiMetrics || { windowStart: now, counts: {} };
        const windowMs = now - (metrics.windowStart || now);
        // Simple heuristic: if we have some engagement and no explicit error events, ramp canary
        const clicks = (metrics.counts['click_explore'] || 0) + (metrics.counts['chat_send'] || 0);
        const errors = (metrics.counts['ui:error'] || 0);
        if (windowMs >= intervalMs) {
          if (clicks > 5 && errors === 0) {
            const next = Math.min(maxPct, (enhancedGameWS.canaryPct || startPct) + stepPct);
            enhancedGameWS.canaryPct = next;
            // Reassign canary on existing clients so more sessions get flags
            for (const [, ci] of enhancedGameWS.clients) { ci.canary = Math.random() < next; }
            broadcastFlags();
          }
          // reset window
          enhancedGameWS.uiMetrics = { windowStart: now, counts: {} };
        }
      } catch {}
    };

    const timer = setInterval(evaluateAndRamp, Math.max(15000, Math.floor(intervalMs / 4)));
    // If process exits, clear timer
    try { process.on('exit', () => clearInterval(timer)); } catch {}

    // Also rebroadcast flags on module:status events occasionally
    try { eventBus.on('module:status', () => broadcastFlags()); } catch {}

    return true;
  } catch (e) {
    try { console.warn('AutoCanary init failed:', e?.message || e); } catch {}
    return false;
  }
}

