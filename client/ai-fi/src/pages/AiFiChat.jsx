import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Zap } from 'lucide-react';

const SILENCE_THRESHOLD = 0.02; // Adjust to environment noise
const SILENCE_DURATION_MS = 1500; // Stop after 1.5s of silence
const MIN_AUDIO_BYTES = 1000; // Ignore very short toggles

export default function AiFiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const speakingRef = useRef(false);
  const activeAudioRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(
    () => () => {
      stopRecording();
      if (audioContextRef.current) audioContextRef.current.close();
    },
    []
  );

  const setSpeaking = (val) => {
    speakingRef.current = val;
    setIsSpeaking(val);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    try {
      const res = await fetch('/api/ai-fi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const body = await res.json();
      const reply = typeof body.response === 'string' ? body.response : JSON.stringify(body.response, null, 2);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      const msg = err?.message || 'Request failed';
      setError(msg);
      setMessages((prev) => [...prev, { role: 'ai', text: `❌ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        if (audioContext.state !== 'closed') audioContext.close();

        if (audioBlob.size > MIN_AUDIO_BYTES) {
          await sendAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSpeaking(false);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudio = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const x = (dataArray[i] - 128) / 128.0;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / bufferLength);

        if (rms > SILENCE_THRESHOLD) {
          setSpeaking(true);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        } else if (speakingRef.current && !silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            stopRecording();
          }, SILENCE_DURATION_MS);
        }
        requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone.');
      setIsHandsFree(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setSpeaking(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  };

  const sendAudio = async (audioBlob) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const res = await fetch('/api/consciousness/voice', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const body = await res.json();

      if (body.response) {
        setMessages((prev) => [...prev, { role: 'user', text: '🎤 (Voice Message)' }]);
        setMessages((prev) => [...prev, { role: 'ai', text: body.response, audio: body.audio }]);

        const autoplay = async () => {
          if (!body.audio) {
            if (isHandsFree) setTimeout(() => startRecording(), 800);
            return;
          }
          const audio = new Audio(body.audio);
          activeAudioRef.current = audio;
          audio.onended = () => {
            activeAudioRef.current = null;
            if (isHandsFree) {
              setTimeout(() => startRecording(), 500);
            }
          };
          audio.onerror = () => {
            activeAudioRef.current = null;
            if (isHandsFree) setTimeout(() => startRecording(), 800);
          };
          try {
            await audio.play();
          } catch (e) {
            console.error('Auto-play failed:', e);
            if (isHandsFree) setTimeout(() => startRecording(), 800);
          }
        };
        autoplay();
      }
    } catch (err) {
      const msg = err?.message || 'Voice request failed';
      setError(msg);
      setMessages((prev) => [...prev, { role: 'ai', text: `❌ ${msg}` }]);
      setIsHandsFree(false);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleHandsFree = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (isHandsFree) {
      setIsHandsFree(false);
      stopRecording();
    } else {
      setIsHandsFree(true);
      startRecording();
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{ fontFamily: '"Inter", "Soehne", system-ui, -apple-system, sans-serif' }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-48 -left-28 h-[26rem] w-[26rem] rounded-full bg-white/6 blur-3xl" />
        <div className="absolute bottom-[-4rem] right-[-4rem] h-[22rem] w-[22rem] rounded-full bg-emerald-400/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.03),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.04),transparent_28%)]" />
      </div>
      <div className="max-w-4xl mx-auto px-5 py-10 relative space-y-6">
        <header className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">AI-Fi • Core Link</div>
          <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight">You’re talking to the operating system itself.</h1>
          <p className="text-white/60 text-sm md:text-base max-w-3xl leading-relaxed">
            No marketing layer. Every prompt touches the core. Ask it what it is, how it thinks, and have it act. Let curiosity drive.
          </p>
        </header>

        <div className="flex flex-col h-[75vh] min-h-[520px] rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_24px_70px_-50px_rgba(0,0,0,0.9)] backdrop-blur-sm overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <div className="text-sm text-white/80">Live chat · direct AI-Fi link</div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/50">
              <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
              {loading ? 'Processing' : isRecording ? (isSpeaking ? 'Listening…' : 'Waiting…') : 'Ready'}
            </div>
          </div>
          <main
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {messages.length === 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-black/40">
                <div className="text-sm text-white/80">
                  This is the control room. Ask it to reveal itself, describe its model of your business, or take an action. You’re speaking to
                  the codebase that will operate your systems.
                </div>
              </div>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-xl px-4 py-3 border transition-transform duration-150 ${
                  m.role === 'user' ? 'bg-black/60 border-white/10' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                }`}
              >
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-1 flex justify-between">
                  <span>{m.role === 'user' ? 'You' : 'AI-Fi'}</span>
                  {m.audio && (
                    <button onClick={() => new Audio(m.audio).play()} className="text-emerald-400 hover:text-emerald-300" title="Replay Audio">
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</div>
              </div>
            ))}
          </main>
          <footer className="border-t border-white/10 px-5 py-4">
            <div className="space-y-2">
              <textarea
                className="w-full bg-black/70 border border-white/10 rounded-lg px-3 py-2 text-base leading-relaxed text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-0 focus:ring-offset-black transition"
                rows={3}
                placeholder="Ask it to think, to explain itself, or to act… (Enter to send, Shift+Enter for newline)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={loading || isRecording}
              />
              <div className="flex items-center justify-between text-xs text-white/60">
                {error ? <span className="text-rose-400">{error}</span> : <span>Direct bridge · nothing buffered</span>}
                <div className="flex gap-2">
                  <button
                    onClick={toggleHandsFree}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                      isHandsFree ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title="Hands-free Mode (Fluid Voice)"
                  >
                    <Zap size={16} className={isHandsFree ? 'fill-current' : ''} />
                    {isHandsFree ? 'Fluid On' : 'Fluid Off'}
                  </button>

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading || isHandsFree}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
                      isRecording ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    {isRecording ? 'Stop' : 'Voice'}
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-md text-sm font-semibold disabled:opacity-50 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
