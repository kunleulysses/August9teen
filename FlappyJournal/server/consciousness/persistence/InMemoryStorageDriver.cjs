/**
 * Storage Error Classes
 */
class StorageError extends Error {
  constructor(message, code = 'STORAGE_ERROR') {
    super(message);
    this.name = 'StorageError';
    this.code = code;
  }
}

class TenantIsolationError extends StorageError {
  constructor(message) {
    super(message, 'TENANT_ISOLATION_ERROR');
    this.name = 'TenantIsolationError';
  }
}

class RecordNotFoundError extends StorageError {
  constructor(message) {
    super(message, 'RECORD_NOT_FOUND');
    this.name = 'RecordNotFoundError';
  }
}

class StorageUnavailableError extends StorageError {
  constructor(message) {
    super(message, 'STORAGE_UNAVAILABLE');
    this.name = 'StorageUnavailableError';
  }
}

/**
 * In-Memory Storage Driver for Testing and Development
 * Implements StorageDriver interface with tenant isolation
 */
class InMemoryStorageDriver {
  constructor(config = {}) {
    this.data = new Map(); // tenantId:sigilId:authHash -> record
    this.config = config;
    this.closed = false;
  }

  _validateTenant(tenantId) {
    if (!tenantId || typeof tenantId !== 'string') {
      throw new TenantIsolationError('Invalid tenant ID provided');
    }
  }

  _createKey(tenantId, sigilId, authHash) {
    return `${tenantId}:${sigilId}:${authHash}`;
  }

  _checkClosed() {
    if (this.closed) {
      throw new StorageUnavailableError('Storage driver has been closed');
    }
  }

  async setSigilRecord(tenantId, sigilId, authHash, record) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    if (!sigilId || !authHash || !record) {
      throw new StorageError('Missing required parameters', 'INVALID_PARAMETERS');
    }

    const key = this._createKey(tenantId, sigilId, authHash);
    const enrichedRecord = {
      ...record,
      tenantId,
      sigilId,
      authHash,
      storedAt: new Date().toISOString(),
      driver: 'memory'
    };
    
    this.data.set(key, enrichedRecord);
  }

  async getSigilRecord(tenantId, sigilId, authHash) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    const key = this._createKey(tenantId, sigilId, authHash);
    return this.data.get(key);
  }

  async allSigilRecords(tenantId, options = {}) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    const { limit, cursor, filter } = options;
    const prefix = `${tenantId}:`;
    const records = [];
    
    for (const [key, record] of this.data.entries()) {
      if (key.startsWith(prefix)) {
        // Apply filter if provided
        if (filter) {
          let matches = true;
          for (const [filterKey, filterValue] of Object.entries(filter)) {
            if (record[filterKey] !== filterValue) {
              matches = false;
              break;
            }
          }
          if (!matches) continue;
        }
        
        records.push(record);
      }
    }
    
    // Sort by storedAt for consistent ordering
    records.sort((a, b) => new Date(a.storedAt) - new Date(b.storedAt));
    
    // Apply cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      startIndex = records.findIndex(r => r.sigilId === cursor);
      if (startIndex === -1) startIndex = 0;
      else startIndex += 1; // Start after cursor
    }
    
    // Apply limit
    if (limit && limit > 0) {
      return records.slice(startIndex, startIndex + limit);
    }
    
    return records.slice(startIndex);
  }

  async deleteSigilRecord(tenantId, sigilId, authHash) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    const key = this._createKey(tenantId, sigilId, authHash);
    const existed = this.data.has(key);
    this.data.delete(key);
    
    if (!existed) {
      throw new RecordNotFoundError(`Record not found: ${sigilId}`);
    }
  }

  async existsSigilRecord(tenantId, sigilId, authHash) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    const key = this._createKey(tenantId, sigilId, authHash);
    return this.data.has(key);
  }

  async countSigilRecords(tenantId) {
    this._checkClosed();
    this._validateTenant(tenantId);
    
    const prefix = `${tenantId}:`;
    let count = 0;
    
    for (const key of this.data.keys()) {
      if (key.startsWith(prefix)) {
        count++;
      }
    }
    
    return count;
  }

  async batch(operations) {
    this._checkClosed();
    
    // Validate all operations first
    for (const op of operations) {
      this._validateTenant(op.tenantId);
      if (!['put', 'del'].includes(op.type)) {
        throw new StorageError(`Invalid operation type: ${op.type}`, 'INVALID_OPERATION');
      }
    }
    
    // Execute all operations (in-memory is naturally atomic)
    for (const op of operations) {
      if (op.type === 'put') {
        await this.setSigilRecord(op.tenantId, op.sigilId, op.authHash, op.record);
      } else if (op.type === 'del') {
        try {
          await this.deleteSigilRecord(op.tenantId, op.sigilId, op.authHash);
        } catch (error) {
          if (!(error instanceof RecordNotFoundError)) {
            throw error;
          }
          // Ignore not found errors in batch delete
        }
      }
    }
  }

  async close() {
    this.closed = true;
    this.data.clear();
  }

  async getHealth() {
    if (this.closed) {
      return {
        status: 'unhealthy',
        details: {
          error: 'Storage driver is closed',
          recordCount: 0
        }
      };
    }
    
    return {
      status: 'healthy',
      details: {
        driver: 'memory',
        recordCount: this.data.size,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
  }

  // Additional utility methods for testing
  _getAllKeys() {
    return Array.from(this.data.keys());
  }

  _clear() {
    this.data.clear();
  }

  _getTenantKeys(tenantId) {
    const prefix = `${tenantId}:`;
    return Array.from(this.data.keys()).filter(key => key.startsWith(prefix));
  }
}

module.exports = { InMemoryStorageDriver };