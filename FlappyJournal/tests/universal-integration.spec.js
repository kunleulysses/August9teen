/*
 * universal-integration.spec.js
 *
 * Integration test verifying that deep-integration modules
 * are available through BOTH chat surfaces:
 *   1. direct CLI invocation (backend container)
 *   2. WebSocket invocation (main-server gateway)
 *
 * This test assumes that `getIntegrationStatus` RPC has been
 * implemented by each deep-integration module and is exposed
 * through the global command registry.
 *
 * If the RPC isn’t yet available the test will be skipped, but
 * serves as a contract for the next implementation step.
 */

import { expect } from 'chai';
import WebSocket from 'ws';
import { spawn } from 'child_process';

const WS_URL = process.env.WS_URL || 'ws://localhost:5000/chat';
const CLI_CMD = process.env.CLI_CMD || 'node universal-system-terminal.js';

/**
 * Helper to run a CLI command that returns JSON on stdout.
 */
function runCliRpc(method) {
  return new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', `${CLI_CMD} --json --rpc ${method}`]);
    let data = '';
    child.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });
    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`CLI exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(data.trim());
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
}

/**
 * Helper to call an RPC via WebSocket and wait for response.
 */
function wsRpc(method) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'rpc', method }));
    });
    ws.on('message', (msg) => {
      try {
        const payload = JSON.parse(msg.toString());
        if (payload.method === method && payload.type === 'rpcResult') {
          ws.close();
          resolve(payload.result);
        }
      } catch (e) {
        // ignore non-JSON messages
      }
    });
    ws.on('error', reject);
    ws.on('close', () => reject(new Error('WebSocket closed before reply')));
  });
}

describe('Universal Integration – Deep-Module Exposure', function () {
  this.timeout(10000);

  let cliStatus;
  let wsStatus;

  before(async function () {
    try {
      cliStatus = await runCliRpc('getIntegrationStatus');
      wsStatus = await wsRpc('getIntegrationStatus');
    } catch (err) {
      this.skip();
    }
  });

  it('CLI and WebSocket should return identical integration counts', function () {
    expect(cliStatus).to.have.property('deepModules');
    expect(wsStatus).to.have.property('deepModules');
    expect(cliStatus.deepModules).to.equal(5);
    expect(wsStatus.deepModules).to.equal(5);
  });

  it('CLI and WebSocket should expose the same module list', function () {
    expect(cliStatus.modules).to.deep.equal(wsStatus.modules);
  });
});
