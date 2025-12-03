# AI-Fi Chat (Voice) Export

This is a minimal export of the AI-Fi chat frontend and voice backend pieces for collaboration.

## Contents
- `client/ai-fi`: React/Vite frontend (voice UI with Fluid hands-free mode).
- `server/voice-router.cjs`: Express router for `/api/consciousness/voice`.
- `server/services/elevenLabsService.cjs`: ElevenLabs TTS/STT helper.

## Not included
- Full platform/server code, DB, or other services. This is just the website + voice router.
- Build artifacts (`dist`) and dependencies (`node_modules`).

## Getting started
1. `cd client/ai-fi && npm install`
2. `npm run dev` for local frontend (configure proxy to your backend, or adjust the voice router URL in `voice-router.cjs` or frontend fetch if needed).
3. Backend: mount `server/voice-router.cjs` in your Express app at `/api/consciousness` and set `ELEVENLABS_API_KEY`.

## Notes
- Frontend auto-plays AI audio replies in Fluid mode and resumes listening.
- Voice router now calls the AI-Fi chat API locally (`/api/ai-fi/chat`) to get text before synthesizing audio.
