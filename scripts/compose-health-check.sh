#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${1:-}"
ENV_FILE="${2:-.env.example}"

if [[ -z "$COMPOSE_FILE" ]]; then
  echo "Usage: $0 <compose-file.yml> [env-file]"
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Compose file $COMPOSE_FILE not found."
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file $ENV_FILE not found."
  exit 1
fi

TMP_ENV=".env.ci.$$"
cp "$ENV_FILE" "$TMP_ENV"

cleanup() {
  echo "Cleaning up containers and env file..."
  docker compose -f "$COMPOSE_FILE" --env-file "$TMP_ENV" down -v || true
  rm -f "$TMP_ENV"
}
trap cleanup EXIT

echo "Building and starting services from $COMPOSE_FILE"
docker compose -f "$COMPOSE_FILE" --env-file "$TMP_ENV" up -d --build

# Wait for all containers to be healthy (up to 120s)
echo "Waiting for containers to become healthy..."
START_TIME=$(date +%s)
while true; do
  HEALTHY=1
  for status in $(docker compose -f "$COMPOSE_FILE" ps --format json | jq -r '.[].Health'); do
    if [[ "$status" != "healthy" && "$status" != "null" ]]; then
      HEALTHY=0
      break
    fi
  done
  if [[ $HEALTHY -eq 1 ]]; then
    echo "All containers healthy."
    break
  fi
  NOW=$(date +%s)
  if (( NOW - START_TIME > 120 )); then
    echo "Timeout waiting for containers to become healthy."
    docker compose -f "$COMPOSE_FILE" ps
    exit 2
  fi
  sleep 5
done

# Probe health endpoints (hard-coded based on detected ports in compose file)
probe() {
  local url="$1"
  echo "Probing $url ..."
  for i in {1..24}; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "Healthcheck passed: $url"
      return 0
    fi
    sleep 5
  done
  echo "Healthcheck FAILED: $url"
  exit 3
}

if grep -q '3000:3000' "$COMPOSE_FILE"; then
  probe "http://localhost:3000/health"
fi
if grep -q '5005:5005' "$COMPOSE_FILE"; then
  probe "http://localhost:5005/health"
fi
if grep -q '5000:5000' "$COMPOSE_FILE"; then
  probe "http://localhost:5000/api/health"
fi

echo "Integration health checks succeeded."