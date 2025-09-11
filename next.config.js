/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: "/sv",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sv/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
