import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const questions = [
    { id: 'name', text: "Welcome! What's the name of your business?" },
    { id: 'mission', text: "Great! In simple terms, what does your business do?" },
    { id: 'industry', text: "And what industry are you in? (e.g., E-commerce, Real Estate, Consulting)" },
    { id: 'email', text: "What's the best contact email?" }
];

const Concierge = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({});
    const [input, setInput] = useState('');

    const handleNext = () => {
        const currentQ = questions[step];
        const val = input || data[currentQ.id]; // Use input or selected option

        if (!val) return;

        const newData = { ...data, [currentQ.id]: val };
        setData(newData);
        setInput('');

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            onComplete(newData);
        }
    };

    const currentQ = questions[step];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-void text-white p-8">
            <div className="max-w-2xl w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-3 text-gold/50 text-sm">
                            <Sparkles size={16} />
                            <span>Step {step + 1} of {questions.length}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                            {currentQ.text}
                        </h1>

                        <div className="space-y-6">
                            {currentQ.options ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {currentQ.options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { setData({ ...data, [currentQ.id]: opt }); setInput(opt); }}
                                            className={`p-6 border ${input === opt ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'} transition-all text-left`}
                                        >
                                            <span className="text-lg tracking-wide">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    autoFocus
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    className="w-full bg-transparent border-b border-white/20 py-4 text-2xl focus:outline-none focus:border-gold transition-colors placeholder-white/10"
                                    placeholder="Type your answer..."
                                />
                            )}

                            <button
                                onClick={handleNext}
                                disabled={!input && !data[currentQ.id]}
                                className="group flex items-center space-x-3 text-gold hover:text-white transition-colors disabled:opacity-50"
                            >
                                <span className="uppercase tracking-widest text-sm">Proceed</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Concierge;
