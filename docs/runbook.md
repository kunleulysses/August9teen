# Operational Runbook & Threat Model

## Meta-State Recovery

### Restore Path

In the event of a Redis outage or snapshot loss, the system will gracefully degrade to in-memory operation. However, to restore the last known state, follow these steps:

1.  **Restore Redis:** Ensure that the Redis instance is back online and accessible.
2.  **Manual Key Replay:** If the `meta:latest` key is lost, you can attempt to restore it from the most recent snapshot.
    ```sh
    # Find the latest snapshot
    redis-cli KEYS "meta:snapshot:*" | sort | tail -n 1
    # Restore the latest snapshot to meta:latest
    redis-cli GET <latest_snapshot_key> | redis-cli SET meta:latest
    ```
3.  **Restart Sequence:** Perform a rolling restart of the `consciousness-system` pods. The system will automatically attempt to load the `meta:latest` key on boot.

### PagerDuty Playbook

*   **Alert:** `heartbeat_skew_ms` > 500ms for 5 minutes
    *   **On-call Steps:**
        1.  Check the Grafana dashboard for a sudden increase in CPU or memory usage.
        2.  Check the logs for any errors or long-running operations.
        3.  If the issue persists, perform a rolling restart of the `consciousness-system` pods.
*   **Alert:** `ws_backpressure_drops_total` > 100/minute for 5 minutes
    *   **On-call Steps:**
        1.  Check the Grafana dashboard for a sudden increase in WebSocket traffic.
        2.  Check the logs for any misbehaving clients.
        3.  If necessary, block the offending IP address at the firewall level.

### Metrics/A/K/SLO Links

*   **Prometheus Targets:**
    *   `metacog_analysis_latency_ms`
    *   `heartbeat_skew_ms`
    *   `ws_backpressure_drops_total`
    *   `ws_rate_limit_drops_total`
    *   `ws_scope_reject_total`
    *   `circuit_breaker_open_total`
    *   `breaker_state`
*   **SLOs:**
    *   p95 analysis latency < 500ms
    *   Heartbeat continuity > 99.9%
    *   WebSocket drops < 0.1%

### Backup/Restore

*   **Schedule:** Redis RDB backups are taken every hour. AOF is enabled for point-in-time recovery.
*   **Restore Process:** Follow the standard Redis restore procedures.

### Security Procedures

*   **JWT Secret Rotation:** JWT secrets are rotated every 90 days.
*   **Scope Claim Audit:** Scope claims are audited on a quarterly basis to ensure that only authorized clients have access to the `metacog.stream` scope.

## Threat Model

### Surface Map

*   **WebSocket:** The primary entry point for real-time communication.
*   **REST:** The `/metrics` endpoint is exposed for Prometheus scraping.
*   **Prometheus:** The Prometheus server itself is a potential target.

### Attack Scenarios

*   **Replay Attacks:** An attacker could attempt to replay a valid JWT to gain unauthorized access.
    *   **Control:** The `jti` (JWT ID) claim is used to prevent replay attacks.
*   **Scope Escalation:** An attacker could attempt to escalate their privileges by forging a JWT with additional scopes.
    *   **Control:** The JWT signature is verified to prevent tampering.
*   **Reflection Injection:** An attacker could attempt to inject malicious data into the `reflection` or `insight.content` fields.
    *   **Control:** All outbound payloads are sanitized to strip these fields.

### Controls

*   **Scope Checks:** The `createWsAuth` middleware enforces that all clients have the `metacog.stream` scope.
*   **Rate-Limiting:** The `createWsAuth` middleware enforces a per-client rate limit of 20 frames/sec.
*   **Sanitization:** The `sanitizeState` utility strips all sensitive data from outbound payloads.
*   **Metrics Auth:** The `/metrics` endpoint is protected by a JWT secret.