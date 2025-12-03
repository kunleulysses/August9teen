import React from 'react';

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center space-y-4">
            <div className="text-6xl font-serif text-gold">404</div>
            <div className="text-2xl font-serif">Page not found</div>
            <p className="text-white/60">The link you followed doesn’t exist. Head back home.</p>
            <a href="/" className="inline-block px-6 py-3 border border-white/20 rounded-full hover:border-gold transition-colors">
                Return Home
            </a>
        </div>
    </div>
);

export default NotFound;
