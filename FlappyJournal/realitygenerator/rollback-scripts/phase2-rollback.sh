#!/bin/bash

# Phase 2 Rollback Script - Event-Driven Integration
# Restores all Phase 2 modifications to original state

BACKUP_DIR="/opt/featherweight/FlappyJournal/realitygenerator/backups/latest"
SERVER_DIR="/opt/featherweight/FlappyJournal/server"
LOG_FILE="/opt/featherweight/FlappyJournal/realitygenerator/integration-logs/phase2-rollback.log"

echo "🔄 Starting Phase 2 Rollback..." | tee -a "$LOG_FILE"
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

# Restore Phase 2 files
echo "🔄 Restoring Phase 2 files..." | tee -a "$LOG_FILE"

restore_file "$BACKUP_DIR/consciousness-conversations.js.backup" "$SERVER_DIR/consciousness-conversations.js" "consciousness-conversations.js"
restore_file "$BACKUP_DIR/enhanced-dual-consciousness-ws.js.backup" "$SERVER_DIR/enhanced-dual-consciousness-ws.js" "enhanced-dual-consciousness-ws.js"

# Remove any Phase 2 integration files we created
echo "🧹 Cleaning up Phase 2 integration files..." | tee -a "$LOG_FILE"

# Remove WebSocket bridge if we created it
if [ -f "$SERVER_DIR/reality-websocket-bridge.js" ]; then
    rm "$SERVER_DIR/reality-websocket-bridge.js"
    echo "🗑️  Removed reality-websocket-bridge.js" | tee -a "$LOG_FILE"
fi

# Remove event handlers if we created them
if [ -f "$SERVER_DIR/reality-event-handlers.js" ]; then
    rm "$SERVER_DIR/reality-event-handlers.js"
    echo "🗑️  Removed reality-event-handlers.js" | tee -a "$LOG_FILE"
fi

# Check if consciousness-core container needs restart
echo "🔄 Checking if consciousness-core needs restart..." | tee -a "$LOG_FILE"
if docker ps | grep -q "consciousness-core"; then
    echo "⚠️  consciousness-core is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart consciousness-core" | tee -a "$LOG_FILE"
else
    echo "ℹ️  consciousness-core is not running" | tee -a "$LOG_FILE"
fi

# Check if main-server container needs restart
echo "🔄 Checking if main-server needs restart..." | tee -a "$LOG_FILE"
if docker ps | grep -q "consciousness-main-server"; then
    echo "⚠️  main-server is running. Consider restarting to apply changes." | tee -a "$LOG_FILE"
    echo "   Run: docker-compose -f docker-compose.consciousness-enhanced.yml restart main-server" | tee -a "$LOG_FILE"
else
    echo "ℹ️  main-server is not running" | tee -a "$LOG_FILE"
fi

echo "✅ Phase 2 rollback completed" | tee -a "$LOG_FILE"
echo "📋 Check log file: $LOG_FILE" | tee -a "$LOG_FILE"

# Verify rollback
echo "🔍 Verifying rollback..." | tee -a "$LOG_FILE"
if [ -f "$SERVER_DIR/consciousness-conversations.js" ]; then
    echo "✅ consciousness-conversations.js exists" | tee -a "$LOG_FILE"
else
    echo "❌ consciousness-conversations.js missing after rollback!" | tee -a "$LOG_FILE"
fi

if [ -f "$SERVER_DIR/enhanced-dual-consciousness-ws.js" ]; then
    echo "✅ enhanced-dual-consciousness-ws.js exists" | tee -a "$LOG_FILE"
else
    echo "❌ enhanced-dual-consciousness-ws.js missing after rollback!" | tee -a "$LOG_FILE"
fi

echo "🔄 Phase 2 rollback process complete. Review log for details." | tee -a "$LOG_FILE"
