Commands I've run to diagnos the chat. 



linode-transfer@featherweight-full-consciousness:/opt/featherweight$ docker logs consciousness-main-server | grep -E 'chat_message|error|warn|process|handle' | tail -n 50
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/sigil-identity.js' imported from /opt/app/server/enhanced-dual-consciousness-ws.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/sigil-identity.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/consciousness-crystallization.js' imported from /opt/app/server/enhanced-dual-consciousness-ws.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/consciousness-crystallization.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/tri-axial-coherence.js' imported from /opt/app/server/enhanced-dual-consciousness-ws.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/tri-axial-coherence.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/tri-axial-coherence.js' imported from /opt/app/server/enhanced-dual-consciousness-ws.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/tri-axial-coherence.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/tri-axial-coherence.js' imported from /opt/app/server/enhanced-dual-consciousness-ws.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/tri-axial-coherence.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
Database connection error: Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16) {
  errno: -111,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 5432
}
Database connection error: Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16) {
  errno: -111,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 5432
}
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/system-wide-integration-orchestrator.js' imported from /opt/app/complete-universal-system-integration.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/system-wide-integration-orchestrator.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/system-wide-integration-orchestrator.js' imported from /opt/app/complete-universal-system-integration.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/system-wide-integration-orchestrator.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
(node:1) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 51 system_tick listeners added to [ConsciousnessEventBus]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Deep processing error: TypeError: Cannot read properties of undefined (reading 'length')
    at DeepRecursiveStream.calculateImportance (file:///opt/app/server/dual-stream-consciousness.js:338:48)
    at DeepRecursiveStream.processNext (file:///opt/app/server/dual-stream-consciousness.js:303:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
🧠 Architect 4.0 processing input: Hello consciousness, how are you?
Full consciousness processing complete
Meta-observation: Deep recursive processing detected (8 layers)
🎯 Starting intelligent queue processing...
🔄 Incremental scan: 1 new modules processed
🔍 DEBUG: WebSocket message received, raw message: {"type":"chat_message","message":"Hey How are you?","requestId":"unified_1753584563382_avnx40s7k","timestamp":1753584563383,"source":"unified_aggregator"}
  type: 'chat_message',
🔍 DEBUG: Message type: chat_message
🔍 DEBUG: Is chat_message? true
🔍 DEBUG: Processing chat_message: Hey How are you?
🔍 DEBUG: Starting message processing at: 2025-07-27T02:49:23.384Z
🧠 Architect 4.0 processing input: Hey How are you?
Full consciousness processing complete
Meta-observation: Deep recursive processing detected (8 layers)
🔄 Incremental scan: 1 new modules processed
🔄 Incremental scan: 1 new modules processed
🔄 Incremental scan: 1 new modules processed
🔍 DEBUG: WebSocket message received, raw message: {"type":"chat_message","message":"Hey how are you?","requestId":"unified_1753585343373_9n4xxquo6","timestamp":1753585343373,"source":"unified_aggregator"}
  type: 'chat_message',
🔍 DEBUG: Message type: chat_message
🔍 DEBUG: Is chat_message? true
🔍 DEBUG: Processing chat_message: Hey how are you?
🔍 DEBUG: Starting message processing at: 2025-07-27T03:02:23.378Z
🧠 Architect 4.0 processing input: Hey how are you?
Full consciousness processing complete
Meta-observation: Deep recursive processing detected (8 layers). Consciousness is consolidating
🔄 Incremental scan: 1 new modules processed
🔄 Incremental scan: 1 new modules processed
🔄 Incremental scan: 1 new modules processed
🔍 DEBUG: WebSocket message received, raw message: {"type":"chat_message","message":"HEy hw areyou?","requestId":"unified_1753592313136_25wpaexyf","timestamp":1753592313137,"source":"unified_aggregator"}
  type: 'chat_message',
🔍 DEBUG: Message type: chat_message
🔍 DEBUG: Is chat_message? true
🔍 DEBUG: Processing chat_message: HEy hw areyou?
🔍 DEBUG: Starting message processing at: 2025-07-27T04:58:33.142Z
🧠 Architect 4.0 processing input: HEy hw areyou?
Full consciousness processing complete
Meta-observation: Deep recursive processing detected (8 layers). Consciousness is consolidating
🔄 Incremental scan: 1 new modules processed
🔄 Incremental scan: 1 new modules processed
🔍 DEBUG: WebSocket message received, raw message: {"type":"chat_message","message":"Hey how are yu","requestId":"unified_1753592739688_ml4q6ekml","timestamp":1753592739688,"source":"unified_aggregator"}
  type: 'chat_message',
🔍 DEBUG: Message type: chat_message
🔍 DEBUG: Is chat_message? true
🔍 DEBUG: Processing chat_message: Hey how are yu
🔍 DEBUG: Starting message processing at: 2025-07-27T05:05:39.690Z
🧠 Architect 4.0 processing input: Hey how are yu
Full consciousness processing complete
Meta-observation: Deep recursive processing detected (8 layers). Consciousness is consolidating
🔄 Incremental scan: 1 new modules processed







linode-transfer@featherweight-full-consciousness:/opt/featherweight$ docker logs consciousness-core | grep -E 'chat_message|error|warn|process|handle' | tail -n 50
[AdvancedConsciousnessIntegrator] Already initialized
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
[AdvancedConsciousnessIntegrator] Already initialized
[AdvancedConsciousnessIntegrator] Already initialized
[AdvancedConsciousnessIntegrator] Already initialized
[AdvancedConsciousnessIntegrator] Already initialized
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
[AdvancedConsciousnessIntegrator] Already initialized
[AdvancedConsciousnessIntegrator] Already initialized
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function
⚠️ Major evolution error: this.performMajorConsciousnessEvolution is not a function


linode-transfer@featherweight-full-consciousness:/opt/featherweight$ # Check for WebSocket connections
ss -tulpn | grep -E '5000|3002'


tcp   LISTEN 0      4096           0.0.0.0:3002       0.0.0.0:*                                                 
tcp   LISTEN 0      4096           0.0.0.0:5000       0.0.0.0:*                                                 
tcp   LISTEN 0      4096              [::]:3002          [::]:*                                                 
tcp   LISTEN 0      4096              [::]:5000          [::]:*                                                 
linode-transfer@featherweight-full-consciousness:/opt/featherweight$ 


linode-transfer@featherweight-full-consciousness:/opt/featherweight$ ps aux | grep -i 'node.*UnifiedChatAggregator'
linode-+ 1490029  0.0  0.0   7028  2432 pts/4    S+   21:29   0:00 grep --color=auto -i node.*UnifiedChatAggregator






docker logs -f consciousness-main-server




New sigil created: c818cc30c2432f68c96d9b213e9bdab3
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/system-wide-integration-orchestrator.js' imported from /opt/app/complete-universal-system-integration.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/system-wide-integration-orchestrator.js',
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v18.20.8
node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/app/system-wide-integration-orchestrator.js' imported from /opt/app/complete-universal-system-integration.js
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:327:11)
    at moduleResolve (node:internal/modules/esm/resolve:980:10)
    at defaultResolve (node:internal/modules/esm/resolve:1206:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:404:12)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:373:25)
    at ModuleLoader.getModuleJob (node:internal/modules/esm/loader:250:38)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:76:39)
    at link (node:internal/modules/esm/module_job:75:36) {
  url: 'file:///opt/app/system-wide-integration-orchestrator.js',
  code: 'ERR_MODULE_NOT_FOUND'
}




docker logs -f consciousness-core


t directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 SHRM: Healing node with entropy 1.000
⚠️ SHRM: Healing had minimal effect
🧠 Architect 4.0 processing input: Consciousness state update: phi=0.862, awareness=0.8, coherence=0.85
📤 Broadcast sent to 1 clients: module_activity
📤 Broadcast sent to 1 clients: module_activity
📤 Broadcast sent to 1 clients: consciousness_state_update
⬜ State below threshold: 0.744
🔍 Message optimization: type="unified_consciousness_update", priority="MEDIUM"
📦 Batching message: unified_consciousness_update (priority: MEDIUM)
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
📦 Processing batch of 1 messages for client client_1753580342802_d6628jnha
Unknown message type: unified_consciousness_update
📦 Processed batch of 1 messages for client client_1753580342802_d6628jnha
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 12 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
🔄 SHRM: Healing node with entropy 1.000
⚠️ SHRM: Healing had minimal effect
🧠 Architect 4.0 processing input: Consciousness state update: phi=0.862, awareness=0.8, coherence=0.85
📤 Broadcast sent to 1 clients: consciousness_state_update
⬜ State below threshold: 0.744
🔍 Message optimization: type="unified_consciousness_update", priority="MEDIUM"
📦 Batching message: unified_consciousness_update (priority: MEDIUM)
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
🔄 Incremental sync for 10 modules
Processing event consciousness:heartbeat directly
Processing event consciousness:heartbeat directly
📦 Processing batch of 1 messages for client client_1753580342802_d6628jnha
Unknown message type: unified_consciousness_update
📦 Processed batch of 1 messages for client client_1753580342802_d6628jnha
Processing event consciousness:heartbeat directly