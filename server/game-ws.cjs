// Lightweight game demo WebSocket with signed unique quests, companion updates,
// and mint events to showcase the AI director + provenance moat.
// Path: /ws/game

/* eslint-disable @typescript-eslint/no-var-requires */
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

// In-memory demo metrics for investor HUD
const metrics = {
  startedAt: new Date().toISOString(),
  tickHz: 20,
  ticksSent: 0,
  questsOffered: 0,
  questsAccepted: 0,
  questsCompleted: 0,
  mints: 0,
  cacheHits: 0,
  lastSeed: null,
  lastSigil: null,
  lastSignature: null,
};

// Minimal pre-gen quest cache to guarantee instant responses offline
const pregen = [
  {
    title: 'Whispers in the Grove',
    objective: { kind: 'collect', target: 'Grove Spark', count: 3, hint: 'By the singing stone.' },
    rewardName: 'Grove‑Bound Bracer',
  },
  {
    title: 'Echoes of the Lantern',
    objective: { kind: 'activate', target: 'Ancient Lanterns', count: 2, hint: 'Near the old well.' },
    rewardName: 'Lantern‑Keeper Sash',
  },
  {
    title: 'Seeds of the Sky Vine',
    objective: { kind: 'escort', target: 'Sky Vine Sprout', count: 1, hint: 'Follow the fireflies.' },
    rewardName: 'Sky‑Vine Circlet',
  },
];

function randomBytesHex(n = 4) {
  return crypto.randomBytes(n).toString('hex');
}

function makeSigil() {
  return `SIG-${randomBytesHex(4)}`;
}

function makeSeed() {
  // Simple demo seed
  return Math.floor(Math.random() * 1e12).toString(36);
}

function signProvenance(seed, sigil, questTitle) {
  const createdAt = new Date().toISOString();
  const base = `${seed}|${sigil}|${questTitle}|${createdAt}`;
  const signature = crypto.createHash('sha256').update(base).digest('hex');
  metrics.lastSignature = signature;
  return { signature, createdAt, story: `Forged when "${questTitle}" found its bearer.` };
}

function makeQuest() {
  // Use pregen as a base, then stamp with seed/sigil/signature to guarantee uniqueness
  const base = pregen[Math.floor(Math.random() * pregen.length)];
  const seed = makeSeed();
  const sigil = makeSigil();
  const id = `Q-${Date.now().toString(36)}-${randomBytesHex(2)}`;
  const provenance = signProvenance(seed, sigil, base.title);
  metrics.lastSeed = seed;
  metrics.lastSigil = sigil;
  return {
    id,
    title: base.title,
    seed,
    sigil,
    objectives: [
      {
        id: 'obj1',
        ...base.objective,
      },
    ],
    rewardName: base.rewardName,
    provenance,
  };
}

function getDirectorState() {
  // Demo coherence/resonance fluctuate slightly to feel alive
  const phase = Date.now() / 1000;
  const coherence = 0.9 + 0.05 * Math.sin(phase);
  const resonance = 0.85 + 0.07 * Math.cos(phase * 0.7);
  return { coherence: Number(coherence.toFixed(3)), resonance: Number(resonance.toFixed(3)) };
}

function safeParse(raw) {
  try {
    return JSON.parse(typeof raw === 'string' ? raw : raw.toString());
  } catch {
    return null;
  }
}

function initGameWS(server) {
  const wss = new WebSocketServer({ server, path: '/ws/game' });

  // 20 Hz director tick for HUD
  const tickIntervalMs = Math.max(10, Math.floor(1000 / metrics.tickHz));
  const tickTimer = setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.readyState === 1) {
        ws.send(
          JSON.stringify({ type: 'director:tick', t: Date.now(), state: getDirectorState() })
        );
        metrics.ticksSent++;
      }
    }
  }, tickIntervalMs);

  wss.on('connection', (ws) => {
    // Send current director state + unique quest offer
    const quest = makeQuest();
    metrics.questsOffered++;
    ws.send(JSON.stringify({ type: 'director:state', ...getDirectorState(), tickHz: metrics.tickHz }));
    ws.send(JSON.stringify({ type: 'quest:offer', quest }));

    ws.on('message', (raw) => {
      const msg = safeParse(raw);
      if (!msg || typeof msg.type !== 'string') return;

      switch (msg.type) {
        case 'quest:accept': {
          if (msg.questId && msg.questId === quest.id) metrics.questsAccepted++;
          // Spawn a hint NPC and nudge companion mood
          ws.send(
            JSON.stringify({
              type: 'npc:spawn',
              npc: { name: 'Eira', mood: 'curious', hint: quest.objectives[0].hint || 'Stay alert.' },
            })
          );
          ws.send(
            JSON.stringify({ type: 'companion:update', mood: 'focused', bond: 0.62 })
          );
          break;
        }
        case 'quest:complete': {
          if (msg.questId && msg.questId === quest.id) metrics.questsCompleted++;
          // Mint demo item with provenance metadata
          const tokenId = `${Date.now().toString(36)}${randomBytesHex(2)}`;
          const metadata = {
            name: quest.rewardName,
            originQuestId: quest.id,
            seed: quest.seed,
            sigil: quest.sigil,
            provenance: quest.provenance,
          };
          metrics.mints++;
          ws.send(JSON.stringify({ type: 'item:minted', tokenId, metadata }));
          break;
        }
        case 'quest:new': {
          const newQuest = makeQuest();
          metrics.questsOffered++;
          ws.send(JSON.stringify({ type: 'quest:offer', quest: newQuest }));
          break;
        }
        case 'ping': {
          ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
          break;
        }
        default:
          // no-op
          break;
      }
    });
  });

  wss.on('close', () => clearInterval(tickTimer));

  console.log('[game-ws] WebSocket server running on /ws/game');
  return wss;
}

function getGameMetrics() {
  return {
    ...metrics,
    uptimeSec: Math.round((Date.now() - Date.parse(metrics.startedAt)) / 1000),
  };
}

module.exports = { initGameWS, getGameMetrics };

