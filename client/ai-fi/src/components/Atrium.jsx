import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Target, MessageSquare, Menu, BookOpen, User, Cpu, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import StrategyCenter from './StrategyCenter';
import Workshop from './Workshop';
import ChiefOfStaff from './ChiefOfStaff';
import Guide from './Guide';

// Simulated Real-time Data
const MOCK_PULSE = [
    { label: 'Revenue Velocity', value: '+12%', trend: 'up' },
    { label: 'Brand Sentiment', value: '98.4', trend: 'up' },
    { label: 'Market Share', value: '14.2%', trend: 'neutral' }
];

const Atrium = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [memoryEntries, setMemoryEntries] = useState([]);
    const [memoryStats, setMemoryStats] = useState(null);
    const [memoryLoading, setMemoryLoading] = useState(false);
    const [memoryStatus, setMemoryStatus] = useState({ success: null, error: null });
    const [memoryForm, setMemoryForm] = useState({
        summary: '',
        importance: 'normal',
        emotion: 'neutral',
        tags: '',
        actor: 'Chief of Staff',
    });

    const [healingSnapshot, setHealingSnapshot] = useState(null);
    const [healingLoading, setHealingLoading] = useState(false);
    const [healingStatus, setHealingStatus] = useState({ success: null, error: null, plan: null });
    const [healingForm, setHealingForm] = useState({
        issueType: '',
        severity: 'high',
        description: '',
    });

    const [policies, setPolicies] = useState([]);
    const [policyStatus, setPolicyStatus] = useState({ success: null, error: null });
    const [policyForm, setPolicyForm] = useState({
        name: '',
        description: '',
        severity: 'high',
        requiredPhrases: '',
        forbiddenPhrases: '',
        channels: 'all',
    });
    const [evaluationInput, setEvaluationInput] = useState('');
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [evaluationStatus, setEvaluationStatus] = useState({ success: null, error: null });
    const [messagingOverview, setMessagingOverview] = useState({ sms: [], email: [] });
    const [messagingStatus, setMessagingStatus] = useState({ sms: null, email: null, error: null });
    const [policyViolations, setPolicyViolations] = useState({ sms: null, email: null });
    const [smsForm, setSmsForm] = useState({ to: '', body: '' });
    const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
    const [systemStatus, setSystemStatus] = useState({ status: 'initializing', health: null, rhythm: null });

    const fetchContextLogs = async () => {
        setMemoryLoading(true);
        setMemoryStatus((prev) => ({ ...prev, error: null }));
        try {
            const response = await fetch('/api/ai-fi/ops/memory?limit=5');
            if (!response.ok) throw new Error('Failed to load system logs');
            const data = await response.json();
            setMemoryEntries(data.memories || []);
            setMemoryStats(data.stats || null);
        } catch (error) {
            setMemoryStatus({ success: null, error: 'Unable to load system context right now.' });
        } finally {
            setMemoryLoading(false);
        }
    };

    const fetchHealthStatus = async () => {
        setHealingLoading(true);
        try {
            const response = await fetch('/api/ai-fi/ops/healing/status');
            if (!response.ok) throw new Error('Failed to load system health');
            const data = await response.json();
            setHealingSnapshot(data.snapshot || null);
        } catch (error) {
            setHealingStatus((prev) => ({ ...prev, error: 'Unable to load diagnostics.' }));
        } finally {
            setHealingLoading(false);
        }
    };

    const fetchMessagingOverview = async () => {
        try {
            const response = await fetch('/api/ai-fi/messaging/overview');
            if (!response.ok) throw new Error('Failed to load messaging overview');
            const data = await response.json();
            setMessagingOverview({
                sms: data.overview?.sms || [],
                email: data.overview?.email || [],
            });
        } catch (error) {
            setMessagingStatus((prev) => ({ ...prev, error: 'Unable to load messaging logs.' }));
        }
    };

    const fetchPolicies = async () => {
        try {
            const response = await fetch('/api/ai-fi/policy/rules');
            if (!response.ok) throw new Error('Failed to load policies');
            const data = await response.json();
            setPolicies(data.rules || []);
        } catch (error) {
            setPolicyStatus({ success: null, error: 'Unable to load policies.' });
        }
    };

    // Fetch System Status
    useEffect(() => {
        const checkSystem = async () => {
            try {
                const response = await fetch('/api/ai-fi/system/status');
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'awake') {
                        setSystemStatus({
                            status: data.status,
                            health: data.health?.score,
                            rhythm: data.rhythm || null
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch system status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const [singularityStatus, setSingularityStatus] = useState(null);
    const [evolutionStrategy, setEvolutionStrategy] = useState(null);

    const fetchSingularity = async () => {
        try {
            const response = await fetch('/api/ai-fi/consciousness/singularity');
            const data = await response.json();
            setSingularityStatus(data);
        } catch (e) {
            console.error('Failed to fetch singularity:', e);
        }
    };

    const fetchEvolution = async () => {
        try {
            const response = await fetch('/api/ai-fi/consciousness/evolution');
            const data = await response.json();
            setEvolutionStrategy(data);
        } catch (e) {
            console.error('Failed to fetch evolution:', e);
        }
    };

    useEffect(() => {
        fetchContextLogs();
        fetchHealthStatus();
        fetchPolicies();
        fetchMessagingOverview();
        fetchSingularity();
        fetchEvolution();
    }, []);

    const handleMemorySubmit = async (event) => {
        event.preventDefault();
        setMemoryStatus({ success: null, error: null });
        const payload = {
            summary: memoryForm.summary,
            importance: memoryForm.importance,
            emotion: memoryForm.emotion,
            actor: memoryForm.actor,
            tags: memoryForm.tags
                ? memoryForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                : undefined,
        };

        try {
            const response = await fetch('/api/ai-fi/ops/memory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to store memory');
            setMemoryStatus({ success: 'Memory captured in the field.', error: null });
            setMemoryForm({
                summary: '',
                importance: 'normal',
                emotion: 'neutral',
                tags: '',
                actor: memoryForm.actor,
            });
            fetchMemories();
        } catch (error) {
            setMemoryStatus({ success: null, error: 'Unable to store memory. Please try again.' });
        }
    };

    const handleHealingSubmit = async (event) => {
        event.preventDefault();
        setHealingStatus({ success: null, error: null, plan: null });

        try {
            const response = await fetch('/api/ai-fi/ops/healing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issueType: healingForm.issueType,
                    severity: healingForm.severity,
                    description: healingForm.description,
                }),
            });

            if (!response.ok) throw new Error('Failed');
            const data = await response.json();
            setHealingStatus({
                success: 'Resolution sequence queued.',
                error: null,
                plan: data.plan,
            });
            setHealingForm({
                issueType: '',
                severity: healingForm.severity,
                description: '',
            });
            fetchHealthStatus();
        } catch (error) {
            setHealingStatus({
                success: null,
                error: 'Unable to queue healing. Verify feature access.',
                plan: null,
            });
        }
    };

    const handlePolicySubmit = async (event) => {
        event.preventDefault();
        setPolicyStatus({ success: null, error: null });
        const payload = {
            name: policyForm.name,
            description: policyForm.description,
            severity: policyForm.severity,
            requiredPhrases: policyForm.requiredPhrases
                ? policyForm.requiredPhrases.split(',').map((item) => item.trim()).filter(Boolean)
                : [],
            forbiddenPhrases: policyForm.forbiddenPhrases
                ? policyForm.forbiddenPhrases.split(',').map((item) => item.trim()).filter(Boolean)
                : [],
            channels: policyForm.channels ? policyForm.channels.split(',').map((item) => item.trim()) : ['all'],
        };
        try {
            const response = await fetch('/api/ai-fi/policy/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed');
            setPolicyStatus({ success: 'Policy saved.', error: null });
            setPolicyForm({
                name: '',
                description: '',
                severity: policyForm.severity,
                requiredPhrases: '',
                forbiddenPhrases: '',
                channels: 'all',
            });
            fetchPolicies();
        } catch (error) {
            setPolicyStatus({ success: null, error: 'Unable to save policy.' });
        }
    };

    const handlePolicyDelete = async (policyId) => {
        setPolicyStatus({ success: null, error: null });
        try {
            const response = await fetch(`/api/ai-fi/policy/rules/${policyId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed');
            setPolicyStatus({ success: 'Policy removed.', error: null });
            fetchPolicies();
        } catch (error) {
            setPolicyStatus({ success: null, error: 'Unable to remove policy.' });
        }
    };

    const handleEvaluationSubmit = async (event) => {
        event.preventDefault();
        if (!evaluationInput.trim()) return;
        setEvaluationStatus({ success: null, error: null });
        try {
            const response = await fetch('/api/ai-fi/policy/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: evaluationInput }),
            });
            if (!response.ok) throw new Error('Failed');
            const data = await response.json();
            setEvaluationResult(data.result);
            setEvaluationStatus({ success: 'Evaluation complete.', error: null });
        } catch (error) {
            setEvaluationResult(null);
            setEvaluationStatus({ success: null, error: 'Unable to evaluate content.' });
        }
    };

    const handleSmsSend = async (event) => {
        event.preventDefault();
        setMessagingStatus((prev) => ({ ...prev, sms: null, error: null }));
        if (!smsForm.to || !smsForm.body) {
            setMessagingStatus((prev) => ({ ...prev, error: 'Phone number and message required.' }));
            return;
        }
        try {
            const response = await fetch('/api/ai-fi/messaging/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: smsForm.to, body: smsForm.body }),
            });
            if (response.status === 422) {
                const data = await response.json();
                setPolicyViolations((prev) => ({ ...prev, sms: data.evaluation || [] }));
                setMessagingStatus((prev) => ({ ...prev, error: data.error || 'Policy violation.' }));
                return;
            }
            if (!response.ok) throw new Error('Failed');
            setPolicyViolations((prev) => ({ ...prev, sms: null }));
            setSmsForm({ to: smsForm.to, body: '' });
            setMessagingStatus((prev) => ({ ...prev, sms: 'SMS queued successfully.' }));
            fetchMessagingOverview();
        } catch (error) {
            setPolicyViolations((prev) => ({ ...prev, sms: null }));
            setMessagingStatus((prev) => ({ ...prev, error: 'Unable to send SMS.' }));
        }
    };

    const handleEmailSend = async (event) => {
        event.preventDefault();
        setMessagingStatus((prev) => ({ ...prev, email: null, error: null }));
        if (!emailForm.to || !emailForm.subject || !emailForm.body) {
            setMessagingStatus((prev) => ({ ...prev, error: 'Email, subject, and message required.' }));
            return;
        }
        try {
            const response = await fetch('/api/ai-fi/messaging/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailForm),
            });
            if (response.status === 422) {
                const data = await response.json();
                setPolicyViolations((prev) => ({ ...prev, email: data.evaluation || [] }));
                setMessagingStatus((prev) => ({ ...prev, error: data.error || 'Policy violation.' }));
                return;
            }
            if (!response.ok) throw new Error('Failed');
            setPolicyViolations((prev) => ({ ...prev, email: null }));
            setEmailForm({ to: emailForm.to, subject: '', body: '' });
            setMessagingStatus((prev) => ({ ...prev, email: 'Email queued successfully.' }));
            fetchMessagingOverview();
        } catch (error) {
            setPolicyViolations((prev) => ({ ...prev, email: null }));
            setMessagingStatus((prev) => ({ ...prev, error: 'Unable to send email.' }));
        }
    };

    const NAV_ITEMS = [
        { id: 'overview', icon: Activity, label: 'The Atrium' },
        { id: 'strategy', icon: Target, label: 'Strategy Center' },
        { id: 'content', icon: Zap, label: 'The Workshop' },
        { id: 'comms', icon: MessageSquare, label: 'Concierge' },
        { id: 'policy', icon: Shield, label: 'Policy Guard' },
        { id: 'guide', icon: BookOpen, label: 'System Manual' }
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar Navigation - Desktop */}
            <div className="hidden md:flex w-64 border-r border-white/10 flex-col bg-obsidian sticky top-0 h-screen">
                <div className="p-6 flex items-center space-x-4 border-b border-white/10">
                    <div className="w-8 h-8 bg-gold rounded-full animate-pulse-slow" />
                    <span className="font-serif text-xl tracking-widest">AI-Fi</span>
                </div>

                <nav className="flex-1 py-8 space-y-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-8 py-4 space-x-4 transition-colors ${activeTab === item.id
                                ? 'text-gold bg-white/5 border-r-2 border-gold'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <User size={14} />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Admin User</div>
                            <div className="text-xs text-white/40">admin@ai-fi.com</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-obsidian border-t border-white/10 z-50 flex justify-around items-center p-2 pb-safe">
                {NAV_ITEMS.slice(0, 5).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center p-2 space-y-1 ${activeTab === item.id ? 'text-gold' : 'text-white/40'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[10px] uppercase tracking-wider">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
                <button
                    onClick={() => setActiveTab('guide')}
                    className={`flex flex-col items-center justify-center p-2 space-y-1 ${activeTab === 'guide' ? 'text-gold' : 'text-white/40'}`}
                >
                    <Menu size={20} />
                    <span className="text-[10px] uppercase tracking-wider">Menu</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-void/50 backdrop-blur-md">
                    <h2 className="text-2xl font-serif text-white">
                        {activeTab === 'overview' && 'The Atrium'}
                        {activeTab === 'strategy' && 'Strategic Command'}
                        {activeTab === 'content' && 'Production Workshop'}
                        {activeTab === 'comms' && 'Chief of Staff'}
                        {activeTab === 'policy' && 'Policy Guard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-gold border border-gold/30 px-3 py-1 rounded-full">TIER: EMPIRE</span>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">System Core</div>
                                    <div className="text-xl text-white font-serif">
                                        {systemStatus.status === 'awake' ? 'Online' : 'Initializing'}
                                    </div>
                                    <div className="text-sm text-white/60">
                                        Health: {systemStatus.health !== null ? `${systemStatus.health}` : '—'}
                                    </div>
                                    {systemStatus.rhythm && (
                                        <div className="text-xs text-white/50 mt-1">
                                            Load: {systemStatus.rhythm.mode || 'stable'}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Singularity</div>
                                    <div className="text-sm text-white/70">
                                        {singularityStatus?.status === 'online'
                                            ? `Coherence ${(singularityStatus.coherence * 100 || 0).toFixed(0)}%`
                                            : 'Connecting...'}
                                    </div>
                                </div>
                                <div className="p-4 border border-white/10 bg-white/5 rounded-lg">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Evolution</div>
                                    <div className="text-sm text-white/70">
                                        {evolutionStrategy
                                            ? `Mode: Aggression ${(evolutionStrategy.marketingAggression * 100).toFixed(0)}%`
                                            : 'Adapting...'}
                                    </div>
                                </div>
                            </div>
                            {/* What AI is Doing Right Now */}
                            <div className="p-6 border border-gold/30 bg-gold/5">
                                <h3 className="text-gold font-serif text-xl mb-4 flex items-center space-x-2">
                                    <Cpu size={20} />
                                    <span>Your AI Engines Are Working</span>
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">MARKET INTELLIGENCE GRID</div>
                                        <p className="text-sm text-white/80">Tracking 12 competitors across 5 channels</p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">CONTENT ENGINE</div>
                                        <p className="text-sm text-white/80">Generated 24 posts this week</p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">BRAND MONITOR</div>
                                        <p className="text-sm text-white/80">Sentiment: 98.4% positive</p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">STRATEGY OPTIMIZER</div>
                                        <p className="text-sm text-white/80">3 new strategic recommendations ready</p>
                                    </div>

                                    {/* Phase 6: Singularity & Evolution Surface */}
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">GLOBAL INTELLIGENCE</div>
                                        <p className="text-sm text-white/80">
                                            {singularityStatus?.status === 'online'
                                                ? `Connected to ${singularityStatus.participants} nodes. Coherence: ${(singularityStatus.coherence * 100).toFixed(0)}%`
                                                : 'Connecting to Hive Mind...'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">ADAPTIVE STRATEGY</div>
                                        <p className="text-sm text-white/80">
                                            {evolutionStrategy
                                                ? `Mode: Aggression ${(evolutionStrategy.marketingAggression * 100).toFixed(0)}%`
                                                : 'Evolving parameters...'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-white/10">
                                        <div className="text-xs text-gold mb-2">SYSTEM EVOLUTION</div>
                                        <p className="text-sm text-white/80">
                                            Last optimization: 2 mins ago.
                                            <br />
                                            <span className="text-xs text-white/50">Auto-deployed fix for 'latency_spike'.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pulse Grid */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {MOCK_PULSE.map((metric) => (
                                    <motion.div
                                        key={metric.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm"
                                    >
                                        <div className="text-xs text-white/40 uppercase tracking-widest mb-2">{metric.label}</div>
                                        <div className="text-4xl font-light text-white">{metric.value}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* The Feed */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 border border-white/10 bg-black/40 min-h-[400px]">
                                    <h3 className="text-gold font-serif text-xl mb-6">Live Intelligence</h3>
                                    <div className="space-y-4">
                                        {[
                                            { engine: 'Market Grid', msg: 'Competitor A adjusted pricing model. Recommended counter-strategy generated.' },
                                            { engine: 'Brand Monitor', msg: 'Positive mention detected on industry forum. Auto-engaging.' },
                                            { engine: 'Content Engine', msg: 'New campaign variant ready for your approval.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start space-x-4 p-4 border-b border-white/5">
                                                <div className="w-1.5 h-1.5 mt-2 bg-gold rounded-full" />
                                                <div className="flex-1">
                                                    <div className="text-xs text-gold mb-1">{item.engine}</div>
                                                    <p className="text-sm text-white/80">{item.msg}</p>
                                                    <span className="text-xs text-white/30 mt-2 block">2 mins ago</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 border border-white/10 bg-black/40 min-h-[400px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-gold font-serif text-xl">Pending Approvals</h3>
                                        <a href="/consultation" className="text-xs text-white/60 hover:text-gold">Need help? Talk to team →</a>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-white/10">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs text-gold border border-gold/20 px-2 py-0.5">INSTAGRAM</span>
                                                <span className="text-xs text-white/30">Draft #821</span>
                                            </div>
                                            <p className="text-sm text-white/90 italic mb-4">"Success isn't about working harder. It's about working smarter. That's where AI comes in. 🚀"</p>
                                            <div className="flex space-x-2">
                                                <button className="flex-1 py-2 bg-white text-black text-xs font-bold uppercase hover:bg-gold transition-colors">Approve</button>
                                                <button className="flex-1 py-2 border border-white/20 text-white text-xs font-bold uppercase hover:bg-white/10">Reject</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid xl:grid-cols-2 gap-6">
                                <div className="p-6 border border-white/10 bg-black/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-serif text-xl">System Context</h3>
                                            <p className="text-white/60 text-sm">
                                                Resonant insights recorded by the Autonomous Chief of Staff.
                                            </p>
                                        </div>
                                        <button
                                            onClick={fetchMemories}
                                            className="text-xs uppercase tracking-widest text-white/60 hover:text-gold"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                    <div className="text-xs text-white/50 mb-4">
                                        {memoryStats ? (
                                            <span>
                                                {memoryStats.totalMemories || 0} total entries · Coherence{' '}
                                                {(memoryStats.coherence * 100).toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span>Gathering resonance metrics…</span>
                                        )}
                                    </div>
                                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                        {memoryLoading && (
                                            <p className="text-white/50 text-sm">Synchronizing memories…</p>
                                        )}
                                        {!memoryLoading && memoryEntries.length === 0 && (
                                            <p className="text-white/50 text-sm">No memories recorded yet.</p>
                                        )}
                                        {memoryEntries.map((entry) => (
                                            <div key={entry.id} className="p-4 bg-white/5 border border-white/10">
                                                <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                                                    <span>{entry.type.toUpperCase()}</span>
                                                    <span>
                                                        Resonance {(entry.resonance * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/90">{entry.summary}</p>
                                                {entry.context?.accumulatedEmotion && (
                                                    <p className="text-xs text-white/40 mt-1">
                                                        Emotions: {entry.context.accumulatedEmotion.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleMemorySubmit} className="space-y-3">
                                        <textarea
                                            className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none"
                                            rows={3}
                                            placeholder="Capture a new observation or decision..."
                                            value={memoryForm.summary}
                                            onChange={(e) => setMemoryForm({ ...memoryForm, summary: e.target.value })}
                                            required
                                        />
                                        <div className="grid md:grid-cols-2 gap-3 text-xs text-white/60">
                                            <div>
                                                <label className="block mb-1">Importance</label>
                                                <select
                                                    className="w-full bg-black/50 border border-white/10 p-2 text-white"
                                                    value={memoryForm.importance}
                                                    onChange={(e) =>
                                                        setMemoryForm({ ...memoryForm, importance: e.target.value })
                                                    }
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="high">High</option>
                                                    <option value="critical">Critical</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block mb-1">Emotion</label>
                                                <select
                                                    className="w-full bg-black/50 border border-white/10 p-2 text-white"
                                                    value={memoryForm.emotion}
                                                    onChange={(e) =>
                                                        setMemoryForm({ ...memoryForm, emotion: e.target.value })
                                                    }
                                                >
                                                    <option value="neutral">Neutral</option>
                                                    <option value="optimistic">Optimistic</option>
                                                    <option value="concerned">Concerned</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-sm text-white focus:border-gold focus:outline-none"
                                            placeholder="Tags (comma separated)"
                                            value={memoryForm.tags}
                                            onChange={(e) => setMemoryForm({ ...memoryForm, tags: e.target.value })}
                                        />
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-sm text-white focus:border-gold focus:outline-none"
                                            placeholder="Recorded by"
                                            value={memoryForm.actor}
                                            onChange={(e) => setMemoryForm({ ...memoryForm, actor: e.target.value })}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Record Insight
                                        </button>
                                        {memoryStatus.error && (
                                            <p className="text-xs text-red-400">{memoryStatus.error}</p>
                                        )}
                                        {memoryStatus.success && (
                                            <p className="text-xs text-gold">{memoryStatus.success}</p>
                                        )}
                                    </form>
                                </div>

                                <div className="p-6 border border-white/10 bg-black/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-gold font-serif text-xl">Autonomous Ops</h3>
                                            <p className="text-white/60 text-sm">
                                                Automated diagnostics keep infrastructure stable.
                                            </p>
                                        </div>
                                        <button
                                            onClick={fetchHealthStatus}
                                            className="text-xs uppercase tracking-widest text-white/60 hover:text-gold"
                                        >
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                        <div className="p-3 bg-white/5 border border-white/10">
                                            <div className="text-xs text-white/50 uppercase">Queue</div>
                                            <div className="text-white text-lg">
                                                {healingSnapshot?.queue?.totalTasks ?? 0}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 border border-white/10">
                                            <div className="text-xs text-white/50 uppercase">Success Rate</div>
                                            <div className="text-white text-lg">
                                                {healingSnapshot?.metrics
                                                    ? `${(healingSnapshot.metrics.successRate * 100).toFixed(0)}%`
                                                    : '--'}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 border border-white/10">
                                            <div className="text-xs text-white/50 uppercase">Active Agents</div>
                                            <div className="text-white text-lg">
                                                {healingSnapshot?.metrics?.availableAgents ?? '--'}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 border border-white/10">
                                            <div className="text-xs text-white/50 uppercase">Resource Utilization</div>
                                            <div className="text-white text-lg">
                                                {healingSnapshot?.metrics
                                                    ? `${(healingSnapshot.metrics.resourceUtilization * 100).toFixed(
                                                        0,
                                                    )}%`
                                                    : '--'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-white/50 mb-4">
                                        {healingSnapshot?.resources ? (
                                            <span>
                                                Compute Units: {healingSnapshot.resources.consciousness_amplifiers?.available ?? 0}/
                                                {healingSnapshot.resources.consciousness_amplifiers?.total ?? 0}
                                            </span>
                                        ) : (
                                            <span>Gathering resource telemetry…</span>
                                        )}
                                    </div>

                                    <form onSubmit={handleHealingSubmit} className="space-y-3">
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-sm text-white focus:border-gold focus:outline-none"
                                            placeholder="Issue type (e.g., coherence_loss)"
                                            value={healingForm.issueType}
                                            onChange={(e) => setHealingForm({ ...healingForm, issueType: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="w-full bg-black/50 border border-white/10 p-2 text-sm text-white focus:border-gold focus:outline-none"
                                            value={healingForm.severity}
                                            onChange={(e) => setHealingForm({ ...healingForm, severity: e.target.value })}
                                        >
                                            <option value="critical">Critical</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                        <textarea
                                            className="w-full bg-black/50 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none"
                                            rows={3}
                                            placeholder="Describe issue for resolution..."
                                            value={healingForm.description}
                                            onChange={(e) =>
                                                setHealingForm({ ...healingForm, description: e.target.value })
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                                        >
                                            Queue Healing Sequence
                                        </button>
                                        {healingStatus.error && (
                                            <p className="text-xs text-red-400">{healingStatus.error}</p>
                                        )}
                                        {healingStatus.success && (
                                            <p className="text-xs text-gold">{healingStatus.success}</p>
                                        )}
                                    </form>

                                    {healingStatus.plan && (
                                        <div className="mt-4 p-4 bg-white/5 border border-white/10">
                                            <div className="text-xs text-white/50 uppercase mb-1">Queued Task</div>
                                            <p className="text-sm text-white/80 mb-2">
                                                Condition: {healingStatus.plan.condition} · Priority{' '}
                                                {(healingStatus.plan.priority * 100).toFixed(0)}%
                                            </p>
                                            <div className="text-xs text-white/50 uppercase mb-1">Recommended Strategies</div>
                                            <ul className="text-sm text-white/80 space-y-1">
                                                {(healingStatus.plan.recommendedStrategies || []).map((strategy) => (
                                                    <li key={strategy.name}>• {strategy.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border border-white/10 bg-black/30">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-gold font-serif text-xl">Unified Messaging</h3>
                                        <p className="text-white/60 text-sm">
                                            SMS + Email concierge with compliance and telemetry baked in.
                                        </p>
                                    </div>
                                    <button
                                        onClick={fetchMessagingOverview}
                                        className="text-xs uppercase tracking-widest text-white/60 hover:text-gold"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-serif">Recent SMS</span>
                                            <span className="text-xs text-white/40">{messagingOverview.sms.length} logs</span>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {messagingOverview.sms.length === 0 && (
                                                <p className="text-white/50 text-sm">No SMS activity yet.</p>
                                            )}
                                            {messagingOverview.sms.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className="p-3 bg-white/5 border border-white/10 text-xs text-white/70"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{msg.direction === 'outbound' ? 'Sent' : 'Received'}</span>
                                                        <span className="text-white/40">
                                                            {new Date(msg.at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-white/90">
                                                        {msg.to ? `→ ${msg.to}` : `← ${msg.from}`}
                                                    </div>
                                                    <p className="text-white/70 mt-1">
                                                        {msg.body?.slice(0, 120)}
                                                        {msg.body?.length > 120 ? '…' : ''}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-serif">Recent Email</span>
                                            <span className="text-xs text-white/40">{messagingOverview.email.length} logs</span>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            {messagingOverview.email.length === 0 && (
                                                <p className="text-white/50 text-sm">No email activity yet.</p>
                                            )}
                                            {messagingOverview.email.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className="p-3 bg-white/5 border border-white/10 text-xs text-white/70"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{msg.direction === 'outbound' ? 'Sent' : 'Received'}</span>
                                                        <span className="text-white/40">
                                                            {new Date(msg.at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-white/90">
                                                        {msg.to ? `→ ${msg.to}` : `← ${msg.from}`}
                                                    </div>
                                                    <p className="text-white/70 font-semibold mt-1">{msg.subject}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <form onSubmit={handleSmsSend} className="space-y-3">
                                        <h4 className="text-white font-serif text-lg">Send SMS</h4>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Recipient phone (+1...)"
                                            value={smsForm.to}
                                            onChange={(e) => setSmsForm({ ...smsForm, to: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            rows={3}
                                            placeholder="Message"
                                            value={smsForm.body}
                                            onChange={(e) => setSmsForm({ ...smsForm, body: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                                        >
                                            Send SMS
                                        </button>
                                        {messagingStatus.sms && (
                                            <p className="text-xs text-gold">{messagingStatus.sms}</p>
                                        )}
                                        {policyViolations.sms && (
                                            <div className="text-xs text-red-300 space-y-1">
                                                {policyViolations.sms
                                                    .filter((item) => !item.passed)
                                                    .map((item) => (
                                                        <div key={item.policy.id}>
                                                            <span className="font-semibold">
                                                                {item.policy.name} —
                                                            </span>
                                                            <ul className="list-disc ml-4">
                                                                {item.violations.map((violation, index) => (
                                                                    <li key={index}>
                                                                        {violation.type}: {violation.detail}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </form>
                                    <form onSubmit={handleEmailSend} className="space-y-3">
                                        <h4 className="text-white font-serif text-lg">Send Email</h4>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Recipient email"
                                            value={emailForm.to}
                                            onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                                            required
                                        />
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Subject"
                                            value={emailForm.subject}
                                            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            rows={3}
                                            placeholder="Message body"
                                            value={emailForm.body}
                                            onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Send Email
                                        </button>
                                        {messagingStatus.email && (
                                            <p className="text-xs text-gold">{messagingStatus.email}</p>
                                        )}
                                        {policyViolations.email && (
                                            <div className="text-xs text-red-300 space-y-1">
                                                {policyViolations.email
                                                    .filter((item) => !item.passed)
                                                    .map((item) => (
                                                        <div key={item.policy.id}>
                                                            <span className="font-semibold">
                                                                {item.policy.name} —
                                                            </span>
                                                            <ul className="list-disc ml-4">
                                                                {item.violations.map((violation, index) => (
                                                                    <li key={index}>
                                                                        {violation.type}: {violation.detail}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </form>
                                </div>
                                {messagingStatus.error && (
                                    <p className="text-xs text-red-400 mt-3">{messagingStatus.error}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'policy' && (
                        <div className="space-y-8">
                            <div className="grid xl:grid-cols-2 gap-6">
                                <div className="p-6 border border-white/10 bg-black/30">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-gold font-serif text-xl">Active Guardrails</h3>
                                            <p className="text-white/60 text-sm">
                                                System-authenticated policies guarding every response.
                                            </p>
                                        </div>
                                        <button
                                            onClick={fetchPolicies}
                                            className="text-xs uppercase tracking-widest text-white/60 hover:text-gold"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                        {policies.length === 0 && (
                                            <p className="text-white/50 text-sm">No guardrails yet. Add one below.</p>
                                        )}
                                        {policies.map((policy) => (
                                            <div key={policy.id} className="p-4 bg-white/5 border border-white/10">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-white">{policy.name}</span>
                                                    <span className="text-xs text-white/50 uppercase">{policy.severity}</span>
                                                </div>
                                                <p className="text-xs text-white/60 mb-2">{policy.description}</p>
                                                <div className="flex flex-wrap gap-2 text-[10px] text-white/40 mb-2">
                                                    {policy.requiredPhrases?.map((phrase) => (
                                                        <span key={phrase} className="px-2 py-1 border border-white/20">
                                                            require: {phrase}
                                                        </span>
                                                    ))}
                                                    {policy.forbiddenPhrases?.map((phrase) => (
                                                        <span key={phrase} className="px-2 py-1 border border-red-500/40 text-red-300">
                                                            forbid: {phrase}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handlePolicyDelete(policy.id)}
                                                    className="text-xs text-white/50 hover:text-gold"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {policyStatus.error && (
                                        <p className="text-xs text-red-400 mt-3">{policyStatus.error}</p>
                                    )}
                                    {policyStatus.success && (
                                        <p className="text-xs text-gold mt-3">{policyStatus.success}</p>
                                    )}
                                </div>
                                <div className="p-6 border border-white/10 bg-black/30">
                                    <h3 className="text-gold font-serif text-xl mb-4">Add Guardrail</h3>
                                    <form onSubmit={handlePolicySubmit} className="space-y-3 text-sm text-white/70">
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Policy name"
                                            value={policyForm.name}
                                            onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            rows={3}
                                            placeholder="Description"
                                            value={policyForm.description}
                                            onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                                        />
                                        <select
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            value={policyForm.severity}
                                            onChange={(e) => setPolicyForm({ ...policyForm, severity: e.target.value })}
                                        >
                                            <option value="critical">Critical</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Required phrases (comma separated)"
                                            value={policyForm.requiredPhrases}
                                            onChange={(e) =>
                                                setPolicyForm({ ...policyForm, requiredPhrases: e.target.value })
                                            }
                                        />
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Forbidden phrases (comma separated)"
                                            value={policyForm.forbiddenPhrases}
                                            onChange={(e) =>
                                                setPolicyForm({ ...policyForm, forbiddenPhrases: e.target.value })
                                            }
                                        />
                                        <input
                                            className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none"
                                            placeholder="Channels (comma, e.g., email,sms,all)"
                                            value={policyForm.channels}
                                            onChange={(e) => setPolicyForm({ ...policyForm, channels: e.target.value })}
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Save Policy
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="p-6 border border-white/10 bg-black/30">
                                <h3 className="text-gold font-serif text-xl mb-4">Evaluate Content</h3>
                                <form onSubmit={handleEvaluationSubmit} className="space-y-3">
                                    <textarea
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none"
                                        rows={4}
                                        placeholder="Paste a draft response or campaign asset to validate…"
                                        value={evaluationInput}
                                        onChange={(e) => setEvaluationInput(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
                                    >
                                        Run Compliance Check
                                    </button>
                                    {evaluationStatus.error && (
                                        <p className="text-xs text-red-400">{evaluationStatus.error}</p>
                                    )}
                                    {evaluationStatus.success && (
                                        <p className="text-xs text-gold">{evaluationStatus.success}</p>
                                    )}
                                </form>
                                {evaluationResult && (
                                    <div className="mt-6 space-y-4">
                                        {evaluationResult.evaluation?.map((item) => (
                                            <div
                                                key={item.policy.id}
                                                className={`p-4 border ${item.passed ? 'border-emerald-500/40' : 'border-red-500/40'
                                                    } bg-white/5`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-white">
                                                        {item.policy.name}{' '}
                                                        {item.passed ? (
                                                            <CheckCircle2 className="inline text-emerald-400 ml-2" size={16} />
                                                        ) : (
                                                            <AlertTriangle className="inline text-red-400 ml-2" size={16} />
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-white/50 uppercase">
                                                        {item.policy.severity}
                                                    </span>
                                                </div>
                                                {item.passed ? (
                                                    <p className="text-xs text-emerald-300">No violations.</p>
                                                ) : (
                                                    <ul className="text-xs text-red-300 list-disc ml-4">
                                                        {item.violations.map((violation, index) => (
                                                            <li key={index}>
                                                                {violation.type}: {violation.detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                        {evaluationResult.signature && (
                                            <div className="p-4 bg-white/5 border border-white/10 text-xs text-white/60">
                                                <div className="uppercase text-white/40 mb-1">System Signature</div>
                                                <div>
                                                    Signature Hash:{' '}
                                                    <span className="text-white">
                                                        {evaluationResult.signature.signature || 'n/a'}
                                                    </span>
                                                </div>
                                                <div>
                                                    Authentic:{' '}
                                                    {evaluationResult.signature.verification?.authentic ? 'Yes' : 'No'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'strategy' && <StrategyCenter />}
                    {activeTab === 'content' && <Workshop />}
                    {activeTab === 'comms' && <ChiefOfStaff />}
                    {activeTab === 'guide' && <Guide />}

                </main>
            </div>
        </div>
    );
};

export default Atrium;
