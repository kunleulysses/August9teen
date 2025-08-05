import { exec } from 'child_process';
import { SpiralMemoryArchitecture } from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import { RedisSpiralAdapter } from '../../server/consciousness/core/storage/RedisSpiralAdapter.cjs';
import pMap from 'p-map';

describe('Chaos Test', () => {
  let arch: SpiralMemoryArchitecture;

  beforeAll(async () => {
    await new Promise(resolve => exec('docker-compose up -d', resolve));
    arch = new SpiralMemoryArchitecture({ storage: new RedisSpiralAdapter('redis://localhost:6379') });
    await arch.init();
  });

  afterAll(async () => {
    await new Promise(resolve => exec('docker-compose down', resolve));
  });

  it('should recover from Redis outage', async () => {
    const storeMemory = () => arch.storeMemory('test');
    const mapper = () => storeMemory();
    const promise = pMap(Array(500 * 3).fill(0), mapper, { concurrency: 10 });

    await new Promise(resolve => setTimeout(resolve, 10000));
    await new Promise(resolve => exec('node FlappyJournal/tools/chaos/redisChaos.cjs', resolve));

    await promise;

    const metrics = await arch.getMetrics();
    const cbState = metrics.consciousnessMetrics.spiral_cb_state.values.find(v => v.labels.backend === 'RedisSpiralAdapter').value;
    expect(cbState).toBe(0);
  }, 180000);
});