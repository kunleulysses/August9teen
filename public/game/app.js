// Featherweight Consciousness Visuals (autonomous, self-evolving)
// - Connects to /ws/game (web client path)
// - Reacts to director:state and director:tick to modulate visuals
// - Fetches a visual genome from /api/game/visuals and evolves it over time

const qs = (id) => document.getElementById(id);
const canvas = qs('view');
const ctx = canvas.getContext('2d', { alpha: false });

const hud = {
  conn: qs('conn'),
  coh: qs('coh'),
  res: qs('res'),
  evo: qs('evolve'),
};

// Minimal UI bindings for gameplay
const ui = {
  area: qs('area'),
  mood: qs('mood'),
  energy: qs('energy'),
  sanctL: qs('sanctL'),
  sanctX: qs('sanctX'),
  battleMsg: qs('battleMsg'),
  btnFeed: qs('btnFeed'),
  btnPlay: qs('btnPlay'),
  btnExplore: qs('btnExplore'),
  btnBattleJoin: qs('btnBattleJoin'),
  btnBattleLeave: qs('btnBattleLeave'),
  btnBattleAccept: qs('btnBattleAccept'),
  btnBattleDecline: qs('btnBattleDecline'),
  btnAegis: qs('btnAbilityAegis'),
  btnStrike: qs('btnAbilityStrike'),
  btnSanctGet: qs('btnSanctGet'),
  btnSanctAscend: qs('btnSanctAscend'),
  selArea: qs('selArea'),
  tabButtons: Array.from(document.querySelectorAll('#ui .tab')),
  tabPanels: {
    controls: document.getElementById('tab-controls'),
    inventory: document.getElementById('tab-inventory'),
    journal: document.getElementById('tab-journal'),
    ladder: document.getElementById('tab-ladder'),
  },
  invList: document.getElementById('invList'),
  btnInvAddApple: document.getElementById('btnInvAddApple'),
  btnInvClear: document.getElementById('btnInvClear'),
  invAddId: document.getElementById('invAddId'),
  invAddName: document.getElementById('invAddName'),
  invAddType: document.getElementById('invAddType'),
  invAddQty: document.getElementById('invAddQty'),
  btnInvAdd: document.getElementById('btnInvAdd'),
  journalList: document.getElementById('journalList'),
  btnJournalRefresh: document.getElementById('btnJournalRefresh'),
  btnJournalPrev: document.getElementById('btnJournalPrev'),
  btnJournalNext: document.getElementById('btnJournalNext'),
  journalPage: document.getElementById('journalPage'),
  ladderList: document.getElementById('ladderList'),
  btnLadderRefresh: document.getElementById('btnLadderRefresh'),
  profilePanel: document.getElementById('profilePanel'),
  profileBody: document.getElementById('profileBody'),
  btnProfileClose: document.getElementById('btnProfileClose'),
  btnProfileChallenge: document.getElementById('btnProfileChallenge'),
  btnProfileSpectate: document.getElementById('btnProfileSpectate'),
  chkSpectate: document.getElementById('chkSpectate'),
  spectateLog: document.getElementById('spectateLog'),
  spectateArea: document.getElementById('spectateArea'),
  btnSpectateRefresh: document.getElementById('btnSpectateRefresh'),
  btnSpectateList: document.getElementById('btnSpectateList'),
  spectateList: document.getElementById('spectateList'),
  arenaHud: document.getElementById('arenaHud'),
  arenaNames: document.getElementById('arenaNames'),
  arenaBarA: document.getElementById('arenaBarA'),
  arenaBarB: document.getElementById('arenaBarB'),
  arenaRound: document.getElementById('arenaRound'),
  arenaStatusA: document.getElementById('arenaStatusA'),
  arenaStatusB: document.getElementById('arenaStatusB'),
};

let W = 0, H = 0, DPR = Math.max(1, Math.min(2, devicePixelRatio || 1));
function resize() {
  const b = canvas.getBoundingClientRect();
  W = Math.floor(b.width * DPR);
  H = Math.floor(b.height * DPR);
  canvas.width = W;
  canvas.height = H;
}
window.addEventListener('resize', resize);
resize();

// Runtime state
const state = {
  coherence: 0.9,
  resonance: 0.85,
  tickHz: 20,
  lastTick: 0,
  connected: false,
  sessionId: null,
  journal: { page: 1, size: 20 },
  profile: { playerId: null, opponentSessionId: null },
};

// Simple client-side inventory to display minted items (persist in localStorage)
const inventory = JSON.parse(localStorage.getItem('fw_inventory') || '[]');
function saveInventory(){ try { localStorage.setItem('fw_inventory', JSON.stringify(inventory.slice(-200))); } catch {}
}
function renderInventory(){
  if (!ui.invList) return;
  if (!inventory.length) { ui.invList.textContent = 'No items yet.'; return; }
  ui.invList.innerHTML = inventory.slice().reverse().map(it => {
    const prov = it.metadata && it.metadata.provenance ? ` • hash ${String(it.metadata.provenance.spriteHash||'').slice(0,8)}…` : '';
    return `<div>• ${it.metadata?.name || 'Item'} <span class="pill">${it.tokenId}</span>${prov}</div>`;
  }).join('');
}
renderInventory();

// Visual genome (fetched + locally evolved)
const genome = {
  seed: 1,
  palette: ['#0b0d10','#1e2a38','#2a78ff','#89ffa1','#ffd289'],
  baseShape: 'spiral',
  speedFactor: 0.7,
  density: 0.6,
  wander: 0.35,
  evolveEveryMs: 30000,
  nextEvolveAt: performance.now() + 30000,
};

// Biome layers (parallax)
const biome = {
  area: 'town',
  sky: null,
  mid: null,
  fore: null,
  ready: false,
};

async function loadBiomes() {
  try {
    const r = await fetch('/api/game/assets');
    const j = await r.json();
    const bgs = j?.manifest?.backgrounds || {};
    const area = biome.area in bgs ? biome.area : Object.keys(bgs)[0];
    const man = bgs[area];
    if (!man) return;
    biome.area = area;
    const sky = new Image(); sky.decoding='async'; sky.src = man.sky + `?v=${Date.now()}`; await sky.decode().catch(()=>{});
    const mid = new Image(); mid.decoding='async'; mid.src = man.mid + `?v=${Date.now()}`; await mid.decode().catch(()=>{});
    const fore = new Image(); fore.decoding='async'; fore.src = man.fore + `?v=${Date.now()}`; await fore.decode().catch(()=>{});
    biome.sky = sky; biome.mid = mid; biome.fore = fore; biome.ready = true;
  } catch {}
}
loadBiomes();

// Utility: PRNG
function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fetch initial genome from server
async function loadGenome() {
  try {
    const r = await fetch('/api/game/visuals');
    const j = await r.json();
    if (j?.ok && j.genome) {
      Object.assign(genome, j.genome);
      genome.nextEvolveAt = performance.now() + (genome.evolveEveryMs || 30000);
    }
  } catch {}
}
loadGenome();

// Asset manifest + companion sprite
const companion = {
  ready: false,
  img: null,
  sheet: null,
  frameWidth: 0,
  frameHeight: 0,
  frames: 1,
  columns: 1,
  fps: 6,
  t: 0,
  bx: 0,
  by: 0,
  pulse: 0,
};

async function loadCompanion() {
  try {
    const r = await fetch('/api/game/assets');
    const j = await r.json();
    const man = j?.manifest?.companions || {};
    // prefer nyx.idle else flappy.idle
    let sel = (man.autonomous && man.autonomous.idle) ? man.autonomous.idle : ((man.nyx && man.nyx.idle) ? man.nyx.idle : (man.flappy && man.flappy.idle ? man.flappy.idle : null));
    if (!sel) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = sel.sheet;
    await img.decode().catch(()=>{});
    if (!img.complete) {
      // try fallback flappy
      if (man.flappy && man.flappy.idle && man.flappy.idle.sheet !== sel.sheet) {
        img.src = man.flappy.idle.sheet;
        await img.decode().catch(()=>{});
        sel = man.flappy.idle;
      }
    }
    companion.img = img;
    companion.frameWidth = sel.frameWidth || img.naturalWidth || 64;
    companion.frameHeight = sel.frameHeight || img.naturalHeight || 64;
    companion.frames = Math.max(1, sel.frames|0);
    companion.columns = Math.max(1, sel.columns|0) || companion.frames;
    companion.fps = Math.max(1, sel.fps|0) || 6;
    companion.ready = true;
  } catch {}
}
loadCompanion();

// Palette helpers
function lerp(a,b,t){ return a + (b-a)*t; }
function hexToRgb(h){
  const s = h.replace('#','');
  const n = parseInt(s.length === 3 ? s.split('').map(x=>x+x).join('') : s, 16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function rgbToStr({r,g,b}){ return `rgb(${r|0},${g|0},${b|0})`; }
function mixHex(a,b,t){ const A=hexToRgb(a), B=hexToRgb(b); return rgbToStr({ r:lerp(A.r,B.r,t), g:lerp(A.g,B.g,t), b:lerp(A.b,B.b,t) }); }

// Particles following a parametric flow field
const MAX_PARTICLES = 1600;
const particles = [];
function initParticles() {
  particles.length = 0;
  const rand = mulberry32(genome.seed >>> 0);
  const count = Math.floor(MAX_PARTICLES * genome.density);
  for (let i=0;i<count;i++) {
    particles.push({
      x: rand()*W, y: rand()*H,
      vx: 0, vy: 0,
      life: 0,
      hueShift: rand(),
      speed: 0.3 + rand()*1.2,
    });
  }
}
initParticles();

// Flow field: spiral/waves/orbs/lissajous
function flow(dx, dy, t) {
  const c = state.coherence; // 0..1
  const r = state.resonance; // 0..1
  const s = genome.speedFactor;
  const w = genome.wander;
  let ax=0, ay=0;
  if (genome.baseShape === 'spiral') {
    const cx = W*0.5, cy = H*0.5;
    const x = dx - cx, y = dy - cy;
    const d = Math.hypot(x,y) + 1e-3;
    const spin = 0.8 + 1.6*c;
    ax = (-y/d) * spin + Math.sin((y+ t*0.5)*0.002 + r*2.0) * w;
    ay = ( x/d) * spin + Math.cos((x+ t*0.5)*0.002 + c*3.0) * w;
  } else if (genome.baseShape === 'waves') {
    ax = Math.sin((dy*0.01) + t*0.001 * (1.0 + 2.0*r));
    ay = Math.cos((dx*0.01) + t*0.001 * (1.0 + 2.0*c));
  } else if (genome.baseShape === 'orbs') {
    ax = Math.sin((dx*0.006) + t*0.0015) + Math.cos((dy*0.01) - t*0.0009) * 0.5;
    ay = Math.cos((dy*0.006) + t*0.0012) - Math.sin((dx*0.01) - t*0.0011) * 0.5;
  } else { // lissajous
    ax = Math.sin((dx*0.008) + t*0.001) * (0.5 + c);
    ay = Math.sin((dy*0.009) + t*0.0013 + Math.PI/2) * (0.5 + r);
  }
  return { ax: ax * (0.6 + s*1.4), ay: ay * (0.6 + s*1.4) };
}

function pickColor(i, life) {
  const p = genome.palette;
  if (!p || p.length === 0) return '#ffffff';
  const a = p[i % p.length];
  const b = p[(i+1) % p.length];
  const t = (Math.sin(life*0.015) + 1) * 0.5;
  return mixHex(a, b, t);
}

// Render loop
let last = performance.now();
function frame() {
  const now = performance.now();
  const dt = Math.min(50, now - last);
  last = now;

  // Evolve genome periodically using coherence/resonance
  if (now >= genome.nextEvolveAt) {
    genome.nextEvolveAt = now + (genome.evolveEveryMs || 30000);
    // Small mutations influenced by mindset
    const drift = (v, amt) => Math.max(0.1, Math.min(1.5, v + (amt*(state.coherence - 0.5))));
    genome.speedFactor = drift(genome.speedFactor, 0.15);
    genome.density = Math.max(0.2, Math.min(1.0, genome.density + (state.resonance - 0.5)*0.1));
    // Rotate shape occasionally
    const shapes = ['spiral','waves','orbs','lissajous'];
    const idx = (shapes.indexOf(genome.baseShape) + (state.coherence > 0.92 ? 1 : 0)) % shapes.length;
    genome.baseShape = shapes[idx];
    // Reinit particle population if density changed a lot
    initParticles();
  }

  hud.evo.textContent = ((genome.nextEvolveAt - now)/1000).toFixed(0) + 's';

  // Background: draw biome layers with slight parallax
  if (biome.ready && biome.sky && biome.mid && biome.fore) {
    const tslow = now*0.00005;
    const p1 = Math.sin(tslow*2)*12*DPR * (0.4 + state.coherence);
    const p2 = Math.cos(tslow*3)*20*DPR * (0.3 + state.resonance);
    const p3 = Math.sin(tslow*4)*28*DPR * (0.2 + (state.coherence+state.resonance)/2);
    drawLayerFit(biome.sky, 0+p1, 0, W, H);
    drawLayerFit(biome.mid, 0+p2, 0, W, H);
    drawLayerFit(biome.fore, 0+p3, 0, W, H);
  } else {
    // fallback gradient
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0, '#12161c'); g.addColorStop(1, '#0b0d10');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }

  // Motion blur/feedback to create particle trails
  ctx.fillStyle = 'rgba(11,13,16,0.12)';
  ctx.fillRect(0,0,W,H);

  const t = now;
  ctx.globalCompositeOperation = 'lighter';
  for (let i=0;i<particles.length;i++) {
    const p = particles[i];
    const f = flow(p.x, p.y, t);
    p.vx = (p.vx + f.ax) * 0.96;
    p.vy = (p.vy + f.ay) * 0.96;
    p.x += p.vx;
    p.y += p.vy;
    p.life += dt;

    if (p.x < -10 || p.y < -10 || p.x > W+10 || p.y > H+10) {
      // respawn softly from edges toward center
      const rand = mulberry32((genome.seed + i) >>> 0);
      const edge = (i + p.life) % 4;
      if (edge < 1) { p.x = 0; p.y = rand()*H; }
      else if (edge < 2) { p.x = W; p.y = rand()*H; }
      else if (edge < 3) { p.x = rand()*W; p.y = 0; }
      else { p.x = rand()*W; p.y = H; }
      p.vx = p.vy = 0;
      p.life = 0;
    }

    // Draw
    const c = pickColor(i, p.life + i*0.1);
    ctx.fillStyle = c;
    // dot size modulated by coherence
    const sz = 1 + Math.max(0, (state.coherence - 0.8)) * 6;
    ctx.fillRect(p.x, p.y, sz, sz);
  }
  ctx.globalCompositeOperation = 'source-over';

  // FX overlay queue (lightweight bursts)
  renderFx(now);

  // Draw companion sprite overlay (bottom center)
  if (companion.ready && companion.img) {
    const idleScale = 0.35 + Math.max(0, state.coherence - 0.8) * 0.4; // breathing baseline
    const pulse = 0.02 + (state.resonance - 0.8) * 0.06;
    companion.pulse = companion.pulse * 0.92 + pulse * 0.08; // smooth
    const breathe = 1.0 + Math.sin(performance.now()*0.002) * companion.pulse;

    const fw = companion.frameWidth;
    const fh = companion.frameHeight;
    const frames = companion.frames;
    const cols = companion.columns;
    const fps = companion.fps;
    companion.t += (dt/1000) * fps;
    const fi = frames > 1 ? Math.floor(companion.t) % frames : 0;
    const sx = (fi % cols) * fw;
    const sy = Math.floor(fi / cols) * fh;

    const baseW = fw * DPR * idleScale * breathe;
    const baseH = fh * DPR * idleScale * breathe;
    const dx = Math.floor(W*0.5 - baseW*0.5 + companion.bx);
    const dy = Math.floor(H - baseH - 24*DPR + companion.by);

    // Soft shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(W*0.5, H - 16*DPR, Math.max(16*DPR, baseW*0.35), 8*DPR, 0, 0, Math.PI*2);
    ctx.fill();

    try {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(companion.img, sx, sy, fw, fh, dx, dy, baseW, baseH);
    } catch {}
    // decay any bounce offsets
    companion.bx *= 0.92;
    companion.by *= 0.92;
  } else {
    // fallback primitive companion
    const rad = 18*DPR + Math.max(0, (state.coherence - 0.8))*30*DPR;
    const cx = W*0.5, cy = H - 40*DPR;
    ctx.beginPath();
    ctx.fillStyle = mixHex(genome.palette[2]||'#2a78ff', genome.palette[3]||'#89ffa1', (Math.sin(performance.now()*0.003)+1)/2);
    ctx.arc(cx, cy, rad, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// WebSocket setup (web client receives director:state + director:tick)
let ws;
function setConn(on) {
  state.connected = on;
  hud.conn.textContent = on ? 'connected' : 'disconnected';
  if (ui.authState) {
    const has = !!(localStorage.getItem('fw_jwt')||'').trim();
    ui.authState.textContent = has ? (on ? 'token (active)' : 'token (saved)') : 'none';
  }
}

function connect() {
  try { if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return; } catch {}
  let url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/game';
  try {
    const t = localStorage.getItem('fw_jwt');
    if (t) url += (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(t);
  } catch {}
  ws = new WebSocket(url);
  ws.onopen = () => {
    setConn(true);
    try { ws.send(JSON.stringify({ type: 'game:connect', payload: {} })); } catch {}
    // Prefetch journal and ladder
    try { ws.send(JSON.stringify({ type: 'game:request_memories', payload: {} })); } catch {}
    try { ws.send(JSON.stringify({ type: 'ladder:get', payload: {} })); } catch {}
    try { ws.send(JSON.stringify({ type: 'inventory:list', payload: {} })); } catch {}
  };
  ws.onclose = () => setConn(false);
  ws.onerror = () => {};
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'ui:flags': {
          // Apply UI flags (CSS variables, behavior toggles)
          const f = msg.flags || {};
          const root = document.documentElement;
          if (typeof f.primaryColor === 'string') root.style.setProperty('--primary', f.primaryColor);
          if (f.accentColor) root.style.setProperty('--accent', f.accentColor);
          if (f.glowColor) root.style.setProperty('--glow', f.glowColor);
          // Behavior: Enter to send in Chat
          if (f.chatEnterToSend && ui.chatInput) {
            ui.chatInput.onkeydown = (e) => { if (e.key === 'Enter') { if (ui.btnChatSend) ui.btnChatSend.click(); } };
          }
          break;
        }
        case 'director:state': {
          const { coherence, resonance } = msg;
          if (typeof coherence === 'number') state.coherence = coherence;
          if (typeof resonance === 'number') state.resonance = resonance;
          hud.coh.textContent = state.coherence.toFixed(3);
          hud.res.textContent = state.resonance.toFixed(3);
          break;
        }
        case 'director:tick': {
          if (msg.state) {
            const { coherence, resonance } = msg.state;
            if (typeof coherence === 'number') state.coherence = coherence;
            if (typeof resonance === 'number') state.resonance = resonance;
            hud.coh.textContent = state.coherence.toFixed(3);
            hud.res.textContent = state.resonance.toFixed(3);
          }
          state.lastTick = performance.now();
          break;
        }
        case 'npc:spawn': {
          // small flash impulse on spawn
          screenFlash(0.08);
          // tiny companion bounce
          companion.by -= 12 * DPR;
          break;
        }
        case 'sprite:update': {
          const m = msg.sprite;
          if (m && m.sheet) {
            // reload image with cache-busting
            const img = new Image();
            img.decoding = 'async';
            img.src = m.sheet + `?v=${Date.now()}`;
            img.onload = () => {
              companion.img = img;
              companion.frameWidth = m.frameWidth || img.naturalWidth || companion.frameWidth;
              companion.frameHeight = m.frameHeight || img.naturalHeight || companion.frameHeight;
              companion.frames = m.frames|0 || 1;
              companion.columns = m.columns|0 || companion.frames;
              companion.fps = m.fps|0 || 6;
              companion.t = 0;
              companion.ready = true;
            };
          }
          break;
        }
        case 'item:minted': {
          try { send('inventory:list', {}); } catch {}
          screenFlash(0.12);
          break;
        }
        case 'companion:update': {
          // nudge density slightly with bond/mood
          if (typeof msg.bond === 'number') {
            genome.density = Math.max(0.2, Math.min(1.0, genome.density + (msg.bond - 0.5)*0.02));
          }
          // lateral wiggle by mood
          if (typeof msg.mood === 'string') {
            const m = msg.mood.toLowerCase();
            companion.bx += (m.includes('play') || m.includes('happy')) ? (4*DPR) : (m.includes('tired') ? (-2*DPR) : (1*DPR));
            ui.mood && (ui.mood.textContent = msg.mood);
          }
          break;
        }
        case 'game:initial_state': {
          state.sessionId = msg.sessionId || state.sessionId;
          const area = (msg.world && msg.world.currentArea) || 'town';
          biome.area = area; ui.area && (ui.area.textContent = area);
          loadBiomes();
          if (msg.sanctuary) { ui.sanctL && (ui.sanctL.textContent = msg.sanctuary.level); ui.sanctX && (ui.sanctX.textContent = msg.sanctuary.xp); }
          if (msg.companion) { ui.energy && (ui.energy.textContent = msg.companion.energy); ui.mood && (ui.mood.textContent = msg.companion.mood); }
          break;
        }
        case 'sanctuary:state': {
          const s = msg; ui.sanctL && (ui.sanctL.textContent = s.level); ui.sanctX && (ui.sanctX.textContent = s.xp);
          break;
        }
        case 'world:fx': {
          if (msg.effect) { queueFx({ color: msg.effect.color, amplitude: msg.effect.amplitude, durationMs: msg.effect.durationMs }); }
          if (ui.chkSpectate && ui.chkSpectate.checked && ui.spectateLog) {
            ui.spectateLog.textContent += `\nFX ${msg.effect?.type || ''}`;
            ui.spectateLog.scrollTop = ui.spectateLog.scrollHeight;
          }
          break;
        }
        case 'ability:result': {
          if (msg.ok) screenFlash(0.05);
          if (msg.stats && typeof msg.stats.energy === 'number') ui.energy && (ui.energy.textContent = msg.stats.energy);
          break;
        }
        case 'companion:legendary': {
          if (ui.btnAegis) ui.btnAegis.disabled = false;
          if (ui.btnStrike) ui.btnStrike.disabled = false;
          screenFlash(0.1);
          break;
        }
        case 'companion:mood_change': {
          if (msg.stats && typeof msg.stats.energy === 'number') ui.energy && (ui.energy.textContent = msg.stats.energy);
          if (typeof msg.mood === 'string') ui.mood && (ui.mood.textContent = msg.mood);
          break;
        }
        case 'battle:queued': { ui.battleMsg && (ui.battleMsg.textContent = `Queued (pos ${msg.position})`); break; }
        case 'battle:unqueued': { ui.battleMsg && (ui.battleMsg.textContent = 'Queue left'); break; }
        case 'battle:match_found': { ui.battleMsg && (ui.battleMsg.textContent = 'Match found! Use Accept in your client.'); break; }
        case 'battle:cooldown': { ui.battleMsg && (ui.battleMsg.textContent = `Cooldown ${Math.ceil((msg.waitMs||0)/1000)}s`); break; }
        case 'battle:declined': { ui.battleMsg && (ui.battleMsg.textContent = 'Battle declined'); break; }
        case 'battle:result': { ui.battleMsg && (ui.battleMsg.textContent = `Battle: ${msg.outcome||'done'} (xp +${msg.xpTransferred||0})`); break; }
        case 'biome:update': {
          const bgs = msg.backgrounds || {};
          const man = bgs[biome.area] || bgs.town || null;
          if (man) {
            // reload with cache bust
            const sky = new Image(); sky.src = man.sky + `?v=${Date.now()}`;
            const mid = new Image(); mid.src = man.mid + `?v=${Date.now()}`;
            const fore = new Image(); fore.src = man.fore + `?v=${Date.now()}`;
            sky.onload = () => { biome.sky = sky; biome.ready = !!(biome.sky&&biome.mid&&biome.fore); };
            mid.onload = () => { biome.mid = mid; biome.ready = !!(biome.sky&&biome.mid&&biome.fore); };
            fore.onload = () => { biome.fore = fore; biome.ready = !!(biome.sky&&biome.mid&&biome.fore); };
          }
          break;
        }
        case 'world:event': {
          if (ui.chkSpectate && ui.chkSpectate.checked && ui.spectateLog) {
            const area = msg.area || biome.area;
            ui.spectateLog.textContent += `\nEvent ${area}: ${JSON.stringify(msg.encounter || msg.npc || msg)}`;
            ui.spectateLog.scrollTop = ui.spectateLog.scrollHeight;
          }
          break;
        }
        case 'world:global_event': {
          if (ui.chkSpectate && ui.chkSpectate.checked && ui.spectateLog) {
            ui.spectateLog.textContent += `\nGlobal: ${JSON.stringify(msg)}`;
            ui.spectateLog.scrollTop = ui.spectateLog.scrollHeight;
          }
          break;
        }
        case 'spectate:battle:event': {
          handleBattleSpectateEvent(msg);
          break;
        }
        case 'spectate:battles:list': {
          if (ui.spectateList) {
            const items = msg.items || [];
            ui.spectateList.innerHTML = items.length ? items.map(it => (
              `<div data-bkey="${escapeHtml(String(it.battleKey||''))}">• ${escapeHtml(it.a)} vs ${escapeHtml(it.b)} — areas: ${(it.areas||[]).join(', ')} <button class="watch">Watch</button></div>`
            )).join('') : 'No battles.';
            Array.from(ui.spectateList.querySelectorAll('button.watch')).forEach((b) => {
              b.onclick = () => {
                const row = b.closest('[data-bkey]');
                const key = row && row.getAttribute('data-bkey');
                if (key) send('spectate:battle', { battleKey: key });
              };
            });
          }
          break;
        }
        case 'fx:emit': {
          queueFx(msg);
          break;
        }
        case 'inventory:list': {
          try {
            const items = Array.isArray(msg.items) ? msg.items : [];
            inventory.length = 0; items.forEach((it) => inventory.push(it));
            renderInventory();
          } catch {}
          break;
        }
        case 'ladder:list': {
          if (ui.ladderList) {
            const list = msg.list || msg.ladder || msg.items || [];
            ui.ladderList.innerHTML = list.map((r, i) => {
              const pid = r.playerId || r.player_id || (r.username ? `player_${r.username}` : '');
              return `<div data-pid="${escapeHtml(String(pid))}" style="cursor:pointer"> ${i+1}. <strong>${escapeHtml(r.username || r.player_id || r.playerId || '')}</strong> • Sanct ${r.sanctuaryLevel || r.sanctuary_level || 1} • Comp ${r.companionLevel || r.companion_level || 1}</div>`;
            }).join('') || 'No data.';
            // Attach click to fetch profiles
            Array.from(ui.ladderList.querySelectorAll('[data-pid]')).forEach((el) => {
              el.addEventListener('click', async () => {
                const pid = el.getAttribute('data-pid');
                if (!pid) return;
                try {
                  const r = await fetch(`/api/game/profile/${encodeURIComponent(pid)}`);
                  const j = await r.json();
                  if (j?.ok) {
                    const inv = (j.inventory||[]).slice(0,5).map(it=>escapeHtml(it.name||it.id)).join(', ') || '-';
                    const battles = (j.battles||[]).slice(0,3).map(b => (b.youWon? 'W':'L')).join(' ') || '-';
                    el.insertAdjacentHTML('afterend', `<div style="margin:4px 0 10px 12px; opacity:0.9;">Inv: ${inv} • Sanct: L${j.sanctuary?.level || 1} (${j.sanctuary?.xp || 0}xp) • Battles: ${battles}</div>`);
                  }
                } catch {}
              });
            });
          }
          break;
        }
        case 'companion:memories': {
          if (ui.journalList) {
            const items = msg.items || [];
            ui.journalList.innerHTML = items.map(it => `<div>• ${escapeHtml(it.type || it.kind || 'event')} — ${escapeHtml(JSON.stringify(it))}</div>`).join('') || 'Empty.';
          }
          break;
        }
        case 'companion:memories_page': {
          if (ui.journalList) {
            const items = msg.items || [];
            ui.journalList.innerHTML = items.map(it => `<div>• ${escapeHtml(it.type || it.kind || 'event')} — ${escapeHtml(JSON.stringify(it))}</div>`).join('') || 'Empty.';
          }
          if (ui.journalPage && typeof msg.page === 'number') ui.journalPage.textContent = String(msg.page);
          break;
        }
        default: break;
      }
    } catch {}
  };
}

// Subtle flash using overlay fill
let flashT = 0;
function screenFlash(amount) {
  flashT = Math.min(1, flashT + amount);
}

// Overlay pass loop
(function overlayLoop(){
  flashT *= 0.92;
  if (flashT > 0.01) {
    ctx.fillStyle = `rgba(255,255,255,${flashT*0.05})`;
    ctx.fillRect(0,0,W,H);
  }
  requestAnimationFrame(overlayLoop);
})();

connect();
document.addEventListener('visibilitychange', () => { if (!document.hidden) connect(); });

// Helpers
function drawLayerFit(img, x, y, w, h){
  try {
    const arImg = img.naturalWidth / img.naturalHeight;
    const arDst = w / h;
    let dw, dh;
    if (arImg > arDst) { dh = h; dw = h * arImg; } else { dw = w; dh = w / arImg; }
    const dx = Math.floor(x + (w - dw)/2);
    const dy = Math.floor(y + (h - dh)/2);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, dx, dy, dw, dh);
  } catch {}
}

// FX system
const fxQueue = [];
function queueFx(fx){
  const now = performance.now();
  fxQueue.push({ ...fx, start: now });
}

// UI bindings
function send(type, payload){ try { ws && ws.send(JSON.stringify({ type, payload })); } catch {} }
function track(event, details){ try { send('ui:telemetry', { event, details }); } catch {} }
if (ui.btnFeed) ui.btnFeed.onclick = () => send('companion:feed', { foodType: 'apple' });
if (ui.btnPlay) ui.btnPlay.onclick = () => send('companion:play', { gameType: 'catch' });
if (ui.btnExplore) ui.btnExplore.onclick = () => { const area = ui.selArea ? ui.selArea.value : 'town'; biome.area = area; if (ui.area) ui.area.textContent = area; track('click_explore', { area }); send('world:explore', { area }); };
if (ui.btnBattleJoin) ui.btnBattleJoin.onclick = () => send('battle:queue_join', {});
if (ui.btnBattleLeave) ui.btnBattleLeave.onclick = () => send('battle:queue_leave', {});
if (ui.btnBattleAccept) ui.btnBattleAccept.onclick = () => send('battle:accept', {});
if (ui.btnBattleDecline) ui.btnBattleDecline.onclick = () => send('battle:decline', {});
if (ui.btnAegis) ui.btnAegis.onclick = () => send('ability:use', { abilityId: 'crystal_aegis' });
if (ui.btnStrike) ui.btnStrike.onclick = () => send('ability:use', { abilityId: 'resonant_strike' });
if (ui.btnSanctGet) ui.btnSanctGet.onclick = () => send('sanctuary:get', {});
if (ui.btnSanctAscend) ui.btnSanctAscend.onclick = () => send('sanctuary:ascend', {});
if (ui.btnInvAddApple) ui.btnInvAddApple.onclick = () => send('inventory:add', { id: 'apple', name: 'Apple', type: 'food', quantity: 1 });
if (ui.btnInvAdd) ui.btnInvAdd.onclick = () => {
  const id = (ui.invAddId && ui.invAddId.value) || '';
  const name = (ui.invAddName && ui.invAddName.value) || '';
  const type = (ui.invAddType && ui.invAddType.value) || 'misc';
  const qty = Number((ui.invAddQty && ui.invAddQty.value) || 1) || 1;
  send('inventory:add', { id, name, type, quantity: qty });
};
if (ui.btnInvAddApple) ui.btnInvAddApple.onclick = () => send('inventory:add', { id: 'apple', name: 'Apple', type: 'food', quantity: 1 });
if (ui.btnInvClear) ui.btnInvClear.onclick = () => { (inventory||[]).forEach((it)=> { const id=(it.id||it.item_id||it.tokenId); if (id) send('inventory:remove', { itemId: id }); }); setTimeout(()=> send('inventory:list', {}), 200); };
if (ui.btnJournalRefresh) ui.btnJournalRefresh.onclick = () => send('game:request_memories', {});
if (ui.btnJournalPrev) ui.btnJournalPrev.onclick = () => { state.journal.page = Math.max(1, (state.journal.page||1)-1); if (ui.journalPage) ui.journalPage.textContent = String(state.journal.page); send('game:request_memories_page', { page: state.journal.page, size: state.journal.size }); };
if (ui.btnJournalNext) ui.btnJournalNext.onclick = () => { state.journal.page = (state.journal.page||1)+1; if (ui.journalPage) ui.journalPage.textContent = String(state.journal.page); send('game:request_memories_page', { page: state.journal.page, size: state.journal.size }); };
if (ui.btnLadderRefresh) ui.btnLadderRefresh.onclick = () => send('ladder:get', {});
if (ui.btnChatSend) ui.btnChatSend.onclick = () => { const m = ui.chatInput && ui.chatInput.value ? ui.chatInput.value.trim() : ''; if (!m) return; track('chat_send', { len: m.length }); send('companion:chat', { message: m }); if (ui.chatInput) ui.chatInput.value=''; };
const journalFilterTypes = () => Array.from(document.querySelectorAll('.jflt')).filter((c)=> c.checked).map((c)=> c.value);
if (qs('btnJournalApply')) qs('btnJournalApply').onclick = () => {
  const types = journalFilterTypes();
  state.journal.page = 1;
  if (ui.journalPage) ui.journalPage.textContent = String(state.journal.page);
  send('game:request_memories_page', { page: state.journal.page, size: state.journal.size, types });
};

if (qs('btnSaveJwt')) qs('btnSaveJwt').onclick = () => {
  const inp = qs('jwtToken');
  const v = inp && inp.value ? inp.value.trim() : '';
  try { if (v) localStorage.setItem('fw_jwt', v); else localStorage.removeItem('fw_jwt'); } catch {}
  try { ws && ws.close(); } catch {}
  setTimeout(connect, 50);
};
if (ui.btnLoginDemo) ui.btnLoginDemo.onclick = async () => {
  const u = (ui.loginUser && ui.loginUser.value || '').trim();
  if (!u) return;
  try {
    const r = await fetch('/api/game/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: u }) });
    const j = await r.json();
    if (j && j.token) {
      if (ui.jwtToken) ui.jwtToken.value = j.token;
      try { localStorage.setItem('fw_jwt', j.token); } catch {}
      try { ws && ws.close(); } catch {}
      setTimeout(connect, 50);
    }
  } catch {}
};

if (ui.chkSpectate) ui.chkSpectate.onchange = () => {
  try {
    if (ui.chkSpectate.checked) send('spectate:area', { area: biome.area || 'town' });
    else send('spectate:off', {});
  } catch {}
};

// Tabs
function switchTab(name){
  Object.entries(ui.tabPanels).forEach(([k, el]) => { if (el) el.style.display = (k === name ? 'block' : 'none'); });
  ui.tabButtons.forEach((b) => { const on = b.dataset.tab === name; b.style.background = on ? '#2a78ff' : '#233045'; b.style.color = on ? '#fff' : '#e8eef5'; });
}
ui.tabButtons.forEach((b) => b.onclick = () => switchTab(b.dataset.tab));
switchTab('controls');

// Helpers
function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, (c)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function renderFx(now){
  for (let i=fxQueue.length-1;i>=0;i--){
    const fx = fxQueue[i];
    const t = (now - fx.start) / Math.max(1, (fx.durationMs || 1000));
    if (t >= 1) { fxQueue.splice(i,1); continue; }
    const alpha = (1 - t) * (0.15 + (fx.amplitude||0.5)*0.25);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = alpha;
    const cx = W*0.5, cy = H*0.75;
    const rad = (Math.pow(t,0.6)) * Math.max(W,H) * (0.3 + (fx.amplitude||0.5));
    const g = ctx.createRadialGradient(cx,cy, rad*0.2, cx,cy, rad);
    const col = fx.color || '#ffffff';
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

// Profile panel controls
if (ui.btnProfileClose) ui.btnProfileClose.onclick = () => { if (ui.profilePanel) ui.profilePanel.style.display = 'none'; };
if (ui.btnProfileChallenge) ui.btnProfileChallenge.onclick = () => {
  const sid = state.profile.opponentSessionId;
  if (sid) send('battle:challenge', { opponentSessionId: sid });
};
if (ui.btnProfileSpectate) ui.btnProfileSpectate.onclick = () => {
  const sid = state.profile.opponentSessionId;
  if (sid) send('spectate:battle', { sessionId: sid });
  if (ui.spectateLog) { ui.spectateLog.textContent += `\nSubscribed to battle (session ${sid||'-'})`; ui.spectateLog.scrollTop = ui.spectateLog.scrollHeight; }
};
if (ui.btnSpectateList) ui.btnSpectateList.onclick = () => {
  const area = ui.spectateArea && ui.spectateArea.value ? ui.spectateArea.value : undefined;
  send('spectate:battles:list', area ? { area } : {});
};
if (ui.btnSpectateRefresh) ui.btnSpectateRefresh.onclick = () => {
  const area = ui.spectateArea && ui.spectateArea.value ? ui.spectateArea.value : undefined;
  send('spectate:battles:list', area ? { area } : {});
};
if (ui.ladderList) ui.ladderList.addEventListener('click', async (e) => {
  const el = (e.target && (e.target.closest('[data-pid]')));
  if (!el) return;
  const pid = el.getAttribute('data-pid');
  if (!pid) return;
  try {
    const r = await fetch(`/api/game/profile/${encodeURIComponent(pid)}`);
    const j = await r.json();
    if (j?.ok) {
      const inv = (j.inventory||[]).slice(0,5).map(it=>escapeHtml(it.name||it.id)).join(', ') || '-';
      const battles = (j.battles||[]).slice(0,5).map(b => (b.youWon? 'W':'L')).join(' ') || '-';
      if (ui.profileBody) ui.profileBody.innerHTML = `
        <div><strong>${escapeHtml(j.player?.username || pid)}</strong></div>
        <div>Sanctuary: L${j.sanctuary?.level || 1} (${j.sanctuary?.xp || 0}xp)</div>
        <div>Companion: ${escapeHtml(j.companion?.name || '-')}, L${j.companion?.level || 1}</div>
        <div>Inventory: ${inv}</div>
        <div>Battles: ${battles}</div>
      `;
      if (ui.profilePanel) ui.profilePanel.style.display = 'block';
      state.profile.playerId = pid;
      state.profile.opponentSessionId = null;
      try {
        const rs = await fetch(`/api/game/player_sessions/${encodeURIComponent(pid)}`);
        const js = await rs.json();
        const sid = (js?.sessions || [])[0] || null;
        state.profile.opponentSessionId = sid;
        if (ui.btnProfileChallenge) ui.btnProfileChallenge.disabled = !sid;
      } catch {}
    }
  } catch {}
});

// Arena HUD state + helpers
const arenaState = {
  a: null,
  b: null,
  aName: null,
  bName: null,
  barA: 50,
  barB: 50,
};
const sessionCache = new Map();
async function getSessionInfo(sid){
  if (!sid) return null;
  if (sessionCache.has(sid)) return sessionCache.get(sid);
  try { const r = await fetch(`/api/game/session/${encodeURIComponent(sid)}`); const j = await r.json(); if (j?.ok) { sessionCache.set(sid, j.info); return j.info; } } catch {}
  return null;
}
function showArena(names){ if (ui.arenaHud) ui.arenaHud.style.display = 'block'; if (ui.arenaNames) ui.arenaNames.textContent = names; }
function setBars(a, b){ if (ui.arenaBarA) ui.arenaBarA.style.width = `${Math.max(5, Math.min(95, a))}%`; if (ui.arenaBarB) ui.arenaBarB.style.width = `${Math.max(5, Math.min(95, b))}%`; }
function setRound(text){ if (ui.arenaRound) ui.arenaRound.textContent = text; }
function handleBattleSpectateEvent(msg){
  const kind = msg.kind || 'battle';
  if (ui.spectateLog) { ui.spectateLog.textContent += `\nBattle ${kind}: ${JSON.stringify(msg)}`; ui.spectateLog.scrollTop = ui.spectateLog.scrollHeight; }
  if (kind === 'match_found') {
    arenaState.a = msg.a; arenaState.b = msg.b; arenaState.barA = 50; arenaState.barB = 50;
    Promise.all([getSessionInfo(msg.a), getSessionInfo(msg.b)]).then(([ai, bi]) => {
      arenaState.aName = (ai && ai.username) || msg.a;
      arenaState.bName = (bi && bi.username) || msg.b;
      showArena(`${arenaState.aName} vs ${arenaState.bName}`);
      setBars(50,50); setRound('Match Found');
    });
  } else if (kind === 'start') {
    showArena(`${arenaState.aName||msg.a} vs ${arenaState.bName||msg.b}`);
    setRound('Start');
  } else if (kind === 'round') {
    // Prefer server-provided hp; fallback to simple wobble
    if (typeof msg.hpA === 'number' && typeof msg.hpB === 'number') {
      const pctA = Math.max(0, Math.min(100, (msg.hpA/100)*100));
      const pctB = Math.max(0, Math.min(100, (msg.hpB/100)*100));
      arenaState.barA = pctA; arenaState.barB = pctB; setBars(pctA, pctB);
    } else {
      const by = msg.by;
      if (by === arenaState.a) { arenaState.barB = Math.max(5, arenaState.barB - 10); }
      else { arenaState.barA = Math.max(5, arenaState.barA - 10); }
      setBars(arenaState.barA, arenaState.barB);
    }
    // map ability to FX
    const fxMap = { resonant_strike: { color: '#9B59B6', amplitude: 0.9, durationMs: 800 }, crystal_aegis: { color: '#ffd289', amplitude: 0.6, durationMs: 900 }, harmonic_aura: { color: '#27AE60', amplitude: 0.7, durationMs: 1000 } };
    const fx = fxMap[msg.ability] || { color: '#2a78ff', amplitude: 0.5, durationMs: 700 };
    queueFx(fx);
    setRound(`Round ${msg.round}: ${msg.ability}`);
    // show simple status indicators for buffs
    const fmt = (arr) => (Array.isArray(arr) && arr.length) ? arr.map(k => (k==='attack'?'🗡️':k==='defense'?'🛡️':'✨')).join(' ') : ' ';
    if (ui.arenaStatusA) ui.arenaStatusA.textContent = fmt(msg.buffsA);
    if (ui.arenaStatusB) ui.arenaStatusB.textContent = fmt(msg.buffsB);
  } else if (kind === 'result') {
    const youWin = msg.result && msg.result.self && msg.result.opponent ? null : null; // not used
    setRound('Result');
    setTimeout(()=> { if (ui.arenaHud) ui.arenaHud.style.display = 'none'; }, 2500);
  }
}
