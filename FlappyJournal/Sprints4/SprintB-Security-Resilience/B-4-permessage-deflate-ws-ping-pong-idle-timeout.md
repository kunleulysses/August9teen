# B-4: permessage-deflate + ws ping/pong + idle timeout

## Objective & Success Criteria
**Objective:**  
Enhance resilience and efficiency of the resonance WebSocket endpoints using compression, ping/pong keepalives, and automatic idle timeouts.

**Success Criteria:**  
- WS supports permessage-deflate.
- Connections drop if idle > N seconds.
- Dead connections detected and closed.
- All functionality covered by tests.

## Prerequisites / Dependencies
- `ws` Node.js library
- Express/WS server for resonance

## Architectural Context
- `FlappyJournal/server/ws/resonance-ws.js`
- WS server setup/config

## Step-by-Step Implementation Plan

1. **Enable permessage-deflate**
   - In ws server:
     ```js
     const WebSocket = require('ws');
     const wss = new WebSocket.Server({ perMessageDeflate: true, ... });
     ```

2. **Add Ping/Pong Keepalive**
   - Set interval to send ping; expect pong back.
   - If no pong, close connection.

3. **Implement Idle Timeout**
   - Track last message per connection.
   - Close connection if idle time exceeded.

4. **Test**
   - Add tests for idle, broken, compressed connections.

## Observability Hooks
- Counter: `resonance_ws_timeouts_total`
- Gauge: `resonance_ws_active_connections`

## Security or Performance Considerations
- Compress only trusted data; defend against zip-bombs.
- Drop connections promptly to save resources.

## Validation / Acceptance Checklist
- [ ] All clients support permessage-deflate
- [ ] Idle timeouts enforced
- [ ] Keepalive works under network partition

## Rollback / Cleanup Notes
- Remove permessage-deflate option and ping/pong logic to revert.