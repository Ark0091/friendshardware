import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        primary: { DEFAULT: '#f97316', foreground: '#ffffff' },
        secondary: { DEFAULT: '#f3f4f6', foreground: '#111827' },
        destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        accent: { DEFAULT: '#fff7ed', foreground: '#9a3412' },
        background: '#ffffff',
        foreground: '#111827',
        card: { DEFAULT: '#ffffff', foreground: '#111827' },
        border: '#e5e7eb',
        input: '#e5e7eb',
        ring: '#f97316',
        muted: { DEFAULT: '#f9fafb', foreground: '#6b7280' },
      },
    },
  },
  plugins: [],
};
export default config;
