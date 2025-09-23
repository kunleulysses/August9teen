// Minimal bootstrap for secrets/env.
// In this environment, we assume required secrets are provided via process.env.
// This file exists to satisfy side-effect import at server startup.

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
