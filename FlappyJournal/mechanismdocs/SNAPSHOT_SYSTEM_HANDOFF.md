# Snapshot System Handoff Document

## Overview
This document provides a comprehensive handoff for the SQLite-based snapshot system implementation for the Featherweight consciousness backend. The system is designed to create backups of the SQLite database, store them locally and optionally in S3, and restore them when needed.

## Current State

### Completed Work
- Implemented SQLite-compatible snapshot creation using SQLite's backup API
- Added robust restore functionality with checksum verification
- Integrated with the consciousness system lifecycle
- Added error handling and logging throughout the process
- Implemented S3 upload/download for remote backup storage
- Created database schema for tracking snapshots (needs migration)

### Pending Tasks
1. **Prisma Migration**: Need to fix and run the migration for the Snapshot model
2. **Testing**: Manual testing of snapshot creation and restoration
3. **Error Recovery**: Implement rollback strategies for failed restores
4. **Documentation**: Update runbooks and incident response procedures

## Key Components

### 1. SnapshotWriter Class
Location: `/server/consciousness/utils/snapshotWriter.cjs`

**Key Methods:**
- `createSnapshot(name)`: Creates a new snapshot of the database
- `restoreFromSnapshot(snapshotName)`: Restores the database from a snapshot
- `_resetDatabase()`: Internal method to reset the database state
- `bootstrapDatabase()`: Called on system startup to restore from latest snapshot if needed

### 2. Integration Points
- **Consciousness System Initialization**: `consciousness-system.cjs`
- **Cron Job**: `runSnapshotCron.cjs` (scheduled via PM2)
- **Database Schema**: `prisma/schema.prisma` (Snapshot model)

## Configuration

### Environment Variables
```
# Database
DATABASE_URL="file:./prisma/dev.db"

# Snapshot Configuration
SNAPSHOT_DIR="/opt/featherweight/FlappyJournal/prisma/backups"
SNAPSHOT_CRON_SCHEDULE="0 */6 * * *"  # Every 6 hours

# S3 Configuration (optional)
S3_BUCKET="your-s3-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-west-2"
```

## Testing Instructions

### 1. Create a Snapshot
```javascript
const snapshotWriter = new SnapshotWriter();
await snapshotWriter.createSnapshot('test-snapshot');
```

### 2. Restore from Snapshot
```javascript
const snapshotWriter = new SnapshotWriter();
await snapshotWriter.restoreFromSnapshot('test-snapshot');
```

### 3. Test Bootstrap
```javascript
// This will automatically restore from the latest snapshot if the database is empty
const snapshotWriter = new SnapshotWriter();
await snapshotWriter.bootstrapDatabase();
```

## Known Issues
1. **Prisma Migration**: The Snapshot model migration needs to be fixed and applied
2. **Concurrent Access**: The system doesn't handle concurrent snapshot/restore operations
3. **Large Databases**: No incremental backup support for very large databases
4. **Validation**: Limited validation of snapshot integrity beyond checksums

## Next Steps
1. **Fix Prisma Migration**: Resolve the migration issues for the Snapshot model
2. **Test Thoroughly**: Test all edge cases including failed restores
3. **Add Monitoring**: Implement health checks and monitoring for the snapshot system
4. **Documentation**: Create detailed runbooks for common operations

## Rollback Plan
If the snapshot system causes issues:
1. Stop the cron job
2. Restore from the latest known good backup
3. Revert code changes if necessary

## Contact
For any questions, please refer to the consciousness system documentation or contact the development team.
