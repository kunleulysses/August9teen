#!/bin/bash
set -e

if [ "$1" == "on" ]; then
  echo "Enabling quantum links..."
  export ENABLE_QUANTUM_LINKS=true
elif [ "$1" == "off" ]; then
  echo "Disabling quantum links..."
  export ENABLE_QUANTUM_LINKS=false
else
  echo "Usage: $0 on|off"
  exit 1
fi

kubectl rollout restart deployment spiral-memory