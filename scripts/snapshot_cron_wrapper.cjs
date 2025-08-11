const url = process.env.DATABASE_URL || '';
if (!/^sqlite:|^file:/.test(url)) {
  console.log('[fw-snapshots] disabled: non-sqlite DATABASE_URL:', (url.split(':')[0]||'unknown'));
  setInterval(()=>{}, 1<<30);
} else {
  const SnapshotCron = require('/opt/featherweight/FlappyJournal/server/consciousness/scripts/runSnapshotCron.cjs');
  const cron = new SnapshotCron();
  cron.start();
  console.log('[fw-snapshots] started', process.env.SNAPSHOT_CRON_SCHEDULE || '*/5 * * * *');
}
