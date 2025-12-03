import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import api from '../utils/api';
import { useToast } from './ToastProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('login'); // login | register
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const fn = mode === 'login' ? api.login.bind(api) : api.register.bind(api);
            const { token, user } = await fn(email, password);
            if (token) {
                localStorage.setItem('ai-fi-token', token);
                localStorage.setItem('ai-fi-user', JSON.stringify(user));
                window.location.href = '/hq';
            }
        } catch (err) {
            setError(err.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
            toast({ title: 'Auth', message: err.message || 'Authentication failed', tone: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="max-w-md w-full space-y-8 p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/40">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gold rounded-full flex items-center justify-center text-black">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-3xl font-serif text-gold">Access Terminal</h2>
                    <p className="text-white/40 text-sm tracking-widest uppercase">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/60">Identity Key (Email)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-gold focus:outline-none transition-colors"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/60">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-gold focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <span>{loading ? 'Please wait…' : mode === 'login' ? 'Authenticate' : 'Create Account'}</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                {error && <p className="text-red-300 text-sm text-center">{error}</p>}

                <div className="text-center">
                    <a href="/onboard" className="text-xs text-white/40 hover:text-gold transition-colors uppercase tracking-widest">
                        New Entity? Initialize Genesis Protocol
                    </a>
                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-xs text-white/50 hover:text-gold transition-colors uppercase tracking-widest"
                        >
                            {mode === 'login' ? 'Create account' : 'Already have access? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
