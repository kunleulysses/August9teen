const { parentPort } = require('worker_threads');
const pool = require('./db.cjs');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({});
const bucket = process.env.SCENE_SNAPSHOT_BUCKET;

parentPort.on('message', async ({ sceneId }) => {
  try {
    if (!sceneId) return;
    // Delete scene nodes from Postgres
    await pool.query('DELETE FROM "SceneNode" WHERE "sceneId" = $1', [sceneId]);

    // Delete snapshot from S3 if configured
    if (bucket) {
      const key = `snapshots/${sceneId}.json`;
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    }

    parentPort.postMessage({ sceneId, success: true });
  } catch (err) {
    console.error('Scene cleanup failed:', err);
    parentPort.postMessage({ sceneId, success: false, error: err.message });
  }
});
