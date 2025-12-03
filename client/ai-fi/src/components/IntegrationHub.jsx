import React, { useEffect, useState } from 'react';
import { Check, Link as LinkIcon, Loader2, PlugZap, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import api from '../utils/api';
import { useToast } from './ToastProvider';

const IntegrationHub = ({ onComplete }) => {
    const [connectors, setConnectors] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [statusMessage, setStatusMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchConnectors = async () => {
        setLoading(true);
        try {
            const user = localStorage.getItem('ai-fi-user');
            const tenantId = user ? JSON.parse(user).tenantId : undefined;
            const data = await api.listConnectors(tenantId);
            setConnectors(data.connectors || []);
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Unable to load connectors.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnectors();
    }, []);

    const handleInputChange = (connectorId, fieldId, value) => {
        setFormValues((prev) => ({
            ...prev,
            [connectorId]: {
                ...(prev[connectorId] || {}),
                [fieldId]: value,
            },
        }));
    };

    const handleConnect = async (connectorId) => {
        setStatusMessage(null);
        try {
            const user = localStorage.getItem('ai-fi-user');
            const tenantId = user ? JSON.parse(user).tenantId : undefined;
            const data = await api.connectConnector(connectorId, tenantId, formValues[connectorId] || {});
            setConnectors(data.connectors || data || []);
            setStatusMessage({ type: 'success', text: 'Connector activated.' });
            toast({ title: 'Connector', message: 'Connector activated', tone: 'success' });
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Unable to connect. Check credentials.' });
            toast({ title: 'Connector', message: 'Unable to connect', tone: 'error' });
        }
    };

    const handleDisconnect = async (connectorId) => {
        setStatusMessage(null);
        try {
            const user = localStorage.getItem('ai-fi-user');
            const tenantId = user ? JSON.parse(user).tenantId : undefined;
            const data = await api.disconnectConnector(connectorId, tenantId);
            setConnectors(data.connectors || data || []);
            setStatusMessage({ type: 'success', text: 'Connector disconnected.' });
            toast({ title: 'Connector', message: 'Connector disconnected', tone: 'info' });
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Unable to disconnect.' });
            toast({ title: 'Connector', message: 'Unable to disconnect', tone: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white">
            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Neural Link
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Connect your tools so AI can book, message, monitor, and report across every channel—always with your approval guardrails.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border border-white/5 bg-white/5 p-6 animate-pulse rounded-lg">
                                <div className="h-4 w-24 bg-white/10 mb-3" />
                                <div className="h-3 w-40 bg-white/5" />
                            </div>
                        ))}
                    </div>
                ) : connectors.length ? (
                    <div className="space-y-4">
                        {connectors.map((connector) => {
                            const isConnected = connector.status === 'connected';
                            return (
                                <div
                                    key={connector.id}
                                    className={`relative overflow-hidden border ${isConnected ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/5'} p-6 rounded-lg`}
                                >
                                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(255,215,0,0.3), transparent 35%)' }} />
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div>
                                            <h3 className="text-xl font-serif">{connector.name}</h3>
                                            <p className="text-white/60 text-sm">{connector.description}</p>
                                        </div>
                                        <div className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                                            {isConnected ? (
                                                <>
                                                    <ShieldCheck className="text-gold" size={16} />
                                                    Connected
                                                </>
                                            ) : (
                                                <>
                                                    <PlugZap className="text-white/40" size={16} />
                                                    Disconnected
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-white/50 mt-2 relative z-10">
                                        <div className="inline-flex items-center gap-1 px-2 py-1 border border-white/10 rounded-full">
                                            <KeyRound size={12} />
                                            {connector.fields.length ? `${connector.fields.length} keys` : 'No keys needed'}
                                        </div>
                                        {connector.docsUrl && (
                                            <a
                                                href={connector.docsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 hover:text-gold"
                                            >
                                                <LinkIcon size={14} />
                                                Docs
                                            </a>
                                        )}
                                    </div>
                                    {connector.maskedConfig && (
                                        <div className="text-xs text-white/50 mt-3">
                                            Active config:{' '}
                                            {Object.entries(connector.maskedConfig)
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(', ')}
                                        </div>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                                        {connector.fields.map((field) => (
                                            <input
                                                key={field.id}
                                                className="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-gold focus:outline-none text-sm"
                                                placeholder={field.label}
                                                value={formValues[connector.id]?.[field.id] || ''}
                                                onChange={(e) =>
                                                    handleInputChange(connector.id, field.id, e.target.value)
                                                }
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button
                                            onClick={() => handleConnect(connector.id)}
                                            className="px-4 py-2 bg-gold text-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            Connect
                                        </button>
                                        {isConnected && (
                                            <button
                                                onClick={() => handleDisconnect(connector.id)}
                                                className="px-4 py-2 border border-white/20 text-xs uppercase tracking-widest hover:border-gold"
                                            >
                                                Disconnect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-white/60 border border-white/10 bg-white/5 rounded-lg p-8">
                        No connectors available yet. We will light these up once your tenant is provisioned.
                    </div>
                )}

                {statusMessage && (
                    <div
                        className={`flex items-center gap-2 text-sm ${
                            statusMessage.type === 'error' ? 'text-red-300' : 'text-gold'
                        }`}
                    >
                        {statusMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
                        {statusMessage.text}
                    </div>
                )}

                <div className="flex justify-center pt-8">
                    <button
                        onClick={onComplete}
                        className="group flex items-center space-x-4 px-8 py-4 bg-white text-black hover:bg-gold transition-colors"
                    >
                        <span className="uppercase tracking-[0.2em] text-sm font-bold">Initialize System</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationHub;
