# 02 – Helmet CSP

## Goal
Enforce robust HTTP security headers and a minimal Content Security Policy (CSP) using helmet in Express.

## Prerequisites
- `helmet` installed in API package
- Access to `server/api/`, `server/consciousness-web-server.cjs`

## Step-by-Step Instructions

1. **Install and Import Helmet**
   ```sh
   npm install helmet
   ```
   - In `server/api/index.ts` (or main express entry):
   ```ts
   import helmet from 'helmet';
   app.use(helmet());
   ```

2. **Set Strict CSP**
   - Add custom CSP via helmet:
   ```ts
   app.use(
     helmet.contentSecurityPolicy({
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"], // minimize 'unsafe-inline'
         imgSrc: ["'self'", "data:", "blob:"],
         connectSrc: ["'self'", "wss://*"],
         fontSrc: ["'self'"],
         objectSrc: ["'none'"],
         upgradeInsecureRequests: [],
       }
     })
   );
   ```

3. **Test CSP in Browser**
   - Open devtools → Network/Headers and verify CSP is set.
   - Try loading external scripts/images to confirm blocking.

4. **CSP Report-Only Mode (optional)**
   - For rollout, start with:
   ```ts
   app.use(
     helmet.contentSecurityPolicy({
       useDefaults: true,
       directives: { ... },
       reportOnly: true
     })
   );
   ```

5. **Document Policy**
   - Update `SECURITY.md` and `docs/holograph/ThreatModel.md` with CSP config and rationales.

## Verification & Acceptance Criteria
- [ ] All HTTP responses include strict CSP and security headers
- [ ] No critical app functionality blocked by policy
- [ ] Policy documented and reviewed by frontend and security

## Time Estimate & Owner
- 0.5 day (Backend/Security)

## Common Pitfalls & Mitigations
- **Pitfall:** Overly strict CSP breaks frontend  
  **Mitigation:** Use reportOnly, iterate with UI team

- **Pitfall:** Headers missing in some Express routes  
  **Mitigation:** Apply helmet globally before all routes

- **Pitfall:** Inline scripts/styles needed  
  **Mitigation:** Minimize use, hash/nonce where possible