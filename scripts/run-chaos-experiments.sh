#!/usr/bin/env bash
set -euo pipefail

CHAOS_DIR="$(dirname "$0")/../k8s/chaos"
RESULTS_DIR="$(dirname "$0")/../docs/chaos-results"
mkdir -p "$RESULTS_DIR"

run_and_collect() {
  local manifest="$1"
  local engine_name="$2"

  kubectl apply -f "$manifest"
  kubectl wait --for=condition=completed --timeout=600s chaosengine "$engine_name" || true
  kubectl get chaosresult -l chaosengine="$engine_name" -o yaml > "$RESULTS_DIR/${engine_name}-$(date +%Y%m%d%H%M%S).yaml"
}

run_and_collect "$CHAOS_DIR/pod-kill.yaml" holograph-pod-kill
run_and_collect "$CHAOS_DIR/db-loss.yaml" holograph-db-loss
run_and_collect "$CHAOS_DIR/broker-partition.yaml" holograph-broker-partition
