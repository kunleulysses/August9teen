const { ElevenLabsClient } = require('elevenlabs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ElevenLabsService {
    constructor() {
        this.apiKey = process.env.ELEVENLABS_API_KEY;
        if (!this.apiKey) {
            console.warn('ELEVENLABS_API_KEY is not set. Voice features will be disabled.');
        }
        this.client = new ElevenLabsClient({ apiKey: this.apiKey });
        this.voiceId = 'JBFqnCBsd6RMkjVDRZzb'; // Default voice (e.g., "Josh")
        this.modelId = 'eleven_multilingual_v2';
    }

    async generateSpeech(text, outputPath) {
        if (!this.apiKey) return null;
        try {
            const response = await this.client.textToSpeech.convert(this.voiceId, {
                text,
                model_id: this.modelId,
                output_format: 'mp3_44100_128',
            });

            // Handle different response types (Stream or Buffer)
            if (response && typeof response.pipe === 'function') {
                const writeStream = fs.createWriteStream(outputPath);
                response.pipe(writeStream);
                return new Promise((resolve, reject) => {
                    writeStream.on('finish', () => resolve(outputPath));
                    writeStream.on('error', reject);
                });
            } else if (Buffer.isBuffer(response)) {
                await fs.promises.writeFile(outputPath, response);
                return outputPath;
            } else if (response && typeof response.getReader === 'function') {
                // Web ReadableStream
                const fileStream = fs.createWriteStream(outputPath);
                const reader = response.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    fileStream.write(value);
                }
                fileStream.end();
                await new Promise((resolve, reject) => {
                    fileStream.on('finish', resolve);
                    fileStream.on('error', reject);
                });
                return outputPath;
            } else {
                // Fallback: async iterable stream or unknown stream type
                if (response && response[Symbol.asyncIterator]) {
                    const writeStream = fs.createWriteStream(outputPath);
                    for await (const chunk of response) {
                        writeStream.write(chunk);
                    }
                    writeStream.end();
                    await new Promise((resolve, reject) => {
                        writeStream.on('finish', resolve);
                        writeStream.on('error', reject);
                    });
                    return outputPath;
                }

                throw new Error('Unknown response format from ElevenLabs SDK');
            }
        } catch (error) {
            console.error('Error generating speech:', error);
            throw error;
        }
    }

    async transcribeAudio(filePath) {
        if (!this.apiKey) return null;
        try {
            // Note: The SDK might not fully support STT yet or it might be under a different namespace.
            // If client.speechToText is not available, we might need to use raw fetch.
            // Checking documentation or assuming 'speechToText' exists based on 'textToSpeech'.
            // If not, we will fallback to fetch.

            if (this.client.speechToText) {
                const transcription = await this.client.speechToText.convert({
                    file: fs.createReadStream(filePath),
                    model_id: 'scribe_v1', // or scribe_v1_base
                });
                return transcription.text;
            } else {
                // Fallback to direct API call if SDK is outdated
                const FormData = require('form-data');
                const axios = require('axios'); // Ensure axios is available or use fetch

                const form = new FormData();
                form.append('file', fs.createReadStream(filePath));
                form.append('model_id', 'scribe_v1');

                const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', form, {
                    headers: {
                        ...form.getHeaders(),
                        'xi-api-key': this.apiKey,
                    },
                });
                return response.data.text;
            }
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
}

module.exports = new ElevenLabsService();
