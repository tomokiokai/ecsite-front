/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['unsplash.it', 'img.icons8.com', 'openweathermap.org'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "book-thumbnail-bucket.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
    reactStrictMode: false,
}

module.exports = nextConfig
