import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   cacheComponents: true,
  images:{
    domains: ["lh3.googleusercontent.com"],
    remotePatterns:[
      {
        protocol:"https",
        hostname:'res.cloudinary.com'
      }
    ]
  },
  reactCompiler:true,
  experimental:{
    turbopackFileSystemCacheForDev:true
  }
};

export default nextConfig;
