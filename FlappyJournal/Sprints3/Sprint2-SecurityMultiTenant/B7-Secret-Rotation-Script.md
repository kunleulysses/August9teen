# Ticket B7 – Secret Rotation Script

## Goal
Automate rotation of the HMAC signing secret for eventSign, propagate the new secret to all running Sigil-DNA services and dependent infrastructure, and support seamless hot-reload with zero downtime.

## Context

The HMAC secret for signing/verification (see [`FlappyJournal/server/consciousness/core/security/eventSign.ts`](../../server/consciousness/core/security/eventSign.ts)) is currently static, stored in code or in a single ENV variable (`SPIRAL_EVENT_SECRET`). This is a critical security risk:
- If the secret is leaked, all signatures can be forged until code is redeployed with a new key.
- No process exists for regular key rotation (best practice: every 30-90 days, or on incident).
- No hot-reload: rotating the secret currently requires a full restart of all services, risking downtime and race conditions.
- Key sync may be inconsistent across distributed services (multi-pod, multi-region).

To close this gap, we must:
- Store secrets in a secure secret manager (Vault, k8s Secrets, AWS/GCP Secret Manager).
- Write a script to generate a new key, update all secrets, and notify/reload all services.
- Implement hot-reload logic (e.g., SIGHUP or file watcher).
- Log all rotation events for audit.
- Optionally, support dual-key period for gradual expiry.

## Prerequisites

- Access to secret manager (Vault, k8s, AWS/GCP, etc.)
- Node.js v18.x or higher
- Access to all service deployment configs and manifests
- Bash, curl, jq, openssl
- ENV: `SPIRAL_EVENT_SECRET`, `SECRET_MANAGER_*`
- Ability to restart or signal all running services

## Step-by-Step Implementation

### 1. Store Secret in Secret Manager

1. For Vault:
   ```bash
   vault kv put secret/sigil/spiral-event-secret value=$(openssl rand -hex 32)
   ```
2. For k8s:
   ```bash
   kubectl create secret generic spiral-event-secret --from-literal=value=$(openssl rand -hex 32)
   ```
3. For AWS SSM:
   ```bash
   aws ssm put-parameter --name spiral-event-secret --value "$(openssl rand -hex 32)" --type SecureString --overwrite
   ```

### 2. Write Rotation Script

1. `scripts/rotate-spiral-secret.sh`:
   ```bash
   #!/bin/bash
   NEW_SECRET=$(openssl rand -hex 32)
   # Vault example:
   vault kv put secret/sigil/spiral-event-secret value=$NEW_SECRET
   # k8s:
   kubectl create secret generic spiral-event-secret --from-literal=value=$NEW_SECRET --dry-run=client -o yaml | kubectl apply -f -
   # AWS SSM:
   aws ssm put-parameter --name spiral-event-secret --value "$NEW_SECRET" --type SecureString --overwrite
   # Notify/reload all pods:
   kubectl rollout restart deployment sigil-dna
   echo "Rotated SPIRAL_EVENT_SECRET and restarted services"
   ```

2. Make script executable:
   ```
   chmod +x scripts/rotate-spiral-secret.sh
   ```

### 3. Implement Hot-Reload in App

1. In `server/index.cjs`, add:
   ```js
   process.on('SIGHUP', () => {
     // re-read secret from ENV or file
     eventSign.reloadSecret();
     logger.info('Reloaded spiral event secret');
   });
   ```
2. Use file watcher or secret manager SDK for live updates if supported.

### 4. Support Dual-Key Window (Optional)

1. Allow verifying signatures with both old and new secrets for N minutes.
2. Add to eventSign:
   ```js
   let secrets = [currentSecret, oldSecret];
   function verify(payload, signature) {
     return secrets.some(secret => verifyWithSecret(payload, signature, secret));
   }
   ```

### 5. Log and Audit

- Log all key rotations, including old/new key fingerprints, timestamp, and initiator.

### 6. Document Process

- In security runbook, describe rotation cadence and incident handling.

---

## Verification

### Automated

- Run script, verify new secret is stored and all pods reload.
- Test that both old and new signatures are accepted during dual-key window.

### Manual

- Check logs for "Reloaded spiral event secret".
- Try forging signature with old secret after window—must fail.

### Security

- Confirm no secrets in logs or error output.

---

## Rollback

- Restore old secret in manager.
- Rollout restart services.
- Remove dual-key window config if rollback complete.

---

## Acceptance Criteria

- HMAC secret can be rotated without downtime.
- All services reload secret within 1 minute.
- No signature verification breaks during rotation.
- All rotations are logged and auditable.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Vault secrets CLI](https://developer.hashicorp.com/vault/docs/commands/kv/put)
- [Kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [AWS SSM parameter store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [Hot-reload secrets in Node.js](https://medium.com/@danielsternlicht/how-to-hot-reload-your-nodejs-apps-secrets-in-production-67f7f8e9b37a)
- [OWASP secret management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)