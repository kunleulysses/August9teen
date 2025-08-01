import { WebSocket } from 'ws';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

/**
 * Executes the CLI RPC and parses JSON output.
 * Returns { modules: string[] }
 */
function getCliStatus() {
  const result = spawnSync('node', [
    'server/universal-system-terminal.js',
    '--json',
    '--rpc',
    'getIntegrationStatus'
  ], { encoding: 'utf-8' });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`CLI exited with code ${result.status}: ${result.stderr}`);
  }
  // Find the last JSON object in stdout
  const jsonMatch = result.stdout.trim().match(/\{[\s\S]*\}$/);
  if (!jsonMatch) {
    throw new Error('CLI output did not contain JSON');
  }
  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.consciousnessModules?.map(m => m.name) ?? [];
}

/**
 * Connects to the WebSocket RPC and retrieves integration status.
 */
async function getWsStatus(endpoint = 'ws://localhost:5000/ws/consciousness-chat') {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(endpoint);

    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'rpc', method: 'getIntegrationStatus' }));
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'rpcResult' && msg.method === 'getIntegrationStatus') {
          ws.close();
          const modules = msg.result?.modules || [];
          resolve(modules);
        }
      } catch (err) {
        reject(err);
      }
    });

    ws.on('error', reject);
    ws.on('close', () => {
      // if closed before response resolve will already be called
    });
  });
}

(async () => {
  try {
    const cliModules = getCliStatus();
    const wsModules = await getWsStatus();

    assert.deepStrictEqual(wsModules.sort(), cliModules.sort(), 'Module lists differ between CLI and WebSocket surfaces');
    console.log('SUCCESS: Both surfaces expose identical modules:', cliModules);
    process.exit(0);
  } catch (err) {
    console.error('INTEGRATION TEST FAILED:', err);
    process.exit(1);
  }
})();
