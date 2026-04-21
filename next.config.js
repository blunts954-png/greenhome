/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable eslint during build temporarily to bypass potential crashes in Vercel environment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similarly for TS (though this is JS project)
    ignoreBuildErrors: true,
  },
  experimental: {
    // Optimize package imports for speed and stability
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
