# Ticket C2 – Graph-Index (LevelGraph) for Fast Lookups

## Goal
Implement a fast, scalable graph index (using LevelGraph or similar) on top of LevelDB to enable sub-millisecond relationship lookups between sigils, supporting advanced queries and analytics.

## Context

Sigil-DNA is more than a flat registry of digital artifacts; each sigil can have relationships or resonance with others (see [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs)), and future features (e.g., similarity search, lineage, clustering) depend on efficient graph traversal. Current lookups are O(N), requiring brute-force scans across all sigils. This limits:
- Real-time analytics (e.g., "show all related sigils to this one")
- Hierarchical queries (parent/child, ancestor/descendant)
- Efficient UI rendering for relationship trees or clusters

LevelGraph is a proven RDF-like graph index built for LevelDB, offering:
- Constant-time edge lookups and predicate queries
- Linked data support (subject, predicate, object)
- Compatibility with JSON-LD and flexible edge schemas

By integrating a graph index:
- Sigil-DNA can support fast queries and analytics
- Future multi-tenant, cross-sigil, and resonance analytics become feasible
- Graph queries are accessible via REST, CLI, and internal code

## Prerequisites

- Node.js v18.x or higher
- `level` and `levelgraph` npm packages
- Working LevelDB persistence
- ENV: `SIGIL_GRAPH_PATH`
- Sufficient disk space for graph index
- Ability to update encode, verify, and relationship logic
- Existing sigil records with unique IDs

## Step-by-Step Implementation

### 1. Install LevelGraph

```bash
npm install level levelgraph
```

### 2. Initialize LevelGraph Index

1. In `server/consciousness/persistence/LevelGraphIndex.js`:
   ```js
   const level = require('level');
   const levelgraph = require('levelgraph');
   const db = level(process.env.SIGIL_GRAPH_PATH || './sigil-graph');
   const graph = levelgraph(db);
   module.exports = graph;
   ```

### 3. Add Relationship Insertion Logic

1. On sigil encode or resonance event, add triples:
   ```js
   graph.put([
     { subject: sigilA.id, predicate: 'resonatesWith', object: sigilB.id },
     { subject: sigilA.id, predicate: 'crystallizes', object: sigilC.id }
   ], callback);
   ```

2. For parent/child or lineage:
   ```js
   graph.put([
     { subject: sigilChild.id, predicate: 'descendantOf', object: sigilParent.id }
   ]);
   ```

### 4. Implement Fast Lookup API

1. In `sigil-api.cjs`:
   ```js
   router.get('/api/consciousness/sigils/:id/related', jwtMiddleware, async (req, res) => {
     const sigilId = req.params.id;
     graph.search([
       { subject: sigilId, predicate: 'resonatesWith', object: graph.v('related') }
     ], (err, results) => {
       if (err) return res.status(500).json({ error: err.message });
       res.json({ related: results.map(r => r.related) });
     });
   });
   ```

2. Support predicate wildcards and reverse lookups.

### 5. Integrate with StorageDriver

- In `StorageDriver`, optionally expose graph methods or inject as a subcomponent for cross-backend support.

### 6. Migrate/Backfill Existing Data

- For all existing resonance or relationship data, traverse sigil records and create graph triples as needed.

### 7. Test Graph Consistency

- Write tests to add/remove edges, verify lookup accuracy, and assert no orphaned nodes.

### 8. Document Graph Schema & Usage

- In README and dev docs, describe predicates, usage patterns, and sample queries.

---

## Verification

### Automated

- Unit tests: insert, query, delete edges; verify related/nested lookups.
- Integration: encode sigil with resonance, confirm relationship appears in API.
- Stress test: insert 10k sigils, ensure lookup latency <10ms.

### Manual

- Use CLI or REST to query relationships.

### Metrics

- Track graph index size and query latency via Prometheus.

---

## Rollback

- Remove graph integration from encode/relationship logic:
  ```
  git checkout HEAD~1 -- server/consciousness/persistence/LevelGraphIndex.js server/sigil-api.cjs
  ```
- Remove LevelGraph dependency and data files.

---

## Acceptance Criteria

- All relationships and resonance between sigils are encoded as edges in graph.
- Lookup for related sigils returns in sub-millisecond time.
- API supports graph queries as documented.
- No regression in encode/verify logic.

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: _______________________

---

## References / Further Reading

- [levelgraph npm](https://www.npmjs.com/package/levelgraph)
- [LevelDB docs](https://github.com/Level/level)
- [Graph data modeling](https://www.dataversity.net/introduction-graph-database-concepts/)
- [JSON-LD and linked data](https://json-ld.org/)
- [Graph queries in practice](https://neo4j.com/developer/cypher/)