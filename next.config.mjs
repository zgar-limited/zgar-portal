

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,

  },
  output: "standalone",
  env:{
    
  },
  typescript:{
    ignoreBuildErrors:true
  }
};

export default nextConfig;
