/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(260, 80%, 60%)',
                    dark: 'hsl(260, 80%, 50%)',
                },
                secondary: 'hsl(200, 90%, 55%)',
                accent: 'hsl(340, 85%, 60%)',
                'bg-dark': 'hsl(240, 20%, 10%)',
                'bg-darker': 'hsl(240, 25%, 5%)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            backdropBlur: {
                'glass': '20px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'glow-primary': '0 0 20px rgba(127, 90, 240, 0.3)',
                'glow-secondary': '0 0 20px rgba(56, 189, 248, 0.3)',
                'glow-accent': '0 0 20px rgba(244, 63, 94, 0.3)',
            },
            animation: {
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                'pulse-ring': {
                    '0%': {
                        transform: 'translate(-50%, -50%) scale(0.8)',
                        opacity: '1',
                    },
                    '100%': {
                        transform: 'translate(-50%, -50%) scale(2)',
                        opacity: '0',
                    },
                },
                'glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(56, 189, 248, 0.6)',
                    },
                },
            },
        },
    },
    plugins: [],
}
