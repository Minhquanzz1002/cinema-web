import type {Config} from "tailwindcss";
import tailwindcssAnimated from 'tailwindcss-animated';

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    ],
    darkMode: 'class',
    mode: 'jit',
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontSize: {
                'xxs': ['0.625rem', '0.875rem'],
                'tiny': ['0.8125rem', '1.125rem'],
            },
            spacing: {
                '4.5': '1.125rem',
            },
            padding: {
                '4.5': '1.125rem',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
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
                    50: '#d0dcfb',
                    100: '#aac0fe',
                    200: '#a3b9f8',
                    300: '#728fea',
                    400: '#3652ba',
                    500: '#1b3bbb',
                    600: '#24388a',
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
                    50: '#E9E3FF',
                    100: '#C0B8FE',
                    200: '#A195FD',
                    300: '#8171FC',
                    400: '#7551FF',
                    // 500: '#422AFB',
                    500: '#7367F0',
                    600: '#3311DB',
                    700: '#2111A5',
                    800: '#190793',
                    900: '#11047A',
                },
                background: {
                    100: 'rgb(244 247 254)',
                    900: '#070f2e',
                },
                shadow: {
                    100: 'var(--shadow-100)',
                    500: 'rgba(112, 144, 176, 0.08)',
                },
                smoke: {
                    300: '#ebebed',
                },
                // background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
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
    plugins: [
        tailwindcssAnimated
    ],
};
export default config;
