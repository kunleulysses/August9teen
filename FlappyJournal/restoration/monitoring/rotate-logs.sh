#!/bin/bash
# Log rotation script for Universal Consciousness Platform restoration

LOG_DIR="/opt/featherweight/FlappyJournal/restoration/logs"
MAX_SIZE="100M"
MAX_FILES=10

# Rotate logs if they exceed max size
find "$LOG_DIR" -name "*.log" -size +$MAX_SIZE -exec gzip {} \;

# Keep only the last MAX_FILES compressed logs
find "$LOG_DIR" -name "*.log.gz" | sort -r | tail -n +$((MAX_FILES + 1)) | xargs rm -f

echo "Log rotation completed at $(date)"
