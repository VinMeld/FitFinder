/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');

const nextConfig = withAxiom({
  experimental: {
      serverActions: true,
  },
    images: {
        domains: ['jewlrhkuhulfayqixmsx.supabase.co', 'test.fitfinder.ca'],
      },
})
module.exports = nextConfig