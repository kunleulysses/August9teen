import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, Globe, Zap } from 'lucide-react';
import api from '../utils/api';

const StrategyCenter = () => {
    const [marketSignals, setMarketSignals] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [aggressionLevel, setAggressionLevel] = useState(0.5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStrategyData();
    }, []);

    const loadStrategyData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load market intelligence
            const intelligence = await api.getMarketSignals();
            if (intelligence?.marketGaps) {
                const signals = intelligence.marketGaps.slice(0, 3).map((gap, idx) => ({
                    id: idx + 1,
                    source: 'Market Analysis',
                    type: 'Gap',
                    signal: `Market opportunity in ${gap}`,
                    impact: 'Medium',
                    date: 'Just now'
                }));
                setMarketSignals(signals);
            }

            // Load strategic recommendations from imagination engine
            const ideasData = await api.getStrategicRecommendations();
            if (ideasData?.ideas) {
                const recs = ideasData.ideas.map((idea, idx) => ({
                    id: idea.id || `REC-${idx}`,
                    title: idea.category || 'Strategic Initiative',
                    description: idea.strategy,
                    confidence: parseFloat(idea.overall) / 100 || 0.8,
                    status: 'pending'
                }));
                setRecommendations(recs);
            }
        } catch (err) {
            console.error('Failed to load strategy data:', err);
            setError(err.message);
            // Fallback to mock data
            setMarketSignals([
                { id: 1, source: 'Competitor A', type: 'Pricing', signal: 'Decreased subscription cost by 10%', impact: 'High', date: '2h ago' },
            ]);
            setRecommendations([
                { id: 1, title: 'Launch Counter-Campaign', description: 'Target Competitor A\'s churned users with a "Switch & Save" offer.', confidence: 0.89, status: 'pending' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        await api.approveRecommendation(id);
        setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'approved' } : rec));
    };

    const handleReject = (id) => {
        setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'rejected' } : rec));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Strategy Center</h2>
                    <p className="text-white/60">Market intelligence and autonomous strategic planning.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-xs text-gold uppercase tracking-widest">System Mode</div>
                        <div className="text-white font-bold">ACTIVE OBSERVATION</div>
                    </div>
                    <Target className="text-gold animate-pulse-slow" size={32} />
                </div>
            </div>

            {/* Adaptive Strategy Control */}
            <div className="p-6 border border-white/10 bg-black/30">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gold font-serif text-xl flex items-center gap-2">
                        <Zap size={20} />
                        <span>Adaptive Strategy Engine</span>
                    </h3>
                    <span className="text-xs text-white/40 uppercase tracking-widest">
                        Aggression Index: {(aggressionLevel * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full mb-4">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-gold to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${aggressionLevel * 100}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={aggressionLevel}
                        onChange={(e) => setAggressionLevel(parseFloat(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                </div>
                <p className="mt-4 text-sm text-white/70">
                    Current posture: <span className="text-white font-semibold">
                        {aggressionLevel < 0.33 ? 'Defensive Growth' : aggressionLevel < 0.66 ? 'Balanced Expansion' : 'Market Domination'}
                    </span>.
                    The AI will prioritize {aggressionLevel < 0.33 ? 'risk mitigation and retention' : aggressionLevel < 0.66 ? 'sustainable acquisition' : 'high-volume acquisition and viral loops'}.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Market Intelligence Grid */}
                <div className="p-6 border border-white/10 bg-black/30 min-h-[400px]">
                    <h3 className="text-gold font-serif text-xl mb-6 flex items-center gap-2">
                        <Globe size={20} />
                        <span>Market Intelligence Grid</span>
                    </h3>

                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-white/20">
                            <div className="animate-spin mr-2"><Target size={20} /></div> Scanning...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {marketSignals.map(signal => (
                                <div key={signal.id} className="p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs text-gold border border-gold/20 px-2 py-0.5 uppercase">{signal.type}</span>
                                        <span className="text-xs text-white/30">{signal.date}</span>
                                    </div>
                                    <div className="text-sm text-white/90 font-medium mb-1">{signal.source}</div>
                                    <p className="text-sm text-white/70">{signal.signal}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${signal.impact === 'High' ? 'bg-red-500' : signal.impact === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                        <span className="text-xs text-white/40 uppercase">Impact: {signal.impact}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Strategy Optimizer */}
                <div className="p-6 border border-white/10 bg-black/30 min-h-[400px]">
                    <h3 className="text-gold font-serif text-xl mb-6 flex items-center gap-2">
                        <TrendingUp size={20} />
                        <span>Strategic Recommendations</span>
                    </h3>

                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-white/20">
                            <div className="animate-spin mr-2"><Target size={20} /></div> Computing...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recommendations.map(rec => (
                                <div key={rec.id} className={`p-4 border ${rec.status === 'pending' ? 'border-white/10 bg-white/5' : rec.status === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'} transition-all`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-serif">{rec.title}</h4>
                                            {rec.status === 'approved' && <CheckCircle2 size={16} className="text-emerald-500" />}
                                            {rec.status === 'rejected' && <AlertTriangle size={16} className="text-red-500" />}
                                        </div>
                                        <span className="text-xs text-gold">{(rec.confidence * 100).toFixed(0)}% Confidence</span>
                                    </div>
                                    <p className="text-sm text-white/70 mb-4">{rec.description}</p>

                                    {rec.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(rec.id)}
                                                className="flex-1 py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(rec.id)}
                                                className="flex-1 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {rec.status !== 'pending' && (
                                        <div className="text-xs text-white/40 uppercase tracking-widest text-center py-1">
                                            {rec.status === 'approved' ? 'Queued for Execution' : 'Dismissed'}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {recommendations.length === 0 && (
                                <div className="text-center text-white/40 py-8">
                                    No pending recommendations.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategyCenter;
