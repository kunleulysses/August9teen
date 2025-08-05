# Ticket A5 – StructuredLogger-Pino

## Goal
Implement robust, structured logging using the `pino` logger throughout all Sigil-DNA service code, with per-request trace IDs, log level support, and sensitive data redaction.

## Context

Console logging (`console.log`, `console.error`) is currently used throughout critical code in the Sigil-DNA subsystem, including:
- [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs)
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)
- [`FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs`](../../server/consciousness/sigil-based-code-authenticator.cjs)

Console logs are unstructured, cannot be parsed by log aggregation tools, and are not suitable for production monitoring or debugging. Additionally, there is no traceability between logs and incoming requests, making it nearly impossible to reconstruct flows or troubleshoot issues in production or in a distributed environment.

The industry standard is to use a performant, structured logger like `pino`, which outputs newline-delimited JSON logs compatible with ELK, Loki, or GCP logging. Per-request logging with unique IDs (trace IDs, request IDs) is critical for distributed tracing, especially as Sigil-DNA grows to support concurrent users, external API calls, and multi-tenant flows.

Pino supports log levels, child loggers, redaction, and is extremely fast (benchmarked as the fastest Node.js logger).

## Prerequisites

- Node.js v18.x or higher
- `pino` and `pino-http` npm packages:
  ```
  npm install pino pino-http
  ```
- Familiarity with Express.js middleware and how to inject per-request context
- Ability to restart/redeploy services
- Access to log aggregation (optional for verification, e.g. `jq` or Loki)

## Step-by-Step Implementation

### 1. Install and Require pino/pino-http

1. Install dependencies:
   ```
   npm install pino pino-http
   ```
2. In your main server entrypoint (`index.cjs` or `index.ts`), require pino and pino-http:
   ```js
   const pino = require('pino');
   const pinoHttp = require('pino-http');
   ```

### 2. Configure Logger and Middleware

1. Create a base logger (singleton):
   ```js
   const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
     redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'response.body.token']
   });
   ```
2. Add `pino-http` middleware to Express, setting a custom request ID if not present:
   ```js
   app.use(
     pinoHttp({
       logger,
       genReqId: (req) => req.headers['x-request-id'] || require('crypto').randomUUID(),
       customSuccessMessage: function (res) {
         return `${res.req.method} ${res.req.url} completed with status ${res.statusCode}`;
       }
     })
   );
   ```
3. Now, all logs inside route handlers will have `req.log` for per-request logging:
   ```js
   app.get('/healthz', (req, res) => {
     req.log.info({route: '/healthz'}, 'Health check ping');
     res.status(200).json({status: 'ok'});
   });
   ```

### 3. Replace All `console.log` and `console.error` Usages

1. Grep for all `console.log`, `console.error`, `console.warn` in:
   - `sigil-identity.cjs`
   - `sigil-api.cjs`
   - `sigil-based-code-authenticator.cjs`
2. Replace them with the appropriate logger call:
   - Use `logger.info`, `logger.error`, or `req.log.info` (if inside a request context).
   - Example:
     ```js
     logger.info({module: 'sigil-identity', event: 'memory-encoded', sigilId}, 'Encoded new sigil');
     ```
   - For errors:
     ```js
     logger.error({err}, 'Failed to encode sigil');
     ```

### 4. Add Child Loggers for Subsystems

1. In each major module/class, create a child logger:
   ```js
   const sigilLogger = logger.child({module: 'sigil-identity'});
   ```
2. Use this child logger for all logs from that module.

### 5. Validate and Redact Sensitive Data

1. Ensure all logs redact sensitive info by configuring the `redact` option.
2. Test by logging requests that include secrets, tokens, or passwords and ensure they are not present in the output.

### 6. Integrate with k8s/Cloud Logging (optional)

1. Ensure logs are written to stdout in JSON (default for pino).
2. Optionally, pipe logs to a file or Loki/ELK via a sidecar.

### 7. Document Logging Conventions

1. Add a section to the developer README documenting:
   - Log levels: info, warn, error, debug
   - Trace/request ID usage
   - How to search logs by request ID

---

## Verification

### Unit and Integration Testing

- Use Jest or Mocha to verify:
  - All endpoints emit logs with expected fields/levels.
  - Request IDs are unique and present in all logs for a request.
  - Redacted fields are not present.

- Run the service and perform typical API calls.  
  - Example:
    ```
    curl -H "X-Request-Id: test123" http://localhost:3000/healthz
    ```
  - Confirm in logs:
    ```json
    {
      "level": 30,
      "msg": "Health check ping",
      "reqId": "test123",
      "route": "/healthz"
    }
    ```

- Simulate errors (e.g., DB offline) and verify `error` logs are emitted.

### Log Parsing

- Pipe logs to `jq`:
  ```
  node server/index.cjs | jq .
  ```
- Search by request ID:
  ```
  grep test123 logs.json
  ```

### Security

- Test with requests including `Authorization` headers, passwords, etc. and verify redaction.

---

## Rollback

- Restore all `console.log` usage via git:
  ```
  git checkout HEAD~1 -- FlappyJournal/server/sigil-identity.cjs FlappyJournal/server/sigil-api.cjs FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs
  ```
- Remove pino and pino-http:
  ```
  npm uninstall pino pino-http
  ```
- Remove logger middleware from Express.

---

## Acceptance Criteria

- All logs output as newline-delimited JSON.
- Each API request/response linked by unique request ID.
- No sensitive fields appear in logs.
- All error cases logged at `error` level.
- Log levels/structure documented.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [pino logging npm](https://www.npmjs.com/package/pino)
- [pino-http npm](https://www.npmjs.com/package/pino-http)
- [pino redaction docs](https://getpino.io/#/docs/redaction)
- [ELK Stack](https://www.elastic.co/what-is/elk-stack)
- [Distributed tracing overview](https://opentelemetry.io/docs/)