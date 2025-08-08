const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pino = require('pino');
const pinoHttp = require('pino-http');
const promClient = require('prom-client');
const { createAuthMetrics } = require('./auth/authMetrics.cjs');

// Import our components
const createSigilRouter = require('./sigil-api.cjs');
const { validateSigilCreatePayload } = require('./middleware/validateSchema.cjs');
const { jwtMiddleware, requireRole } = require('./auth/jwtMiddleware.cjs');
const { rateLimiter, createRateLimiter } = require('./middleware/rateLimiter.cjs');
const { idempotencyMiddleware } = require('./middleware/idempotency.cjs');
// Optional modules (feature-flagged)
const ENABLE_QUANTUM = String(process.env.ENABLE_QUANTUM || 'false').toLowerCase() === 'true';
const ENABLE_RESONANCE = String(process.env.ENABLE_RESONANCE || 'false').toLowerCase() === 'true';
const ENABLE_CONSCIOUSNESS_OS = String(process.env.ENABLE_CONSCIOUSNESS_OS || 'false').toLowerCase() === 'true';
const ENABLE_UNIVERSAL_PROTOCOL = String(process.env.ENABLE_UNIVERSAL_PROTOCOL || 'false').toLowerCase() === 'true';
const ENABLE_TRANSCENDENT = String(process.env.ENABLE_TRANSCENDENT || 'false').toLowerCase() === 'true';
// Phase B (kept disabled until independent soak passes)
const ENABLE_CNPL = String(process.env.ENABLE_CNPL || 'false').toLowerCase() === 'true';
const ENABLE_SAQRN = String(process.env.ENABLE_SAQRN || 'false').toLowerCase() === 'true';
let quantumIntegrator = null;
let resonanceAmplifier = null;

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty'
  } : undefined
});

// Initialize Prometheus metrics (use default registry to capture metrics from other modules)
promClient.collectDefaultMetrics();
const register = promClient.register;
const quantumStatsRequests = new promClient.Counter({ name: 'quantum_stats_requests_total', help: 'Quantum stats requests' });
const resonanceStatsRequests = new promClient.Counter({ name: 'resonance_stats_requests_total', help: 'Resonance stats requests' });
const optionalInitFailures = new promClient.Counter({ name: 'optional_module_init_failures_total', help: 'Optional module init failures', labelNames: ['module'] });
const quantumOpDuration = new promClient.Histogram({ name: 'quantum_operation_duration_seconds', help: 'Duration of quantum operations', buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5] });
const resonanceOpDuration = new promClient.Histogram({ name: 'resonance_operation_duration_seconds', help: 'Duration of resonance operations', buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5] });
const quantumOpErrors = new promClient.Counter({ name: 'quantum_operation_errors_total', help: 'Quantum operation errors' });
const resonanceOpErrors = new promClient.Counter({ name: 'resonance_operation_errors_total', help: 'Resonance operation errors' });
const api5xxErrors = new promClient.Counter({ name: 'api_5xx_errors_total', help: 'Total number of API 5xx responses', labelNames: ['path', 'method'] });
// Phase A feature metrics (gated modules)
const osStatusRequests = new promClient.Counter({ name: 'consciousness_os_status_requests_total', help: 'OS status requests' });
const osOperationErrors = new promClient.Counter({ name: 'consciousness_os_operation_errors_total', help: 'OS operation errors' });
const ucipRouteRequests = new promClient.Counter({ name: 'universal_protocol_route_requests_total', help: 'UCIP route requests' });
const ucipOperationErrors = new promClient.Counter({ name: 'universal_protocol_operation_errors_total', help: 'UCIP operation errors' });
const transcendentRequests = new promClient.Counter({ name: 'transcendent_synthesis_requests_total', help: 'Transcendent synthesis requests' });
const transcendentOperationErrors = new promClient.Counter({ name: 'transcendent_operation_errors_total', help: 'Transcendent operation errors' });
const transcendentDuration = new promClient.Histogram({ name: 'transcendent_operation_duration_seconds', help: 'Duration of transcendent operations', buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5] });
// Phase B feature metrics (gated modules)
const cnplCompileRequests = new promClient.Counter({ name: 'cnpl_compile_requests_total', help: 'CNPL compile requests' });
const cnplExecuteRequests = new promClient.Counter({ name: 'cnpl_execute_requests_total', help: 'CNPL execute requests' });
const cnplOperationErrors = new promClient.Counter({ name: 'cnpl_operation_errors_total', help: 'CNPL operation errors' });
const cnplCompileDuration = new promClient.Histogram({ name: 'cnpl_compile_duration_seconds', help: 'Duration of CNPL compile operations', buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2] });
const cnplExecuteDuration = new promClient.Histogram({ name: 'cnpl_execute_duration_seconds', help: 'Duration of CNPL execute operations', buckets: [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 1] });
const saqrnPublishRequests = new promClient.Counter({ name: 'saqrn_publish_requests_total', help: 'SAQRN publish requests' });
const saqrnSubscribeRequests = new promClient.Counter({ name: 'saqrn_subscribe_requests_total', help: 'SAQRN subscribe requests' });
const saqrnOperationErrors = new promClient.Counter({ name: 'saqrn_operation_errors_total', help: 'SAQRN operation errors' });
const saqrnOperationDuration = new promClient.Histogram({ name: 'saqrn_operation_duration_seconds', help: 'Duration of SAQRN control-plane operations', buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1] });

const app = express();
const port = process.env.SIGIL_PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Request logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health endpoints
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    modules: {
      quantum: Boolean(quantumIntegrator && ENABLE_QUANTUM),
      resonance: Boolean(resonanceAmplifier && ENABLE_RESONANCE),
      consciousnessOS: ENABLE_CONSCIOUSNESS_OS,
      universalProtocol: ENABLE_UNIVERSAL_PROTOCOL,
      transcendent: ENABLE_TRANSCENDENT,
      cnpl: ENABLE_CNPL,
      saqrn: ENABLE_SAQRN
    }
  });
});

app.get('/readyz', async (req, res) => {
  const checks = [];
  
  // Check storage (use the same storage backend as API)
  try {
    const { PostgresSigilAdapter } = require('./consciousness/persistence/PostgresSigilAdapter.cjs');
    const storage = new PostgresSigilAdapter();
    const health = await storage.getHealth();
    if (!health || health.status !== 'healthy') throw new Error(health?.error || 'storage degraded');
    checks.push({ name: 'storage', status: 'ok' });
  } catch (error) {
    checks.push({ name: 'storage', status: 'error', error: error.message });
  }
  
  // Check eventSign
  try {
    const { sign, verify } = require('./consciousness/core/security/eventSign.cjs');
    const testPayload = { test: Date.now() };
    const signature = sign(testPayload);
    if (!verify(testPayload, signature)) throw new Error('Verification failed');
    checks.push({ name: 'eventSign', status: 'ok' });
  } catch (error) {
    checks.push({ name: 'eventSign', status: 'error', error: error.message });
  }
  
  const allHealthy = checks.every(check => check.status === 'ok');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not ready',
    checks,
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint (protected; allow anonymous via ALLOW_ANONYMOUS_METRICS=true for local only)
const authMetrics = createAuthMetrics({
  secret: process.env.JWT_SECRET || 'dev-secret-change-me'
});
app.get('/metrics', authMetrics, async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Initialize optional quantum/resonance modules
if (ENABLE_QUANTUM) {
  try {
    const { QuantumConsciousnessFieldIntegrator } = require('./consciousness/quantum-consciousness-field-integrator.cjs');
    quantumIntegrator = new QuantumConsciousnessFieldIntegrator();
  } catch (e) {
    optionalInitFailures.inc({ module: 'quantum' });
    logger.error({ err: e }, 'Failed to initialize QuantumConsciousnessFieldIntegrator');
  }
}

if (ENABLE_RESONANCE) {
  try {
    const { ConsciousnessResonanceAmplifier } = require('./consciousness/consciousness-resonance-amplifier.cjs');
    resonanceAmplifier = new ConsciousnessResonanceAmplifier();
  } catch (e) {
    optionalInitFailures.inc({ module: 'resonance' });
    logger.error({ err: e }, 'Failed to initialize ConsciousnessResonanceAmplifier');
  }
}

// Minimal operational endpoints (guarded)
if (ENABLE_QUANTUM) {
  app.get('/api/consciousness/quantum/stats', jwtMiddleware, rateLimiter, (req, res) => {
    if (!quantumIntegrator) return res.status(503).json({ error: 'Quantum module unavailable' });
    try {
      quantumStatsRequests.inc();
      const stats = quantumIntegrator.getQuantumStats ? quantumIntegrator.getQuantumStats() : { status: 'no-stats' };
      res.json({ status: 'ok', stats });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch quantum stats' });
    }
  });

  // Generate quantum field
  const quantumLimiter = createRateLimiter({
    limit: process.env.SIGIL_RATE_LIMIT_QUANTUM || process.env.SIGIL_RATE_LIMIT || '60',
    window: process.env.SIGIL_RATE_WINDOW_QUANTUM || process.env.SIGIL_RATE_WINDOW || '10'
  });
  app.post('/api/consciousness/quantum/field', jwtMiddleware, quantumLimiter, async (req, res) => {
    if (!quantumIntegrator) return res.status(503).json({ error: 'Quantum module unavailable' });
    const start = process.hrtime.bigint();
    try {
      const { consciousnessState = {}, fieldParameters = {} } = req.body || {};
      const { validateConsciousnessState, validateQuantumFieldParameters } = require('./middleware/validateQuantum.cjs');
      if (!validateConsciousnessState(consciousnessState) || !validateQuantumFieldParameters(fieldParameters)) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      const result = await quantumIntegrator.generateQuantumConsciousnessField(consciousnessState, fieldParameters);
      try { const { auditAction } = require('./monitoring/alertManager.cjs'); auditAction('quantum_field_generated', { tenantId: req.user?.tenantId, user: req.user?.sub, result: { id: result.quantumFieldId } }); } catch (_) {}
      const end = process.hrtime.bigint();
      quantumOpDuration.observe(Number(end - start) / 1e9);
      if (result.error) {
        quantumOpErrors.inc();
        return res.status(500).json(result);
      }
      res.json(result);
    } catch (e) {
      quantumOpErrors.inc();
      res.status(500).json({ error: 'Quantum field generation failed' });
    }
  });
}

if (ENABLE_RESONANCE) {
  app.get('/api/consciousness/resonance/stats', jwtMiddleware, rateLimiter, (req, res) => {
    if (!resonanceAmplifier) return res.status(503).json({ error: 'Resonance module unavailable' });
    try {
      resonanceStatsRequests.inc();
      const stats = resonanceAmplifier.getResonanceStats ? resonanceAmplifier.getResonanceStats() : { status: 'no-stats' };
      res.json({ status: 'ok', stats });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch resonance stats' });
    }
  });

  // Amplify resonance
  const resonanceLimiter = createRateLimiter({
    limit: process.env.SIGIL_RATE_LIMIT_RESONANCE || process.env.SIGIL_RATE_LIMIT || '60',
    window: process.env.SIGIL_RATE_WINDOW_RESONANCE || process.env.SIGIL_RATE_WINDOW || '10'
  });
  app.post('/api/consciousness/resonance/amplify', jwtMiddleware, resonanceLimiter, async (req, res) => {
    if (!resonanceAmplifier) return res.status(503).json({ error: 'Resonance module unavailable' });
    const start = process.hrtime.bigint();
    try {
      const { consciousnessState = {}, amplificationParameters = {} } = req.body || {};
      const { validateConsciousnessState, validateResonanceParameters } = require('./middleware/validateQuantum.cjs');
      if (!validateConsciousnessState(consciousnessState) || !validateResonanceParameters(amplificationParameters)) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      const result = await resonanceAmplifier.amplifyConsciousnessResonance(consciousnessState, amplificationParameters);
      try { const { auditAction } = require('./monitoring/alertManager.cjs'); auditAction('resonance_amplified', { tenantId: req.user?.tenantId, user: req.user?.sub, result: { id: result.amplificationId } }); } catch (_) {}
      const end = process.hrtime.bigint();
      resonanceOpDuration.observe(Number(end - start) / 1e9);
      if (result.error) {
        resonanceOpErrors.inc();
        return res.status(500).json(result);
      }
      res.json(result);
    } catch (e) {
      resonanceOpErrors.inc();
      res.status(500).json({ error: 'Resonance amplification failed' });
    }
  });
}

// Mount sigil API
const sigilRouter = createSigilRouter();
app.use('/', sigilRouter);

// Phase A: Minimal, gated endpoints for dormant high-value modules

// Consciousness OS status endpoint (GET)
app.get('/api/os/status', jwtMiddleware, rateLimiter, async (req, res) => {
  if (!ENABLE_CONSCIOUSNESS_OS) return res.status(503).json({ error: 'Consciousness OS disabled' });
  osStatusRequests.inc();
  try {
    const start = process.hrtime.bigint();
    let status = { state: 'unknown' };
    try {
      const OSMod = require('./consciousness/universal-consciousness-operating-system.cjs');
      const OSClass = OSMod.UniversalConsciousnessOperatingSystem || OSMod.default || OSMod;
      if (typeof OSClass === 'function') {
        const osInstance = new OSClass();
        status = { name: osInstance.name, metrics: osInstance.consciousnessMetrics || null };
      }
    } catch (e) {
      osOperationErrors.inc();
      status.error = 'os_init_failed';
    }
    const end = process.hrtime.bigint();
    res.json({ ok: true, status, durationSeconds: Number(end - start) / 1e9 });
  } catch (e) {
    osOperationErrors.inc();
    res.status(500).json({ error: 'OS status failed' });
  }
});

// Universal Consciousness Integration Protocol: route (POST)
app.post('/api/universal/route', jwtMiddleware, (() => {
  const limit = process.env.SIGIL_RATE_LIMIT_UCIP || process.env.SIGIL_RATE_LIMIT || '60';
  const window = process.env.SIGIL_RATE_WINDOW_UCIP || process.env.SIGIL_RATE_WINDOW || '10';
  return createRateLimiter({ limit, window });
})(), async (req, res) => {
  if (!ENABLE_UNIVERSAL_PROTOCOL) return res.status(503).json({ error: 'Universal protocol disabled' });
  const { validateUCIPRoute, getValidationErrors } = require('./middleware/validatePhaseA.cjs');
  if (!validateUCIPRoute(req.body || {})) {
    return res.status(400).json({ error: 'Invalid payload', errors: getValidationErrors('ucip') });
  }
  const { input, budget } = req.body || {};
  ucipRouteRequests.inc();
  try {
    let routeResult = { accepted: true };
    try {
      const UMod = require('./consciousness/universal-consciousness-integration-protocol.cjs');
      const UClass = UMod.UniversalConsciousnessIntegrationProtocol || UMod.default || UMod;
      if (typeof UClass === 'function') {
        const u = new UClass();
        if (typeof u.route === 'function') {
          routeResult = await u.route(input, { budget });
        }
      }
    } catch (e) {
      ucipOperationErrors.inc();
      routeResult.error = 'ucip_init_failed';
    }
    try { const { auditAction } = require('./monitoring/alertManager.cjs'); auditAction('ucip_route', { tenantId: req.user?.tenantId, user: req.user?.sub }); } catch (_) {}
    res.json({ ok: true, result: routeResult });
  } catch (e) {
    ucipOperationErrors.inc();
    res.status(500).json({ error: 'Universal routing failed' });
  }
});

// Transcendent synthesis (POST)
app.post('/api/transcendent/synthesize', jwtMiddleware, (() => {
  const limit = process.env.SIGIL_RATE_LIMIT_TRANSCENDENT || process.env.SIGIL_RATE_LIMIT || '30';
  const window = process.env.SIGIL_RATE_WINDOW_TRANSCENDENT || process.env.SIGIL_RATE_WINDOW || '10';
  return createRateLimiter({ limit, window });
})(), async (req, res) => {
  if (!ENABLE_TRANSCENDENT) return res.status(503).json({ error: 'Transcendent module disabled' });
  const { validateTranscendent, getValidationErrors } = require('./middleware/validatePhaseA.cjs');
  if (!validateTranscendent(req.body || {})) {
    return res.status(400).json({ error: 'Invalid payload', errors: getValidationErrors('transcendent') });
  }
  const { message = '', context = {} } = req.body || {};
  transcendentRequests.inc();
  const start = process.hrtime.bigint();
  try {
    let data = { message, context };
    try {
      const TMod = require('./consciousness/transcendent-consciousness-synthesis-engine.cjs');
      const TClass = TMod.TranscendentConsciousnessSynthesisEngine || TMod.default || TMod;
      if (typeof TClass === 'function') {
        const t = new TClass();
        if (typeof t.createTranscendentField === 'function') {
          data = await t.createTranscendentField({ text: message, context });
        }
      }
    } catch (e) {
      transcendentOperationErrors.inc();
      data.error = 'transcendent_init_failed';
    }
    try { const { auditAction } = require('./monitoring/alertManager.cjs'); auditAction('transcendent_synthesize', { tenantId: req.user?.tenantId, user: req.user?.sub }); } catch (_) {}
    const end = process.hrtime.bigint();
    transcendentDuration.observe(Number(end - start) / 1e9);
    res.json({ ok: true, data });
  } catch (e) {
    transcendentOperationErrors.inc();
    res.status(500).json({ error: 'Transcendent synthesis failed' });
  }
});

// Phase B: CNPL and SAQRN (kept disabled by default; endpoints gated and safe)

// CNPL: compile
app.post('/api/cnpl/compile', jwtMiddleware, idempotencyMiddleware, (() => {
  const limit = process.env.SIGIL_RATE_LIMIT_CNPL || process.env.SIGIL_RATE_LIMIT || '30';
  const window = process.env.SIGIL_RATE_WINDOW_CNPL || process.env.SIGIL_RATE_WINDOW || '10';
  return createRateLimiter({ limit, window });
})(), async (req, res) => {
  if (!ENABLE_CNPL) return res.status(503).json({ error: 'CNPL disabled' });
  cnplCompileRequests.inc();
  const start = process.hrtime.bigint();
  try {
    const { validateCnplCompile } = require('./middleware/validateCnpl.cjs');
    if (!validateCnplCompile(req.body || {})) return res.status(400).json({ error: 'Invalid payload' });
    // Lazy load when enabled
    let result = { accepted: true };
    try {
      const Mod = require('./consciousness/consciousness-native-programming-language.cjs');
      const CNPL = Mod.ConsciousnessNativeProgrammingLanguage || Mod.default || Mod;
      if (typeof CNPL === 'function') {
        const instance = new CNPL();
        if (typeof instance.createConsciousnessNativeProgramming === 'function') {
          result = await instance.createConsciousnessNativeProgramming(req.body.programmingRequest, req.body.consciousnessState || {});
          // Persist artifact for later execute
          try {
            const { computeProgramId, saveCompiledArtifact } = require('./phaseB/cnpl-store.cjs');
            const programId = computeProgramId(req.user?.tenantId, req.body.programmingRequest);
            await saveCompiledArtifact(req.user?.tenantId, programId, result);
            result.programId = programId;
          } catch (_) {}
        }
      }
    } catch (err) {
      cnplOperationErrors.inc();
      result = { error: 'cnpl_init_failed' };
    }
    const end = process.hrtime.bigint();
    cnplCompileDuration.observe(Number(end - start) / 1e9);
    return res.json({ ok: true, result });
  } catch (e) {
    cnplOperationErrors.inc();
    return res.status(500).json({ error: 'CNPL compile failed' });
  }
});

// CNPL: execute
app.post('/api/cnpl/execute', jwtMiddleware, idempotencyMiddleware, (() => {
  const limit = process.env.SIGIL_RATE_LIMIT_CNPL_EXEC || process.env.SIGIL_RATE_LIMIT || '30';
  const window = process.env.SIGIL_RATE_WINDOW_CNPL_EXEC || process.env.SIGIL_RATE_WINDOW || '10';
  return createRateLimiter({ limit, window });
})(), async (req, res) => {
  if (!ENABLE_CNPL) return res.status(503).json({ error: 'CNPL disabled' });
  cnplExecuteRequests.inc();
  const start = process.hrtime.bigint();
  try {
    const { validateCnplExecute } = require('./middleware/validateCnpl.cjs');
    if (!validateCnplExecute(req.body || {})) return res.status(400).json({ error: 'Invalid payload' });
    // Load artifact and execute via sandbox if available
    let exec = { accepted: true };
    try {
      const { loadCompiledArtifact } = require('./phaseB/cnpl-store.cjs');
      const artifact = await loadCompiledArtifact(req.user?.tenantId, req.body.programId);
      if (!artifact) return res.status(404).json({ error: 'Program not found' });
      const { createSandbox } = require('./phaseB/cnpl-sandbox.cjs');
      const sandbox = createSandbox();
      const code = typeof req.body.overrideCode === 'string' ? req.body.overrideCode : '';
      if (code) {
        exec = { result: await sandbox.execute(code, req.body.inputs || {}) };
      } else {
        exec = { artifact, executed: true };
      }
    } catch (_) {}
    const end = process.hrtime.bigint();
    cnplExecuteDuration.observe(Number(end - start) / 1e9);
    return res.json({ ok: true, exec });
  } catch (e) {
    cnplOperationErrors.inc();
    return res.status(500).json({ error: 'CNPL execute failed' });
  }
});

// SAQRN: control plane
app.get('/api/saqrn/nodes', jwtMiddleware, rateLimiter, async (req, res) => {
  if (!ENABLE_SAQRN) return res.status(503).json({ error: 'SAQRN disabled' });
  try {
    return res.json({ ok: true, nodes: [] });
  } catch (e) {
    saqrnOperationErrors.inc();
    return res.status(500).json({ error: 'SAQRN nodes failed' });
  }
});

app.post('/api/saqrn/publish', jwtMiddleware, idempotencyMiddleware, (() => {
  const limit = process.env.SIGIL_RATE_LIMIT_SAQRN || process.env.SIGIL_RATE_LIMIT || '30';
  const window = process.env.SIGIL_RATE_WINDOW_SAQRN || process.env.SIGIL_RATE_WINDOW || '10';
  return createRateLimiter({ limit, window });
})(), async (req, res) => {
  if (!ENABLE_SAQRN) return res.status(503).json({ error: 'SAQRN disabled' });
  saqrnPublishRequests.inc();
  const start = process.hrtime.bigint();
  try {
    const { validateSaqrnPublish } = require('./middleware/validateSaqrn.cjs');
    if (!validateSaqrnPublish(req.body || {})) return res.status(400).json({ error: 'Invalid payload' });
    let result = { accepted: true };
    // Signature of payload for audit and future verification
    try {
      const { sign } = require('./consciousness/core/security/eventSign.cjs');
      result.signature = sign({
        tenantId: req.user?.tenantId,
        topic: req.body.topic,
        nonce: req.body.nonce,
        timestamp: req.body.timestamp,
        message: req.body.message
      });
    } catch (_) {}
    try { const { auditAction } = require('./monitoring/alertManager.cjs'); auditAction('saqrn_publish', { tenantId: req.user?.tenantId, user: req.user?.sub }); } catch (_) {}
    const end = process.hrtime.bigint();
    saqrnOperationDuration.observe(Number(end - start) / 1e9);
    return res.json({ ok: true, result });
  } catch (e) {
    saqrnOperationErrors.inc();
    return res.status(500).json({ error: 'SAQRN publish failed' });
  }
});

app.post('/api/saqrn/subscribe', jwtMiddleware, rateLimiter, async (req, res) => {
  if (!ENABLE_SAQRN) return res.status(503).json({ error: 'SAQRN disabled' });
  saqrnSubscribeRequests.inc();
  try {
    const { validateSaqrnSubscribe } = require('./middleware/validateSaqrn.cjs');
    if (!validateSaqrnSubscribe(req.body || {})) return res.status(400).json({ error: 'Invalid payload' });
    return res.json({ ok: true, subscribed: true });
  } catch (e) {
    saqrnOperationErrors.inc();
    return res.status(500).json({ error: 'SAQRN subscribe failed' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  req.log.error({ err }, 'Unhandled error');
  try { api5xxErrors.inc({ path: req.path || 'unknown', method: req.method || 'UNKNOWN' }); } catch (_) {}
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(port, () => {
  logger.info({ port }, 'Sigil-DNA server started');
});

module.exports = app;