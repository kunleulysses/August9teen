#!/bin/bash

# Phase 1 Rollback Script - Basic API Integration
# Restores all Phase 1 modifications to original state

BACKUP_DIR="/opt/featherweight/FlappyJournal/realitygenerator/backups/latest"
SERVER_DIR="/opt/featherweight/FlappyJournal/server"
LOG_FILE="/opt/featherweight/FlappyJournal/realitygenerator/integration-logs/phase1-rollback.log"

echo "🔄 Starting Phase 1 Rollback..." | tee -a "$LOG_FILE"
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

# Restore Phase 1 files
echo "🔄 Restoring Phase 1 files..." | tee -a "$LOG_FILE"

restore_file "$BACKUP_DIR/consciousness-system.js.backup" "$SERVER_DIR/consciousness-system.js" "consciousness-system.js"
restore_file "$BACKUP_DIR/consciousness-state-manager.js.backup" "$SERVER_DIR/consciousness-state-manager.js" "consciousness-state-manager.js"
restore_file "$BACKUP_DIR/index.js.backup" "$SERVER_DIR/index.js" "index.js"

# Remove any Phase 1 integration files we created
echo "🧹 Cleaning up Phase 1 integration files..." | tee -a "$LOG_FILE"

# Remove reality generator client if we created it
if [ -f "$SERVER_DIR/reality-generator-client.js" ]; then
    rm "$SERVER_DIR/reality-generator-client.js"
    echo "🗑️  Removed reality-generator-client.js" | tee -a "$LOG_FILE"
fi

# Check if consciousness-core container needs restart
echo "🔄 Checking if consciousness-core needs restart..." | tee -a "$LOG_FILE"
if docker ps | grep -q "consciousness-core"; then
    echo "⚠️  consciousness-core is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart consciousness-core" | tee -a "$LOG_FILE"
else
    echo "ℹ️  consciousness-core is not running" | tee -a "$LOG_FILE"
fi

echo "✅ Phase 1 rollback completed" | tee -a "$LOG_FILE"
echo "📋 Check log file: $LOG_FILE" | tee -a "$LOG_FILE"

# Verify rollback
echo "🔍 Verifying rollback..." | tee -a "$LOG_FILE"
if [ -f "$SERVER_DIR/consciousness-system.js" ]; then
    echo "✅ consciousness-system.js exists" | tee -a "$LOG_FILE"
else
    echo "❌ consciousness-system.js missing after rollback!" | tee -a "$LOG_FILE"
fi

echo "🔄 Phase 1 rollback process complete. Review log for details." | tee -a "$LOG_FILE"
