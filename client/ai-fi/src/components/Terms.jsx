import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-serif text-white">Terms of Service</h1>
                <p className="text-white/70">
                    Welcome to AI-Fi. These Terms of Service (“Terms”) govern your use of our products and services.
                    By using AI-Fi, you agree to these Terms.
                </p>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">1. Services</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        We provide AI-powered automation and strategist support for business operations, including scheduling,
                        messaging, analytics, and related services (“Services”). We may update or improve the Services over time.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">2. Accounts</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        You are responsible for maintaining the confidentiality of your account and credentials.
                        You must provide accurate information and promptly update any changes.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">3. Acceptable Use</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        You agree not to misuse the Services, attempt unauthorized access, or violate applicable laws.
                        We may suspend or terminate access for violations.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">4. Payments & Plans</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Paid plans are billed as agreed. You are responsible for applicable taxes. Changes to your plan will
                        be reflected on subsequent billing cycles. Refunds are handled according to your agreement or local law.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">5. Data</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        You retain ownership of your data. We use your data to deliver the Services and improve them.
                        See our Privacy Policy for details on data handling.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">6. Disclaimers & Liability</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        The Services are provided “as is” without warranties. To the fullest extent permitted by law,
                        AI-Fi will not be liable for indirect or consequential damages.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">7. Termination</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        You may stop using the Services at any time. We may suspend or terminate your access for violations of these Terms
                        or if required by law.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">8. Contact</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Questions? Contact us at support@ai-fi.app.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
