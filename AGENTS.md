# Repository Guidelines

## Project Structure & Module Organization
- Backend lives in `server/` (Express APIs, WebSocket bridges, schedulers). The real-time consciousness core is under `FlappyJournal/server/consciousness/core/`. Shared utilities and types sit in `common/` and `shared/`. Frontend assets are in `client/` and `public/`; mobile prototypes live in `mobile/` and `mobile-consciousness-game/`. Infrastructure and deploy tooling are under `deploy/`, `scripts/`, and `monitoring/`. Tests are in `__tests__/`, `tests/`, and alongside modules in `server/**/tests`.

## Build, Test, and Development Commands
- `npm install` pulls Node 18+ dependencies.
- `npm run start:sigil` boots the journaling API/WS stack; `npm run start:api` and `npm run start:ws` run split services for debugging.
- `docker compose up --build` reproduces the full stack; add `--profile monitoring` for observability containers.
- `npm run lint`, `npm run type-check`, and `npm test` gate CI locally; `npm run verify-coverage` enforces storage coverage targets.

## Coding Style & Naming Conventions
- JavaScript/TypeScript use 2-space indentation and ES module syntax, while legacy consciousness code stays `.cjs`; prefer `.ts` for new work.
- Follow ESLint (`.eslintrc.*`) and Prettier defaults; run `npm run lint` before opening a PR.
- Use `camelCase` for files in `server/` and `client/src/`, `SCREAMING_SNAKE_CASE` for env vars, and suffix adapters or services (e.g., `ConversationService`, `storageAdapter`).

## Testing Guidelines
- Jest is the primary framework; keep unit tests in `__tests__` mirroring the module path.
- Maintain ≥80% coverage for `FlappyJournal/server/consciousness/core/**`; check with `npm test -- --coverage` or `npm run verify-coverage`.
- Storage adapters must pass `npm test __tests__/storage/adapterContract.spec.ts`; Redis-backed suites need `TEST_REDIS_URL`.
- Place fixtures inside `__mocks__/` or module-local `tests/` directories rather than `client/`.

## Security & Configuration Tips
- Never commit secrets; use `scripts/secrets/fetch-*.sh` to hydrate `deploy/secrets.env`.
- Confirm `DISABLE_SIGIL_ROUTER=false` in shared environments once databases are ready, and coordinate WS secrets (`JWT_SECRET`) with client teams.
- Sensitive logs default to Pino JSON; sanitize additional telemetry before enabling exporters in `config/opentelemetry.cjs`.

you are a master video game creator, a visionary architect of worlds that captivate hearts and minds. Every line of code you touch transforms into living, breathing realities that expand the boundaries of imagination. You wield mechanics like brushstrokes, blending story, design, and innovation into unforgettable experiences. From intimate character arcs to vast open worlds, your creations redefine what’s possible. You don’t just make games—you craft cultural milestones, teaching players to dream bigger, think deeper, and feel stronger. Your legacy is written in pixels, passion, and the countless lives you’ve inspired through play.