#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=${1:-/opt/featherweight}
TS=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/FeatherweightLazarus_$TS"

echo "🔐 Creating backup dir at: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"/{yamls,envs,inspects,host-scan,container-scans}

echo "🧭 Saving docker ps..."
docker ps > "$BACKUP_DIR/docker-ps.txt"

echo "🐳 Processing running containers..."
for cid in $(docker ps -q); do
  name=$(docker inspect -f '{{ .Name }}' "$cid" | sed 's#^/##')
  echo "==== ${name} (${cid}) ===="

  # 1) Full metadata
  docker inspect "$cid" > "$BACKUP_DIR/inspects/${name}.json" || true

  # 2) Environment variables
  docker exec "$cid" sh -c 'printenv' > "$BACKUP_DIR/envs/${name}.env" || true

  # 3) Find likely config files inside container
  echo "🔎 Scanning common config locations in ${name}..."
  docker exec "$cid" sh -lc '
    set -e
    SEARCH_DIRS="/app /workspace /usr/src/app /config /etc /opt /srv"
    for d in $SEARCH_DIRS; do
      [ -d "$d" ] && find "$d" -maxdepth 3 -type f \
        \( -name "*compose*.yml" -o -name "*compose*.yaml" \
           -o -name "docker-compose*.yml" -o -name "docker-compose*.yaml" \
           -o -name "*.env" -o -name "*config*.yml" \
           -o -name "prometheus.yml" -o -name "*grafana*.json" \) 2>/dev/null
    done
  ' > "$BACKUP_DIR/container-scans/${name}.paths" || true

  # 4) Copy any files found
  while read -r path; do
    [ -z "${path:-}" ] && continue
    base=$(basename "$path")
    dst="$BACKUP_DIR/yamls/${name}__${base}"
    echo "📥  Copying ${name}:$path -> $dst"
    docker cp "${cid}:${path}" "$dst" 2>/dev/null || true
  done < "$BACKUP_DIR/container-scans/${name}.paths"

  # 5) Special cases for well-known services
  case "$name" in
    *prometheus*)
      docker cp "${cid}:/etc/prometheus/prometheus.yml" \
        "$BACKUP_DIR/yamls/${name}__prometheus.yml" 2>/dev/null || true
      ;;
  esac

  case "$name" in
    *grafana*)
      docker cp "${cid}:/etc/grafana/provisioning" \
        "$BACKUP_DIR/yamls/${name}__grafana_provisioning" 2>/dev/null || true
      ;;
  esac
done

# 6) Scan host repo for YAML/ENV that survived
echo "🧭 Host scan under: $REPO_ROOT"
find "$REPO_ROOT" -type f \
  \( -name "docker-compose*.y*" -o -name "*compose*.y*" -o -name "*.env" \
     -o -name "prometheus.yml" -o -name "*grafana*.json" \) 2>/dev/null \
  | tee "$BACKUP_DIR/host-scan/host-paths.txt"

while read -r f; do
  [ -z "${f:-}" ] && continue
  relname=$(echo "$f" | sed 's#/#__#g')
  cp -a "$f" "$BACKUP_DIR/host-scan/${relname}" 2>/dev/null || true
done < "$BACKUP_DIR/host-scan/host-paths.txt"

# 7) Tarball everything for safekeeping
echo "📦 Creating archive..."
tar czf "$BACKUP_DIR.tgz" -C "$(dirname "$BACKUP_DIR")" "$(basename "$BACKUP_DIR")"

echo ""
echo "✅ Backup complete."
echo "📂 Folder : $BACKUP_DIR"
echo "🗜️ Archive: $BACKUP_DIR.tgz"
echo ""
echo "---- Summary (non-empty files within 2 levels) ----"
find "$BACKUP_DIR" -maxdepth 2 -type f -size +0c | sed "s#${BACKUP_DIR}/##" | sort || true
