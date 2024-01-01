import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mainColor : "#f5f5f5",
        whiteColor : "#ffffff",
        navBarBgCardColor : "#ffffff",
        navBarTextColor : "#000000",
        notFoundBgColor : "#1A2238",
        notFoundColor : "#FF6A3D",
      },      
    },
  },
  plugins: [],
}
export default config
