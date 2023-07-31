/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');

const nextConfig = withAxiom({
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
      serverActions: true,
  },
    images: {
        domains: ['jewlrhkuhulfayqixmsx.supabase.co', 'server.fitfinder.ca'],
      },
})
module.exports = nextConfig