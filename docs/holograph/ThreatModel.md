# Threat Model

| Threat                 | STRIDE | Mitigation                            |
|------------------------|--------|---------------------------------------|
| JWT replay             | S      | Use exp/nbf/aud, 15 min TTL           |
| SceneNode injection    | T      | Schema validation, input sanitization |
| Unbounded recursion    | D      | Depth cap, metrics, alerting          |
| Leaked metrics         | I      | Authenticate metrics endpoint         |
| WS flooding            | D      | Rate-limiting, connection limits      |
| Broken authz           | E      | Role-based access control (RBAC)      |