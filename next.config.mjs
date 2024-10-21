/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/cinema-782ef.appspot.com/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.galaxycine.vn',
                port: '',
                pathname: '/media/**'
            },
            {
                protocol: 'https',
                hostname: 'www.galaxycine.vn',
                port: '',
                pathname: '/media/**'
            },
            {
                protocol: 'https',
                hostname: 'www.galaxycine.vn',
                port: '',
                pathname: '/_next/static/media/**'
            },
        ]
    }
};

export default nextConfig;
