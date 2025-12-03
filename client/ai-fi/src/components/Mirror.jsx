import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Mirror = ({ data }) => {
    const [dna, setDna] = useState(null);

    useEffect(() => {
        // Simulate API call to generate Sigil
        setTimeout(() => {
            setDna({
                hash: 'BIP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                colors: ['#D4AF37', '#000000'], // Default Gold/Black
                geometry: 'Spiral'
            });
        }, 1500);
    }, [data]);

    if (!dna) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-gold/60 tracking-widest text-sm">SYNTHESIZING BRAND DNA...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-64 h-64 md:w-96 md:h-96"
            >
                {/* The Sigil Container */}
                <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse-slow" />
                <div className="absolute inset-4 rounded-full border border-gold/20 animate-spin-slow" style={{ animationDuration: '20s' }} />

                {/* The Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <h2 className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold to-white/50">
                            {data.name?.[0]}
                        </h2>
                        <div className="text-xs text-gold/60 tracking-[0.3em]">{dna.hash}</div>
                    </div>
                </div>
            </motion.div>

            <div className="text-center space-y-2 max-w-md">
                <h3 className="text-2xl font-serif text-white">Identity Established</h3>
                <p className="text-white/60">
                    Your digital avatar has been forged. It is now ready to generate content aligned with your mission.
                </p>
            </div>
        </div>
    );
};

export default Mirror;
