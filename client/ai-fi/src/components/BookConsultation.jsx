import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';

const BookConsultation = () => {
    useEffect(() => {
        // Load Calendly widget script
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gold rounded-full mx-auto flex items-center justify-center">
                        <Calendar size={32} className="text-black" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white">Let's Talk</h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Have questions? Need bespoke pricing? Book a <span className="text-gold">free, no-pressure call</span> with our team to discuss how AI-Fi can transform your operations.
                    </p>
                </div>

                {/* Calendly inline widget */}
                <div
                    className="calendly-inline-widget border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/30"
                    data-url="https://calendly.com/your-calendly-username/30min?hide_gdpr_banner=1&background_color=000000&text_color=ffffff&primary_color=d4af37"
                    style={{ minWidth: '320px', height: '700px' }}
                ></div>

                <p className="text-xs text-white/40 text-center max-w-xl mx-auto">
                    We respect your time. This is a genuine conversation to understand your needs, not a sales pitch.
                    Perfect for teams evaluating enterprise plans or custom integrations.
                </p>
            </div>
        </div>
    );
};

export default BookConsultation;
