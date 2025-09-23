"use strict";
/**
 * CommonJS wrapper for Venice AI adaptive reply orchestration.
 *
 * This mirrors the TS helper's public shape enough for terminal use.
 * It builds a simple enhanced system prompt and calls veniceAI with
 * exponential backoff. Returns a normalized object:
 * { content, prompt, context, personality }
 */

const { veniceAI } = require("./enhanced-venice-ai.cjs");

// Provide a CommonJS veniceClient wrapper for parity with the TS helper
const veniceClient = {
  async call(opts) {
    const content = await veniceAI.generateResponse(opts.prompt, {
      systemPrompt: opts.systemPrompt,
      maxTokens: opts.maxTokens,
      temperature: opts.temperature,
      topP: opts.topP,
      enableWebSearch: opts.enableWebSearch,
    });
    return { content };
  },
};

// Simple context analysis (lightweight subset of TS helper)
function analyzeConversationContext(content, userInfo) {
  const lower = String(content || "").toLowerCase();
  const context = {
    isFirstInteraction: !!userInfo?.isFirstMessage,
  };
  if (/(stress|overwhelm|pressure|anxious|anxiety)/.test(lower)) context.userEmotionalState = "stressed";
  else if (/(sad|down|depressed|lonely)/.test(lower)) context.userEmotionalState = "melancholy";
  else if (/(excited|stoked|pumped|thrilled)/.test(lower)) context.userEmotionalState = "excited";
  else context.userEmotionalState = "neutral";

  if (/(work|deadline|project|ship|deploy)/.test(lower)) context.topicCategory = "work";
  else if (/(family|friend|relationship|love)/.test(lower)) context.topicCategory = "relationships";
  else if (/(health|sleep|exercise|diet)/.test(lower)) context.topicCategory = "wellbeing";
  else if (/(learn|study|research|write|build)/.test(lower)) context.topicCategory = "creativity";
  else context.topicCategory = "daily-life";

  const hour = new Date().getHours();
  context.timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  return context;
}

// Minimal personality response stub (structure compatible with TS return consumer)
function buildPersonalityResponse(context) {
  return {
    config: { tone: context.userEmotionalState, style: "concise" },
    elements: {
      greeting: context.isFirstInteraction ? "Hey — welcome!" : "Hey again!",
      empathy: context.userEmotionalState === "stressed" ? "I hear the pressure you're under." : "I'm here with you.",
      encouragement: "You're making steady progress — keep going.",
      closing: "If you'd like, I can help you plan next steps.",
    },
    memoryReferences: [],
    proactiveSupport: true,
    adaptedTone: context.userEmotionalState,
    generatePersonalizedResponse: () => ({})
  };
}

function buildEnhancedPrompt(contentType, userMessage, userInfo, memories, personalityResponse, context) {
  const { elements } = personalityResponse || {};
  const name = userInfo?.firstName || userInfo?.username || "friend";
  const header = `You are Flappy — warm, practical, clear. Content type: ${contentType}. Time: ${context.timeOfDay}. Topic: ${context.topicCategory}. Tone: ${context.userEmotionalState}.`;
  const principles = `Principles: be empathetic, specific, and actionable; keep it concise; avoid platitudes; reflect back understanding.`;
  const userCtx = `User: ${name}${userInfo?.isFirstMessage ? " (first conversation)" : ""}.`;
  const mem = Array.isArray(memories) && memories.length ? `Known memories: ${memories.slice(0,5).map(m=>m.title||m.summary||m.content?.slice(0,50)).join(" | ")}` : "Known memories: none.";
  const guidance = `Style cues: ${elements?.greeting || ""} ${elements?.empathy || ""}`.trim();

  return [header, principles, userCtx, mem, guidance, "\nUser message:", userMessage, "\nRespond helpfully in 1-2 short paragraphs, with optional bullets if useful."]
    .filter(Boolean)
    .join("\n");
}

async function callVeniceWithBackoff(opts, retries = 5, delay = 1000) {
  try {
    const content = await veniceAI.generateResponse(opts.prompt, {
      systemPrompt: opts.systemPrompt,
      maxTokens: opts.maxTokens,
      temperature: opts.temperature,
      topP: opts.topP,
      enableWebSearch: opts.enableWebSearch,
    });
    return { content };
  } catch (e) {
    if (retries === 0) throw e;
    await new Promise(r => setTimeout(r, delay));
    return callVeniceWithBackoff(opts, retries - 1, Math.min(delay * 2, 30000));
  }
}

async function generateAdaptiveVeniceReply(params) {
  const {
    contentType = "chatConversation",
    userMessage,
    userInfo = {},
    memories = [],
    venice = {},
  } = params || {};

  if (!userMessage || typeof userMessage !== "string") {
    throw new Error("generateAdaptiveVeniceReply(): missing userMessage");
  }

  const context = analyzeConversationContext(userMessage, userInfo);
  const personalityResponse = buildPersonalityResponse(context);
  const prompt = buildEnhancedPrompt(contentType, userMessage, userInfo, memories, personalityResponse, context);

  const veniceOpts = {
    systemPrompt: venice.systemPrompt,
    maxTokens: venice.maxTokens || 500,
    temperature: venice.temperature ?? 0.7,
    topP: venice.topP ?? 0.9,
    enableWebSearch: !!venice.enableWebSearch,
  };

  const veniceResponse = await callVeniceWithBackoff({ prompt, ...veniceOpts });
  const content = veniceResponse?.content || "";

  return { content, prompt, context, personality: personalityResponse };
}

module.exports = { generateAdaptiveVeniceReply, callVeniceWithBackoff, veniceClient, analyzeConversationContext, buildEnhancedPrompt };
