import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        colors: {
            white: '#ffffff',
            background: {
                100: 'rgb(244 247 254)',
                900: '#070f2e',
            },
        }
    },
    plugins: [],
};
export default config;
