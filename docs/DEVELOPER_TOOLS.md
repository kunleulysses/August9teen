# Spiral Explorer Developer Tools

## Spiral Explorer UI

This is a React + Three.js single-page app for visualizing spiral memory nodes in 3-D.

### Quickstart

```sh
cd client/spiral-explorer
npm install
npm run dev
# open http://localhost:5173
```

### Features

- Live render spiral lattice from `/api/spiral` JSON.
- Color nodes by tenantId.
- Click node to view details in sidebar.
- Live updates via `/ws/spiral` websocket.
- Animates new nodes in smoothly.

---

## Math/Topology Utilities

- Parametric N-D spiral using Archimedean formula, powered by gl-matrix.
- Full property-based reversibility test (see `spiral:mathtest`).

---

## Scripts

- `npm run spiral:mathtest` – runs property-based tests on topology engine.
- `npm run explorer:dev` – starts Spiral Explorer UI in dev mode.
- `npm run explorer:build` – static build to `client/spiral-explorer/dist`.