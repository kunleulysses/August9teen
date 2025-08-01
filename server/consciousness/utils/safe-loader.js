import { Worker } from 'worker_threads';
import { pathToFileURL } from 'url';

/**
 * Safely import a JavaScript module in a worker thread.
 * Returns the module's default export, or the module namespace if no default.
 * Kills the worker after timeout ms (default 3000).
 * 
 * @param {string} filePath - Path to JS module file
 * @param {number} timeout - Max ms to wait
 * @returns {Promise<any>}
 */
export async function safeImport(filePath, timeout = 3000) {
    return new Promise((resolve, reject) => {
        let settled = false;
        const worker = new Worker(`
            import { parentPort, workerData } from 'worker_threads';
            import { pathToFileURL } from 'url';
            (async () => {
                try {
                    const mod = await import(pathToFileURL(workerData.filePath).href);
                    parentPort.postMessage({ ok: true, value: mod.default ?? mod });
                } catch (e) {
                    parentPort.postMessage({ ok: false, error: e && e.message ? e.message : String(e) });
                }
            })();
        `, {
            eval: true,
            workerData: { filePath }
        });

        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                worker.terminate();
                reject(new Error(`safeImport: Timeout after ${timeout}ms loading ${filePath}`));
            }
        }, timeout);

        worker.once('message', (msg) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            worker.terminate();
            if (msg.ok) {
                resolve(msg.value);
            } else {
                reject(new Error(`safeImport: Failed to import ${filePath}: ${msg.error}`));
            }
        });

        worker.once('error', (err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            worker.terminate();
            reject(new Error(`safeImport: Worker error: ${err && err.message ? err.message : String(err)}`));
        });

        worker.once('exit', (code) => {
            if (!settled && code !== 0) {
                settled = true;
                clearTimeout(timer);
                reject(new Error(`safeImport: Worker exited with code ${code} for ${filePath}`));
            }
        });
    });
}