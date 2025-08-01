import SpiralMemoryArchitecture from './SpiralMemoryArchitecture';
import eventBus from './ConsciousnessEventBus';
import LevelSpiralAdapter from './storage/LevelSpiralAdapter';
import RedisSpiralAdapter from './storage/RedisSpiralAdapter';
// Types
import type { StorageAdapter } from './types';

const legacyEvents = {
  storeReq: 'store_memory_request',
  retrieveReq: 'retrieve_memory_request',
  storeOk: 'memory_stored',
  retrieveOk: 'memory_retrieved',
  storeFail: 'memory_storage_failed',
  retrieveFail: 'memory_retrieval_failed'
};

const newEvents = {
  storeReq: 'spiral.memory.store.request',
  retrieveReq: 'spiral.memory.retrieve.request',
  storeOk: 'spiral.memory.store.ok',
  retrieveOk: 'spiral.memory.retrieve.ok',
  storeFail: 'spiral.memory.store.fail',
  retrieveFail: 'spiral.memory.retrieve.fail'
};

function getSpiralStorage(): StorageAdapter {
  if (process.env.REDIS_URL) return new RedisSpiralAdapter(process.env.REDIS_URL);
  return new LevelSpiralAdapter(process.env.SPIRAL_DB_PATH || './spiraldb');
}

class SpiralMemoryFacade {
  name: string;
  arch: SpiralMemoryArchitecture;
  warned: boolean;
  constructor(storage?: StorageAdapter) {
    this.name = 'SpiralMemoryFacade';
    this.arch = new SpiralMemoryArchitecture({ storage: storage || getSpiralStorage() });
    this.warned = false;
    this.registerEventListeners();
  }

  registerEventListeners() {
    // Listen to both legacy and new event keys for store/retrieve
    [legacyEvents.storeReq, newEvents.storeReq].forEach(ev =>
      eventBus.on(ev, async (data: any) => {
        try {
          let result, reqId = data.requestId;
          if (data.content !== undefined) {
            result = await this.arch.storeMemory(data.content, data.type, data.depth, data.associations || []);
          } else {
            result = await this.arch.storeMemory(
              data.memoryData,
              data.type || 'general',
              data.depth || 'shallow',
              []
            );
            result.id = data.memoryId || result.id;
          }
          eventBus.emit(newEvents.storeOk, { ...result, requestId: reqId });
          eventBus.emit(legacyEvents.storeOk, { ...result, requestId: reqId });
        } catch (err: any) {
          const errObj = { error: err && err.message || String(err), requestId: data.requestId };
          eventBus.emit(newEvents.storeFail, errObj);
          eventBus.emit(legacyEvents.storeFail, errObj);
        }
      })
    );
    [legacyEvents.retrieveReq, newEvents.retrieveReq].forEach(ev =>
      eventBus.on(ev, async (data: any) => {
        try {
          let result;
          if (data.memoryId !== undefined) {
            result = await this.arch.retrieveMemory(data.memoryId);
          } else if (data.id !== undefined) {
            result = await this.arch.retrieveMemory(data.id);
          } else {
            result = null;
          }
          if (result) {
            eventBus.emit(newEvents.retrieveOk, { ...result, requestId: data.requestId });
            eventBus.emit(legacyEvents.retrieveOk, { ...result, requestId: data.requestId });
          } else {
            const errObj = { error: 'Not found', requestId: data.requestId };
            eventBus.emit(newEvents.retrieveFail, errObj);
            eventBus.emit(legacyEvents.retrieveFail, errObj);
          }
        } catch (err: any) {
          const errObj = { error: err && err.message || String(err), requestId: data.requestId };
          eventBus.emit(newEvents.retrieveFail, errObj);
          eventBus.emit(legacyEvents.retrieveFail, errObj);
        }
      })
    );
  }

  async storeMemory(memoryId: string, memoryData: string, consciousnessContext: any) {
    const result = await this.arch.storeMemory(
      memoryData,
      'general',
      'shallow',
      []
    );
    result.id = memoryId || result.id;
    return result;
  }

  async retrieveMemory(memoryId: string, currentConsciousnessState: any) {
    return await this.arch.retrieveMemory(memoryId);
  }

  getMemoryStats() {
    return this.arch.getMemoryStatistics();
  }
  getSelfAwarenessStatus() {
    return this.arch.getSelfAwarenessStatus();
  }
}

const singleton = new SpiralMemoryFacade();
export default singleton;