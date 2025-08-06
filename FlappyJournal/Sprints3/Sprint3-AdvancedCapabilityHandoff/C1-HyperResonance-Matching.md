# Ticket C1 – Hyper-Resonance Matching Engine

## Goal
Develop a robust hyper-resonance matching engine that links sigils to DNA patterns, supports similarity queries, and enables advanced matching for downstream applications such as audit, clustering, and recommendation.

## Context

In the Sigil-DNA stack, each sigil encodes not just a cryptographic identity, but also a unique "DNA pattern"—a vector or structure representing resonance, crystallization, and code properties (see [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs) and [`FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs`](../../server/consciousness/sigil-based-code-authenticator.cjs)). However, there is currently no system for:
- Querying: "Find all sigils similar to this one" or "Find all sigils with resonance pattern X."
- Linking: Grouping sigils by shared structure, resonance, or cryptographic features.
- Advanced analytics: Building recommendation, clustering, or anomaly detection features atop sigil DNA.

A hyper-resonance engine should:
- Index all sigils by their DNA pattern (spiral, phi, code DNA, etc.).
- Support efficient similarity search (e.g., cosine, Jaccard, Hamming distance).
- Expose an API for queries (e.g., `/sigil/match`).
- Be extensible to other pattern types (future-proof).
- Integrate with the graph index if present (see C2).

## Prerequisites

- Node.js v18.x or higher
- Access to sigil encode and DNA pattern logic
- Vector/graph math library (e.g., `ml-matrix` or `cosine-similarity`)
- ENV: None special, but large memory for indexing is helpful
- Test data: wide variety of sigil patterns and edge cases
- API authentication (see B1)
- Ability to add new API endpoints

## Step-by-Step Implementation

### 1. Define DNA Pattern Extraction/Encoding

1. Ensure each sigil record includes a DNA pattern field:
   ```js
   // Example in encode logic
   sigil.dnaPattern = extractDnaPattern(data); // array/vector
   ```

2. DNA pattern could be:
   - Vector of floats (e.g., resonance angles)
   - Hash or k-mer (for code DNA)
   - Multidimensional pattern

### 2. Build Index for Patterns

1. In memory (for PoC):
   ```js
   const sigilPatternIndex = new Map(); // sigilId -> dnaPattern
   ```

2. Periodically (or on encode), update index:
   ```js
   sigilPatternIndex.set(sigil.id, sigil.dnaPattern);
   ```

### 3. Implement Similarity Function

1. Cosine similarity for vector patterns:
   ```js
   function cosineSimilarity(a, b) {
     const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
     const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
     const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
     return dot / (normA * normB);
   }
   ```

2. Jaccard or Hamming for hashes/sets.

### 4. Expose Match API Endpoint

1. In `sigil-api.cjs`:
   ```js
   router.post('/api/consciousness/sigils/match', jwtMiddleware, async (req, res) => {
     const queryPattern = req.body.dnaPattern;
     const topN = req.body.topN || 10;
     const matches = [];
     for (const [id, pattern] of sigilPatternIndex) {
       const score = cosineSimilarity(queryPattern, pattern);
       matches.push({ id, score });
     }
     matches.sort((a, b) => b.score - a.score);
     res.json({ matches: matches.slice(0, topN) });
   });
   ```

2. Document the endpoint and required payload.

### 5. Integrate with Graph Index (Optional)

- If C2 is implemented, also link sigils in the graph.

### 6. Test and Tune

- Add edge cases: missing/short/empty patterns, dimensionality mismatch.
- Tune similarity thresholds for false positives/negatives.

### 7. Document and Expose in UI/Docs

- Add usage to API docs and README.
- Provide code snippets for client-side matching.

---

## Verification

### Automated

- Unit tests for similarity functions (cosine, Jaccard, etc.).
- Test API endpoint with known similar/dissimilar patterns.
- Integration test: encode N sigils, query for similar, verify correct matches.

### Manual

- Use curl to POST to `/sigil/match` with a valid DNA pattern:
  ```bash
  curl -X POST http://localhost:3000/sigil/api/consciousness/sigils/match \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"dnaPattern": [0.1, 0.5, 0.9], "topN": 5}'
  ```

### Metrics

- Track match endpoint latency and usage in Prometheus.

---

## Rollback

- Remove matching logic and API endpoint:
  ```
  git checkout HEAD~1 -- server/sigil-api.cjs
  ```
- Remove index and pattern fields from records.

---

## Acceptance Criteria

- Each sigil has a well-defined DNA pattern field.
- API supports match queries with top-N results.
- Similarity function is correct and tested.
- No regression in encode/verify performance.
- Docs and code are up to date.

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: _______________________

---

## References / Further Reading

- [Cosine similarity in JS](https://www.npmjs.com/package/cosine-similarity)
- [OWASP secure API design](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [JSON:API relationships](https://jsonapi.org/format/#document-resource-object-relationships)
- [Efficient nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search)
- [Graph matching](https://networkx.org/documentation/stable/reference/algorithms/isomorphism.html)