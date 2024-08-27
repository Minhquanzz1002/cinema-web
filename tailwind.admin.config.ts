import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    mode: 'jit',
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        screens: {
            sm: '576px',
            'sm-max': { max: '576px' },
            md: '768px',
            'md-max': { max: '768px' },
            lg: '992px',
            'lg-max': { max: '992px' },
            xl: '1200px',
            'xl-max': { max: '1200px' },
            '2xl': '1320px',
            '2xl-max': { max: '1320px' },
            '3xl': '1600px',
            '3xl-max': { max: '1600px' },
            '4xl': '1850px',
            '4xl-max': { max: '1850px' },
        },
        colors: {
            white: '#FFFFFF',
            'light-primary': '#F4F7FE',
            gray: {
                200: '#DADEEC',
                300: '#C9D0E3',
                400: '#B0BBD5',
                600: '#A3AED0',
                800: '#2D396B',
            },
            navy: {
                700: '#1B254B',
                800: '#111c44',
                900: '#1B2559',
            },
            red: {
                500: '#f53939',
            },
            background: {
                100: 'rgb(244 247 254)',
                900: '#070f2e',
            },
        }
    },
    plugins: [],
};
export default config;
