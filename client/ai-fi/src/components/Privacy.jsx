import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-serif text-white">Privacy Policy</h1>
                <p className="text-white/70">
                    We respect your privacy. This policy explains what data we collect, why we collect it, and how we use it.
                </p>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Data We Collect</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Account data (name, email), business information (company details, preferences), and operational data
                        (messages, bookings, logs) needed to provide the Services.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">How We Use Data</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        To deliver and improve the Services, personalize automation, provide support, and communicate with you.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Sharing</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        We do not sell your data. We may share with trusted providers (e.g., hosting, messaging, payments) to operate the Services,
                        subject to confidentiality and data protection obligations. We may disclose if required by law.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Security</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        We apply reasonable technical and organizational measures to protect your data. No system is 100% secure; please use strong credentials.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Your Rights</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        You can access, update, export, or delete your data. Contact us at privacy@ai-fi.app to exercise these rights.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Retention</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        We retain data as needed to provide the Services and comply with legal obligations. You may request deletion.
                    </p>
                </section>
                <section className="space-y-3">
                    <h2 className="text-2xl font-serif text-white">Contact</h2>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Questions? Contact privacy@ai-fi.app.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
