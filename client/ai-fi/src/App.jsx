import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Concierge from './components/Concierge';
import Mirror from './components/Mirror';
import PackageSelector from './components/PackageSelector';
import IntegrationHub from './components/IntegrationHub';
import Atrium from './components/Atrium';
import BookConsultation from './components/BookConsultation';
import Profile from './components/Profile';
import HowItWorks from './components/HowItWorks';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Diagnostic from './components/Diagnostic';
import AiFiChat from './pages/AiFiChat';
import api from './utils/api';
import Shell from './components/Shell';
import { ToastProvider } from './components/ToastProvider';
import GlobalStyles from './components/GlobalStyles';

const Lobby = () => {
    const testimonials = [
        {
            name: 'Lena Ortiz',
            role: 'VP Growth, DevTools',
            sector: 'B2B SaaS',
            services: ['Outbound GTM pod', 'Landing fixes', 'Pipeline reporting'],
            quote: 'We plugged AI-Fi into our site and inbox. It found breakage, shipped fixes, and booked meetings the same week.',
            impact: '28% lift in qualified meetings; zero engineering tickets.',
            tags: ['Outbound', 'Conversion', 'Automation'],
        },
        {
            name: 'Samir Patel',
            role: 'Head of Sales Engineering, Security SaaS',
            sector: 'Security',
            services: ['Form/inbox triage', 'Drift detection', 'Policy guardrails'],
            quote: 'Leads were dying in forms and emails. AI-Fi caught the failures, rerouted leads, and escalated anomalies automatically.',
            impact: 'Lead leakage eliminated; SLA response under 5 minutes.',
            tags: ['Routing', 'Reliability', 'Compliance'],
        },
        {
            name: 'Ava Kim',
            role: 'COO, Data Platform',
            sector: 'Data Infra',
            services: ['Site QA', 'Outbound variants', 'Ops automation'],
            quote: 'We skipped the sales call. The diagnostic had the top 5 issues with fixes. The pod shipped Quick Wins and kept watching.',
            impact: 'Hero-to-meeting conversion up 19% in 30 days.',
            tags: ['Conversion', 'Autonomy', 'Ops'],
        },
    ];

    const steps = [
        { title: 'Drop your site + email', copy: 'Enter your URL and email. No sales call required.', detail: 'We only scan public pages and respect robots.txt.' },
        { title: 'We scan in <24 hours', copy: 'AI-Fi fuses with your site to crawl key pages, forms, and CTAs.', detail: 'Checks routing, broken assets, performance, and clarity.' },
        { title: 'You get a top-5 report', copy: 'Ranked by revenue risk with fixes and variants.', detail: 'Clear why-it-matters and what to ship first.' },
        { title: 'Turn on the pod', copy: 'Approve Quick Wins or activate the GTM pod.', detail: 'Outbound, landing fixes, and routing run with guardrails.' },
    ];

    const tiers = [
        { name: 'Diagnostic', price: 'Free', bullets: ['Top 5 issues', 'Severity + impact', 'Fix recommendations'], cta: 'Run my diagnostic', href: '/diagnostic' },
        { name: 'Quick Wins', price: '$1.5k–$3k', bullets: ['Fix forms/links/CTAs', 'Lead routing hygiene', 'Perf + asset cleanup'], cta: 'Book Quick Wins', href: '/consultation' },
        { name: 'GTM Pod Pilot', price: '$6k–$12k', bullets: ['Outbound variants + send', 'Landing tests', 'Inbox triage + SLAs'], cta: 'Start pilot', href: '/consultation' },
        { name: 'Autonomous Ops', price: '$1k–$3k/mo', bullets: ['Continuous monitoring', 'Auto fixes + alerts', 'Policy guardrails + review queue'], cta: 'Set up monitoring', href: '/consultation' },
    ];

    const commonIssues = [
        'Forms that fail silently or route to dead inboxes',
        'Broken links, docs, or assets that erode trust',
        'Hero with no singular CTA for the buyer',
        'Slow hero load or oversized media on key pages',
        'No clear next step for mid-market buyers',
    ];

    const afterFixes = [
        'Buyers see a clear CTA immediately',
        'Forms submit, confirm, and route reliably',
        'Dead links/docs/assets removed',
        'Faster first paint on revenue pages',
        'Leads routed to the right inbox every time with SLAs',
    ];

    return (
        <div className="bg-black text-white">
            <section className="min-h-screen flex flex-col justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.08), transparent 30%), radial-gradient(circle at 75% 10%, rgba(255,255,255,0.05), transparent 25%)' }} />
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-[11px] uppercase tracking-[0.25em]">
                            Autonomous GTM Pod for B2B SaaS
                        </div>
                        <motion.h1
                            className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Your site runs itself. Pipeline keeps moving.
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.1 }}
                        >
                            AI-Fi fuses with your site and inbox to find revenue leaks, ship fixes, and keep outbound moving—no sales call required.
                        </motion.p>
                        <div className="flex flex-col md:flex-row gap-3">
                            <a href="/diagnostic" className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all text-base font-semibold rounded-md">
                                Run my diagnostic
                            </a>
                            <a href="#pricing" className="px-8 py-3 border border-white/30 text-white hover:bg-white/10 transition-all text-base rounded-md">
                                View pricing tiers
                            </a>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3 pt-2">
                            {[
                                ['Report in under 24h', 'Top 5 issues ranked by revenue risk'],
                                ['No sales calls', 'Email + link when ready'],
                                ['Autonomous fixes', 'Quick Wins + GTM pod on approval'],
                            ].map(([title, copy]) => (
                                <div key={title} className="p-3 rounded-lg border border-white/10 bg-white/5 text-left">
                                    <div className="text-white text-xs uppercase tracking-[0.2em] mb-1">{title}</div>
                                    <div className="text-sm text-white/70 leading-relaxed">{copy}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 space-y-4">
                        <div className="text-sm uppercase tracking-[0.2em] text-white/60">Sample report snapshot</div>
                        <div className="space-y-3">
                            {[
                                { title: 'Checkout form fails silently', severity: 'critical', impact: 'high', fix: 'Validate and confirm submissions; add fallback email capture.' },
                                { title: 'Hero has no primary CTA above the fold', severity: 'major', impact: 'high', fix: 'Add a single button with a direct action label.' },
                                { title: 'Broken asset on pricing page', severity: 'major', impact: 'medium', fix: 'Replace the missing image and remove the dead link.' },
                            ].map((item) => (
                                <div key={item.title} className="p-3 rounded-lg border border-white/10 bg-black/50">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-white font-semibold">{item.title}</div>
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">{item.severity}</span>
                                    </div>
                                    <div className="text-white/70 text-sm mt-1">Impact: {item.impact}</div>
                                    <div className="text-white/80 text-sm mt-1"><span className="text-white/60">Fix:</span> {item.fix}</div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-white/10 text-sm text-white/70">
                            You also get: issue counts by severity, why-it-matters, and optional quick-win variants to test.
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Proof + Offers */}
            <section className="border-t border-white/10 bg-gradient-to-b from-black via-black/80 to-black p-6 md:p-10">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 mb-2">Visual-first GTM</div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white">Show what’s possible, then ship it.</h2>
                            <p className="text-white/70 max-w-3xl mt-2">We win trust with visuals first, then run the pod. Start free, approve the starter pack, and scale into the GTM pod.</p>
                        </div>
                        <div className="flex gap-3">
                            <a href="/diagnostic" className="px-5 py-3 bg-white text-black font-semibold rounded-md hover:bg-gold transition-colors">Run diagnostic</a>
                            <a href="/consultation" className="px-5 py-3 border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors">Talk to a strategist</a>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                title: 'Visual Proof Diagnostic',
                                badge: 'Free',
                                body: 'Hero “what you’re missing” mock + top-5 issues ranked by revenue risk.',
                                points: ['Hero + CTA redesign preview', 'Routing/latency/asset sanity check', 'Delivery in <24h, no call needed'],
                                cta: { label: 'Get the report', href: '/diagnostic' }
                            },
                            {
                                title: 'Care Package Pilot',
                                badge: 'Free ad',
                                body: 'First 10 clients get the tech report + 1 free AI video ad to prove lift.',
                                points: ['We deliver the ad + report', 'You see lift before spending', 'Scoped to one core page/offer'],
                                cta: { label: 'Claim a slot', href: '/consultation' }
                            },
                            {
                                title: 'Growth Starter Pack',
                                badge: '$1,500',
                                body: 'Hero upgrade + 1 AI video ad + image variants + routing hygiene.',
                                points: ['Production-ready assets', 'A/B-ready variants', 'Next-step roadmap to the GTM pod'],
                                cta: { label: 'Start the pack', href: '/consultation' }
                            }
                        ].map((item) => (
                            <div key={item.title} className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-serif text-white">{item.title}</h3>
                                    <span className="px-2 py-1 text-[11px] uppercase tracking-[0.2em] rounded-full bg-white/10 text-white/80">{item.badge}</span>
                                </div>
                                <p className="text-white/70 text-sm">{item.body}</p>
                                <ul className="text-sm text-white/80 space-y-1">
                                    {item.points.map((p) => (
                                        <li key={p} className="flex items-start gap-2">
                                            <span className="text-white/50">•</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href={item.cta.href} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-white/20 hover:border-white text-sm font-semibold bg-white/5 hover:bg-white/10">
                                    {item.cta.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shop Window Demos */}
            <section className="border-t border-white/10 bg-black p-6 md:p-10" id="demos">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 mb-2">Shop Window</div>
                            <h2 className="text-3xl md:text-4xl font-serif text-white">What we ship for your peers.</h2>
                            <p className="text-white/70 max-w-3xl">Verticalized before/after hero + UGC ad per segment. Pick yours and we’ll run the same play.</p>
                        </div>
                        <a href="/diagnostic" className="px-5 py-3 bg-white text-black font-semibold rounded-md hover:bg-gold transition-colors">Start my diagnostic</a>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { seg: 'HVAC Service', before: 'Generic template, no clear CTA', after: 'Emergency repair CTA + trust badges', lift: '+5 leads/week', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.alpinehvacla.com', afterImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', ugc: null },
                            { seg: 'Physical Therapy', before: 'Wall of text, hard to book', after: 'Book Eval button + condition icons', lift: '+15% bookings', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.lasportsandspine.com', afterImg: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', ugc: null },
                            { seg: 'Chiropractic', before: 'Outdated design, no mobile', after: 'Mobile-first + new patient offer', lift: '2x mobile conv', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.westlachiro.com', afterImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80', ugc: null },
                            { seg: 'AC Repair', before: 'Hidden phone number', after: 'Sticky call bar + SMS booking', lift: 'Faster response', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.coolzone-ac.com', afterImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', ugc: null },
                            { seg: 'Sports Medicine', before: 'Confusing service menu', after: 'Symptom-based nav + athlete testimonials', lift: 'Better quality leads', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.hollywoodspine.com', afterImg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', ugc: null },
                            { seg: 'Plumbing & HVAC', before: 'Cluttered homepage', after: 'Segmented routing (Air vs Water)', lift: 'Lower bounce rate', beforeImg: 'https://image.thum.io/get/width/600/crop/800/https://www.precisionairandplumbing.com', afterImg: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80', ugc: null },
                        ].map((item) => (
                            <div key={item.seg} className="p-5 rounded-xl border border-white/10 bg-white/5 space-y-3 shadow-lg shadow-black/30">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-serif text-white">{item.seg}</h3>
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">Before → After</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-lg overflow-hidden border border-white/10 relative group">
                                            <img src={item.beforeImg} alt={`${item.seg} before`} className="w-full h-28 object-cover opacity-80 group-hover:opacity-100 transition" loading="lazy" />
                                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-[10px] text-white rounded">Live</div>
                                        </div>
                                        <div className="rounded-lg overflow-hidden border border-gold/40 relative">
                                            <img src={item.afterImg} alt={`${item.seg} after`} className="w-full h-28 object-cover" loading="lazy" />
                                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gold/90 text-[10px] text-black font-bold rounded">AI-Fi</div>
                                        </div>
                                    </div>
                                    <div className="text-white/60 text-sm"><span className="text-white/80">Before:</span> {item.before}</div>
                                    <div className="text-white/60 text-sm"><span className="text-white/80">After:</span> {item.after}</div>
                                </div>
                                <div className="text-gold text-sm font-semibold">{item.lift}</div>
                                <div className="flex items-center justify-between text-xs text-white/70">
                                    <span>See this play on your site</span>
                                    <a href="/consultation" className="text-gold hover:text-white transition-colors">Book it →</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="border-t border-white/10 bg-black/70 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 space-y-8">
                    <div className="space-y-2">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">How it works</div>
                        <h2 className="text-3xl md:text-4xl font-serif">Self-serve. Under 24 hours.</h2>
                        <p className="text-white/70 max-w-3xl text-base">Designed for speed and clarity—no demos, no meetings. Submit a URL, get a report, decide if you want us to fix it.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {steps.map((step) => (
                            <div key={step.title} className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 space-y-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-white/60">{step.title}</div>
                                <div className="text-white font-semibold text-lg">{step.copy}</div>
                                <div className="text-white/70 text-sm">{step.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="border-t border-white/10 bg-black">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 mb-2">Pricing</div>
                            <h2 className="text-3xl md:text-4xl font-serif">Choose your tier after the report</h2>
                            <p className="text-white/60 max-w-2xl">Start free. If the findings are useful, pick the $1.5k starter pack and scale into the pod.</p>
                        </div>
                        <div className="text-white/70 text-sm md:text-base">No commitment until you see the results.</div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tiers.map((tier) => (
                            <div key={tier.name} className="p-5 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 space-y-3">
                                <div className="text-xs uppercase tracking-[0.2em] text-white/60">{tier.name}</div>
                                <div className="text-2xl font-semibold text-white">{tier.price}</div>
                                <ul className="text-sm text-white/80 space-y-1">
                                    {tier.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-2">
                                            <span className="text-white/50">•</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href={tier.href} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-white/20 hover:border-white text-sm font-semibold bg-white/5 hover:bg-white/10">
                                    {tier.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ / Trust */}
            <section className="border-t border-white/10 bg-black/80 backdrop-blur-md p-6 md:p-10" id="faq">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">How it works</div>
                        <h2 className="text-3xl font-serif text-white">Safety, speed, and what you get.</h2>
                        <p className="text-white/70 text-sm leading-relaxed">Diagnostic in &lt;24h, starter pack in 3–5 days. Policy guardrails on by default. Stripe billing with plan entitlements; Postgres-backed storage.</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {[
                                ['Timeline', '<24h diagnostic; 3–5 days starter pack'],
                                ['Guardrails', 'Policy checks, rate limits, kill switch'],
                                ['Data', 'Postgres storage; JWT auth ready'],
                                ['Billing', 'Stripe checkout/portal; entitlements by plan'],
                            ].map(([title, body]) => (
                                <div key={title} className="p-3 rounded-lg border border-white/10 bg-white/5">
                                    <div className="text-xs uppercase tracking-[0.2em] text-white/60">{title}</div>
                                    <div className="text-white/80 text-sm">{body}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            ['What’s free?', 'Visual diagnostic + top-5 issues + hero mock. First 10 clients also get 1 AI video ad delivered.'],
                            ['What’s in the $1.5k pack?', 'Hero upgrade, 1 AI video ad + 5 image variants, routing hygiene, and next-step roadmap.'],
                            ['Do you need my team?', 'Minimal time: approve assets and point us at your site. We handle routing hygiene and variants.'],
                            ['How do you ship safely?', 'Policy guardrails on content, JWT auth ready, per-tenant rate limits, kill switch, and review gates for risky flows.'],
                        ].map(([q, a]) => (
                            <div key={q} className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-md shadow-black/30">
                                <div className="text-white font-semibold">{q}</div>
                                <div className="text-white/70 text-sm mt-1">{a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10 bg-gradient-to-b from-black via-black to-void">
                <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">Common issues we find</div>
                            <h3 className="text-2xl font-serif text-white">What usually breaks</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                                {commonIssues.map((issue) => <li key={issue}>{issue}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">After fixes</div>
                            <h3 className="text-2xl font-serif text-white">What changes</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/70 text-sm">
                                {afterFixes.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                            <div className="pt-2">
                                <a href="/diagnostic" className="px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition">Run my diagnostic</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/10 bg-black pb-16">
                <div className="max-w-6xl mx-auto px-6 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pt-12 pb-6">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 mb-2">Proof in the field</div>
                            <h2 className="text-3xl md:text-4xl font-serif">Teams that already rely on AI-Fi</h2>
                            <p className="text-white/60 mt-2 max-w-2xl">Real operators using the diagnostic + Quick Wins flow to keep revenue paths clear.</p>
                        </div>
                        <div className="text-white/70 text-sm md:text-base">5/5 for clarity, speed, and tone.</div>
                    </div>
                    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                        {testimonials.map((t) => (
                            <div key={t.name} className="p-6 rounded-xl border border-white/10 bg-white/5 shadow-lg shadow-black/30 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm text-white/70 uppercase tracking-[0.2em]">{t.sector}</div>
                                        <div className="text-lg font-semibold text-white">{t.name}</div>
                                        <div className="text-white/60 text-sm">{t.role}</div>
                                    </div>
                                    <div className="text-gold text-base" aria-label="Five star rating">5/5</div>
                                </div>
                                <p className="text-white/80 leading-relaxed text-sm md:text-base">"{t.quote}"</p>
                                <div className="text-white/70 text-xs uppercase tracking-[0.15em]">
                                    Services: {t.services.join(', ')}
                                </div>
                                <div className="text-white font-medium text-sm md:text-base">{t.impact}</div>
                                <div className="flex flex-wrap gap-2">
                                    {t.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 text-[11px] uppercase tracking-[0.15em] rounded-full border border-white/15 bg-white/5 text-white/70">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const OnboardingFlow = () => {
    const [step, setStep] = useState('concierge');
    const [data, setData] = useState(null);
    const [profileSaved, setProfileSaved] = useState(false);

    if (step === 'concierge') {
        return <Concierge onComplete={(d) => {
            setData(d);
            setStep('mirror');
        }} />;
    }
    if (step === 'mirror') {
        return (
            <div className="h-screen flex flex-col">
                <div className="flex-1">
                    <Mirror data={data} />
                </div>
                <div className="p-8 flex justify-center">
                    <button
                        onClick={() => setStep('profile')}
                        className="px-8 py-4 bg-white text-black hover:bg-gray-100 transition-all text-sm rounded-md"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }
    if (step === 'profile') {
        const email = data?.email || '';
        const companyName = data?.name || 'Your Company';
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                <div className="max-w-lg w-full space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-serif">Identity Confirmed</h2>
                        <p className="text-white/60 text-sm">Save your details, then pick a plan.</p>
                    </div>
                    <div className="space-y-4 p-6 border border-white/10 bg-white/5 rounded-xl backdrop-blur-lg">
                        <div className="text-sm text-white/80"><span className="text-white/90">Company:</span> {companyName}</div>
                        <div className="text-sm text-white/80"><span className="text-white/90">Email:</span> {email || 'Add email in next step'}</div>
                        <div className="text-sm text-white/60">Industry: {data?.industry || 'Not set'}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                        <button
                            onClick={async () => {
                                try {
                                    await api.createProfile({
                                        email: email || 'unknown@demo.com',
                                        companyName,
                                        industry: data?.industry || '',
                                        description: data?.mission || ''
                                    });
                                    setProfileSaved(true);
                                } catch (e) {
                                    setProfileSaved(false);
                                } finally {
                                    setStep('plans');
                                }
                            }}
                            className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-all flex-1"
                        >
                            {profileSaved ? 'Profile Saved' : 'Save & Continue'}
                        </button>
                        <button
                            onClick={() => setStep('plans')}
                            className="px-6 py-3 border border-white/20 text-white rounded-md hover:border-white transition-all flex-1"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (step === 'plans') {
        return (
            <div className="min-h-screen py-20">
                <h2 className="text-center text-3xl font-serif text-white mb-12">Select Your Plan</h2>
                <PackageSelector onSelect={() => setStep('integrations')} />
            </div>
        );
    }
    if (step === 'integrations') {
        return <IntegrationHub onComplete={() => window.location.href = '/hq'} />;
    }
    return null;
};

const ProtectedRoute = ({ children }) => {
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('ai-fi-token') : null;
        if (!token) {
            setStatus('unauth');
            return;
        }
        api.me(token)
            .then(() => setStatus('ok'))
            .catch(() => {
                localStorage.removeItem('ai-fi-token');
                localStorage.removeItem('ai-fi-user');
                setStatus('unauth');
            });
    }, []);

    if (status === 'checking') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-void text-white">
                <div className="text-center space-y-3">
                    <div className="text-white text-sm tracking-widest uppercase">Verifying access</div>
                    <div className="text-white/60">Hold tight...</div>
                </div>
            </div>
        );
    }
    if (status === 'unauth') return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <Router>
            <ToastProvider>
                <GlobalStyles />
                <Shell>
                    <div className="selection:bg-white selection:text-black">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<Lobby />} />
                                <Route path="/how-it-works" element={<HowItWorks />} />
                                <Route path="/diagnostic" element={<Diagnostic />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/consultation" element={<BookConsultation />} />
                                <Route path="/onboard" element={<OnboardingFlow />} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/hq" element={<ProtectedRoute><Atrium /></ProtectedRoute>} />
                                <Route path="/ai-fi-chat" element={<AiFiChat />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </AnimatePresence>
                    </div>
                </Shell>
            </ToastProvider>
        </Router>
    );
}

export default App;
