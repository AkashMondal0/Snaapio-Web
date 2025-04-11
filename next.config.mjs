/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "standalone",
    env: {
        // API
        SERVER_API_URL: process.env.SERVER_API_URL,
        // Supabase
        SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        // SUPABASE_URL: process.env.SUPABASE_URL,
        // SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    }
};

export default nextConfig;