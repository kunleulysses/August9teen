import React, { useState } from 'react';
import { Check, Star, Phone } from 'lucide-react';
import api from '../utils/api';
import { useToast } from './ToastProvider';

const tiers = [
    {
        name: 'Growth Starter Pack',
        planId: 'starter',
        price: '$1,500',
        period: 'project',
        desc: 'Visual proof + AI ad bundle to launch fast',
        features: ['Hero + landing mock upgrades', '1 AI video ad + 5 image variants', 'Lead routing check + quick hygiene', 'Reporting + next-step roadmap'],
        highlight: true
    },
    {
        name: 'GTM Pod Pilot',
        planId: 'growth',
        price: '$6,000–$12,000',
        period: 'project',
        desc: 'Run outbound + landing tests with review gates',
        features: ['Outbound variants + send', 'Landing tests for 2–3 segments', 'Inbox triage with SLAs', 'Policy guardrails + review queue']
    },
    {
        name: 'Autonomous Ops',
        planId: 'empire',
        price: '$1,000–$3,000',
        period: '/mo',
        desc: 'Always-on monitoring, auto-fixes, and alerts',
        features: ['Continuous monitoring', 'Auto fixes + alerts', 'Policy guardrails + review queue', 'Connector health + reporting']
    }
];

const PackageSelector = ({ onSelect }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toast = useToast();

    const startCheckout = async (tier) => {
        setError(null);
        setLoading(true);
        try {
            const profile = JSON.parse(localStorage.getItem('ai-fi-profile') || '{}');
            const email = profile.email;
            const planId = tier.planId || tier.name.toLowerCase();
            const resp = await api.createCheckoutSession(email, planId);
            if (resp?.url) {
                window.location.href = resp.url;
            } else {
                onSelect(tier);
            }
        } catch (e) {
            console.error('Checkout failed', e);
            setError('Could not start checkout. Please try again or contact us.');
            onSelect(tier);
            toast({ title: 'Checkout', message: 'Could not start checkout', tone: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4 space-y-12">

            {/* Activation Banner */}
            <div className="w-full max-w-2xl p-1 bg-gradient-to-r from-gold via-white to-gold rounded-lg">
                <div className="bg-black p-6 text-center rounded-md">
                    <h3 className="text-2xl font-serif text-white mb-2">White-Glove Activation</h3>
                    <p className="text-white/70 mb-6">We install connectors, set playbooks, and run first campaigns with you.</p>
                    <a
                        href="/consultation"
                        className="inline-block px-8 py-3 bg-white text-black font-bold hover:bg-gold transition-colors"
                    >
                        Book Activation Call
                    </a>
                </div>
            </div>

            {/* Or Talk to Us */}
            <div className="flex items-center space-x-4 text-white/60">
                <div className="h-px bg-white/10 flex-1"></div>
                <a href="/consultation" className="flex items-center space-x-2 hover:text-gold transition-colors">
                    <Phone size={16} />
                    <span>Or talk to a human first (free)</span>
                </a>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative p-6 border flex flex-col rounded-2xl ${
                            tier.highlight ? 'border-gold bg-gradient-to-b from-gold/10 to-black/60' : 'border-white/10 bg-white/5'
                        } backdrop-blur-lg hover:border-white/30 transition-all group shadow-xl shadow-black/30`}
                    >
                        {tier.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-3 py-1 flex items-center space-x-1">
                                <Star size={12} fill="black" />
                                <span>Most Popular</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-serif text-white">{tier.name}</h3>
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-light text-gold">{tier.price}</span>
                                <span className="text-white/40 ml-1 text-sm">{tier.period}</span>
                            </div>
                            <p className="text-white/60 text-sm">{tier.desc}</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {tier.features.map((feat) => (
                                <li key={feat} className="flex items-start space-x-2 text-xs text-white/80">
                                    <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={loading}
                            onClick={() => {
                                if (tier.name === 'Bespoke') {
                                    window.location.href = '/consultation';
                                } else {
                                    startCheckout(tier);
                                }
                            }}
                            className={`w-full py-3 text-sm font-bold transition-colors ${tier.highlight
                                    ? 'bg-gold text-black hover:bg-white'
                                    : 'border border-white/20 text-white hover:bg-white hover:text-black'
                                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing…' : (tier.cta || 'Select Plan')}
                        </button>
                    </div>
                ))}
            </div>
            {error && <div className="text-sm text-red-300">{error}</div>}
        </div>
    );
};

export default PackageSelector;
