#!/bin/bash
set -e

NEW_PASS="$1"
if [ -z "$NEW_PASS" ]; then
  echo "Usage: $0 <new-password>"
  exit 1
fi

echo "Rotating Redis password to: $NEW_PASS"

# This is a simplified example. In a real environment, you would
# iterate over all Redis nodes.
redis-cli config set requirepass "$NEW_PASS"

# Update the Kubernetes secret
kubectl create secret generic redis-url --from-literal=url="rediss://:$NEW_PASS@localhost:6379" --dry-run=client -o yaml | kubectl apply -f -

# Restart the deployment
kubectl rollout restart deployment spiral-memory