import React from 'react';


const GlobalStyles = () => (
    <style>{`
        :root {
            --font-display: 'Playfair Display', serif;
            --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body {
            font-family: var(--font-sans);
            letter-spacing: 0.01em;
        }
        h1, h2, h3, .font-serif {
            font-family: var(--font-display);
            letter-spacing: 0.01em;
        }
    `}</style>
);

export default GlobalStyles;
