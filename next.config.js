/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/guess-the-prompt',
        destination: '/quiz?category=prompt',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

