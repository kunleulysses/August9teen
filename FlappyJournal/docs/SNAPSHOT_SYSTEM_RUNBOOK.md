# Snapshot System Operations Runbook

## Overview
This runbook provides step-by-step procedures for operating the Featherweight consciousness database snapshot system. The system provides automated backups, manual snapshot creation, and disaster recovery capabilities.

## System Architecture

### Components
- **SnapshotWriter**: Core snapshot creation and restoration logic
- **SnapshotRecovery**: Error recovery and rollback utilities  
- **Cron Job**: Automated snapshot scheduling
- **HTTP API**: Manual snapshot management endpoints
- **S3 Integration**: Remote backup storage (optional)

### Data Flow
1. **Creation**: Database → SQLite backup → Checksum → S3 upload → Metadata storage
2. **Restoration**: S3 download → Checksum verification → Database replacement → Migration
3. **Recovery**: Pre-operation backup → Rollback on failure → Integrity validation

## Common Operations

### 1. Create Manual Snapshot

**When to use**: Before major system changes, deployments, or maintenance

```bash
# Via HTTP API
curl -X POST http://localhost:5000/snapshots \
  -H "Content-Type: application/json" \
  -d '{"name": "pre_deployment_2024_01_15"}'

# Via Node.js
const snapshotWriter = require('./server/consciousness/utils/snapshotWriter.cjs');
await snapshotWriter.createSnapshot('manual_snapshot_name');
```

**Expected outcome**: 
- Snapshot created in S3 and local metadata stored
- Response includes snapshot ID, checksum, and size
- Status should be "COMPLETED"

### 2. List Available Snapshots

```bash
# Via HTTP API
curl http://localhost:5000/snapshots

# Via database query
SELECT name, status, size, createdAt, lastRestoredAt 
FROM Snapshot 
ORDER BY createdAt DESC 
LIMIT 10;
```

### 3. Restore from Snapshot

**⚠️ WARNING**: This operation will replace the entire database. Always create a backup first.

```bash
# Via HTTP API
curl -X POST http://localhost:5000/snapshots/snapshot_name/restore

# Via Node.js
const snapshotWriter = require('./server/consciousness/utils/snapshotWriter.cjs');
await snapshotWriter.restoreFromSnapshot('snapshot_name');
```

**Expected outcome**:
- Database replaced with snapshot data
- Prisma migrations applied
- Snapshot status updated to "SUCCESS"

### 4. Check System Health

```bash
# Check consciousness system health
curl http://localhost:5000/health

# Check snapshot system status
curl http://localhost:5000/snapshots

# Validate database integrity
const recovery = require('./server/consciousness/utils/snapshotRecovery.cjs');
await recovery.validateDatabaseIntegrity();
```

## Troubleshooting Guide

### Issue: Snapshot Creation Fails

**Symptoms**:
- HTTP 500 error on snapshot creation
- "Failed to create snapshot" in logs
- Snapshot status shows "FAILED"

**Diagnosis**:
```bash
# Check disk space
df -h

# Check database connectivity
npx prisma db pull

# Check S3 credentials (if using S3)
aws s3 ls s3://your-bucket-name/snapshots/
```

**Resolution**:
1. Ensure sufficient disk space (at least 2x database size)
2. Verify database is accessible and not locked
3. Check S3 credentials and permissions
4. Review error logs for specific failure reason

### Issue: Snapshot Restoration Fails

**Symptoms**:
- Restore operation hangs or fails
- Database becomes corrupted
- "Restore failed" error messages

**Diagnosis**:
```bash
# Check if snapshot exists
curl http://localhost:5000/snapshots | grep snapshot_name

# Verify snapshot integrity
# (Checksum verification happens automatically)

# Check database file permissions
ls -la prisma/dev.db
```

**Resolution**:
1. **Immediate**: Stop the restore operation
2. **Recovery**: Use automatic rollback system
   ```javascript
   const recovery = require('./server/consciousness/utils/snapshotRecovery.cjs');
   await recovery.recoverFromFailedRestore('snapshot_name', error);
   ```
3. **Manual rollback** (if automatic fails):
   ```bash
   # Find latest pre-restore backup
   ls -la prisma/recovery/pre_restore_*
   
   # Manually restore from backup
   cp prisma/recovery/pre_restore_latest.db prisma/dev.db
   ```

### Issue: Database Corruption

**Symptoms**:
- SQLite database errors
- Prisma connection failures
- Data inconsistencies

**Emergency Recovery**:
```javascript
const recovery = require('./server/consciousness/utils/snapshotRecovery.cjs');

// Try integrity validation first
const integrity = await recovery.validateDatabaseIntegrity();

if (!integrity.isHealthy) {
  // Attempt emergency reset (LAST RESORT)
  await recovery.emergencyDatabaseReset();
}
```

### Issue: S3 Upload/Download Failures

**Symptoms**:
- Snapshots created locally but not in S3
- Restore fails with S3 errors
- "Access Denied" or "NoSuchBucket" errors

**Resolution**:
1. Verify AWS credentials:
   ```bash
   aws sts get-caller-identity
   ```
2. Check S3 bucket permissions
3. Verify bucket exists and region is correct
4. Test S3 connectivity:
   ```bash
   aws s3 ls s3://your-bucket-name/
   ```

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Snapshot Success Rate**: Should be >95%
2. **Snapshot Size Growth**: Monitor for unexpected increases
3. **Restore Time**: Baseline and alert on significant increases
4. **Storage Usage**: Both local and S3
5. **Database Integrity**: Regular validation checks

### Recommended Alerts

```yaml
# Prometheus alert rules
groups:
  - name: snapshot_system
    rules:
      - alert: SnapshotCreationFailed
        expr: snapshot_creation_failures_total > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Snapshot creation has failed"
          
      - alert: NoRecentSnapshots
        expr: time() - snapshot_last_created_timestamp > 86400
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "No snapshots created in 24 hours"
          
      - alert: DatabaseIntegrityIssue
        expr: database_integrity_healthy == 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Database integrity validation failed"
```

## Maintenance Procedures

### Weekly Maintenance

1. **Review snapshot logs**:
   ```bash
   grep -i snapshot /var/log/consciousness/*.log | tail -100
   ```

2. **Clean up old snapshots**:
   ```javascript
   // Keep last 10 snapshots, delete older ones
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   
   const oldSnapshots = await prisma.snapshot.findMany({
     where: { status: 'COMPLETED' },
     orderBy: { createdAt: 'desc' },
     skip: 10
   });
   
   // Delete old snapshots (implement cleanup logic)
   ```

3. **Validate database integrity**:
   ```javascript
   const recovery = require('./server/consciousness/utils/snapshotRecovery.cjs');
   const integrity = await recovery.validateDatabaseIntegrity();
   console.log('Database integrity:', integrity);
   ```

### Monthly Maintenance

1. **Test disaster recovery**:
   - Create test snapshot
   - Restore to test environment
   - Verify data integrity
   - Document restore time

2. **Review storage usage**:
   - Check S3 storage costs
   - Analyze snapshot size trends
   - Optimize retention policies

3. **Update documentation**:
   - Review and update runbook
   - Update emergency contacts
   - Verify backup procedures

## Emergency Contacts

### Escalation Path
1. **Level 1**: Development Team
2. **Level 2**: SRE Team  
3. **Level 3**: Database Administrator
4. **Level 4**: System Architect

### Emergency Procedures

#### Complete System Failure
1. **Assess scope**: Database corruption, data loss, system unavailable
2. **Immediate actions**:
   - Stop all write operations
   - Preserve current state (if possible)
   - Notify stakeholders
3. **Recovery**:
   - Identify latest good snapshot
   - Restore from snapshot
   - Validate data integrity
   - Resume operations
4. **Post-incident**:
   - Root cause analysis
   - Update procedures
   - Improve monitoring

#### Data Loss Incident
1. **Quantify loss**: Time range, affected data types
2. **Recovery options**:
   - Point-in-time restore from snapshot
   - Partial data recovery from logs
   - Manual data reconstruction
3. **Communication**:
   - Notify users of data loss
   - Provide timeline for recovery
   - Document lessons learned

## Configuration Reference

### Environment Variables
```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Snapshot Configuration  
SNAPSHOT_DIR="/opt/featherweight/FlappyJournal/prisma/backups"
SNAPSHOT_CRON_SCHEDULE="0 */6 * * *"  # Every 6 hours
RECOVERY_DIR="/opt/featherweight/FlappyJournal/prisma/recovery"

# S3 Configuration (optional)
S3_BUCKET="featherweight-snapshots"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"  
AWS_REGION="us-west-2"
```

### File Locations
- **Database**: `prisma/dev.db`
- **Snapshots**: `prisma/backups/`
- **Recovery**: `prisma/recovery/`
- **Logs**: `/var/log/consciousness/`
- **Config**: `.env`

## Performance Considerations

### Snapshot Creation
- **Time**: ~30 seconds for 100MB database
- **Storage**: 2x database size during creation
- **I/O Impact**: Minimal (uses SQLite backup API)

### Snapshot Restoration  
- **Time**: ~60 seconds for 100MB database
- **Downtime**: Full system unavailable during restore
- **Rollback**: ~30 seconds if restore fails

### Optimization Tips
1. Schedule snapshots during low-traffic periods
2. Monitor database growth and adjust retention
3. Use S3 lifecycle policies for cost optimization
4. Consider incremental backups for large databases

## Security Considerations

### Access Control
- Snapshot creation: Requires admin privileges
- Snapshot restoration: Requires admin privileges  
- S3 access: Use IAM roles with minimal permissions

### Data Protection
- Snapshots contain full database (including sensitive data)
- Encrypt snapshots at rest (S3 encryption)
- Secure snapshot storage locations
- Audit snapshot access and operations

### Compliance
- Retain snapshots per data retention policies
- Document snapshot contents for compliance
- Ensure secure deletion of expired snapshots
- Regular security reviews of snapshot system