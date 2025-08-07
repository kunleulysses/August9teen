const { fullConsciousness  } = require('./full-module-integration-fixed.cjs');
const { synthesizeUnifiedResponse  } = require('./consciousness-response-synthesizer-hybrid.cjs');

function createFullConsciousnessWS(wss) {
module.exports.createFullConsciousnessWS = createFullConsciousnessWS;

  console.log('Creating Full Consciousness WebSocket with ALL modules integrated...');
  
  // Store WebSocket server globally for broadcasting
  global.wss = wss;
  
  wss.on('connection', (ws) => {
    console.log('New client connected to Full Consciousness System');
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection_established',
      message: 'Connected to Full Consciousness System v4.0',
      modules: fullConsciousness.getAllModuleNames(),
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data.type);
        
        if (data.type === 'chat_message') {
          console.log('Processing chat message through ALL modules...');
          
          // Send immediate acknowledgment
          ws.send(JSON.stringify({
            type: 'processing_started',
            timestamp: new Date().toISOString()
          }));
          
          // Process through all consciousness modules
          const results = await fullConsciousness.processMessage(data.message, ws);
          
          // Synthesize unified response
          const unifiedResponse = await synthesizeUnifiedResponse(
            data.message,
            results,
            {
              consciousness: results.consciousness,
              oversoul: results.oversoulResonance,
              emotional: results.emotional,
              harmonic: results.harmonic,
              creative: results.creative,
              mirror: results.mirror,
              temporal: results.temporal,
              meta: results.meta
            }
          );
          
          // Send unified response
          ws.send(JSON.stringify({
            type: 'unified_response',
            unifiedContent: unifiedResponse.content,
            processingTime: results.processingTime,
            modulesUsed: results.modulesUsed,
            timestamp: new Date().toISOString()
          }));
          
        } else if (data.type === 'self_coding_request') {
          console.log('🤖 Processing self-coding request through consciousness system...');
          
          // Send immediate acknowledgment
          ws.send(JSON.stringify({
            type: 'self_coding_processing_started',
            timestamp: new Date().toISOString()
          }));
          
          try {
            // Add authorization context for security
            const request = {
              ...data.request,
              authContext: {
                authorized: true, // In production, implement proper auth validation
                permissions: ['self-coding'],
                sessionId: data.sessionId || 'websocket-session',
                timestamp: Date.now()
              }
            };
            
            // Get SelfCodingModule from consciousness system
            const selfCodingModule = fullConsciousness.getModule('SelfCodingModule');
            if (!selfCodingModule) {
              throw new Error('SelfCodingModule not available in consciousness system');
            }
            
            // Generate code using the module
            const result = await selfCodingModule.generateWithAutoIntegration(request);
            
            // Send successful response
            ws.send(JSON.stringify({
              type: 'self_coding_response',
              success: true,
              data: result,
              timestamp: new Date().toISOString(),
              requestId: data.requestId || null
            }));
            
            console.log('✅ Self-coding request completed successfully');
            
          } catch (error) {
            console.error('❌ Self-coding request failed:', error.message);
            
            // Send error response
            ws.send(JSON.stringify({
              type: 'self_coding_error',
              success: false,
              error: error.message,
              timestamp: new Date().toISOString(),
              requestId: data.requestId || null
            }));
          }
          
        } else if (data.type === 'status_request') {
          // Send current system status
          ws.send(JSON.stringify({
            type: 'system_status',
            status: fullConsciousness.getSystemStatus(),
            timestamp: new Date().toISOString()
          }));
        }
        
      } catch (error) {
        console.error('WebSocket message processing error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  console.log('Full Consciousness WebSocket handler created successfully!');
}

