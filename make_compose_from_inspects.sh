#!/usr/bin/env bash
# ------------------------------------------------------------
# Build docker-compose.recovered.yml from docker inspect JSONs
#   ./make_compose_from_inspects.sh                 # build only
#   ./make_compose_from_inspects.sh --up            # build + up -d
#   ./make_compose_from_inspects.sh /path/Lazarus   # build from a specific folder
#   ./make_compose_from_inspects.sh /path/Lazarus --up
# ------------------------------------------------------------
set -euo pipefail
need(){ command -v "$1" &>/dev/null || { echo "🚨  missing '$1'"; exit 1; }; }
need jq; need docker

# ---------- Parse args ----------
AUTO_UP=0
ARG1="${1:-}"
ARG2="${2:-}"

[[ "$ARG1" == "--up" || "$ARG2" == "--up" ]] && AUTO_UP=1
BACKUP_DIR="$HOME"
if [[ -d "$ARG1" && "$ARG1" != "--up" ]]; then
  BACKUP_DIR="$ARG1"
else
  # newest Lazarus folder
  BACKUP_DIR=$(ls -d "$HOME"/FeatherweightLazarus_* 2>/dev/null | sort | tail -n1)
fi

[[ -d "$BACKUP_DIR/inspects" ]] || { echo "❌  No 'inspects' dir in $BACKUP_DIR"; exit 1; }

OUT="$BACKUP_DIR/docker-compose.recovered.yml"
echo "version: '3.9'" > "$OUT"
echo "services:"      >> "$OUT"

echo "🔧  Building compose from: $BACKUP_DIR/inspects"
for f in "$BACKUP_DIR"/inspects/*.json; do
  svc=$(jq -r '.[0].Name' "$f" | sed 's#^/##')
  img=$(jq -r '.[0].Config.Image' "$f")
  safe=${svc//[^A-Za-z0-9_.-]/_}

  {
    echo "  $safe:"
    echo "    image: \"$img\""
    echo "    container_name: \"$safe\""

    cmd=$(jq -r '.[0].Config.Cmd | select(length>0) | join(" ")' "$f")
    [[ -n "$cmd" ]] && echo "    command: $cmd"

    # ports
    jq -r '
      .[0].HostConfig.PortBindings // {} |
      to_entries[] |
      .value[]? |
      "\(.HostPort):\(.ContainerPort)"' "$f" | sort -u | while read -r p; do
        [[ -n "$p" ]] && printf "    ports:\n      - \"%s\"\n" "$p"
      done

    # volumes (bind mounts only)
    jq -r '.[0].Mounts[]? | select(.Type=="bind") | "\(.Source):\(.Destination)"' "$f" \
      | while read -r v; do
          [[ -n "$v" && $v != "" ]] && { echo "    volumes:"; echo "      - \"$v\""; }
        done | uniq

    # env
    jq -r '.[0].Config.Env[]?' "$f" \
      | while read -r e; do
          [[ -n "$e" ]] && { echo "    environment:"; echo "      - $e"; }
        done | uniq
    echo
  } >> "$OUT"
done

echo "✅  Compose file ➜ $OUT"

if [[ $AUTO_UP -eq 1 ]]; then
  echo "🚀  Starting stack…"
  (docker compose -f "$OUT" up -d 2>/dev/null || docker-compose -f "$OUT" up -d)
  echo "🎉  Containers should now be running."
else
  echo "👉  Launch manually with:\n    docker compose -f $OUT up -d"
fi
