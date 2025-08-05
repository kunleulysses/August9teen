const { fork } = require('child_process');
const path = require('path');

describe('Renderer Worker', () => {
  it('should launch without errors', (done) => {
    const workerPath = path.resolve(__dirname, '../../../server/holograph/worker/renderer.cjs');
    const worker = fork(workerPath);

    worker.on('error', (err) => {
      done(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        done(new Error(`Worker exited with code ${code}`));
      } else {
        done();
      }
    });

    // Kill the worker after a short delay to prevent it from running forever
    setTimeout(() => {
      worker.kill();
    }, 1000);
  });
});