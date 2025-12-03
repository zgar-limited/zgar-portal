import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     three: path.resolve(__dirname, "node_modules/three"),
  //   };
  //   return config;
  // },
  output: "standalone",
  env: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;
