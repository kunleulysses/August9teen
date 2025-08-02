#!/usr/bin/env bash
set -euo pipefail
#
# Usage: scripts/create-swarm-secrets.sh [envfile]
# Reads secrets from .env.production (or supplied env file) and pushes them into Docker Swarm as secrets.
# Existing secrets are replaced. Requires: Docker Swarm initialized, user must have rights.
# 
# Secrets created:
#   openai_api_key, gemini_api_key, venice_ai_api_key, postgres_password, api_jwt_secret, gf_admin_password, cloudflare_api_token
#

ENV_FILE="${1:-.env.production}"

SECRET_NAMES=(
  openai_api_key
  gemini_api_key
  venice_ai_api_key
  postgres_password
  api_jwt_secret
  gf_admin_password
  cloudflare_api_token
)

ENV_KEYS=(
  OPENAI_API_KEY
  GEMINI_API_KEY
  VENICE_AI_API_KEY
  POSTGRES_PASSWORD
  API_JWT_SECRET
  GF_SECURITY_ADMIN_PASSWORD
  CLOUDFLARE_API_TOKEN
)

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file $ENV_FILE not found."
  exit 1
fi

# Parse env var value (ignore comments and export statements)
get_env_value() {
  local key="$1"
  grep -E "^$key=" "$ENV_FILE" | head -n1 | cut -d'=' -f2- | sed 's/^["'\'']//;s/["'\'']$//'
}

for i in "${!SECRET_NAMES[@]}"; do
  secret="${SECRET_NAMES[$i]}"
  var="${ENV_KEYS[$i]}"
  value="$(get_env_value "$var")"
  if [[ -z "$value" ]]; then
    echo "Warning: $var not found or empty in $ENV_FILE, skipping $secret"
    continue
  fi
  echo "$value" > "/tmp/$secret"
  if docker secret inspect "$secret" > /dev/null 2>&1; then
    echo "Updating Swarm secret $secret"
    docker secret rm "$secret"
  fi
  docker secret create --label managed=consciousness "$secret" "/tmp/$secret"
  rm -f "/tmp/$secret"
done

echo "Docker Swarm secrets created or updated."