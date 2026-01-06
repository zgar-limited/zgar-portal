import Image from "next/image";
import React from "react";

export default function ShopBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-brand">
      {/* 柔和的光晕装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-rose-400/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* 左侧文字内容 */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-medium">New Collection 2025</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              <span className="block">Cloud Chaser</span>
              <span className="block text-rose-100">Pro Series</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of vaping with our most advanced device yet. Smooth clouds, exceptional flavor, and unmatched performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
              <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-white text-brand-blue rounded-2xl font-bold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="group px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300">
                Watch Video
              </button>
            </div>

            {/* 信任标识 */}
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 text-xs mt-1">10,000+ Happy Customers</p>
              </div>
            </div>
          </div>

          {/* 右侧产品图片 */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-full max-w-lg">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl scale-90"></div>

              {/* 产品图片容器 */}
              <div className="relative z-10 animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 to-blue-500/30 rounded-3xl blur-2xl transform rotate-6"></div>
                <Image
                  className="w-full max-w-md h-auto relative z-10 drop-shadow-2xl rounded-3xl"
                  src="/images/slot/pendant/shop_pendant.webp"
                  width={600}
                  height={600}
                  alt="Cloud Chaser Pro"
                />

                {/* 浮动标签 */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce">
                  <div className="text-rose-500 font-bold text-2xl">30%</div>
                  <div className="text-gray-600 text-xs">OFF</div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 text-sm font-semibold">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部波浪 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
}
