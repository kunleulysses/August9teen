#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(dirname "$0")/.."
CMD="$ROOT_DIR/scripts/run-chaos-experiments.sh"
LOG_DIR="$ROOT_DIR/docs/chaos-results"
mkdir -p "$LOG_DIR"

CRON_SCHEDULE="0 3 * * *"
(
  crontab -l 2>/dev/null
  echo "$CRON_SCHEDULE $CMD >> $LOG_DIR/cron.log 2>&1"
) | crontab -

echo "Chaos experiments scheduled with cron expression '$CRON_SCHEDULE'."
echo "Results will be stored in $LOG_DIR."
