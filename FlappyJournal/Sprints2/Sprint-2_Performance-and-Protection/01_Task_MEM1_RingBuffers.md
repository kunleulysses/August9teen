# Task MEM1: RingBuffers for Memory Safety

**Owner:** Backend Eng  
**Pre-req:** Basic TS/JS familiarity  
**Est. hours:** 2

---

## Objective

Replace unbounded arrays (`analysisHistory`, `previousMoments`) with fixed-capacity ring buffers to prevent memory leaks.

## Steps

1. **Create `lib/RingBuffer.ts`:**
   - Export generic RingBuffer&lt;T&gt; with fixed capacity
   - Methods: `push(item)`, `toArray()`, `clear()`
2. **Replace:**
   - In `MetaCognitiveAnalysis.cjs` (`analysisHistory`)
   - In `TemporalContinuityTracker` (`previousMoments`)
   - Set capacities: 5,000 and 1,000 respectively
3. **Test:**
   - Unit: fill to cap, assert oldest drop
   - Integration: monitor heap with `--expose-gc`
4. **Docs:**  
   - Add usage comments, link to leak test
5. **Commit Message:**  
   ```
   feat(memory): migrate analysisHistory & previousMoments to ring buffers
   ```
6. **Done Criteria:**
   - Heap flat under sustained load
   - No OOM on extended run