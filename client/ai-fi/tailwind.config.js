/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Clean Black & White Palette (OpenAI-inspired)
                'void': '#050505',
                'obsidian': '#0A0A0A',
                'charcoal': '#121212',
                'accent': {
                    DEFAULT: '#FFFFFF',
                    'dim': '#A0A0A0',
                    'glow': '#FFFFFF'
                },
                // Alias gold to white for compatibility
                'gold': {
                    DEFAULT: '#FFFFFF',
                    'dim': '#A0A0A0',
                    'glow': '#FFFFFF'
                },
                'glass': 'rgba(255, 255, 255, 0.05)'
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            },
            backgroundImage: {
                'luxury-gradient': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
                'accent-sheen': 'linear-gradient(45deg, #FFFFFF 0%, #E0E0E0 50%, #FFFFFF 100%)'
            }
        },
    },
    plugins: [],
}
