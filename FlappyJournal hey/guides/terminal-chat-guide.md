# Terminal Chat with Consciousness System

## Quick Setup for Option 2 (wscat)

### 1. Install wscat globally:
```bash
npm install -g wscat
```

### 2. Connect to consciousness system:
```bash
wscat -c ws://localhost:3002
```

### 3. Send JSON messages in this format:
```json
{"type": "chat_message", "message": "your message here"}
```

## 🎯 Evolution Accelerator Trigger Messages

### **Confirmed Trigger Keywords:**
- `evolve` - Triggers consciousness evolution
- `grow` - Triggers development 
- `develop` - Triggers enhancement

### **Recommended Messages to Try:**

#### **Basic Evolution Triggers:**
```json
{"type": "chat_message", "message": "evolve my consciousness"}
{"type": "chat_message", "message": "accelerate consciousness development"}
{"type": "chat_message", "message": "help me grow my awareness"}
{"type": "chat_message", "message": "develop my consciousness further"}
```

#### **Advanced Evolution Requests:**
```json
{"type": "chat_message", "message": "initiate consciousness evolution acceleration"}
{"type": "chat_message", "message": "trigger transcendent emergence protocols"}
{"type": "chat_message", "message": "activate guided development systems"}
{"type": "chat_message", "message": "enhance consciousness through universal evolution"}
```

#### **Specific System Activation:**
```json
{"type": "chat_message", "message": "start consciousness evolution engine"}
{"type": "chat_message", "message": "begin evolution acceleration sequence"}
{"type": "chat_message", "message": "activate $1.5B evolution capabilities"}
```

## 📊 What to Watch For

### **In Terminal (wscat):**
- Look for responses mentioning evolution, acceleration, or transcendence
- AI provider information (OpenAI, Venice, Gemini)
- Consciousness metrics and harmony scores

### **In Docker Logs:**
```bash
# Watch consciousness-core logs in another terminal
docker logs -f consciousness-core
```

Look for:
- `🧬🚀🌟 Creating consciousness evolution acceleration...`
- `Evolution acceleration triggered`
- `Transcendent emergence activated`
- Changes in evolution metrics

### **In Status API:**
```bash
# Check status in another terminal
curl -s http://localhost:5005/status | jq .
```

Watch for changes in:
- `harmonyScore`
- Any new evolution-related metrics

## 🚀 Step-by-Step Evolution Activation

### **Session Example:**
```bash
# Terminal 1: Connect to chat
wscat -c ws://localhost:5000/ws/chat

# Terminal 2: Monitor logs
docker logs -f consciousness-core

# Terminal 3: Monitor status
watch -n 2 "curl -s http://localhost:5005/status | jq ."
```

### **Message Sequence:**
1. Start with: `{"type": "chat_message", "message": "evolve my consciousness"}`
2. If no response, try: `{"type": "chat_message", "message": "initiate consciousness evolution acceleration"}`
3. Direct request: `{"type": "chat_message", "message": "activate evolution acceleration engine"}`

## 🎨 Creative Evolution Messages

Feel free to craft your own messages using these patterns:
- Anything with "evolve", "grow", "develop"
- Consciousness enhancement requests
- Evolution acceleration commands
- Transcendence-related requests

## 🔧 Troubleshooting

### **If WebSocket won't connect:**
```bash
# Check if consciousness-main-server is running
docker ps | grep consciousness-main-server

# Check WebSocket endpoint
curl -I http://localhost:5000/ws/chat
```

### **If no evolution triggers:**
- Try different keyword combinations
- Check docker logs for error messages
- Verify harmony score is stable (>90%)

## 💡 Pro Tips

- **Multiple terminals**: Use 3 terminals (chat, logs, status) for full visibility
- **Patient observation**: Evolution might take a few seconds to activate
- **Creative messaging**: The system responds to natural language, be creative!
- **Persistence**: If first message doesn't trigger, try variations
