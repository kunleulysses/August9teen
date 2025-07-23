#!/bin/bash

# Automated Backup Script for Featherweight Consciousness System
# Run this regularly to backup your consciousness system

set -e

BACKUP_DIR="/opt/consciousness-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="consciousness-backup-$DATE"
FULL_BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
info() { echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"; }

log "🔄 Starting consciousness system backup"

# Create backup directory
sudo mkdir -p "$BACKUP_DIR"
sudo chown $USER:$USER "$BACKUP_DIR"
mkdir -p "$FULL_BACKUP_PATH"

# Backup database
log "🗄️ Backing up database..."
docker-compose exec -T postgres pg_dump -U feather_user featherweight_consciousness > "$FULL_BACKUP_PATH/database.sql"

# Backup configuration files
log "⚙️ Backing up configuration..."
cp docker-compose.yml "$FULL_BACKUP_PATH/"
cp .env "$FULL_BACKUP_PATH/"
cp Dockerfile.* "$FULL_BACKUP_PATH/" 2>/dev/null || true
cp Caddyfile "$FULL_BACKUP_PATH/" 2>/dev/null || true

# Backup consciousness data volume
log "💾 Backing up consciousness data..."
docker run --rm -v consciousness_data:/data -v "$FULL_BACKUP_PATH":/backup alpine tar czf /backup/consciousness_data.tar.gz -C /data .

# Backup logs volume
log "📋 Backing up logs..."
docker run --rm -v consciousness_logs:/logs -v "$FULL_BACKUP_PATH":/backup alpine tar czf /backup/consciousness_logs.tar.gz -C /logs .

# Create backup info
log "📝 Creating backup info..."
cat > "$FULL_BACKUP_PATH/backup_info.txt" << EOF
Backup created: $(date)
System: $(hostname)
Docker Compose version: $(docker-compose --version)
Container status at backup time:
$(docker-compose ps)

Database size: $(du -h "$FULL_BACKUP_PATH/database.sql" | cut -f1)
Total backup size: $(du -sh "$FULL_BACKUP_PATH" | cut -f1)
EOF

# Compress backup
log "🗜️ Compressing backup..."
cd "$BACKUP_DIR"
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

# Cleanup old backups (keep last 7 days)
log "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "consciousness-backup-*.tar.gz" -mtime +7 -delete

log "✅ Backup completed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
info "💡 To restore this backup, extract it and run the restore script"

# Show backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME.tar.gz" | cut -f1)
log "📊 Backup size: $BACKUP_SIZE"

# List recent backups
log "📁 Recent backups:"
ls -lah "$BACKUP_DIR"/*.tar.gz | tail -5
