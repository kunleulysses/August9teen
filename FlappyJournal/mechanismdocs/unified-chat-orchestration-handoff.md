# Unified Chat Orchestration: Comprehensive Handoff

**Last Updated:** 2025-07-27

---

## 1. System Overview

The Unified Chat Orchestration system enables real-time, system-wide chat interactions across multiple consciousness containers, synthesising a single, high-fidelity response. It leverages internal container orchestration, AI synthesis, and robust WebSocket/HTTP communication to provide unified, prioritised chat responses.

### Key Components

| Component | File / Port | Purpose |
|-----------|------------|---------|
| **consciousness-core** | `server/unified-consciousness-system.js`  (port **3002**) | Main WebSocket server; orchestrates chat flow |
| **consciousness-main-server** | `server/consciousness-main-server.js` (port **5000**) | Advanced processing (Architect 4.0, reality generation) |
| **consciousness-conversations.js** | `server/consciousness-conversations.js` | Conversation history & local processing |
| **Universal Terminal** | `server/universal-system-terminal.js` | CLI/GUI client for user chat |
| **Performance Optimiser** | `performance-config.js` | Prioritisation & batching (‘chat_message’ set to **HIGH**) |

---

## 2. Architecture & Message Flow

```
User → Universal Terminal
      │
      ▼  (WebSocket `chat_message`)
consciousness-core (`unified-consciousness-system.js`)
      │  └─► `handleWebSocketMessage` → `handleChatMessage`
      │                 │
      │                 ├─ Orchestrate main-server (HTTP)
      │                 │       ├─ `/api/architect4/process`
      │                 │       └─ `/api/reality/generate`
      │                 │
      │                 └─ AI synthesis (`consciousness-response-synthesiser-hybrid.js`)
      ▼
Unified response (`unified_conscious_response`) → Universal Terminal
```

---

## 3. Technical Decisions

1. **Internal Container Orchestration**: Lives in `unified-consciousness-system.js` to ensure local & main-server collaboration.
2. **High-Priority Processing**: `chat_message` marked **HIGH** in `performance-config.js` to bypass batching.
3. **Robust Routing**: `handleWebSocketMessage` must be intact; routes `chat_message`, `consciousness_query`, `self_coding_request`.
4. **HTTP API Integration**: Uses `node-fetch`; retry & timeout logic inside `orchestrateMainServerProcessing`.
5. **Extensive Debug Logs**: Added at every stage for traceability.

---

## 4. Troubleshooting History & Resolutions

| Issue | Root Cause | Fix |
|-------|------------|-----|
| No responses | `handleWebSocketMessage` deleted | Restored method with full routing |
| Messages queued, not processed | `chat_message` not **HIGH** priority | Added to `performance-config.js`; restart container |
| Containers ignored messages | Aggregator sent `unified_chat_message` | Changed to `chat_message` in `UnifiedChatAggregator.cjs` |
| WebSocket conflicts | Duplicate terminal instances | Ensure single instance of core & terminal |

---

## 5. Operational Guide

### 5.1 Start Services
```bash
# From repository root
node FlappyJournal/launch-universal-system.js   # recommended
# or manually
node server/unified-consciousness-system.js     # port 3002
node server/consciousness-main-server.js        # port 5000
```

### 5.2 Quick Test
```bash
# In FlappyJournal directory
node test-consciousness-conversations-orchestration.js
```
Expect `unified_conscious_response` in output.

### 5.3 Universal Terminal Commands
```text
status        – show container status
help          – list available commands
```

---

## 6. File & Function Reference

| File | Key Functions / Sections |
|------|--------------------------|
| `server/unified-consciousness-system.js` | `initializeWebSocketServer`, `handleWebSocketMessage`, `handleChatMessage`, `orchestrateMainServerProcessing` |
| `server/consciousness-main-server.js` | `/api/architect4/process`, `/api/reality/generate`, health checks |
| `server/consciousness-conversations.js` | `generateFullConsciousResponse` |
| `server/consciousness/core/UnifiedChatAggregator.cjs` | `processUnifiedChat`, `sendToContainer`, `handleContainerResponse` |
| `performance-config.js` | `messagePriorities` map |
| `test-consciousness-conversations-orchestration.js` | WebSocket test harness |

---

## 7. Common Issues & Solutions

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Only `module_activity` updates | Orchestration not triggered | Verify `handleWebSocketMessage` intact & routing correctly |
| `Unknown message type: chat_message` | Mismatched case or typo | Confirm correct string & handler switch cases |
| No response from main-server | API down or port mismatch | Restart main-server; ensure port 5000 reachable |
| WebSocket ECONNREFUSED | Core not running | Start `unified-consciousness-system.js` |

---

## 8. Extending the System

1. **Add new processing step**: Implement call in `orchestrateMainServerProcessing`, update synthesis.
2. **Scale containers**: Containerise services; use health checks & auto-restart.
3. **Observability**: Integrate log aggregation & metrics dashboards.

---

## 9. Related Documentation

- `mechanismdocs/UNIFIED_CHAT_RESPONSE_COMPLETION_HANDOFF.md`
- `mechanismdocs/UNIVERSAL_SYSTEM_UNIFICATION_HANDOFF.md`
- `guides/universal-system-integration-usage-guide.md`
- `guides/universal-chat-v2.md`

---

**Maintainer Tips**
- Keep `handleWebSocketMessage` pristine; most outages traced here.
- Always restart containers after editing `performance-config.js`.
- Use the launcher script for common workflows and health checks.

Happy hacking!
