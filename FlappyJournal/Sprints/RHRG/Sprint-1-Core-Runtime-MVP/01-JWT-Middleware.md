# 01 – JWT Middleware

## Goal
Add robust JWT (JSON Web Token) authentication to all API and WebSocket endpoints using RS256, with user/role claims.

## Prerequisites
- Public/private keypair for signing tokens
- `jsonwebtoken` package installed
- Access to `server/api/auth/` or equivalent middleware directory

## Step-by-Step Instructions

1. **Generate Keypair (if not done)**
   ```sh
   openssl genrsa -out jwt-private.pem 2048
   openssl rsa -in jwt-private.pem -pubout -out jwt-public.pem
   # Store private securely; commit only public
   ```

2. **Add JWT Middleware**
   - File: `server/api/auth/jwtMiddleware.ts`
   ```ts
   import jwt from 'jsonwebtoken';
   import fs from 'fs';

   const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || './jwt-public.pem');

   export function jwtAuth(req, res, next) {
     const authHeader = req.headers.authorization || '';
     const token = authHeader.replace(/^Bearer /, '');
     if (!token) return res.status(401).json({ error: 'Missing token' });

     jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, payload) => {
       if (err) return res.status(401).json({ error: 'Invalid token' });
       req.user = payload;
       next();
     });
   }
   ```

3. **Integrate With Express**
   - File: `server/api/index.ts`
   ```ts
   import { jwtAuth } from './auth/jwtMiddleware';
   app.use('/api/holograph', jwtAuth);
   ```

4. **Enforce Auth on WebSocket**
   - File: `server/api/modules/holograph/gateway.ts`
   - Validate JWT payload on WS handshake, reject if invalid.

5. **Write Unit Tests**
   - File: `__tests__/auth/jwtMiddleware.test.cjs`
   - Test with valid/invalid/missing tokens.

## Verification & Acceptance Criteria
- [ ] All API and WS requests require valid JWT
- [ ] 401 error returned for invalid/missing tokens
- [ ] Unit tests cover all branches
- [ ] Manual test: `curl -H "Authorization: Bearer $TOKEN" ...`

## Time Estimate & Owner
- 0.5 day (Backend)

## Common Pitfalls & Mitigations
- **Pitfall:** Key mismatch (bad public/private)  
  **Mitigation:** Test with locally signed tokens before staging

- **Pitfall:** Leaking private key in repo  
  **Mitigation:** Add `jwt-private.pem` to `.gitignore`

- **Pitfall:** JWT exp/nbf not enforced  
  **Mitigation:** Set and verify token lifetimes