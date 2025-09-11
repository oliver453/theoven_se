/** @type {import('next').NextConfig} */
const nextConfig = {
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