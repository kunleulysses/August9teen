/**
 * SpiralMemoryFacade: Deprecated IntelligentSpiralMemory API, backed by SpiralMemoryArchitecture.
 * Handles both legacy and new event keys for store/retrieve.
 */

import SpiralMemoryArchitecture from './SpiralMemoryArchitecture.js';
import eventBus from './ConsciousnessEventBus.js';

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

class SpiralMemoryFacade {
  constructor() {
    this.name = 'SpiralMemoryFacade';
    this.arch = new SpiralMemoryArchitecture();
    this.warned = false;
    this.registerEventListeners();
  }

  registerEventListeners() {
    // Listen to both legacy and new event keys for store/retrieve
    [legacyEvents.storeReq, newEvents.storeReq].forEach(ev =>
      eventBus.on(ev, async (data) => {
        try {
          // SpiralMemoryArchitecture expects: content, type, depth, associations
          // Legacy expects: memoryId, memoryData, consciousnessContext
          let result, reqId = data.requestId;
          if (data.content !== undefined) {
            result = await this.arch.storeMemory(data.content, data.type, data.depth, data.associations || []);
          } else {
            // Legacy
            result = await this.arch.storeMemory(
              data.memoryData,
              data.type || 'general',
              data.depth || 'shallow',
              []
            );
            result.id = data.memoryId || result.id;
          }
          // Emit both new and legacy events
          eventBus.emit(newEvents.storeOk, { ...result, requestId: reqId });
          eventBus.emit(legacyEvents.storeOk, { ...result, requestId: reqId });
        } catch (err) {
          const errObj = { error: err && err.message || String(err), requestId: data.requestId };
          eventBus.emit(newEvents.storeFail, errObj);
          eventBus.emit(legacyEvents.storeFail, errObj);
        }
      })
    );
    [legacyEvents.retrieveReq, newEvents.retrieveReq].forEach(ev =>
      eventBus.on(ev, async (data) => {
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
        } catch (err) {
          const errObj = { error: err && err.message || String(err), requestId: data.requestId };
          eventBus.emit(newEvents.retrieveFail, errObj);
          eventBus.emit(legacyEvents.retrieveFail, errObj);
        }
      })
    );
  }

  // API: storeMemory (legacy signature)
  async storeMemory(memoryId, memoryData, consciousnessContext) {
    // Forward as content/type/depth
    const result = await this.arch.storeMemory(
      memoryData,
      'general',
      'shallow',
      []
    );
    result.id = memoryId || result.id;
    return result;
  }

  // API: retrieveMemory (legacy signature)
  async retrieveMemory(memoryId, currentConsciousnessState) {
    return await this.arch.retrieveMemory(memoryId);
  }

  // API: getMemoryStats (legacy)
  getMemoryStats() {
    return this.arch.getMemoryStatistics();
  }

  // API: getSelfAwarenessStatus (legacy)
  getSelfAwarenessStatus() {
    return this.arch.getSelfAwarenessStatus();
  }
}

const singleton = new SpiralMemoryFacade();
export default singleton;