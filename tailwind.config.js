/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Podemos añadir colores personalizados si los necesitamos
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(bg|border|text)-(red|green|blue|yellow|indigo|purple|pink|gray|black|white|orange|teal|cyan|amber|lime|emerald|fuchsia|rose)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
};
