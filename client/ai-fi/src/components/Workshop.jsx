import React, { useState, useEffect } from 'react';
import { PenTool, Image as ImageIcon, Send, Check, X, Calendar, Edit3, Zap, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const Workshop = () => {
    const [contentQueue, setContentQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('queue');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get transcendent synthesis (content generation)
            const response = await api.getContentQueue();

            // Transform the response into content items
            if (response?.result) {
                const mockContent = [
                    {
                        id: 1,
                        type: 'social',
                        platform: 'LinkedIn',
                        content: typeof response.result === 'string' ? response.result.substring(0, 120) : 'New AI-driven insights ready! 🚀',
                        image: null,
                        status: 'pending',
                        generatedAt: '10m ago'
                    },
                ];
                setContentQueue(mockContent);
            } else {
                // Fallback to mock data
                setContentQueue([
                    {
                        id: 1,
                        type: 'social',
                        platform: 'LinkedIn',
                        content: 'Excited to announce our new AI-driven dashboard! 🚀',
                        status: 'pending',
                        generatedAt: '10m ago'
                    },
                ]);
            }
        } catch (err) {
            console.error('Failed to load content:', err);
            setError('Failed to load content. Please try again.');
            // Fallback to mock data on error
            setContentQueue([
                {
                    id: 1,
                    type: 'social',
                    platform: 'LinkedIn',
                    content: 'Excited to announce our new AI-driven analytics dashboard! 🚀 #TechNews #AI',
                    image: null,
                    status: 'pending',
                    generatedAt: '10m ago'
                },
                {
                    id: 2,
                    type: 'email',
                    platform: 'Newsletter',
                    subject: 'Weekly Insights: The Future of Automation',
                    content: 'Hi {{firstName}}, this week we are diving deep into how automation is reshaping...',
                    image: null,
                    status: 'pending',
                    generatedAt: '1h ago'
                },
                {
                    id: 3,
                    type: 'social',
                    platform: 'Instagram',
                    content: 'Behind the scenes at our annual retreat. 🌲',
                    image: 'https://via.placeholder.com/300',
                    status: 'approved',
                    generatedAt: 'Yesterday'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approved') {
                await api.approveContent(id);
            } else if (action === 'rejected') {
                await api.rejectContent(id);
            }
            setContentQueue(prev => prev.map(item =>
                item.id === id ? { ...item, status: action } : item
            ));
        } catch (err) {
            console.error('Failed to update content:', err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">The Workshop</h2>
                    <p className="text-white/60">Review, edit, and approve AI-generated content.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-xs text-gold uppercase tracking-widest">Production Status</div>
                        <div className="text-white font-bold">GENERATING ASSETS</div>
                    </div>
                    <PenTool className="text-gold animate-pulse-slow" size={32} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6 border-b border-white/10">
                {['queue', 'calendar', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-gold border-b-2 border-gold' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Queue */}
            {activeTab === 'queue' && (
                <div className="grid gap-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-white/20">
                            <div className="animate-spin mr-2"><Zap size={20} /></div> Assembling Drafts...
                        </div>
                    ) : (
                        contentQueue.filter(item => item.status === 'pending').length === 0 ? (
                            <div className="text-center py-20 border border-white/10 bg-white/5">
                                <CheckCircle2 size={48} className="mx-auto text-white/20 mb-4" />
                                <p className="text-white/60">All caught up! No pending drafts.</p>
                            </div>
                        ) : (
                            contentQueue.filter(item => item.status === 'pending').map(item => (
                                <div key={item.id} className="p-6 border border-white/10 bg-black/30 flex flex-col md:flex-row gap-6">
                                    {/* Preview */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gold border border-gold/20 px-2 py-0.5 uppercase">{item.platform}</span>
                                            <span className="text-xs text-white/30">{item.generatedAt}</span>
                                        </div>

                                        {item.subject && (
                                            <div className="text-white font-serif text-lg">{item.subject}</div>
                                        )}

                                        <div className="p-4 bg-white/5 rounded text-white/80 text-sm whitespace-pre-wrap font-mono">
                                            {item.content}
                                        </div>

                                        {item.image && (
                                            <div className="relative h-48 bg-black/50 flex items-center justify-center border border-white/10">
                                                <ImageIcon className="text-white/20" />
                                                <span className="ml-2 text-xs text-white/40">Image Placeholder</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full md:w-48 flex flex-col gap-3 justify-center border-l border-white/10 pl-6">
                                        <button
                                            onClick={() => handleAction(item.id, 'approved')}
                                            className="w-full py-3 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                        <button className="w-full py-3 bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                            <Edit3 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleAction(item.id, 'rejected')}
                                            className="w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}

            {/* Calendar Placeholder */}
            {activeTab === 'calendar' && (
                <div className="h-96 border border-white/10 bg-black/30 flex items-center justify-center text-white/20">
                    <div className="text-center">
                        <Calendar size={48} className="mx-auto mb-4" />
                        <p>Content Calendar Module Loading...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workshop;
