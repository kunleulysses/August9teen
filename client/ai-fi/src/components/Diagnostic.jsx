import React, { useState } from 'react';
import api from '../utils/api';

const formatImpact = (impact) => {
    if (!impact) return '';
    return impact.charAt(0).toUpperCase() + impact.slice(1);
};

const Diagnostic = () => {
    const [form, setForm] = useState({ url: '', email: '', businessType: '' });
    const [status, setStatus] = useState({ loading: false, error: null, result: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, result: null });
        try {
            const result = await api.runDiagnostic(form);
            setStatus({ loading: false, error: null, result });
        } catch (error) {
            setStatus({ loading: false, error: error.message || 'Failed to run diagnostic', result: null });
        }
    };

    const summary = status.result?.summary || {};

    // Ops Health Component
    const OpsHealth = () => {
        const [health, setHealth] = useState(null);

        React.useEffect(() => {
            fetch('/api/ai-fi/ops/health')
                .then(res => res.json())
                .then(setHealth)
                .catch(() => setHealth({ ok: false }));
        }, []);

        if (!health) return null;

        return (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/60">
                <div className={`w-2 h-2 rounded-full ${health.ok ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                <span>System: {health.ok ? 'Operational' : 'Degraded'}</span>
                {health.telemetry && (
                    <span className="hidden md:inline border-l border-white/10 pl-2 ml-2">
                        Scans: {health.telemetry.scans?.total || 0}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-10 relative">
            <OpsHealth />
            <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-[11px] uppercase tracking-[0.25em]">
                    Free 24-hour Site Diagnostic
                </div>
                <h1 className="text-3xl md:text-4xl font-serif text-white">Find what’s broken. Fix it fast.</h1>
                <p className="text-white/70 max-w-3xl text-base">
                    We scan your site, find critical issues, and show you how to fix them. No sales call. Clear report in under 24 hours.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 p-6 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30">
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Website URL</label>
                        <input
                            type="url"
                            name="url"
                            required
                            value={form.url}
                            onChange={handleChange}
                            placeholder="https://yourbusiness.com"
                            className="w-full px-3 py-2 rounded-md bg-black border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Email (send the report here)</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 rounded-md bg-black border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-white/70">Business type (optional)</label>
                        <input
                            type="text"
                            name="businessType"
                            value={form.businessType}
                            onChange={handleChange}
                            placeholder="e.g., clinic, retail, services"
                            className="w-full px-3 py-2 rounded-md bg-black border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status.loading}
                        className="px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-60"
                    >
                        {status.loading ? 'Scanning...' : 'Run my diagnostic'}
                    </button>
                    {status.error && <p className="text-rose-300 text-sm">{status.error}</p>}
                    {!status.result && !status.loading && (
                        <p className="text-white/60 text-sm">You’ll get a top-5 issues report in under 24 hours.</p>
                    )}
                </form>

                <div className="space-y-4 p-6 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30">
                    <h3 className="text-lg font-semibold text-white">What we check</h3>
                    <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                        <li>Forms and CTAs: are they working, obvious, and above the fold?</li>
                        <li>Broken links/assets: dead ends and missing files.</li>
                        <li>Performance basics: slow pages and friction.</li>
                        <li>UX clarity: clear next steps and trust cues.</li>
                    </ul>
                    <div className="pt-3 border-t border-white/10">
                        <h4 className="text-sm uppercase tracking-[0.2em] text-white/60">Pricing</h4>
                        <ul className="text-sm text-white/80 space-y-1 pt-2">
                            <li>Diagnostic: Free</li>
                            <li>Quick Wins: $1,500–$3,000</li>
                            <li>Strategic: $8,000–$15,000</li>
                            <li>Ongoing: $500–$2,000/mo</li>
                        </ul>
                    </div>
                </div>
            </div>

            {status.result && (
                <div className="space-y-6">
                    {/* Visual Proof Section */}
                    <div className="p-6 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-serif text-white">Visual Proof: The "After" State</h3>
                            <span className="px-2 py-1 text-[10px] uppercase tracking-widest bg-gold/20 text-gold rounded-full">AI Generated Preview</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="text-xs uppercase tracking-widest text-white/60">Current Site (Detected)</div>
                                <div className="aspect-video bg-black/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative group">
                                    <img src={`https://image.thum.io/get/width/600/crop/800/${form.url}`} alt="Current Site" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="px-3 py-1 bg-black/80 text-white text-xs rounded">Live Preview</span>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm">We detected low-res assets and weak CTA placement.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs uppercase tracking-widest text-gold/80">AI-Fi Optimized (Hallucination)</div>
                                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gold/30 flex items-center justify-center relative overflow-hidden">
                                    {/* Placeholder for AI generated image */}
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                                    <div className="relative z-10 text-center space-y-2 p-4">
                                        <div className="text-white font-serif text-lg">Premium Hero Section</div>
                                        <button className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded">Book Now</button>
                                    </div>
                                </div>
                                <p className="text-gold/80 text-sm">High-conversion layout with clear CTA and premium imagery.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-xl font-semibold text-white">Your report</h3>
                            <div className="text-sm text-white/70">
                                Critical: {summary.critical || 0} | Major: {summary.major || 0} | Minor: {summary.minor || 0}
                            </div>
                        </div>
                        <div className="grid gap-3 mt-4">
                            {status.result.issues.slice(0, 5).map((issue) => (
                                <div key={issue.id} className="p-4 rounded-lg border border-white/10 bg-black/40">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-white font-semibold">{issue.title}</div>
                                        <span className="text-[11px] uppercase tracking-[0.15em] text-white/60">{issue.severity}</span>
                                    </div>
                                    <div className="text-white/70 text-sm mt-1">{issue.whyItMatters}</div>
                                    <div className="text-white/80 text-sm mt-2"><span className="text-white/60">Impact:</span> {formatImpact(issue.impact)}</div>
                                    <div className="text-white/80 text-sm mt-1"><span className="text-white/60">Recommended fix:</span> {issue.recommendedFix}</div>
                                </div>
                            ))}
                        </div>
                        {status.result.suggestedVariants?.length ? (
                            <div className="pt-3 border-t border-white/10 space-y-2 mt-4">
                                <h4 className="text-white font-semibold">Suggested quick wins</h4>
                                <ul className="list-disc list-inside text-white/80 text-sm space-y-1">
                                    {status.result.suggestedVariants.map((v) => (
                                        <li key={v.id}>{v.title} — {v.description}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 text-sm mt-4">
                            <a href="#quick-wins" className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition">Fix now (Quick Wins)</a>
                            <a href="#strategic" className="px-4 py-2 rounded-md border border-white/20 text-white hover:border-white transition">Plan deeper improvements</a>
                            <a href="#ongoing" className="px-4 py-2 rounded-md border border-white/20 text-white hover:border-white transition">Keep monitoring</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Diagnostic;
