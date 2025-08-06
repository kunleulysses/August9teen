# 🕊️ Featherweight – A Private AI Companion for Emotional Wellness

[![Test Suite](https://github.com/featherweight/featherweight/actions/workflows/test.yml/badge.svg)](https://github.com/featherweight/featherweight/actions/workflows/test.yml)
[![Coverage](https://img.shields.io/badge/coverage-65%25-yellow)](https://github.com/featherweight/featherweight/actions/workflows/test.yml)
[![Security](https://github.com/featherweight/featherweight/actions/workflows/security-and-quality.yml/badge.svg)](https://github.com/featherweight/featherweight/actions/workflows/security-and-quality.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)

Featherweight is a lightweight journaling and conversation assistant powered by uncensored large language models. It’s designed to help users reflect, heal, and grow — with privacy, personality, and emotional depth at its core.

Flappy, the companion at the heart of Featherweight, is a mystical, emotionally intelligent character trained on therapeutic practices and user memory. It evolves with the user and appears across platforms: web, email, SMS, and eventually physical plush toys and mobile apps.

---

## ✨ Key Features

### 🧠 AI-Powered Emotional Journaling
- Flappy engages users in conversation and transforms those dialogues into organized journal entries.
- Uses **Llama-3.1-405B** for high-context inference, emotional tone tracking, and memory awareness.
- Journaling entries are stored securely and can be accessed or continued via multiple channels.

### 📬 Multi-Channel Access
- Flappy can communicate with users through:
  - Web interface
  - SMS (Twilio integration)
  - Email (SendGrid SMTP integration)
- Mobile app (iOS & Android) is currently in development.

### 🧸 Flappy Plush Prototype (In Progress)
- Connected Bluetooth/WiFi plush that allows users to talk to Flappy physically.
- Responds with speech synthesized from Venice-powered LLM responses.
- Emotional LED expressions and contextual replies in sync with the mobile app.

### 🪙 Pet Evolution & Token Integration (Coming)
- Companion evolution based on journaling streaks, on-chain interaction, and XP.
- Solana-based token (FVW) will power the reputation, governance, and staking ecosystem.
- XP events (journaling, wallet actions) influence pet appearance and Flappy’s interaction logic.

---

## 🔧 Bug Fixes (June 2025)

Recent critical improvements:

### ✅ Email Conversation Context
- Replaced generic replies with AI-powered, contextual back-and-forth using `emailConversation` content type.
- Threading headers (`In-Reply-To`, `References`) now maintain proper flow.

### ✅ SMS Memory & Tone
- Full conversation history is now passed during SMS replies.
- Prompt generation respects tone and previous interactions.

### ✅ Prompt Generation Fixes
- Missing `emailConversation` case added to ensure correct behavior across formats.

### ✅ Storage & Threading
- Fixed conversation metadata and ID consistency.
- Conversations now persist and evolve properly across all channels.

📂 Key files modified:
- `/server/email.ts`
- `/server/openai.ts`
- `/server/twilio.ts`

---

## 🧪 Tech Stack

- **LLM:** Llama-3.1-405B via Venice API
- **Backend:** Node.js + pnpm + Express
- **Frontend:** React (Replit-hosted)
- **Database:** Supabase (Postgres)
- **Integrations:** Twilio (SMS), SendGrid (Email), Venice API (LLM Inference)

---

## 🛠️ Currently In Development

- Mobile app UX (iOS/Android)
- Flappy plush speaker + LED prototype
- Solana FVW token drop via Candle & Raydium
- Flappy & Friends YouTube pilot
- Community soul-circle experience w/ live journaling

---

## 📌 Expected Behavior (Post-Bug Fixes)

- **Email & SMS**: Flappy now holds full conversations with memory across replies.
- **Conversations**: Properly saved, threaded, and associated with journal logs.
- **AI**: Richer, more personalized output across every channel.

---

## 👥 Join the Mission

Featherweight is a new kind of AI wellness product — one that listens more than it speaks. Whether you’re a developer, emotional tech thinker, or community organizer, we’re building this space for (and with) real people.

More to come soon.

---

## 🧪 Development & Testing

### Prerequisites
- Node.js ≥18.0.0
- Redis (for full test suite)
- npm or yarn

### Installation
```bash
git clone https://github.com/featherweight/featherweight.git
cd featherweight
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage (requires ≥80% to pass)
npm test -- --coverage

# Run specific test suites
npm test __tests__/spiral/          # Spiral memory tests
npm test __tests__/storage/         # Storage adapter tests

# Verify coverage threshold
npm run verify-coverage

# Run tests with Redis (for full adapter testing)
TEST_REDIS_URL=redis://localhost:6379/15 npm test
```

### Coverage Requirements
- **Minimum Coverage**: 80% (lines, statements, functions, branches)
- **Scope**: `FlappyJournal/server/consciousness/core/**`
- **CI Enforcement**: Builds fail if coverage drops below threshold
- **Reports**: Generated in `coverage/` directory

### Storage Adapter Contract
All storage adapters must pass the contract test suite:
```bash
npm test __tests__/storage/adapterContract.spec.ts
```

Adding a new adapter? Run `npm test storage` - it must pass the contract.

### Spiral Memory Architecture
The consciousness core includes comprehensive test coverage:
- Unit tests for memory storage and retrieval
- Concurrency safety validation
- Garbage collection testing
- Statistics rebuilding verification

---

## Running Locally with Docker

```bash
cp .env.docker.example .env.docker  # then edit if needed
docker compose up --build
# or include monitoring containers
docker compose --profile monitoring up --build
```

## 📚 Additional Documentation

- [Self-Coding API](docs/self-coding-API.md)
- [Deployment Guide](docs/deployment-guide.md)

## 🧬 License

MIT for open-source logic components. Proprietary assets like Flappy IP and the plush toy designs are developed and held under the August9teen creative studio.

---
