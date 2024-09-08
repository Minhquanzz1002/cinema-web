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
            colors: {
                white: '#FFFFFF',
                'light-primary': '#F4F7FE',
                'brand-linear': '#868CFF',
                gray: {
                    50: '#F5F6FA',
                    100: '#EEF0F6',
                    200: '#DADEEC',
                    300: '#C9D0E3',
                    400: '#B0BBD5',
                    500: '#B5BED9',
                    600: '#A3AED0',
                    700: '#707eae',
                    800: '#2D396B',
                    900: '#1B2559',
                },
                navy: {
                    700: '#1B254B',
                    800: '#111c44',
                    900: '#1B2559',
                },
                red: {
                    500: '#f53939',
                },
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2152ff',
                    700: '#1d4ed8',
                    800: '#344e86',
                    900: '#00007d',
                },
                green: {
                    50: '#05cd991a',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#17ad37',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                brand: {
                    200: '#A195FD',
                    300: '#8171FC',
                    400: '#7551FF',
                    500: '#422AFB',
                    600: '#3311DB',
                    700: '#2111A5',
                },
                background: {
                    100: 'rgb(244 247 254)',
                    900: '#070f2e',
                },
                shadow: {
                    100: 'var(--shadow-100)',
                    500: 'rgba(112, 144, 176, 0.08)',
                }
            }
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
    },
    plugins: [],
};
export default config;
