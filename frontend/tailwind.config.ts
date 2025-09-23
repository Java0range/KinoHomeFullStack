import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                'bg-pan': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                'float-slow': {
                    '0%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(10px, -12px)' },
                    '100%': { transform: 'translate(0, 0)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                'grow-x': {
                    '0%': { transform: 'scaleX(0)' },
                    '100%': { transform: 'scaleX(1)' },
                },
            },
            animation: {
                'bg-pan': 'bg-pan 18s ease-in-out infinite',
                'float-slow': 'float-slow 14s ease-in-out infinite',
                'fade-in-up': 'fade-in-up .8s cubic-bezier(0.22,1,0.36,1) both',
                'grow-x': 'grow-x .8s .3s ease-out both',
            },
        },
    },
    plugins: [],
} satisfies Config