import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   cacheComponents: true,
  images:{
    remotePatterns:[
      {
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      }
    ]
  },
  reactCompiler:true,
  experimental:{
    turbopackFileSystemCacheForDev:false,
    cacheComponents: false,
  }
};

export default nextConfig;
