
import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(['Welcome to Featherweight Chat!']);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<W3CWebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Determine WebSocket URL based on environment
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.hostname;
    const wsPort = window.location.hostname === 'localhost' ? ':3002' : ':5005';
    const wsUrl = `${wsProtocol}//${wsHost}${wsPort}`;
    
    try {
      const wsClient = new W3CWebSocket(wsUrl);
      setClient(wsClient);

      wsClient.onopen = () => {
        setIsConnected(true);
        setMessages(prev => [...prev, 'WebSocket Client Connected']);
      };

      wsClient.onmessage = (message) => {
        setMessages(prev => [...prev, message.data as string]);
      };

      wsClient.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setMessages(prev => [...prev, `WebSocket connection failed. Chat functionality may be limited.`]);
        setIsConnected(false);
      };

      wsClient.onclose = () => {
        setMessages(prev => [...prev, 'WebSocket Client Disconnected']);
        setIsConnected(false);
      };

      return () => {
        if (wsClient.readyState === W3CWebSocket.OPEN) {
          wsClient.close();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setMessages(prev => [...prev, 'Failed to establish WebSocket connection. Using offline mode.']);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      if (client && client.readyState === W3CWebSocket.OPEN) {
        client.send(input);
      } else {
        setMessages(prev => [...prev, `You: ${input}`, 'Bot: Connection unavailable. Please try again later.']);
      }
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold">Featherweight Chat</h1>
        <div className="text-sm opacity-90">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg max-w-md ${
              msg.startsWith('You:') 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : msg.startsWith('Bot:') || msg.startsWith('WebSocket')
                ? 'bg-muted text-muted-foreground'
                : 'bg-card text-card-foreground'
            }`}
          >
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t bg-card p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
