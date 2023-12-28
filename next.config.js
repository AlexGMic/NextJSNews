/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dc17hqknj/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "mineabyssinianews.netlify.app",
        port: "",
        pathname: "/MediaFolders/**"
      }
    ],
  },
};

module.exports = nextConfig;
