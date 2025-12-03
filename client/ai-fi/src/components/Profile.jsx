import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Save, Edit, LogOut, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { useToast } from './ToastProvider';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        companyName: '',
        industry: '',
        description: '',
        email: '',
        phone: '',
        website: ''
    });
    const [plan, setPlan] = useState({ plan: 'free', trialEndsAt: null });
    const [status, setStatus] = useState({ loading: true, error: null, saving: false });
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('ai-fi-token');
                const user = localStorage.getItem('ai-fi-user');
                let email = '';
                if (user) email = JSON.parse(user).email;

                if (token && email) {
                    try {
                        const { profile: apiProfile } = await api.getProfile(email);
                        setProfile({
                            companyName: apiProfile.companyName,
                            industry: apiProfile.industry,
                            description: apiProfile.description,
                            email: apiProfile.email,
                            phone: apiProfile.phone,
                            website: apiProfile.website
                        });
                    } catch (err) {
                        // Not found; fallback to local data
                        const savedProfile = localStorage.getItem('ai-fi-profile');
                        if (savedProfile) setProfile(JSON.parse(savedProfile));
                        if (email && (!profile.email || profile.email === '')) {
                            setProfile((p) => ({ ...p, email }));
                        }
                    }
                    const billing = await api.getBillingStatus(email);
                    setPlan({ plan: billing.plan, trialEndsAt: billing.trialEndsAt });
                } else {
                    const savedProfile = localStorage.getItem('ai-fi-profile');
                    if (savedProfile) setProfile(JSON.parse(savedProfile));
                }
            } catch (error) {
                setStatus((s) => ({ ...s, error: 'Failed to load profile' }));
            } finally {
                setStatus((s) => ({ ...s, loading: false }));
            }
        };
        init();
    }, []);

    const handleSave = async () => {
        setStatus((s) => ({ ...s, saving: true, error: null }));
        try {
            await api.updateProfile(profile.email || profile.companyName, profile);
            localStorage.setItem('ai-fi-profile', JSON.stringify(profile));
            setIsEditing(false);
            toast({ title: 'Profile', message: 'Profile saved', tone: 'success' });
        } catch (error) {
            setStatus((s) => ({ ...s, error: 'Unable to save profile' }));
            toast({ title: 'Profile', message: 'Unable to save profile', tone: 'error' });
        } finally {
            setStatus((s) => ({ ...s, saving: false }));
        }
    };

    const goToCheckout = async () => {
        try {
            const resp = await api.createCheckoutSession(profile.email, plan.plan || 'growth');
            if (resp?.url) {
                setCheckoutUrl(resp.url);
                window.location.href = resp.url;
            }
        } catch (e) {
            setStatus((s) => ({ ...s, error: 'Unable to start checkout' }));
            toast({ title: 'Billing', message: 'Unable to start checkout', tone: 'error' });
        }
    };

    const logout = () => {
        localStorage.removeItem('ai-fi-token');
        localStorage.removeItem('ai-fi-user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">Company Profile</h1>
                        <p className="text-white/60">Manage your business information</p>
                    </div>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gold text-black hover:bg-white transition-colors disabled:opacity-60"
                        disabled={status.saving}
                    >
                        {isEditing ? (
                            <>
                                <Save size={16} />
                                <span>{status.saving ? 'Saving…' : 'Save Changes'}</span>
                            </>
                        ) : (
                            <>
                                <Edit size={16} />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-6 p-8 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-lg shadow-xl shadow-black/30">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="text-sm text-white/80 flex items-center space-x-2">
                            <Building size={16} />
                            <span>Company Name</span>
                        </label>
                        <input
                            type="text"
                            value={profile.companyName}
                            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Your Company Inc."
                        />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Industry</label>
                        <input
                            type="text"
                            value={profile.industry}
                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="E.g., E-commerce, Consulting, Real Estate"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm text-white/80">What does your business do?</label>
                        <textarea
                            value={profile.description}
                            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                            disabled={!isEditing}
                            rows={4}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            placeholder="Tell us about your business..."
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/80 flex items-center space-x-2">
                                <Mail size={16} />
                                <span>Email</span>
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="contact@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/80">Phone</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                disabled={!isEditing}
                                className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-white/80">Website</label>
                        <input
                            type="url"
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="https://yourcompany.com"
                        />
                    </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8 flex justify-between items-center p-6 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/30">
                    <div>
                        <div className="flex items-center space-x-2">
                            <ShieldCheck size={18} className="text-gold" />
                            <h3 className="text-white font-semibold mb-1">Current Plan</h3>
                        </div>
                        <p className="text-white/60 text-sm">
                            {plan.plan ? plan.plan.toUpperCase() : 'FREE'}{plan.trialEndsAt ? ` · Trial ends ${new Date(plan.trialEndsAt).toLocaleDateString()}` : ''}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => window.location.href = '/hq'}
                            className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-colors flex items-center space-x-2 rounded-full"
                        >
                            <CreditCard size={16} />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={goToCheckout}
                            className="px-4 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center space-x-2 rounded-full"
                        >
                            <CreditCard size={16} />
                            <span>Manage Plan</span>
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-3 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center space-x-2 rounded-full"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
                {status.error && <p className="text-red-300 text-sm mt-3">{status.error}</p>}
                {status.loading && <p className="text-white/50 text-sm mt-3">Loading profile…</p>}
                {checkoutUrl && <p className="text-white/60 text-sm mt-3">Redirecting to billing…</p>}
            </div>
        </div>
    );
};

export default Profile;
