/*
 * RealityGeneratorBridge
 * Listens for 'reality:generate' and produces structured content.
 * Uses Gemini 2.5 Pro if GEMINI_API_KEY is set; otherwise falls back to templates.
 */

let GoogleGenerativeAI;
try { ({ GoogleGenerativeAI } = require('@google/generative-ai')); } catch {}

module.exports = function startRealityGeneratorBridge() {
  try {
    const eventBus = require('../core/ConsciousnessEventBus.cjs');
    const gkey = process.env.GEMINI_API_KEY;
    const useGemini = !!(gkey && GoogleGenerativeAI);
    const genAI = useGemini ? new GoogleGenerativeAI(gkey) : null;
    const primaryModelId = process.env.GEMINI_MODEL_PRIMARY || 'gemini-2.5-pro';
    const fallbackModelId = process.env.GEMINI_MODEL_FALLBACK || 'gemini-2.5-flash';
    const primary = useGemini ? genAI.getGenerativeModel({ model: primaryModelId }) : null;
    const fallback = useGemini ? genAI.getGenerativeModel({ model: fallbackModelId }) : null;

    const gen = async (prompt) => {
      if (!useGemini) return null;
      try { const r = await primary.generateContent(prompt); return (await r.response).text(); }
      catch { try { const r2 = await fallback.generateContent(prompt); return (await r2.response).text(); } catch { return null; } }
    };

    eventBus.on('reality:generate', async (req) => {
      try {
        const { type, context, callback } = req || {};
        let out = null;
        if (type === 'game_encounter') {
          const { area, playerLevel, companionPersonality } = context || {};
          const prompt = `Generate a JSON object for a game encounter in area ${area}. Include keys: npc { name, kind, mood, line }, item { name, rarity }, hazard { name, severity }. Keep it under 3 short lines of flavor inside values.`;
          let txt = await gen(prompt);
          out = parseJsonOrTemplate(txt, () => ({
            npc: { name: suggestNPC(area), kind: 'guide', mood: 'curious', line: 'Stay aware; the field is shifting.' },
            item: { name: suggestItem(area), rarity: 'uncommon' },
            hazard: { name: suggestHazard(area), severity: 'low' }
          }));
        } else if (type === 'world_event') {
          const { worldState, activePlayerCount } = context || {};
          const prompt = `Generate a JSON object for a global world event. Include keys: title, description, effect { resonanceDelta, coherenceDelta }. Keep text concise.`;
          let txt = await gen(prompt);
          out = parseJsonOrTemplate(txt, () => ({
            title: 'Resonant Whisper',
            description: 'A soft pulse passes through all zones.',
            effect: { resonanceDelta: 0.02, coherenceDelta: 0.01 }
          }));
        }
        if (typeof callback === 'function' && out) callback(out);
      } catch {}
    });

    const parseJsonOrTemplate = (txt, tmpl) => {
      if (txt && typeof txt === 'string') {
        const m = txt.match(/\{[\s\S]*\}/);
        if (m) {
          try { return JSON.parse(m[0]); } catch {}
        }
      }
      return tmpl();
    };

    const suggestNPC = (area) => ({ town:'Eira', forest:'Sprig', beach:'Marin', mountains:'Elden', desert:'Nadir' }[String(area||'town')] || 'Eira');
    const suggestItem = (area) => ({ town:'Glyph Token', forest:'Leaf Sigil', beach:'Shell Charm', mountains:'Stone Rune', desert:'Dust Relic' }[String(area||'town')] || 'Glyph Token');
    const suggestHazard = (area) => ({ town:'Static Field', forest:'Whisper Fog', beach:'Slip Current', mountains:'Echo Draft', desert:'Dry Surge' }[String(area||'town')] || 'Static Field');

    return true;
  } catch (e) {
    try { console.warn('RealityGeneratorBridge init failed:', e?.message || e); } catch {}
    return false;
  }
};

