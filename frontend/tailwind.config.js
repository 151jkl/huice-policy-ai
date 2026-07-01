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
          DEFAULT: '#1677FF',
          hover: '#0958D9',
          light: '#E6F0FF',
          lighter: '#BAE0FF',
        },
        secondary: '#F5F7FA',
        success: {
          DEFAULT: '#52C41A',
          light: '#F6FFED',
        },
        warning: {
          DEFAULT: '#FAAD14',
          light: '#FFFBE6',
        },
        danger: {
          DEFAULT: '#FF4D4F',
          light: '#FFF1F0',
        },
        ink: {
          DEFAULT: '#1F1F1F',
          secondary: '#595959',
          weak: '#8C8C8C',
        },
        border: {
          DEFAULT: '#D9D9D9',
          light: '#F0F0F0',
        },
        highlight: {
          bg: '#FFF7E6',
          border: '#FA8C16',
        },
        highContrast: {
          text: '#000000',
          bg: '#FFF9DB',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-l': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
        'amount': ['56px', { lineHeight: '1.0', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '12px',
        'modal': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(22,119,255,0.12)',
        'modal': '0 8px 32px rgba(0,0,0,0.16)',
        'nav': '0 1px 4px rgba(0,0,0,0.04)',
        'a11y': '0 -2px 8px rgba(0,0,0,0.06)',
        'glow': '0 0 40px rgba(22,119,255,0.3)',
        'glow-lg': '0 0 80px rgba(22,119,255,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'blob': 'blob 7s infinite',
        'blob-delay': 'blob 7s infinite 2s',
        'blob-slow': 'blob 12s infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-delayed': 'fadeInUp 0.6s ease-out 0.2s both',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(22,119,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(22,119,255,0.4)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
