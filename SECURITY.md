# SECURITY

These demos are designed for public viewing on GitHub Pages. They intentionally avoid proprietary internals.

- No secrets, tokens, or private endpoints in the codebase. All API calls stick to local demo endpoints.
- No persistence or PII: inputs are processed in-memory and discarded.
- Rate limiting and honeypot guards are demonstrated only; not sufficient for production.
- File serving uses an allowlist and cache-busting; tighten for any production use.
- Report issues via private email: security@featherweight.world
