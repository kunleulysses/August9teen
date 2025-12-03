import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Command, Clock } from 'lucide-react';
import api from '../utils/api';

const ChiefOfStaff = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Good morning. I have reviewed the overnight metrics. How can I assist you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        const userInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // Call system orchestration endpoint
            const response = await api.sendChatMessage(userInput);

            let aiText = 'I can help with that. Let me analyze the data.';
            let action = null;

            if (response?.orchestration) {
                aiText = response.orchestration.recommendation || response.orchestration.analysis || aiText;
            } else if (response?.result) {
                aiText = typeof response.result === 'string' ? response.result : JSON.stringify(response.result);
            }

            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: aiText.substring(0, 300), // Limit response length
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'I apologize, I encountered an issue processing your request. Please try again.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col border border-white/10 bg-black/30">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                            <Bot className="text-gold" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-serif">Chief of Staff</h3>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Online · Access Level: OMNI
                            </div>
                        </div>
                    </div>
                    <button className="text-xs text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> History
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-white/10' : 'bg-gold/10 border border-gold/30'}`}>
                                {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-gold" />}
                            </div>
                            <div className={`max-w-[70%] space-y-2 ${msg.sender === 'user' ? 'items-end flex flex-col' : ''}`}>
                                <div className={`p-4 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white/90'}`}>
                                    {msg.text}
                                </div>
                                {msg.action && (
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-colors rounded">
                                        <Sparkles size={14} />
                                        {msg.action.label}
                                    </button>
                                )}
                                <span className="text-[10px] text-white/30 block">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                                <Bot size={14} className="text-gold" />
                            </div>
                            <div className="flex items-center gap-1 h-8">
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me to analyze data, draft content, or execute a strategy..."
                            className="w-full bg-black/50 border border-white/10 p-4 pr-12 text-white focus:border-gold focus:outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-2 top-2 p-2 text-gold hover:bg-gold/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Context / Memory Sidebar */}
            <div className="w-80 hidden xl:flex flex-col gap-6">
                <div className="p-6 border border-white/10 bg-black/30 flex-1">
                    <h4 className="text-gold font-serif mb-4 flex items-center gap-2">
                        <Command size={16} /> Active Context
                    </h4>
                    <div className="space-y-4">
                        <div className="p-3 bg-white/5 border border-white/10">
                            <div className="text-xs text-white/40 uppercase mb-1">Current Focus</div>
                            <div className="text-sm text-white">Churn Reduction & Retention</div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10">
                            <div className="text-xs text-white/40 uppercase mb-1">Active Memory</div>
                            <div className="text-sm text-white">Recalled Q3 Performance Report and Competitor A Pricing Update.</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border border-white/10 bg-black/30 h-1/3">
                    <h4 className="text-gold font-serif mb-4 flex items-center gap-2">
                        <Sparkles size={16} /> Suggested Actions
                    </h4>
                    <div className="space-y-2">
                        <button className="w-full text-left p-2 text-xs text-white/60 hover:text-gold hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gold pl-3">
                            Draft email to high-value users
                        </button>
                        <button className="w-full text-left p-2 text-xs text-white/60 hover:text-gold hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gold pl-3">
                            Analyze support ticket trends
                        </button>
                        <button className="w-full text-left p-2 text-xs text-white/60 hover:text-gold hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gold pl-3">
                            Schedule strategy review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChiefOfStaff;
