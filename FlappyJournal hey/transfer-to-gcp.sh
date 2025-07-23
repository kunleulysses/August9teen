#!/bin/bash

# Featherweight Consciousness System - File Transfer Script
# Run this on your CURRENT VPS to transfer files to Google Cloud VM

set -e

# Configuration - CORRECTED
GCP_VM_IP="199.223.235.116"
GCP_USERNAME="linode-transfer"  # Fixed username
BACKUP_DIR="/tmp/consciousness-backup-$(date +%Y%m%d_%H%M%S)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] $1${NC}"; exit 1; }

log "🚀 Starting file transfer to Google Cloud VM"
log "Source: $(hostname)"
log "Destination: $GCP_USERNAME@$GCP_VM_IP"

# Test connection to GCP VM
log "🔍 Testing connection to GCP VM..."
if ! ssh -o ConnectTimeout=10 "$GCP_USERNAME@$GCP_VM_IP" "echo 'Connection successful'"; then
    error "Cannot connect to GCP VM. Please check SSH access."
fi

# Create fresh backup
log "📦 Creating fresh backup..."
mkdir -p "$BACKUP_DIR"

# Backup project files
log "📁 Backing up project files..."
cp -r /opt/featherweight "$BACKUP_DIR/project"

# Try database backup with different approaches
log "🗄️ Attempting database backup..."
DB_BACKUP_SUCCESS=false

# Method 1: Try with environment password
if [ -f "/opt/featherweight/FlappyJournal/.env" ]; then
    DB_PASSWORD=$(grep "POSTGRES_PASSWORD" /opt/featherweight/FlappyJournal/.env | cut -d'=' -f2 | tr -d '"' || echo "hist0ric")
    if PGPASSWORD="$DB_PASSWORD" pg_dump -h localhost -U feather_user featherweight_consciousness > "$BACKUP_DIR/database.sql" 2>/dev/null; then
        log "✅ Database backup successful with environment password"
        DB_BACKUP_SUCCESS=true
    fi
fi

# Method 2: Try with default password
if [ "$DB_BACKUP_SUCCESS" = false ]; then
    if PGPASSWORD="hist0ric" pg_dump -h localhost -U feather_user featherweight_consciousness > "$BACKUP_DIR/database.sql" 2>/dev/null; then
        log "✅ Database backup successful with default password"
        DB_BACKUP_SUCCESS=true
    fi
fi

# Method 3: Try to get from running service
if [ "$DB_BACKUP_SUCCESS" = false ]; then
    warn "Standard database backup failed, trying alternative method..."
    if systemctl is-active consciousness-conversations-enhanced.service >/dev/null 2>&1; then
        # Try to backup from Docker if it's running
        if docker ps | grep postgres >/dev/null 2>&1; then
            docker exec $(docker ps | grep postgres | awk '{print $1}') pg_dump -U feather_user featherweight_consciousness > "$BACKUP_DIR/database.sql" 2>/dev/null && DB_BACKUP_SUCCESS=true
        fi
    fi
fi

if [ "$DB_BACKUP_SUCCESS" = false ]; then
    warn "⚠️ Database backup failed - will proceed without database backup"
    echo "# Database backup failed" > "$BACKUP_DIR/database.sql"
fi

# Backup environment file
log "⚙️ Backing up environment configuration..."
if [ -f "/opt/featherweight/FlappyJournal/.env" ]; then
    cp /opt/featherweight/FlappyJournal/.env "$BACKUP_DIR/env_backup"
    log "✅ Environment file backed up"
else
    warn "Environment file not found"
fi

# Create transfer package with better error handling
log "📦 Creating transfer package..."
cd "$BACKUP_DIR"
TRANSFER_FILE="/tmp/consciousness-transfer-$(date +%Y%m%d_%H%M%S).tar.gz"

if tar -czf "$TRANSFER_FILE" .; then
    log "✅ Transfer package created: $TRANSFER_FILE"
    log "📊 Package size: $(du -h "$TRANSFER_FILE" | cut -f1)"
else
    error "Failed to create transfer package"
fi

# Verify package exists
if [ ! -f "$TRANSFER_FILE" ]; then
    error "Transfer package not found: $TRANSFER_FILE"
fi

# Transfer to GCP VM
log "🚀 Transferring files to GCP VM..."
log "This may take several minutes depending on your connection speed..."

# Create directories on GCP VM
ssh "$GCP_USERNAME@$GCP_VM_IP" "mkdir -p /opt/featherweight /tmp/consciousness-restore"

# Transfer the package
if scp "$TRANSFER_FILE" "$GCP_USERNAME@$GCP_VM_IP:/tmp/consciousness-restore/"; then
    log "✅ File transfer completed successfully"
else
    error "File transfer failed"
fi

# Extract on GCP VM
log "📂 Extracting files on GCP VM..."
ssh "$GCP_USERNAME@$GCP_VM_IP" << 'REMOTE_EOF'
cd /tmp/consciousness-restore
if [ -f consciousness-transfer-*.tar.gz ]; then
    tar -xzf consciousness-transfer-*.tar.gz
    if [ -d project ]; then
        cp -r project/* /opt/featherweight/
        echo "✅ Files extracted successfully"
    else
        echo "❌ Project directory not found in backup"
        exit 1
    fi
else
    echo "❌ Transfer file not found"
    exit 1
fi
REMOTE_EOF

# Verify transfer
log "🔍 Verifying transfer..."
REMOTE_FILES=$(ssh "$GCP_USERNAME@$GCP_VM_IP" "find /opt/featherweight -type f 2>/dev/null | wc -l")
LOCAL_FILES=$(find /opt/featherweight -type f 2>/dev/null | wc -l)

log "📊 Transfer verification:"
log "   Local files: $LOCAL_FILES"
log "   Remote files: $REMOTE_FILES"

if [ "$REMOTE_FILES" -gt 0 ]; then
    log "✅ Transfer verification successful"
else
    warn "⚠️ Transfer verification shows no files - but continuing..."
fi

# Cleanup
log "🧹 Cleaning up temporary files..."
rm -f "$TRANSFER_FILE"
rm -rf "$BACKUP_DIR"

log "🎉 File transfer completed!"
log "Database backup status: $( [ "$DB_BACKUP_SUCCESS" = true ] && echo "✅ Success" || echo "⚠️ Failed" )"
log ""
log "Next steps:"
log "1. Connect to your GCP VM: ssh $GCP_USERNAME@$GCP_VM_IP"
log "2. Set up Docker environment"
log "3. Start the consciousness system"

echo ""
echo "Connection command for next steps:"
echo "ssh $GCP_USERNAME@$GCP_VM_IP"
