/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        scada: {
          bg: '#F4F6F9',
          sidebar: '#0B1120',
          border: '#1E293B',
          card: '#FFFFFF',
          accent: '#2563EB',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
          cyan: '#06B6D4',
        }
      },
      boxShadow: {
        'scada-card': '0 2px 10px -3px rgba(6, 81, 237, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'scada-elevated': '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 15px rgba(244, 63, 94, 0.4)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-scan': 'laserScan 2s ease-in-out infinite',
      },
      keyframes: {
        laserScan: {
          '0%, 100%': { top: '5%' },
          '50%': { top: '92%' },
        }
      }
    }
  },
  plugins: [],
}
