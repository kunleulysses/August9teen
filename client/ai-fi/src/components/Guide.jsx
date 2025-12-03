import React from 'react';
import { Play, BookOpen, Terminal } from 'lucide-react';

const tutorials = [
    {
        id: 'genesis',
        title: 'Genesis Protocol',
        desc: 'Understanding your Brand Sigil and DNA.',
        duration: '2 min',
        icon: Terminal
    },
    {
        id: 'strategy',
        title: 'Strategy Center',
        desc: 'How to interpret market signals and execute moves.',
        duration: '5 min',
        icon: Play
    },
    {
        id: 'content',
        title: 'Content Workshop',
        desc: 'Approving and refining AI-generated campaigns.',
        duration: '3 min',
        icon: BookOpen
    },
    {
        id: 'singularity',
        title: 'Global Intelligence',
        desc: 'How your AI learns from the collective wisdom of the network.',
        duration: '1 min',
        icon: Terminal
    }
];

const Guide = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h2 className="text-3xl font-serif text-white mb-4">System Manual</h2>
                <p className="text-white/60">Master the controls of your Digital Headquarters.</p>
            </div>

            <div className="grid gap-6">
                {tutorials.map((tut) => (
                    <div
                        key={tut.id}
                        className="group flex items-center p-6 border border-white/10 bg-white/5 hover:border-gold hover:bg-gold/5 transition-all cursor-pointer"
                    >
                        <div className="p-4 bg-black border border-white/10 rounded-full mr-6 group-hover:border-gold transition-colors">
                            <tut.icon size={24} className="text-white group-hover:text-gold" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-serif text-white mb-1 group-hover:text-gold transition-colors">{tut.title}</h3>
                            <p className="text-sm text-white/60">{tut.desc}</p>
                        </div>

                        <div className="text-xs text-white/40 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                            {tut.duration}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 border border-gold/30 bg-gold/5 rounded-lg">
                <h3 className="text-gold font-serif text-lg mb-2">Chief of Staff Note</h3>
                <p className="text-sm text-white/80 italic">
                    "The system learns from your actions. The more you use the Strategy Center, the sharper its predictions become. Do not hesitate to reject content in the Workshop; it is the fastest way to align the neural network with your taste."
                </p>
            </div>
        </div>
    );
};

export default Guide;
