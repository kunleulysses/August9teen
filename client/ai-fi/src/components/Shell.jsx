import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Shell = ({ children }) => {
    const [pulse, setPulse] = useState({ status: 'initializing', health: null });
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/ai-fi/consciousness/status');
                const data = await res.json();
                if (data?.status) {
                    setPulse({ status: data.status, health: data.health?.score || null });
                }
            } catch (_) {
                setPulse((p) => ({ ...p, status: 'unknown' }));
            }
        };
        fetchStatus();
        const id = setInterval(fetchStatus, 30000);
        return () => clearInterval(id);
    }, []);

    const pulseColor = pulse.status === 'awake' ? 'bg-emerald-400' : 'bg-yellow-400';

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-30 backdrop-blur-2xl bg-black/70 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-white text-black font-bold flex items-center justify-center text-xs uppercase tracking-widest shadow-lg shadow-gold/30">
                            AI
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm uppercase tracking-[0.3em] text-white/80">AI-Fi</span>
                            <span className="text-[10px] text-white/40 tracking-[0.25em]">The Future is Now</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-4 text-sm text-white/70">
                        <Link to="/how-it-works" className="hover:text-gold transition-colors">How It Works</Link>
                        <Link to="/diagnostic" className="hover:text-gold transition-colors">Diagnostic</Link>
                        <Link to="/onboard" className="hover:text-gold transition-colors">Onboard</Link>
                        <Link to="/consultation" className="hover:text-gold transition-colors">Consultation</Link>
                        <Link to="/hq" className="hover:text-gold transition-colors">HQ</Link>
                        <Link to="/login" className="px-3 py-1 rounded-full border border-white/20 hover:border-white transition-colors bg-white/5">
                            Login
                        </Link>
                        <div className="hidden md:flex items-center space-x-2 text-[11px] text-white/50">
                            <span className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
                            <span>{pulse.status === 'awake' ? 'System: Online' : 'System: Connecting...'}</span>
                        </div>
                    </nav>
                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                        className="md:hidden inline-flex items-center px-3 py-2 rounded-full border border-white/15 text-white/80 text-xs tracking-[0.2em] uppercase bg-white/5 hover:border-white hover:text-white transition-colors"
                    >
                        Menu
                        <span className={`ml-2 w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
                    </button>
                </div>
                {menuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
                        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col space-y-3 text-sm text-white/80">
                            <Link to="/how-it-works" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>How It Works</Link>
                            <Link to="/diagnostic" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>Diagnostic</Link>
                            <Link to="/onboard" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>Onboard</Link>
                            <Link to="/consultation" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>Consultation</Link>
                            <Link to="/hq" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>HQ</Link>
                            <Link to="/login" className="hover:text-gold transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
                            <div className="flex items-center space-x-2 text-[11px] text-white/60 pt-2 border-t border-white/10">
                                <span className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
                                <span>{pulse.status === 'awake' ? 'System: Online' : 'System: Connecting...'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <main className="pt-4">
                {children}
            </main>
            <footer className="mt-16 border-t border-white/10 bg-black/70 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-white/50 text-xs">
                    <div>Luxury Ops OS · Autonomous + Human</div>
                    <div className="flex items-center space-x-3">
                        <Link to="/consultation" className="hover:text-gold transition-colors">Talk to a strategist</Link>
                        <Link to="/how-it-works" className="hover:text-gold transition-colors">Learn more</Link>
                        <Link to="/login" className="hover:text-gold transition-colors">Client login</Link>
                        <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Shell;
