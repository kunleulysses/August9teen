/*
 * BiomeAutonomyEngine
 * - Generates autonomous parallax background layers (sky/mid/fore) per area.
 * - Driven by coherence/resonance hints and world events. No external art pipeline.
 */

const fs = require('fs');
const path = require('path');
const eventBus = require('../core/ConsciousnessEventBus.cjs');
let CanvasLib; try { CanvasLib = require('canvas'); } catch { CanvasLib = null; }
const crypto = require('crypto');

const OUT_DIR = path.resolve(process.cwd(), 'public', 'images', 'generated', 'biomes');
const AREAS = ['town','forest','beach','mountains','desert'];
const manifests = { backgrounds: {} };
let regenTimer = null;

function ensureDir(p){ try { fs.mkdirSync(p, { recursive: true }); } catch {} }

function mulberry32(a){ return function(){ let t=(a+=0x6D2B79F5); t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }

function paletteForArea(area){
  switch(area){
    case 'forest': return ['#0a1f0d','#0f3d1a','#27AE60','#89ffa1'];
    case 'beach': return ['#061e2e','#0b3a54','#2a78ff','#ffd289'];
    case 'mountains': return ['#0b0d10','#1e2a38','#9B59B6','#a5d6ff'];
    case 'desert': return ['#2a1b0a','#4a2f13','#cfa75e','#ffd289'];
    default: return ['#0b0d10','#12161c','#2a78ff','#89ffa1'];
  }
}

function drawLayer(ctx, w, h, colors, variant, coherence, resonance){
  // sky gradient
  if (variant === 'sky'){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, colors[1]);
    g.addColorStop(1, colors[0]);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    // stars or clouds
    const count = Math.floor(100 * (0.4 + resonance));
    ctx.fillStyle = colors[3];
    for (let i=0;i<count;i++){
      const x = Math.random()*w;
      const y = Math.random()*h*(0.6);
      const r = Math.random()*1.5;
      ctx.globalAlpha = 0.15 + Math.random()*0.35;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }
  // mid hills/trees/waves silhouettes
  if (variant === 'mid'){
    ctx.fillStyle = colors[1];
    const lines = 6;
    for (let i=0;i<lines;i++){
      const y = h*0.3 + (i/lines)*h*0.5;
      ctx.globalAlpha = 0.15 + (i/lines)*0.35;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x=0;x<=w;x+=8){
        const k = (x/w);
        const amp = 8 + 40*(0.2 + coherence*0.6);
        const dy = Math.sin(k*10 + i*0.6) * amp * (0.3+resonance*0.4);
        ctx.lineTo(x, y + dy);
      }
      ctx.lineTo(w, h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }
  // foreground ridges/plants/foam
  if (variant === 'fore'){
    ctx.fillStyle = colors[2];
    const patches = 80;
    for (let i=0;i<patches;i++){
      const px = Math.random()*w;
      const py = h*0.6 + Math.random()*h*0.35;
      const pw = 6 + Math.random()*24;
      const ph = 2 + Math.random()*12;
      ctx.globalAlpha = 0.2 + Math.random()*0.5;
      ctx.fillRect(px, py, pw, ph);
    }
    ctx.globalAlpha = 1;
  }
}

function generateArea(area){
  if (!CanvasLib) return null;
  ensureDir(OUT_DIR);
  const { createCanvas } = CanvasLib;
  const w = 512, h = 288; // 16:9 base, scaled on client
  const colors = paletteForArea(area);
  const coh = Number(globalThis.__fw_coherence || 0.9);
  const res = Number(globalThis.__fw_resonance || 0.85);
  const variants = ['sky','mid','fore'];
  const out = {};
  const layerHashes = {};
  for (const v of variants){
    const c = createCanvas(w,h);
    const ctx = c.getContext('2d');
    drawLayer(ctx, w, h, colors, v, coh, res);
    const name = `${area}_${v}_${Date.now()}.png`;
    const file = path.join(OUT_DIR, name);
    const buf = c.toBuffer('image/png');
    fs.writeFileSync(file, buf);
    layerHashes[v] = crypto.createHash('sha256').update(buf).digest('hex');
    out[v] = `/images/generated/biomes/${name}`;
  }
  try {
    eventBus.emit('spiral_memory:store', { type: 'visual_genome', memory: { kind: 'biome_layers', area, colors, hashes: layerHashes }, timestamp: Date.now() });
  } catch {}
  // cleanup keep last 9 per area
  try {
    const files = fs.readdirSync(OUT_DIR).filter(f => f.startsWith(area+'_') && f.endsWith('.png')).sort();
    if (files.length > 9){
      for (let i=0;i<files.length-9;i++){ try { fs.unlinkSync(path.join(OUT_DIR, files[i])); } catch{} }
    }
  } catch{}
  return out;
}

function regenerateAll(reason='timer'){
  let changed = false;
  for (const area of AREAS){
    try{
      const man = generateArea(area);
      if (man){ manifests.backgrounds[area] = man; changed = true; }
    } catch {}
  }
  if (changed){
    try { eventBus.emit('biome:update', { backgrounds: manifests.backgrounds, reason, ts: Date.now() }); } catch {}
  }
}

function startBiomeAutonomyEngine(){
  if (regenTimer) return;
  ensureDir(OUT_DIR);
  // capture coherence/resonance
  try { eventBus.on('system_tick', (s)=>{ if (s){ if (typeof s.coherence==='number') globalThis.__fw_coherence=s.coherence; if (typeof s.resonance==='number') globalThis.__fw_resonance=s.resonance; } }); } catch{}
  // initial
  regenerateAll('init');
  regenTimer = setInterval(()=> regenerateAll('timer'), 5*60_000);
  // nudge on world events
  try { eventBus.on('world:generated_encounter', ()=> regenerateAll('encounter')); } catch {}
}

function getAutonomousBiomeManifest(){
  return manifests.backgrounds || {};
}

module.exports = {
  startBiomeAutonomyEngine,
  getAutonomousBiomeManifest,
  regenerateAll,
};
