/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mineabyssinianews.netlify.app",
        port: "",
        pathname: "/MediaFolders/**",
      },
    ],
  },
};

module.exports = nextConfig;
