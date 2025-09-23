const qs = (id) => document.getElementById(id);
let ws = null;
let currentQuest = null;
let metricsTimer = null;

function log(...args) {
  const el = qs('log');
  const line = args.map((a)=> typeof a==='string'?a:JSON.stringify(a)).join(' ');
  el.textContent += line + "\n";
  el.scrollTop = el.scrollHeight;
}

function setConnState(state) { qs('connState').textContent = state; }

function setDirectorState({ tickHz, coherence, resonance }) {
  if (tickHz) qs('tickHz').textContent = tickHz;
  if (coherence !== undefined) qs('coherence').textContent = coherence;
  if (resonance !== undefined) qs('resonance').textContent = resonance;
}

function setQuest(q) {
  currentQuest = q;
  qs('questTitle').textContent = q?.title ?? '—';
  qs('questSeed').textContent = q?.seed ?? '—';
  qs('questSigil').textContent = q?.sigil ?? '—';
  qs('questSig').textContent = q?.provenance?.signature ?? '—';
  const obj = q?.objectives?.[0];
  qs('questObj').textContent = obj ? `${obj.kind} ${obj.count || ''} ${obj.target || ''} (${obj.hint || ''})` : '—';
  const enable = !!q;
  qs('btnAccept').disabled = !enable;
  qs('btnComplete').disabled = !enable;
  qs('btnNewQuest').disabled = !enable;
}

function setCompanion(mood, bond) {
  qs('mood').textContent = mood ?? '—';
  qs('bond').textContent = bond != null ? String(bond) : '—';
}

function setMint(tokenId, metadata) {
  qs('tokenId').textContent = tokenId || '—';
  qs('mintJson').textContent = metadata ? JSON.stringify(metadata, null, 2) : '—';
}

async function refreshMetrics() {
  try {
    const r = await fetch('/api/game/metrics');
    const j = await r.json();
    if (j?.ok && j.metrics) {
      qs('ticksSent').textContent = j.metrics.ticksSent;
      qs('questsOffered').textContent = j.metrics.questsOffered;
      qs('mints').textContent = j.metrics.mints;
    }
  } catch (e) {
    // ignore for demo
  }
}

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/game';
  ws = new WebSocket(url);
  ws.onopen = () => {
    setConnState('connected');
    qs('btnConnect').disabled = true;
    qs('btnDisconnect').disabled = false;
    metricsTimer = setInterval(refreshMetrics, 1000);
    log('Connected to', url);
  };
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'director:state':
          setDirectorState({ tickHz: msg.tickHz, coherence: msg.coherence, resonance: msg.resonance });
          break;
        case 'director:tick':
          // Optionally update dynamic coherence/resonance here
          if (msg.state) setDirectorState(msg.state);
          break;
        case 'quest:offer':
          setQuest(msg.quest);
          log('Quest offered:', msg.quest?.id, msg.quest?.title);
          break;
        case 'npc:spawn':
          log('NPC spawn:', msg.npc?.name, '-', msg.npc?.hint || '');
          break;
        case 'companion:update':
          setCompanion(msg.mood, msg.bond);
          log('Companion mood:', msg.mood, 'bond:', msg.bond);
          break;
        case 'item:minted':
          setMint(msg.tokenId, msg.metadata);
          log('Minted token:', msg.tokenId);
          break;
        default:
          // log other messages quietly
          break;
      }
    } catch (e) {
      log('Parse error:', String(e));
    }
  };
  ws.onclose = () => {
    setConnState('disconnected');
    qs('btnConnect').disabled = false;
    qs('btnDisconnect').disabled = true;
    setQuest(null);
    setCompanion(null, null);
    setMint(null, null);
    if (metricsTimer) clearInterval(metricsTimer);
    log('Disconnected');
  };
  ws.onerror = (e) => log('WS error', String(e?.message || e));
}

function disconnect() { if (ws) ws.close(); }
function acceptQuest() { if (ws && currentQuest) ws.send(JSON.stringify({ type: 'quest:accept', questId: currentQuest.id })); }
function completeQuest() { if (ws && currentQuest) ws.send(JSON.stringify({ type: 'quest:complete', questId: currentQuest.id })); }
function newQuest() { if (ws) ws.send(JSON.stringify({ type: 'quest:new' })); }

qs('btnConnect').onclick = connect;
qs('btnDisconnect').onclick = disconnect;
qs('btnAccept').onclick = acceptQuest;
qs('btnComplete').onclick = completeQuest;
qs('btnNewQuest').onclick = newQuest;

// Auto-connect for convenience in demos
connect();

