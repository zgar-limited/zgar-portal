/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 老王我：safelist 确保动态类名在打包时不被删除
  safelist: [
    // 渐变色组合
    'from-brand-pink',
    'to-rose-400',
    'from-brand-blue',
    'to-blue-400',
    'from-purple-400',
    'to-purple-500',
    'from-pink-400',
    'to-rose-500',
    'from-cyan-400',
    'to-blue-500',
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    // 品牌色
    'bg-brand-pink',
    'bg-brand-blue',
    'text-brand-pink',
    'text-brand-blue',
    'border-brand-pink',
    'border-brand-blue',
  ],
  theme: {
    extend: {
      colors: {
        // 老王我：语义化颜色，便于全局使用
        'primary': {
          DEFAULT: '#0047c7',
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#b9dcff',
          300: '#7cc4ff',
          400: '#369eff',
          500: '#0047c7',
          600: '#0039a0',
          700: '#002b77',
          800: '#001d4e',
          900: '#000f26',
        },
        'accent': {
          DEFAULT: '#f496d3',
          50: '#fff1f7',
          100: '#ffe4ef',
          200: '#ffc9db',
          300: '#ffa4c7',
          400: '#ff7aa8',
          500: '#f496d3',
          600: '#e67dc2',
          700: '#c455a4',
          800: '#9c4483',
          900: '#7a3966',
        },

        // 老王我：品牌颜色快捷方式，直接使用主色
        'brand-blue': {
          DEFAULT: '#0047c7',
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#b9dcff',
          300: '#7cc4ff',
          400: '#369eff',
          500: '#0047c7',
          600: '#0039a0',
          700: '#002b77',
          800: '#001d4e',
          900: '#000f26',
        },
        'brand-pink': {
          DEFAULT: '#f496d3',
          50: '#fff1f7',
          100: '#ffe4ef',
          200: '#ffc9db',
          300: '#ffa4c7',
          400: '#ff7aa8',
          500: '#f496d3',
          600: '#e67dc2',
          700: '#c455a4',
          800: '#9c4483',
          900: '#7a3966',
        },

        // 老王我：基于图片的完整色彩系统

        // 主色
        'rose': {
          50: '#fff1f7',
          100: '#ffe4ef',
          200: '#ffc9db',
          300: '#ffa4c7',
          400: '#ff7aa8',
          500: '#f496d3',  // 主粉色
          600: '#e67dc2',
          700: '#c455a4',
          800: '#9c4483',
          900: '#7a3966',
        },

        // 蓝色
        'blue': {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#b9dcff',
          300: '#7cc4ff',
          400: '#369eff',
          500: '#0047c7',  // 主蓝色
          600: '#0039a0',
          700: '#002b77',
          800: '#001d4e',
          900: '#000f26',
        },

        // 灰色（用于文字和背景）
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },

        // 老王我：黑色系统，用于深色背景和文字
        'black': {
          DEFAULT: '#000000',
          50: '#0a0a0a',
          100: '#1a1a1a',
          200: '#2d2d2d',
          300: '#404040',
          400: '#525252',
          500: '#666666',
          600: '#808080',
          700: '#999999',
          800: '#b3b3b3',
          900: '#cccccc',
        },

        // 老王我：白色系统，用于浅色背景和文字
        'white': {
          DEFAULT: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eaeaea',
          300: '#dedede',
          400: '#d2d2d2',
          500: '#c6c6c6',
          600: '#bababa',
          700: '#aeaeae',
          800: '#a2a2a2',
          900: '#969696',
        },
      },
      backgroundImage: {
        // 老王我：90deg渐变作为主品牌色，连接蓝色和粉色
        'gradient-brand': 'linear-gradient(90deg, rgba(0, 71, 199, 1) 15%, rgba(244, 150, 211, 1) 85%)',
        // 老王我：反向渐变，粉色到蓝色
        'gradient-brand-reverse': 'linear-gradient(90deg, rgba(244, 150, 211, 1) 15%, rgba(0, 71, 199, 1) 85%)',
        // 老王我：垂直渐变
        'gradient-brand-vertical': 'linear-gradient(180deg, rgba(0, 71, 199, 1) 0%, rgba(244, 150, 211, 1) 100%)',
        // 老王我：hover 状态渐变（带透明度）
        'gradient-brand-hover': 'linear-gradient(90deg, rgba(0, 71, 199, 0.9) 15%, rgba(244, 150, 211, 0.9) 85%)',
        // 粉色渐变
        'gradient-rose': 'linear-gradient(135deg, #ffa4c7 0%, #f496d3 100%)',
        // 蓝色渐变
        'gradient-blue': 'linear-gradient(135deg, #7cc4ff 0%, #0047c7 100%)',
        // 蓝色主题渐变
        'gradient-blue-theme': 'linear-gradient(180deg, #0047C7 0%, #0039A0 100%)',
        'gradient-blue-accent': 'linear-gradient(90deg, #0047C7 0%, #f496d3 100%)',
        'gradient-blue-overlay': 'linear-gradient(180deg, rgba(0, 71, 199, 0.95) 0%, rgba(0, 71, 199, 0.85) 100%)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
