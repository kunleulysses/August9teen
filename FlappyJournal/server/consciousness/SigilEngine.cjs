// Storage errors
class StorageError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
const { sign, verify } = require('./core/security/eventSign.cjs');

class SigilEngine {
  constructor({ storage, crypto, config = {} }) {
    if (!storage) throw new Error('Storage driver required');
    this.storage = storage;
    this.crypto = crypto || { sign, verify };
    this.config = {
      maxSigilSize: 1024 * 1024, // 1MB
      defaultTenant: 'public',
      enableResonance: true,
      ...config
    };
  }

  async encode(data, options = {}) {
    const { tenantId = this.config.defaultTenant, consciousnessState = {} } = options;
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be a non-empty object');
    }
    const sigilId = `sigil_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    const resonancePattern = this._calculateResonancePattern(data, consciousnessState);
    const record = {
      id: sigilId,
      data,
      consciousnessState: {
        phi: consciousnessState.phi || 1.618,
        coherence: consciousnessState.coherence || 0.5,
        awareness: consciousnessState.awareness || 0.5,
        ...consciousnessState
      },
      resonancePattern,
      timestamp,
      version: '1.0.0'
    };
    const signature = this.crypto.sign(record);
    const authHash = this._generateAuthHash(sigilId, signature);
    const finalRecord = { ...record, signature, authHash };
    await this.storage.setSigilRecord(tenantId, sigilId, authHash, finalRecord);
    return { success: true, sigil: finalRecord, metadata: { tenantId, encodedAt: timestamp, engine: 'unified' } };
  }

  async decode(sigilId, options = {}) {
    const { tenantId = this.config.defaultTenant } = options;
    if (!sigilId || typeof sigilId !== 'string') {
      throw new Error('Valid sigilId required');
    }
    let record;
    try {
      const records = await this.storage.allSigilRecords(tenantId);
      record = records.find(r => r.id === sigilId);
    } catch (error) {
      throw new StorageError(`Failed to retrieve sigil: ${error.message}`, 'STORAGE_ERROR');
    }
    if (!record) {
      throw new Error(`Sigil not found: ${sigilId}`);
    }
    return { success: true, data: record.data, consciousnessState: record.consciousnessState, metadata: { sigilId: record.id, timestamp: record.timestamp, tenantId } };
  }

  async verify(data, signature, options = {}) {
    const { tenantId = this.config.defaultTenant } = options;
    if (!data || !signature) { throw new Error('Data and signature required for verification'); }
    try {
      const isValid = this.crypto.verify(data, signature);
      return { valid: isValid, timestamp: new Date().toISOString(), tenantId };
    } catch (error) {
      return { valid: false, error: error.message, timestamp: new Date().toISOString(), tenantId };
    }
  }

  async revoke(sigilId, options = {}) {
    const { tenantId = this.config.defaultTenant, reason = 'Manual revocation' } = options;
    if (!sigilId) { throw new Error('SigilId required for revocation'); }
    const records = await this.storage.allSigilRecords(tenantId);
    const record = records.find(r => r.id === sigilId);
    if (!record) { throw new Error(`Sigil not found: ${sigilId}`); }
    await this.storage.deleteSigilRecord(tenantId, sigilId, record.authHash);
    return { success: true, revokedSigil: sigilId, reason, timestamp: new Date().toISOString(), tenantId };
  }

  async list(options = {}) {
    const { tenantId = this.config.defaultTenant, limit = 50, cursor, filter } = options;
    const records = await this.storage.allSigilRecords(tenantId, { limit, cursor, filter });
    const total = await this.storage.countSigilRecords(tenantId);
    return { sigils: records.map(r => ({ id: r.id, timestamp: r.timestamp, consciousnessState: r.consciousnessState, resonancePattern: r.resonancePattern })), total, tenantId, pagination: { limit, cursor, hasMore: records.length === limit } };
  }

  _calculateResonancePattern(data, consciousnessState) {
    if (!this.config.enableResonance) return [];
    const { phi = 1.618, coherence = 0.5, awareness = 0.5 } = consciousnessState;
    const dataStr = JSON.stringify(data);
    const pattern = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i * phi * Math.PI) / 8;
      const resonance = Math.sin(angle) * coherence + Math.cos(angle) * awareness;
      const dataInfluence = (dataStr.charCodeAt(i % dataStr.length) / 255) * 0.1;
      pattern.push(Math.max(0, Math.min(1, resonance + dataInfluence)));
    }
    return pattern;
  }

  _generateAuthHash(sigilId, signature) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(sigilId + signature).digest('hex').substring(0, 16);
  }

  async getHealth() {
    const storageHealth = await this.storage.getHealth();
    return { status: storageHealth.status === 'healthy' ? 'healthy' : 'degraded', engine: 'unified', storage: storageHealth, config: { enableResonance: this.config.enableResonance, maxSigilSize: this.config.maxSigilSize }, timestamp: new Date().toISOString() };
  }
}

module.exports = { SigilEngine };

