/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["drive.google.com", "drive.usercontent.google.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.googleusercontent.com",
            },
        ],
    },
};

module.exports = nextConfig;
