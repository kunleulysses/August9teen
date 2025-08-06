/**
 * Test: Reality Persistence
 * Verifies that generated scenes persist via PostgresStore across generator restarts.
 */

const { PostgresStore } = require('../persistence/PostgresStore.cjs');

// Simple scene generator that stores scenes in PostgresStore
class SceneGenerator {
  constructor(store) {
    this.store = store;
  }

  async generateScene(id) {
    const scene = { id, createdAt: Date.now() };
    await this.store.pushToList('scenes', scene);
    return scene;
  }

  async loadScenes() {
    return await this.store.list('scenes');
  }
}

describe('Reality Persistence', () => {
  let store;

  beforeAll(async () => {
    store = new PostgresStore();
    await store.ready;
    // Clean up any existing scenes
    await store.pool.query("DELETE FROM consciousness_kv WHERE id = $1", ['scenes']);
  });

  afterAll(async () => {
    if (store) {
      await store.pool.query("DELETE FROM consciousness_kv WHERE id = $1", ['scenes']);
      await store.close();
    }
  });

  test('should persist scenes across generator restart', async () => {
    const generator = new SceneGenerator(store);
    const totalScenes = 100;

    for (let i = 0; i < totalScenes; i++) {
      await generator.generateScene(`scene-${i}`);
    }

    // Simulate restart by closing store and creating new instances
    await store.close();
    store = new PostgresStore();
    await store.ready;

    const restartedGenerator = new SceneGenerator(store);
    const scenes = await restartedGenerator.loadScenes();

    expect(scenes.length).toBe(totalScenes);
  });
});
