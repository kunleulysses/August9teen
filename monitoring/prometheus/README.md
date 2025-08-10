## Importing alert rules

Rules to load:

- `deploy/prometheus/alerts/selfcoding_rules.yml`

Steps:

1. Mount the rules file into Prometheus container under `/etc/prometheus/rules/`
2. Reference via `rule_files` in Prometheus config
3. Reload Prometheus or restart

Ensure Alertmanager is configured and routes are set to the on-call channel.
