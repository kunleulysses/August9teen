# Ticket C5 – Chaos Harness: Disk-Full/LevelDB Lock Tests

## Goal
Develop a chaos testing harness that simulates disk-full and LevelDB lock failures, verifying that Sigil-DNA services handle these edge cases gracefully—without data loss, undefined behavior, or crashes.

## Context

Production systems eventually encounter infrastructure failures: disks may fill, filesystems may become read-only, or LevelDB may become locked due to unclean shutdowns or concurrent access. Without explicit chaos testing, these scenarios are often missed until a real-world outage occurs—by which point data loss or cascading failure is likely.

Sigil-DNA depends heavily on LevelDB for sigil persistence (see [`FlappyJournal/server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs)). It must:
- Detect and report disk full or read-only errors.
- Handle LevelDB lock errors (e.g., another process holds a lock file).
- Fail fast and emit actionable logs and alerts, not hang or corrupt state.
- Recover cleanly when underlying conditions are resolved.

A chaos harness enables safe, repeatable simulation of these failures in dev, test, and staging.

## Prerequisites

- Node.js v18.x or higher
- Ability to run scripts with elevated permissions (for mount/unmount)
- Access to LevelDB data path
- Docker or VM with ability to mount tmpfs/loopback filesystems
- ENV: `SIGIL_DB_PATH`
- Test environment (never run on prod!)

## Step-by-Step Implementation

### 1. Simulate Disk-Full

#### Local (Linux/macOS):

1. Create a small loopback file system:
   ```bash
   mkdir /tmp/sigil-chaos
   dd if=/dev/zero of=/tmp/sigil-disk.img bs=1M count=10
   sudo losetup /dev/loop10 /tmp/sigil-disk.img
   sudo mkfs.ext4 /dev/loop10
   sudo mount /dev/loop10 /tmp/sigil-chaos
   ```

2. Set `SIGIL_DB_PATH=/tmp/sigil-chaos` and start the service.

3. Fill the disk:
   ```bash
   dd if=/dev/zero of=/tmp/sigil-chaos/fill bs=1M
   ```

4. Attempt to encode a sigil; service should emit an error and not crash.

#### Docker (docker-compose):

- Mount a tmpfs with size limit:
   ```yaml
   services:
     sigil:
       volumes:
         - type: tmpfs
           target: /var/lib/sigil-leveldb
           tmpfs:
             size: 10485760 # 10MB
   ```

### 2. Simulate LevelDB Lock

1. Start the service, then in another shell:
   ```bash
   touch /var/lib/sigil-leveldb/LOCK
   ```
   Or, run a parallel process holding the DB open:
   ```
   node -e "require('level')('/var/lib/sigil-leveldb')"
   ```
2. Start a second instance; should immediately fail with "LOCKED" error.

### 3. Add Detection and Logging in Code

1. In `LevelDBSigilAdapter.cjs`, catch disk errors:
   ```js
   try {
     await this.db.put(...);
   } catch (e) {
     if (e.code === 'ENOSPC') {
       logger.error('Disk full at SIGIL_DB_PATH');
       // Optionally, trigger alert or shutdown
     }
     throw e;
   }
   ```

2. Catch LevelDB lock errors:
   ```js
   if (e.message.includes('LOCK')) {
     logger.error('LevelDB locked, possible concurrent access');
     // Optionally, trigger alert or exit
   }
   ```

### 4. Integrate with Alerting

- On error, send Slack/PagerDuty alert (see B9).

### 5. Automate Chaos Harness

- In `scripts/chaos/sigilDiskFull.cjs`, include steps to fill disk and run encode, then cleanup.

---

## Verification

### Automated

- Run chaos script, verify service logs error, does not crash.
- Try writing after unmounting disk; expect error, not hang.

### Manual

- After test, clean up:
   ```bash
   sudo umount /tmp/sigil-chaos
   sudo losetup -d /dev/loop10
   rm -rf /tmp/sigil-chaos /tmp/sigil-disk.img
   ```

- Check service recovers after disk space is restored.

### Metrics

- Add Prometheus gauge: `sigil_disk_full_error_total`

---

## Rollback

- Remove chaos harness scripts.
- Remove error handling if needed (not advised).
- Restore LevelDB code to prior state.

---

## Acceptance Criteria

- Service emits actionable error/log on disk full or locked DB.
- No data loss or silent corruption.
- System recovers after error condition is resolved.
- Chaos harness repeatable in dev/test.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [LevelDB error codes](https://github.com/Level/leveldown#errors)
- [Chaos engineering basics](https://principlesofchaos.org/)
- [Testing disk full](https://unix.stackexchange.com/questions/22506/how-to-simulate-no-space-left-on-device)
- [PagerDuty API](https://developer.pagerduty.com/api-reference/)
- [Docker tmpfs mounts](https://docs.docker.com/storage/tmpfs/)