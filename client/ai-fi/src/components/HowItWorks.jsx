import React from 'react';
import { Users, Cpu, Zap, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-white mb-4">Luxury Ops OS</h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        AI handles the work; strategists keep it aligned. One HQ for scheduling, outreach, follow-ups, and reporting.
                    </p>
                </div>

                {/* The Process */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="p-8 border border-white/10 bg-white/5 text-center space-y-4 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/30">
                        <div className="w-16 h-16 bg-gold rounded-full mx-auto flex items-center justify-center text-black">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-serif text-white">1. Meet Your Team</h3>
                        <p className="text-white/70">
                            Start with a free call with a strategist. We map your outcomes, stack rank priorities, and set constraints.
                        </p>
                    </div>

                    <div className="p-8 border border-white/10 bg-white/5 text-center space-y-4 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/30">
                        <div className="w-16 h-16 bg-gold rounded-full mx-auto flex items-center justify-center text-black">
                            <Cpu size={32} />
                        </div>
                        <h3 className="text-2xl font-serif text-white">2. AI Starts Working</h3>
                        <p className="text-white/70">
                            15+ automation playbooks go live: scheduling, messaging, monitoring, and creation run 24/7 with guardrails.
                        </p>
                    </div>

                    <div className="p-8 border border-white/10 bg-white/5 text-center space-y-4 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/30">
                        <div className="w-16 h-16 bg-gold rounded-full mx-auto flex items-center justify-center text-black">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-2xl font-serif text-white">3. Approve & Scale</h3>
                        <p className="text-white/70">
                            One-click approvals in HQ. The AI learns from every signal; strategists review weekly to keep results on track.
                        </p>
                    </div>
                </div>

                {/* What the AI Does */}
                <div className="mb-20">
                    <h2 className="text-3xl font-serif text-center text-white mb-12">What Our AI Engines Do</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            'Generate on-brand campaigns and content daily',
                            'Track competitors and market signals in real-time',
                            'Run outreach and messaging with approvals',
                            'Monitor reputation 24/7 and route reviews',
                            'Predict risks/opportunities before they hit revenue',
                            'Optimize spend and messaging based on performance',
                            'Automate reporting, briefings, and executive updates',
                            'Learn your brand voice and keep consistency everywhere'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3 p-4 border border-white/10 bg-white/5">
                                <CheckCircle size={20} className="text-gold mt-1 flex-shrink-0" />
                                <span className="text-white/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outcomes + Human Touch */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/30">
                        <h2 className="text-2xl font-serif text-white mb-2">Outcomes We Deliver</h2>
                        <ul className="space-y-3 text-white/80 text-sm leading-relaxed">
                            <li>• 24/7 concierge that books, confirms, and fills gaps</li>
                            <li>• Adaptive reminders + deposits to slash no-shows</li>
                            <li>• Live queue orchestration for walk-ins + appointments</li>
                            <li>• Upsell and retail flows that learn from accept/decline</li>
                            <li>• Owner KPIs via SMS: utilization, no-show %, rebook %, avg ticket</li>
                        </ul>
                    </div>
                    <div className="p-12 border border-gold/30 bg-gold/5 text-center space-y-6 rounded-2xl backdrop-blur-lg shadow-lg shadow-gold/30">
                        <h2 className="text-3xl font-serif text-white">The Human Touch</h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            AI handles execution; humans keep it aligned. Weekly check-ins, strategic resets, and direct access to senior operators who know your industry.
                        </p>
                        <a href="/consultation" className="inline-block px-8 py-4 bg-gradient-to-r from-gold to-white text-black hover:from-white hover:to-gold transition-all font-bold rounded-full shadow-lg shadow-gold/30">
                            Talk to a Strategist
                        </a>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <a href="/onboard" className="inline-block px-12 py-5 border-2 border-white text-white hover:bg-white hover:text-black transition-all text-lg font-bold rounded-full shadow-lg shadow-black/30">
                        Begin Concierge Onboarding
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
