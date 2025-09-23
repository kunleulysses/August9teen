"use strict";
// Smoke script for generateAdaptiveVeniceReply via CommonJS wrapper
// - Avoids network calls if VENICE_AI_API_KEY is not set by stubbing veniceAI.generateResponse

const { generateAdaptiveVeniceReply } = require("../venice-ai-helpers.cjs");
const { veniceAI } = require("../enhanced-venice-ai.cjs");

async function main() {
  const msg = process.argv.slice(2).join(" ") || process.env.MSG || "Hello Flappy, quick test.";
  const type = process.env.TYPE || "chatConversation";
  const verbose = process.env.VERBOSE === "1" || process.env.VERBOSE === "true";

  if (!process.env.VENICE_AI_API_KEY) {
    console.log("[smoke] No VENICE_AI_API_KEY set; using mock Venice response to avoid network calls.");
    veniceAI.generateResponse = async () => {
      return `SMOKE(mock) reply for: ${msg}`;
    };
  }

  try {
    const res = await generateAdaptiveVeniceReply({
      contentType: type,
      userMessage: msg,
      userInfo: { firstName: "SmokeUser" },
      memories: [
        { topic: "work", context: "Enjoys quick smoke tests" },
      ],
      venice: { systemPrompt: "Smoke test run" },
    });

    if (verbose) {
      console.log("--- Prompt ---\n" + res.prompt + "\n--- End Prompt ---\n");
    }
    console.log("--- Response ---\n" + res.content + "\n--- End Response ---");
  } catch (e) {
    console.error("[smoke] Error:", e && e.message ? e.message : e);
    process.exit(1);
  }
}

main();
