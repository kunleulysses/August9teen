import SpiralMemoryArchitecture from './SpiralMemoryArchitecture';
import eventBus from './ConsciousnessEventBus';
import LevelSpiralAdapter from './storage/LevelSpiralAdapter';
import RedisSpiralAdapter from './storage/RedisSpiralAdapter';
import logger from './utils/logger';
import { sign, verify } from './security/eventSign';
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
    logger.info('SpiralMemoryFacade instantiated');
    this.registerEventListeners();
  }

  private getCurrentTenantId(data?: any): string {
    // Prefer explicit, else env, else 'public'
    return (data && data.tenantId) || process.env.TENANT_ID || 'public';
  }

  registerEventListeners() {
    // Listen to both legacy and new event keys for store/retrieve
    [legacyEvents.storeReq, newEvents.storeReq].forEach(ev =>
      eventBus.on(ev, async (data: any) => {
        try {
          const tenantId = this.getCurrentTenantId(data);
          let result;
          if (data.content !== undefined) {
            if (data.tenantId && data.tenantId !== tenantId) throw new Error('tenant mismatch');
            result = await this.arch.storeMemory(data.content, data.type, data.depth, data.associations || []);
            result.tenantId = tenantId;
          } else {
            result = await this.arch.storeMemory(
              data.memoryData,
              data.type || 'general',
              data.depth || 'shallow',
              []
            );
            result.id = data.memoryId || result.id;
            result.tenantId = tenantId;
          }
          // ACL: only allow store if tenant matches (mock)
          if (data.tenantId && data.tenantId !== tenantId) throw new Error('tenant mismatch');
          // Signed event
          const payload = { ...result, requestId: data.requestId, tenantId };
          const signature = sign(payload);
          eventBus.emit(newEvents.storeOk, { ...payload, signature });
          eventBus.emit(legacyEvents.storeOk, { ...payload, signature });
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
          const tenantId = this.getCurrentTenantId(data);
          let result;
          if (data.memoryId !== undefined) {
            result = await this.arch.retrieveMemory(data.memoryId);
          } else if (data.id !== undefined) {
            result = await this.arch.retrieveMemory(data.id);
          } else {
            result = null;
          }
          // ACL check: only return if tenant matches
          if (result && result.tenantId && result.tenantId !== tenantId) result = null;
          if (result) {
            const payload = { ...result, requestId: data.requestId, tenantId };
            const signature = sign(payload);
            eventBus.emit(newEvents.retrieveOk, { ...payload, signature });
            eventBus.emit(legacyEvents.retrieveOk, { ...payload, signature });
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