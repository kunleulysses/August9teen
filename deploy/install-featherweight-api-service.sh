#!/usr/bin/env bash
set -euo pipefail

# Featherweight API systemd installer
# - Generates /etc/systemd/system/featherweight-api.service from template
# - Enables and starts the service
# Requires: sudo privileges

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE="$SCRIPT_DIR/featherweight-api.service"
SERVICE_NAME="featherweight-api.service"
SERVICE_DST="/etc/systemd/system/${SERVICE_NAME}"

# Resolve repo root assuming this script is at repo/deploy/
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

RUN_USER_DEFAULT="${SUDO_USER:-${USER}}"
RUN_USER="${RUN_USER:-$RUN_USER_DEFAULT}"
WORK_DIR="${WORK_DIR:-$REPO_ROOT}"

# Optional overrides (export before running to change)
PORT_VAL="${PORT:-3004}"
STORE_BACKEND_VAL="${STORE_BACKEND:-memory}"
REALITY_GENERATOR_URL_VAL="${REALITY_GENERATOR_URL:-http://localhost:5006}"

if [[ $EUID -ne 0 ]]; then
  echo "[INFO] Re-running with sudo..."
  exec sudo RUN_USER="$RUN_USER" WORK_DIR="$WORK_DIR" PORT="$PORT_VAL" STORE_BACKEND="$STORE_BACKEND_VAL" REALITY_GENERATOR_URL="$REALITY_GENERATOR_URL_VAL" bash "$0" "$@"
fi

command -v systemctl >/dev/null 2>&1 || { echo "[ERROR] systemctl not found"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[WARN] node not in root PATH; relying on /usr/bin/env node in unit"; }

[[ -f "$TEMPLATE" ]] || { echo "[ERROR] Template not found: $TEMPLATE"; exit 1; }

TMP_UNIT="$(mktemp)"
# Render template placeholders
sed -e "s#{{RUN_USER}}#${RUN_USER}#g" \
    -e "s#{{WORK_DIR}}#${WORK_DIR}#g" "$TEMPLATE" > "$TMP_UNIT"

# Inject optional overrides via an Environment file section if changed
if [[ "$PORT_VAL" != "3004" || "$STORE_BACKEND_VAL" != "memory" || "$REALITY_GENERATOR_URL_VAL" != "http://localhost:5006" ]]; then
  echo "[INFO] Applying overrides via drop-in style in unit file"
  cat >>"$TMP_UNIT" <<EOF

# Overrides applied by installer
Environment=PORT=${PORT_VAL}
Environment=STORE_BACKEND=${STORE_BACKEND_VAL}
Environment=REALITY_GENERATOR_URL=${REALITY_GENERATOR_URL_VAL}
EOF
fi

install -m 0644 "$TMP_UNIT" "$SERVICE_DST"
rm -f "$TMP_UNIT"

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
# Start or restart
if systemctl is-active --quiet "$SERVICE_NAME"; then
  systemctl restart "$SERVICE_NAME"
else
  systemctl start "$SERVICE_NAME"
fi

sleep 1
systemctl --no-pager --full status "$SERVICE_NAME" || true

# Health check
code=$(curl -sS -o /dev/null -w '%{http_code}' http://localhost:"${PORT_VAL}"/health || true)
echo "[HEALTH] GET /health -> ${code}"

echo "[DONE] Installed ${SERVICE_NAME} for user=${RUN_USER} workdir=${WORK_DIR}"
