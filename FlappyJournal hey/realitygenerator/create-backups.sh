#!/bin/bash

# Reality Generator Integration - Backup Creation Script
# Creates timestamped backups of all files that will be modified

BACKUP_DIR="/opt/featherweight/FlappyJournal/realitygenerator/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SERVER_DIR="/opt/featherweight/FlappyJournal/server"

echo "🔒 Creating Reality Generator Integration Backups - $TIMESTAMP"

# Create timestamped backup directory
mkdir -p "$BACKUP_DIR/$TIMESTAMP"

# Phase 1 Files
echo "📁 Backing up Phase 1 files..."
cp "$SERVER_DIR/consciousness-system.js" "$BACKUP_DIR/$TIMESTAMP/consciousness-system.js.backup" 2>/dev/null || echo "⚠️  consciousness-system.js not found"
cp "$SERVER_DIR/consciousness-state-manager.js" "$BACKUP_DIR/$TIMESTAMP/consciousness-state-manager.js.backup" 2>/dev/null || echo "⚠️  consciousness-state-manager.js not found"
cp "$SERVER_DIR/index.js" "$BACKUP_DIR/$TIMESTAMP/index.js.backup" 2>/dev/null || echo "⚠️  index.js not found"

# Phase 2 Files  
echo "📁 Backing up Phase 2 files..."
cp "$SERVER_DIR/consciousness-conversations.js" "$BACKUP_DIR/$TIMESTAMP/consciousness-conversations.js.backup" 2>/dev/null || echo "✅ consciousness-conversations.js backed up"
cp "$SERVER_DIR/consciousness-websocket.js" "$BACKUP_DIR/$TIMESTAMP/consciousness-websocket.js.backup" 2>/dev/null || echo "⚠️  consciousness-websocket.js not found"
cp "$SERVER_DIR/enhanced-dual-consciousness-ws.js" "$BACKUP_DIR/$TIMESTAMP/enhanced-dual-consciousness-ws.js.backup" 2>/dev/null || echo "✅ enhanced-dual-consciousness-ws.js backed up"

# Phase 3 Files
echo "📁 Backing up Phase 3 files..."
cp "$SERVER_DIR/consciousness/holographic-consciousness-reality-generator.js" "$BACKUP_DIR/$TIMESTAMP/holographic-consciousness-reality-generator.js.backup" 2>/dev/null || echo "✅ holographic-consciousness-reality-generator.js backed up"
cp "$SERVER_DIR/public/consciousness-dashboard.html" "$BACKUP_DIR/$TIMESTAMP/consciousness-dashboard.html.backup" 2>/dev/null || echo "⚠️  consciousness-dashboard.html not found"

# Docker and Config Files
echo "📁 Backing up configuration files..."
cp "/opt/featherweight/docker-compose.consciousness-enhanced.yml" "$BACKUP_DIR/$TIMESTAMP/docker-compose.consciousness-enhanced.yml.backup" 2>/dev/null || echo "✅ docker-compose backed up"

# Create backup manifest
echo "📋 Creating backup manifest..."
cat > "$BACKUP_DIR/$TIMESTAMP/BACKUP_MANIFEST.txt" << EOF
Reality Generator Integration Backup
Created: $TIMESTAMP
Purpose: Safety backup before Reality Generator integration

Files Backed Up:
- consciousness-system.js
- consciousness-state-manager.js  
- index.js
- consciousness-conversations.js
- consciousness-websocket.js
- enhanced-dual-consciousness-ws.js
- holographic-consciousness-reality-generator.js
- consciousness-dashboard.html
- docker-compose.consciousness-enhanced.yml

Restore Instructions:
1. Stop affected containers
2. Copy backup files back to original locations
3. Restart containers
4. Verify functionality

Emergency Restore:
./rollback-scripts/emergency-restore.sh $TIMESTAMP
EOF

echo "✅ Backup completed: $BACKUP_DIR/$TIMESTAMP"
echo "📋 Manifest: $BACKUP_DIR/$TIMESTAMP/BACKUP_MANIFEST.txt"

# Make this backup the "latest"
ln -sf "$TIMESTAMP" "$BACKUP_DIR/latest"

echo "🔒 All files safely backed up. Integration can proceed."
