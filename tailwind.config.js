/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-copernicus)", "system-ui", "sans-serif"],
        default: ["var(--font-styrne)", "system-ui", "sans-serif"],
      },
      colors: {
        // Grundfärger - konverterade till HSL
        'background': 'hsl(var(--background) / <alpha-value>)',
        'foreground': 'hsl(var(--foreground) / <alpha-value>)',
        'accent': 'hsl(var(--accent) / <alpha-value>)',
        'dark': 'hsl(var(--dark) / <alpha-value>)',
        'cream': 'hsl(var(--cream) / <alpha-value>)',
        'beige': 'hsl(var(--beige) / <alpha-value>)',
        'sage': 'hsl(var(--sage) / <alpha-value>)',
        'lavender': 'hsl(var(--lavender) / <alpha-value>)',
        'coral': 'hsl(var(--coral) / <alpha-value>)',
        'charcoal': 'hsl(var(--charcoal) / <alpha-value>)',
        
        // Accent-färger
        'accent-brand': 'hsl(var(--accent-brand) / <alpha-value>)',
        'accent-main': {
          '000': 'hsl(var(--accent-main-000) / <alpha-value>)',
          '100': 'hsl(var(--accent-main-100) / <alpha-value>)',
          '200': 'hsl(var(--accent-main-200) / <alpha-value>)',
          '900': 'hsl(var(--accent-main-900) / <alpha-value>)',
        },
        'accent-pro': {
          '000': 'hsl(var(--accent-pro-000) / <alpha-value>)',
          '100': 'hsl(var(--accent-pro-100) / <alpha-value>)',
          '200': 'hsl(var(--accent-pro-200) / <alpha-value>)',
          '900': 'hsl(var(--accent-pro-900) / <alpha-value>)',
        },
        'accent-secondary': {
          '000': 'hsl(var(--accent-secondary-000) / <alpha-value>)',
          '100': 'hsl(var(--accent-secondary-100) / <alpha-value>)',
          '200': 'hsl(var(--accent-secondary-200) / <alpha-value>)',
          '900': 'hsl(var(--accent-secondary-900) / <alpha-value>)',
        },
        
        // Bakgrunder
        'bg': {
          '000': 'hsl(var(--bg-000) / <alpha-value>)',
          '100': 'hsl(var(--bg-100) / <alpha-value>)',
          '200': 'hsl(var(--bg-200) / <alpha-value>)',
          '300': 'hsl(var(--bg-300) / <alpha-value>)',
          '400': 'hsl(var(--bg-400) / <alpha-value>)',
          '500': 'hsl(var(--bg-500) / <alpha-value>)',
        },
        
        // Borders
        'border': {
          '100': 'hsl(var(--border-100) / <alpha-value>)',
          '200': 'hsl(var(--border-200) / <alpha-value>)',
          '300': 'hsl(var(--border-300) / <alpha-value>)',
          '400': 'hsl(var(--border-400) / <alpha-value>)',
        },
        
        // Danger
        'danger': {
          '000': 'hsl(var(--danger-000) / <alpha-value>)',
          '100': 'hsl(var(--danger-100) / <alpha-value>)',
          '200': 'hsl(var(--danger-200) / <alpha-value>)',
          '900': 'hsl(var(--danger-900) / <alpha-value>)',
        },
        
        // On-color
        'oncolor': {
          '100': 'hsl(var(--oncolor-100) / <alpha-value>)',
          '200': 'hsl(var(--oncolor-200) / <alpha-value>)',
          '300': 'hsl(var(--oncolor-300) / <alpha-value>)',
        },
        
        // Text
        'text': {
          '000': 'hsl(var(--text-000) / <alpha-value>)',
          '100': 'hsl(var(--text-100) / <alpha-value>)',
          '200': 'hsl(var(--text-200) / <alpha-value>)',
          '300': 'hsl(var(--text-300) / <alpha-value>)',
          '400': 'hsl(var(--text-400) / <alpha-value>)',
          '500': 'hsl(var(--text-500) / <alpha-value>)',
        },
      },
      animation: {
        // Fade up and down
        "fade-up": "fade-up 0.5s",
        "fade-down": "fade-down 0.5s",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        // Fade up and down
        "fade-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: 0.6,
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("radix-side-top", '&[data-side="top"]');
      addVariant("radix-side-bottom", '&[data-side="bottom"]');
    }),
  ],
};