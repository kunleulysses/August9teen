const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const elevenLabsService = require('./services/elevenLabsService.cjs');

// Minimal bridge: call the existing AI-Fi chat API to get a text reply,
// then synthesize audio. This avoids depending on the heavy consciousness web server.
async function fetchAiResponse(message) {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/ai-fi/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `HTTP ${res.status}`);
        }
        const body = await res.json();
        return (typeof body.response === 'string' && body.response) ? body.response : JSON.stringify(body.response);
    } catch (err) {
        console.error('Voice router: ai-fi chat fallback failed:', err && err.message);
        return `I heard: "${message}". I could not reach the AI engine right now.`;
    }
}

router.get('/voice/ping', (req, res) => {
    res.json({ status: 'ok', message: 'Voice router is active' });
});

router.post('/voice', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        const audioPath = req.file.path;
        console.log('🎤 Received voice input:', audioPath);

        // 1. Transcribe Audio
        const transcription = await elevenLabsService.transcribeAudio(audioPath);
        console.log('📝 Transcribed text:', transcription);

        if (!transcription || !transcription.trim()) {
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath); // Cleanup
            return res.json({ response: "I couldn't hear anything.", audio: null });
        }

        // 2. Get AI text response via the ai-fi chat API
        const responseText = await fetchAiResponse(transcription);
        const metadata = { source: 'ai-fi-chat' };

        // 3. Generate Audio Response
        const outputAudioPath = path.join(__dirname, `response_${Date.now()}.mp3`);
        await elevenLabsService.generateSpeech(responseText, outputAudioPath);

        // 4. Read Audio and Convert to Base64
        const audioBuffer = fs.readFileSync(outputAudioPath);
        const audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

        // Cleanup
        if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        if (fs.existsSync(outputAudioPath)) fs.unlinkSync(outputAudioPath);

        res.json({
            response: responseText,
            audio: audioBase64,
            metadata: metadata,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Voice API error:', error);
        // Cleanup if file exists
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Internal voice processing error' });
    }
});

module.exports = router;
