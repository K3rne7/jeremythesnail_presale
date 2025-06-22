
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7F00FF', // Vivid Violet
          DEFAULT: '#5E00BC', // Darker Violet
          dark: '#400080',  // Deep Purple
        },
        secondary: {
          light: '#00FFA3', // Bright Mint
          DEFAULT: '#00D688', // Strong Mint
          dark: '#00A86B', // Dark Mint
        },
        accent: {
          light: '#FFD700', // Gold
          DEFAULT: '#FFC400', // Bright Gold
          dark: '#B8860B', // Dark Goldenrod
        },
        neutral: {
          light: '#F3F4F6', // Gray 100
          DEFAULT: '#1F2937', // Gray 800
          dark: '#111827', // Gray 900
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F2937',
          '900': '#111827',
        },
        'jsnail-green': '#32CD32', // Lime Green (body)
        'jsnail-purple': '#8A2BE2', // Blue Violet (shell)
        'jsnail-gold': '#FFD700', // Gold (chain)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'gradient-bg': 'gradient-bg 15s ease infinite',
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'subtle-bob': 'subtle-bob 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-bg': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px #FFD700)' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px #FFD700) drop-shadow(0 0 25px #FFD700)' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'subtle-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      backgroundImage: {
        'hero-pattern': "url('https://raw.githubusercontent.com/username-placeholder/jeremy-presale-assets/main/jeremy-presale-1.jpg')", // Example, replace with your actual image path
        'throne-pattern': "url('https://raw.githubusercontent.com/username-placeholder/jeremy-presale-assets/main/jeremy-presale-2.jpg')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
