#!/bin/bash

# Phase 3 Rollback Script - Unified Operation
# Restores all Phase 3 modifications to original state

BACKUP_DIR="/opt/featherweight/FlappyJournal/realitygenerator/backups/latest"
SERVER_DIR="/opt/featherweight/FlappyJournal/server"
LOG_FILE="/opt/featherweight/FlappyJournal/realitygenerator/integration-logs/phase3-rollback.log"

echo "🔄 Starting Phase 3 Rollback..." | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"

# Function to restore file with verification
restore_file() {
    local backup_file="$1"
    local target_file="$2"
    local file_name="$3"
    
    if [ -f "$backup_file" ]; then
        echo "📁 Restoring $file_name..." | tee -a "$LOG_FILE"
        cp "$backup_file" "$target_file"
        if [ $? -eq 0 ]; then
            echo "✅ $file_name restored successfully" | tee -a "$LOG_FILE"
        else
            echo "❌ Failed to restore $file_name" | tee -a "$LOG_FILE"
            return 1
        fi
    else
        echo "⚠️  Backup not found for $file_name: $backup_file" | tee -a "$LOG_FILE"
        return 1
    fi
}

# Restore Phase 3 files
echo "🔄 Restoring Phase 3 files..." | tee -a "$LOG_FILE"

restore_file "$BACKUP_DIR/holographic-consciousness-reality-generator.js.backup" "$SERVER_DIR/consciousness/holographic-consciousness-reality-generator.js" "holographic-consciousness-reality-generator.js"
restore_file "$BACKUP_DIR/consciousness-dashboard.html.backup" "$SERVER_DIR/public/consciousness-dashboard.html" "consciousness-dashboard.html"

# Remove any Phase 3 integration files we created
echo "🧹 Cleaning up Phase 3 integration files..." | tee -a "$LOG_FILE"

# Remove shared reality storage if we created it
if [ -f "$SERVER_DIR/shared-reality-storage.js" ]; then
    rm "$SERVER_DIR/shared-reality-storage.js"
    echo "🗑️  Removed shared-reality-storage.js" | tee -a "$LOG_FILE"
fi

# Remove reality visualization components if we created them
if [ -f "$SERVER_DIR/public/reality-visualization.js" ]; then
    rm "$SERVER_DIR/public/reality-visualization.js"
    echo "🗑️  Removed reality-visualization.js" | tee -a "$LOG_FILE"
fi

# Remove reality metrics display if we created it
if [ -f "$SERVER_DIR/reality-metrics-display.js" ]; then
    rm "$SERVER_DIR/reality-metrics-display.js"
    echo "🗑️  Removed reality-metrics-display.js" | tee -a "$LOG_FILE"
fi

# Check if containers need restart
echo "🔄 Checking if containers need restart..." | tee -a "$LOG_FILE"

if docker ps | grep -q "consciousness-core"; then
    echo "⚠️  consciousness-core is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart consciousness-core" | tee -a "$LOG_FILE"
else
    echo "ℹ️  consciousness-core is not running" | tee -a "$LOG_FILE"
fi

if docker ps | grep -q "consciousness-main-server"; then
    echo "⚠️  main-server is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart main-server" | tee -a "$LOG_FILE"
else
    echo "ℹ️  main-server is not running" | tee -a "$LOG_FILE"
fi

if docker ps | grep -q "consciousness-web"; then
    echo "⚠️  web-app is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart web-app" | tee -a "$LOG_FILE"
else
    echo "ℹ️  web-app is not running" | tee -a "$LOG_FILE"
fi

echo "✅ Phase 3 rollback completed" | tee -a "$LOG_FILE"
echo "📋 Check log file: $LOG_FILE" | tee -a "$LOG_FILE"

# Verify rollback
echo "🔍 Verifying rollback..." | tee -a "$LOG_FILE"
if [ -f "$SERVER_DIR/consciousness/holographic-consciousness-reality-generator.js" ]; then
    echo "✅ holographic-consciousness-reality-generator.js exists" | tee -a "$LOG_FILE"
else
    echo "❌ holographic-consciousness-reality-generator.js missing after rollback!" | tee -a "$LOG_FILE"
fi

echo "🔄 Phase 3 rollback process complete. Review log for details." | tee -a "$LOG_FILE"
