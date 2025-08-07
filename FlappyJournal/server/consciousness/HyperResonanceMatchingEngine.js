const { HyperResonanceMatchingEngine } = require('../consciousness/HyperResonanceMatchingEngine.js');

class HyperResonanceMatchingEngine {
  constructor({ storage, config = {} }) {
    this.storage = storage;
    this.config = {
      indexSize: 10000,
      similarityThreshold: 0.5,
      maxResults: 100,
      ...config
    };
    this.patternIndex = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    await this._buildIndex();
    this.initialized = true;
  }

  async _buildIndex() {
    const tenants = ['public'];
    for (const tenantId of tenants) {
      try {
        const records = await this.storage.allSigilRecords(tenantId);
        for (const record of records) {
          if (record.resonancePattern && record.id) {
            this.patternIndex.set(record.id, {
              pattern: record.resonancePattern,
              tenantId,
              timestamp: record.timestamp
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to index tenant ${tenantId}:`, error.message);
      }
    }
  }

  async findSimilar(queryPattern, options = {}) {
    if (!this.initialized) await this.initialize();
    
    const { topN = 10, threshold = 0.5, tenantId } = options;
    const matches = [];

    for (const [sigilId, indexData] of this.patternIndex.entries()) {
      if (tenantId && indexData.tenantId !== tenantId) continue;
      
      const similarity = this.cosineSimilarity(queryPattern, indexData.pattern);
      if (similarity >= threshold) {
        matches.push({ sigilId, similarity, tenantId: indexData.tenantId });
      }
    }

    matches.sort((a, b) => b.similarity - a.similarity);
    return { matches: matches.slice(0, topN) };
  }

  cosineSimilarity(a, b) {
    if (a.length !== b.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dot / magnitude;
  }
}

module.exports = { HyperResonanceMatchingEngine };