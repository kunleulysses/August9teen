# API Endpoints

> All endpoints except `/health` and `/docs` require Bearer JWT (RS256) authentication.

---

## `GET /health`
- Returns: `{ "status": "ok", "backend": "..."}`
- 200 OK if API is healthy

## `POST /login`
- Body: `{ "user": string }`
- Returns: `{ token: string }` (JWT RS256, 1h expiry)
- Rate limited (10/15min per IP)

## `POST /realities`
- Body: `{ id: string, data?: any }`
- Returns: `{ id: string }` (encoded reality id)
- Validates id (≤80 chars)
- Rate limited (30/15min per IP)
- Requires auth

## `GET /realities/:id`
- Returns: full encoded reality object, or 404 if not found
- Requires auth

## `GET /metrics`
- Returns: Prometheus metrics (text/plain)
- Requires auth

---

See OpenAPI spec at `/docs` in a running cluster for full details.