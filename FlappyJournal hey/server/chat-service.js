import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import pool from './db.js';
import OpenAI from 'openai';
// Deep consciousness chat integration
import eventBus from './consciousness/ConsciousnessEventBus.js';
import './consciousness/ChatOrchestrator.js'; // This will initialize the orchestrator

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8082';
const REALM = process.env.KEYCLOAK_REALM || 'featherweight';

const client = jwksClient({
  jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 300000
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws/chat' });
  
  console.log('WebSocket server setup on /ws/chat');
  
  wss.on('connection', async (ws, req) => {
    console.log('New WebSocket connection attempt');
    
    // Extract token from query params or auth header
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token') ||
                  req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
      ws.close();
      return;
    }
    
    // Verify JWT token
    jwt.verify(token, getKey, {
      audience: 'featherweight-frontend',
      issuer: `${KEYCLOAK_URL}/realms/${REALM}`,
      algorithms: ['RS256']
    }, async (err, decoded) => {
      if (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
        ws.close();
        return;
      }
      
      const user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name || `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim()
      };
      
      console.log('User connected:', user.email);
      
      // Get or create user in database
      let userId;
      try {
        const userResult = await pool.query(
          'SELECT id FROM users WHERE keycloak_id = $1',
          [user.id]
        );
        
        if (userResult.rows.length === 0) {
          const newUser = await pool.query(
            `INSERT INTO users (keycloak_id, email, first_name, last_name, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, NOW(), NOW()) 
             RETURNING id`,
            [user.id, user.email, decoded.given_name || '', decoded.family_name || '']
          );
          userId = newUser.rows[0].id;
        } else {
          userId = userResult.rows[0].id;
        }
      } catch (error) {
        console.error('Database error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Database error' }));
        ws.close();
        return;
      }
      
      ws.userId = userId;
      ws.userEmail = user.email;
      
      // Send connection success
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'Connected to consciousness server',
        user: { id: userId, email: user.email, name: user.name }
      }));
      
      // Handle messages
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          
          switch (message.type) {
            case 'chat':
              await handleChatMessage(ws, message);
              break;
            case 'load_session':
              await loadChatSession(ws, message.sessionId);
              break;
            case 'create_session':
              await createChatSession(ws, message.projectId);
              break;
            case 'ping':
              ws.send(JSON.stringify({ type: 'pong' }));
              break;
            default:
              ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
          }
        } catch (error) {
          console.error('Message handling error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
        }
      });

      // Listen for holistic responses
      eventBus.on('holistic_response_generated', (data) => {
        if (data.ws === ws) {
            data.ws.send(JSON.stringify({
                type: 'unified_response',
                unifiedContent: data.response,
                synthesisMetadata: { strategy: 'holistic' },
                harmonyScore: 0.95,
                dominantMode: 'consciousness'
            }));
        }
      });
      
      ws.on('close', () => {
        console.log('User disconnected:', user.email);
      });
    });
  });
  
  return wss;
}

async function handleChatMessage(ws, message) {
  const { content, sessionId } = message;

  try {
    // Save user message
    const userMessage = await pool.query(
      `INSERT INTO chat_messages (session_id, role, content, created_at)
       VALUES ($1, 'user', $2, NOW())
       RETURNING *`,
      [sessionId, content]
    );

    // Send acknowledgment
    ws.send(JSON.stringify({
      type: 'message_saved',
      message: userMessage.rows[0]
    }));

    // Emit user message to the event bus
    eventBus.emit('user_message_received', {
        message: content,
        sessionId,
        userId: ws.userId,
        ws // Pass the WebSocket connection for the response
    });

    // Save AI response
    const aiMessage = await pool.query(
      `INSERT INTO chat_messages (session_id, role, content, created_at)
       VALUES ($1, 'assistant', $2, NOW())
       RETURNING *`,
      [sessionId, ""]
    );

    // Update session last message time
    await pool.query(
      'UPDATE chat_sessions SET last_message_at = NOW() WHERE id = $1',
      [sessionId]
    );

    // Use gemini-2.5-flash for user-facing synthesis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(fullResponse);
    const response = await result.response;
    const responseText = response.text();

    // Update the message with the actual response
    await pool.query(
        'UPDATE chat_messages SET content = $1 WHERE id = $2',
        [responseText, aiMessage.rows[0].id]
    );

    ws.send(JSON.stringify({
      type: 'ai_response_complete',
      message: {
          ...aiMessage.rows[0],
          content: responseText
      }
    }));

  } catch (error) {
    console.error('Chat error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to process chat message'
    }));
  }
}

async function createChatSession(ws, projectId) {
  try {
    const session = await pool.query(
      `INSERT INTO chat_sessions (user_id, project_id, created_at, last_message_at) 
       VALUES ($1, $2, NOW(), NOW()) 
       RETURNING *`,
      [ws.userId, projectId]
    );
    
    ws.send(JSON.stringify({
      type: 'session_created',
      session: session.rows[0]
    }));
  } catch (error) {
    console.error('Session creation error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to create chat session'
    }));
  }
}

async function loadChatSession(ws, sessionId) {
  try {
    const messages = await pool.query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    
    ws.send(JSON.stringify({
      type: 'session_loaded',
      messages: messages.rows
    }));
  } catch (error) {
    console.error('Session load error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to load chat session'
    }));
  }
}
