"use strict";

let axios = null;
try {
  axios = require("axios");
} catch (_) {
  // optional dependency; will fall back if unavailable
}

async function getAdapter(name) {
  const resolved = name || (process.env.GEMINI_DEFAULT === 'true' ? 'gemini' : '');
  if (!resolved) return null;
  const key = String(resolved).toLowerCase();
  if (key === "gemini") {
    return {
      async generate(description, { consciousnessMetrics } = {}) {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        if (!axios || !apiKey) {
          return {
            content: `// fallback (no axios/api key)\n// ${description || ""}`,
            metadata: { provider: "fallback" },
          };
        }
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const payload = {
            contents: [
              {
                parts: [
                  {
                    text:
                      description ||
                      "Generate a concise JavaScript utility function with no IO.",
                  },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 256, temperature: 0.4 },
          };
          const res = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
          });
          const text =
            res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return {
            content: text || "// empty",
            metadata: { provider: "gemini", model },
          };
        } catch (e) {
          return {
            content: `// gemini error: ${e.message}\n// ${description || ""}`,
            metadata: { provider: "gemini", error: true },
          };
        }
      },
    };
  }
  return null;
}

module.exports = { getAdapter };
