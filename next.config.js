/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      serverActions: true,
  },
    images: {
        domains: ['jewlrhkuhulfayqixmsx.supabase.co', 'test.fitfinder.ca'],
      },
}
module.exports = nextConfig