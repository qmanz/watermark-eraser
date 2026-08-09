/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          600: '#534AB7',
          800: '#3C3489',
          900: '#26215C',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans SC"',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
  // RTL 支持：在 CSS 中使用 rtl: 前缀覆盖方向相关样式
  // 例如: rtl:right-0 rtl:left-auto 镜像 left/right
};