/*
 * VisualAutonomyEngine
 * - Generates autonomous, evolving sprite sheets for companions without external tools.
 * - Driven by backend metrics (coherence/resonance) and events over the ConsciousnessEventBus.
 * - Exposes a manifest for current sprite sheet and emits 'sprite:update' when regenerated.
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const eventBus = require('../core/ConsciousnessEventBus.cjs');

let CanvasLib;
try { CanvasLib = require('canvas'); } catch { CanvasLib = null; }

const GEN_DIR = path.resolve(process.cwd(), 'public', 'images', 'generated');
let currentGenome = null;
let currentManifest = null;
let timer = null;

function ensureDir(p) {
  try { fs.mkdirSync(p, { recursive: true }); } catch {}
}

function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(arr, rnd) { return arr[Math.floor(rnd()*arr.length) % arr.length]; }

function defaultPalettes() {
  return [
    ['#2a78ff','#89ffa1','#ffd289','#9B59B6'],
    ['#27AE60','#9B59B6','#F1C40F','#E67E22'],
    ['#7afcff','#feff9c','#fff740','#ff65a3'],
    ['#8e9aaf','#cbc0d3','#efd3d7','#feeafa'],
  ];
}

function newGenome(seed, coherence = 0.9, resonance = 0.85) {
  const rnd = mulberry32(seed >>> 0);
  const palettes = defaultPalettes();
  const palette = pick(palettes, rnd);
  const shapes = ['blob','orb','crystal','star'];
  const baseShape = pick(shapes, rnd);
  return {
    id: `auto_${seed}`,
    seed,
    palette,
    baseShape,
    species: pick(['plain','horned','crowned'], rnd),
    frames: 6,
    columns: 6,
    fps: 8,
    frameWidth: 32,
    frameHeight: 32,
    wobble: 0.15 + (coherence - 0.8) * 0.3,
    pulse: 0.12 + (resonance - 0.8) * 0.25,
  };
}

function drawFrame(ctx, g, phase) {
  const { frameWidth: fw, frameHeight: fh, baseShape, palette, wobble } = g;
  ctx.clearRect(0,0,fw,fh);
  ctx.save();
  ctx.translate(fw/2, fh/2);
  const R = Math.min(fw, fh) * 0.42;
  // background glow
  const gr = ctx.createRadialGradient(0,0,R*0.2, 0,0,R);
  gr.addColorStop(0, palette[0] || '#2a78ff');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gr;
  ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill();

  // body
  ctx.beginPath();
  const steps = 64;
  for (let i=0;i<=steps;i++) {
    const t = (i/steps) * Math.PI * 2;
    let rad = R;
    if (baseShape === 'blob') {
      rad *= 1 + Math.sin(t*3 + phase)*wobble*0.7 + Math.cos(t*5 - phase*0.7)*wobble*0.3;
    } else if (baseShape === 'orb') {
      rad *= 1 + Math.sin(t*2 + phase*0.8)*wobble*0.3;
    } else if (baseShape === 'crystal') {
      const spikes = 6;
      rad *= 0.85 + Math.max(0, Math.sin(Math.floor((t/(Math.PI*2))*spikes)*Math.PI))*0.35;
    } else { // star
      const spikes = 5;
      rad *= 0.8 + 0.3*Math.sin(spikes*t + phase);
    }
    const x = Math.cos(t) * rad;
    const y = Math.sin(t) * rad;
    if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = palette[1] || '#89ffa1';
  ctx.strokeStyle = palette[2] || '#ffd289';
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  // adornments (horns/crown)
  if (g.species === 'horned') {
    ctx.save();
    ctx.rotate(0.1*Math.sin(phase));
    ctx.fillStyle = palette[3] || '#9B59B6';
    ctx.beginPath(); ctx.moveTo(-R*0.6, -R*0.1); ctx.lineTo(-R*0.3, -R*0.8); ctx.lineTo(-R*0.1, -R*0.1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo( R*0.6, -R*0.1); ctx.lineTo( R*0.3, -R*0.8); ctx.lineTo( R*0.1, -R*0.1); ctx.closePath(); ctx.fill();
    ctx.restore();
  } else if (g.species === 'crowned') {
    ctx.fillStyle = palette[2] || '#ffd289';
    ctx.fillRect(-R*0.2, -R*0.9, R*0.4, R*0.12);
    ctx.beginPath(); ctx.moveTo(-R*0.2, -R*0.9); ctx.lineTo(-R*0.05, -R*1.1); ctx.lineTo(0, -R*0.9); ctx.lineTo(R*0.05, -R*1.1); ctx.lineTo(R*0.2, -R*0.9); ctx.closePath(); ctx.fill();
  }

  // eyes
  const eyeR = Math.max(1, Math.floor(R*0.12));
  const eyeY = -R*0.05 + Math.sin(phase)*R*0.02;
  const eyeX = R*0.18;
  ctx.fillStyle = '#101318';
  ctx.beginPath(); ctx.arc(-eyeX, eyeY, eyeR, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( eyeX, eyeY, eyeR, 0, Math.PI*2); ctx.fill();

  // small highlight
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath(); ctx.arc(-eyeX-0.5, eyeY-0.5, eyeR*0.35, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc( eyeX-0.5, eyeY-0.7, eyeR*0.35, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function generateSheet(genome) {
  if (!CanvasLib) return null;
  ensureDir(GEN_DIR);
  const { createCanvas } = CanvasLib;
  const fw = genome.frameWidth;
  const fh = genome.frameHeight;
  const cols = genome.columns;
  const frames = genome.frames;
  const rows = Math.ceil(frames / cols);
  const sheetW = fw * cols;
  const sheetH = fh * rows;
  const sheet = createCanvas(sheetW, sheetH);
  const sctx = sheet.getContext('2d');
  sctx.fillStyle = 'rgba(0,0,0,0)';
  sctx.clearRect(0,0,sheetW,sheetH);

  // Draw frames
  for (let i=0;i<frames;i++) {
    const cx = (i % cols) * fw;
    const cy = Math.floor(i / cols) * fh;
    const frame = createCanvas(fw, fh);
    const fctx = frame.getContext('2d');
    const phase = (i / frames) * Math.PI * 2;
    drawFrame(fctx, genome, phase);
    sctx.drawImage(frame, cx, cy);
  }

  const name = `auto_companion_${genome.seed}_${Date.now()}.png`;
  const outPath = path.join(GEN_DIR, name);
  const buf = sheet.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);
  // provenance hash
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  // Keep folder tidy (best-effort: remove older than last 5)
  try {
    const files = fs.readdirSync(GEN_DIR).filter(f => f.startsWith('auto_companion_') && f.endsWith('.png')).sort();
    if (files.length > 5) {
      for (let i=0;i<files.length-5;i++) { try { fs.unlinkSync(path.join(GEN_DIR, files[i])); } catch {} }
    }
  } catch {}
  const manifest = {
    sheet: `/images/generated/${name}`,
    frameWidth: fw,
    frameHeight: fh,
    frames,
    columns: cols,
    fps: genome.fps,
    hash,
  };
  try {
    eventBus.emit('spiral_memory:store', { type: 'visual_genome', memory: { kind: 'sprite_genome', genome, manifest }, timestamp: Date.now() });
  } catch {}
  return manifest;
}

function regenerateSprite(reason = 'timer') {
  // coherence/resonance hints may come from last captured metrics
  const coh = Number(globalThis.__fw_coherence || 0.9);
  const res = Number(globalThis.__fw_resonance || 0.85);
  const seed = Math.floor(Date.now() / 1000); // 1-second cadence seed
  const g = newGenome(seed, coh, res);
  let manifest;
  try {
    manifest = generateSheet(g);
  } catch {}

  if (!manifest) {
    // Fallback: static sprite
    manifest = { sheet: '/images/flappy-avatar.png', frameWidth: 512, frameHeight: 512, frames: 1, columns: 1, fps: 1 };
  }
  currentGenome = g;
  currentManifest = manifest;
  try { eventBus.emit('sprite:update', { reason, manifest, genome: g, ts: Date.now() }); } catch {}
}

function startVisualAutonomyEngine() {
  if (timer) return;
  ensureDir(GEN_DIR);
  // Capture hints from director ticks if available
  try {
    eventBus.on('system_tick', (s) => {
      if (s && typeof s.coherence === 'number') globalThis.__fw_coherence = s.coherence;
      if (s && typeof s.resonance === 'number') globalThis.__fw_resonance = s.resonance;
    });
  } catch {}

  // Respond to mood changes with immediate slight evolution
  try {
    eventBus.on('companion:mood_change', () => regenerateSprite('mood'));
  } catch {}

  regenerateSprite('init');
  // Evolve periodically
  timer = setInterval(() => regenerateSprite('timer'), 60_000);
}

function getAutonomousSpriteManifest() {
  if (!currentManifest) regenerateSprite('get');
  return currentManifest;
}

function getAutonomousGenome() {
  return currentGenome;
}

module.exports = {
  startVisualAutonomyEngine,
  getAutonomousSpriteManifest,
  getAutonomousGenome,
  regenerateSprite,
};
