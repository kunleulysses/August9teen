const level = require('level');
const levelgraph = require('levelgraph');

class GraphIndex {
  constructor(dbPath = './sigil-graph') {
    this.db = level(dbPath);
    this.graph = levelgraph(this.db);
  }

  async addRelationship(subjectId, predicate, objectId, metadata = {}) {
    const triple = {
      subject: subjectId,
      predicate,
      object: objectId,
      ...metadata
    };
    
    return new Promise((resolve, reject) => {
      this.graph.put([triple], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async findRelated(sigilId, predicate) {
    return new Promise((resolve, reject) => {
      this.graph.search([{
        subject: sigilId,
        predicate,
        object: this.graph.v('related')
      }], (err, results) => {
        if (err) reject(err);
        else resolve(results.map(r => r.related));
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      this.db.close(resolve);
    });
  }
}

module.exports = { GraphIndex };