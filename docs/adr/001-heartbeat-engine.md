# ADR 001: Centralized Heartbeat Engine

## Status

Accepted

## Context

The legacy system used multiple `setInterval` and `setTimeout` calls across various modules to drive periodic tasks, such as the WebSocket heartbeat, metrics collection, and simulations. This approach led to several problems:

*   **Concurrency Issues:** Multiple timers firing at once could lead to unpredictable load and race conditions.
*   **Timer Drift:** `setInterval` does not guarantee exact timing, and can drift over time, especially under load.
*   **Lack of Observability:** It was difficult to monitor the health and performance of the various timers.
*   **Maintenance Overhead:** Adding or removing timers was a manual and error-prone process.

## Decision

We decided to implement a single, centralized `HeartbeatEngine` to drive all periodic tasks in the system. This engine is responsible for maintaining a single, high-resolution timer and emitting a `heartbeat` event at a configurable interval. Other modules can then subscribe to this event to perform their periodic tasks.

The `HeartbeatEngine` also includes the following features:

*   **Drift Compensation:** The engine actively compensates for timer drift, ensuring that the heartbeat remains accurate over time.
*   **Skew Metrics:** The engine exposes a `heartbeat_skew_ms` histogram metric, which allows us to monitor the accuracy of the heartbeat and alert on any significant deviations.
*   **Idle Timeout:** The engine can automatically shut down the application if it becomes idle for a configurable period of time.

## Consequences

The adoption of a centralized `HeartbeatEngine` has the following consequences:

*   **Predictable CPU:** By centralizing all periodic tasks, we can better predict and manage the CPU load of the system.
*   **Memory Safety:** The `HeartbeatEngine` is designed to be memory-safe, and the use of a single timer reduces the risk of memory leaks.
*   **Easier Observability:** The `HeartbeatEngine` exposes a number of metrics that make it easy to monitor the health and performance of the system.
*   **Simplified Maintenance:** Adding or removing periodic tasks is now as simple as subscribing or unsubscribing from the `heartbeat` event.

## Alternatives Considered

*   **`setInterval`:** This was the legacy approach, and was rejected due to the problems outlined above.
*   **Node.js Cluster:** We considered using the Node.js cluster module to run each timer in its own process. However, this would have added significant complexity to the system, and would not have solved the problem of timer drift.
*   **Third-party Schedulers:** We considered using a third-party scheduler library, such as `node-cron`. However, we decided that a custom solution would be more flexible and would allow us to better integrate with our existing metrics and logging infrastructure.

## Rollout

The `HeartbeatEngine` was rolled out in a staged manner:

1.  The `HeartbeatEngine` was implemented and tested in a separate branch.
2.  The `HeartbeatEngine` was integrated into the main branch behind a feature flag.
3.  The feature flag was enabled in a staging environment, and the system was soak-tested for 24 hours.
4.  Alerts were configured to fire if the `heartbeat_skew_ms` metric exceeded a certain threshold.
5.  The feature flag was enabled in production.