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
    ],
  },
};

module.exports = nextConfig;
