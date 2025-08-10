set -euo pipefail
BACKUP_DIR=/var/backups/featherweight/postgres
mkdir -p ""
TS=20250810T050344Z
if docker ps --format '{{.Names}}' | grep -q '^postgres-test$'; then
  docker exec -i postgres-test pg_dump -U postgres sigil_staging | gzip -9 > "/sigil_staging_.sql.gz"
else
  PGPASSWORD="" pg_dump -h 127.0.0.1 -U postgres sigil_staging | gzip -9 > "/sigil_staging_.sql.gz"
fi
find "" -type f -name 'sigil_staging_*.sql.gz' -mtime +14 -delete
