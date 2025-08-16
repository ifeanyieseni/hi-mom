/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // shadcn blue-500
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'risk-high': '#E63946',
        'risk-medium': '#F4A261',
        'risk-low': '#2A9D8F',
        'error-50': '#FDECEA',
        'warning-50': '#FFF8E1',
        'success-50': '#E6F4EA',
        'status-offline': '#F97316', // orange
        'status-synced': '#22C55E', // green
        'status-syncing': '#3B82F6', // blue
        'status-error': '#EF4444',
      },
      fontFamily: {
        spaceMono: ['SpaceMono'],
        groteskLight: ['HostGrotesk-Light'],
        groteskMedium: ['HostGrotesk-Medium'],
        groteskRegular: ['HostGrotesk-Regular'],
        groteskSemiBold: ['HostGrotesk-SemiBold'],
      },
    },
  },
  plugins: [],
}
