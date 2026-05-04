/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(14,90,180,0.06), 0 4px 16px -2px rgba(14,90,180,0.08)',
        'card-hover': '0 8px 28px -4px rgba(14,90,180,0.15), 0 2px 8px rgba(14,90,180,0.07)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.22)',
        'glow-mint': '0 0 20px rgba(16,185,129,0.22)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.22)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out both',
        'slide-up': 'slideUp 0.45s ease-out both',
        'slide-in': 'slideIn 0.4s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
        'float': 'float 7s ease-in-out infinite',
        'spin-slow': 'spin 16s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-14px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.94)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
