# Security Policy

## Supported Versions
- All releases on the `main` branch are supported for security updates.
- Releases older than 6 months may not receive patches.

## Reporting Vulnerabilities
Please report security issues to [security@example.com](mailto:security@example.com) or open a private GitHub Security Advisory.

## Key Rotation Procedure (JWT RS256)
- JWT keys are managed as Kubernetes secrets via [ExternalSecrets](https://external-secrets.io/).
- To rotate keys:
  1. Generate new RSA keypair:
     ```
     openssl genrsa -out jwtRS256.key 2048
     openssl rsa -in jwtRS256.key -pubout -out jwtRS256.key.pub
     ```
  2. Update the secret in your backend (Vault, AWS, etc).
  3. Restart API pods to pick up the new keys.

## Dependencies Scanning
- All dependencies are scanned in CI using `npm audit --audit-level=high`.
- Results are uploaded as part of the GitHub Actions build.
- Critical findings block release; moderate findings are reviewed monthly.

## Contact
For urgent security matters, contact: [security@example.com](mailto:security@example.com)