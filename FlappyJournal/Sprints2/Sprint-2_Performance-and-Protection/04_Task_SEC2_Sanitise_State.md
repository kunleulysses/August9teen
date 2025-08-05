# Task SEC2: State Sanitization

**Owner:** BE/Security  
**Pre-req:** None  
**Est. hours:** 1

---

## Objective

Ensure no sensitive data (e.g., reflection content, insight text, PII) is ever broadcast over WebSocket.

## Steps

1. **Write `sanitizeState(obj)` util:**  
   - Recursively strip fields: `reflection`, `insight.content`, any string >256 chars
2. **Integrate:**  
   - Apply before all outbound WS sends
   - Unit test with synthetic payloads
3. **Test:**  
   - Send crafted payload with >256 char string; confirm dropped/truncated
   - Confirm no PII fields
4. **Docs:**  
   - Describe in runbook/sec section
5. **Commit Message:**  
   ```
   feat(security): sanitize all outbound state payloads
   ```
6. **Done Criteria:**
   - No secrets/PII in any client message
   - Test suite passes with sanitizer