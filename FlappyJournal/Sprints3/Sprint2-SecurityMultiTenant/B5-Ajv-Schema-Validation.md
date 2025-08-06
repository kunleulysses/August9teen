# Ticket B5 – Ajv Schema Validation on POST

## Goal
Validate all incoming sigil data at the API boundary using Ajv JSON schema validation, ensuring only well-formed, expected payloads are accepted and preventing code injection, abuse, or schema drift.

## Context

Currently, the Sigil-DNA API (see [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)) accepts arbitrary POST payloads to endpoints such as `/sigil/api/consciousness/sigils`. The request body is inserted into storage and cryptographic processes with minimal or no validation. This exposes the system to:
- Injection attacks (malicious or malformed JSON)
- Storage of invalid or inconsistent data
- Breakage of downstream processes expecting certain fields/types
- Data corruption or security issues, especially as the schema evolves

Ajv is a production-grade, high-performance JSON schema validator for Node.js, widely used for REST APIs. This ticket will:
- Define strict JSON schemas for all API payloads (e.g., sigil mint, verify, revoke)
- Add Ajv-based middleware for validation before handler logic
- Reject any invalid payloads with HTTP 400 and a clear error message
- Test all validation logic and document schema requirements

Key files:
- [`server/sigil-api.cjs`](../../server/sigil-api.cjs)
- New: `server/schemas/sigil.schema.json`
- New: `server/middleware/validateSchema.js`
- Test code in `__tests__/sigil/`

## Prerequisites

- Node.js v18.x or higher
- `ajv` npm package (`npm install ajv`)
- Familiarity with JSON Schema Draft-07 or higher
- Ability to update Express middleware and API handlers
- ENV: none specific
- Example payloads for all endpoints

## Step-by-Step Implementation

### 1. Install ajv

```bash
npm install ajv
```

### 2. Define JSON Schemas

1. In `server/schemas/sigil.schema.json`:
   ```json
   {
     "$id": "https://sigildna.dev/schemas/sigil.json",
     "type": "object",
     "properties": {
       "data": { "type": "object" },
       "consciousnessState": {
         "type": "object",
         "properties": {
           "phi": { "type": "number", "minimum": 0, "maximum": 2 },
           "coherence": { "type": "number", "minimum": 0, "maximum": 1 },
           "awareness": { "type": "number", "minimum": 0, "maximum": 1 }
         },
         "required": ["phi", "coherence", "awareness"]
       }
     },
     "required": ["data"],
     "additionalProperties": false
   }
   ```

2. Define similar schemas for verify, revoke if needed.

### 3. Add Validation Middleware

1. In `server/middleware/validateSchema.js`:
   ```js
   const Ajv = require('ajv');
   const ajv = new Ajv();
   function validateSchema(schema) {
     const validate = ajv.compile(schema);
     return function (req, res, next) {
       if (!validate(req.body)) {
         res.status(400).json({ error: 'Invalid request', details: validate.errors });
       } else {
         next();
       }
     };
   }
   module.exports = validateSchema;
   ```

### 4. Integrate Middleware in API

1. In `sigil-api.cjs`:
   ```js
   const validateSchema = require('./middleware/validateSchema');
   const sigilSchema = require('./schemas/sigil.schema.json');
   router.post('/api/consciousness/sigils', validateSchema(sigilSchema), handler);
   ```

### 5. Document Schemas

- In README and API docs, include example schemas and valid/invalid payloads.
- Provide sample curl commands.

---

## Verification

### Automated

- Unit tests: POST invalid payloads (missing fields, wrong types), expect 400.
- POST valid payloads, expect 200.
- Run integration tests for edge cases.

### Manual

- Use curl to POST malformed JSON:
  ```bash
  curl -X POST http://localhost:3000/sigil/api/consciousness/sigils \
    -H "Content-Type: application/json" \
    -d '{"data": "not an object"}'
  ```
  Should return 400 with error details.

- Review logs for all rejections.

---

## Rollback

- Remove validation middleware from API routes:
  ```
  git checkout HEAD~1 -- server/middleware/validateSchema.js server/sigil-api.cjs
  ```
- Remove ajv dependency.

---

## Acceptance Criteria

- All incoming POSTs are validated against strict schema.
- Invalid requests are rejected with HTTP 400 and error message.
- No regressions in API/handler logic.
- Schemas documented and copy-paste tested.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Ajv JSON Schema validator](https://ajv.js.org/)
- [JSON Schema docs](https://json-schema.org/)
- [Express middleware patterns](https://expressjs.com/en/guide/using-middleware.html)
- [API security validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Best practices for API payload validation](https://swagger.io/docs/specification/data-models/)