import Image from "next/image";
import React from "react";

export default function ShopBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* 左侧文字内容 - 简约风格 */}
          <div className="flex-1 text-center lg:text-left space-y-5">
            {/* 徽章 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="w-2 h-2 bg-gradient-to-r from-brand-pink to-brand-blue rounded-full"></span>
              <span className="text-gray-700 text-sm font-semibold tracking-wide">NEW COLLECTION 2025</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="block">CLOUD</span>
              <span className="block text-brand-pink">CHASER</span>
              <span className="block text-gray-600">PRO SERIES</span>
            </h1>

            {/* 描述文字 */}
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              ✨ Experience the future of vaping with cutting-edge technology.
              <br />
              Smooth clouds, exceptional flavor, unmatched performance.
            </p>

            {/* CTA按钮组 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <button className="group px-8 py-3.5 bg-gradient-to-r from-brand-pink to-brand-blue text-white rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2">
                SHOP NOW
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group px-8 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                WATCH VIDEO
              </button>
            </div>

            {/* 统计数据 */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <p className="text-gray-500 text-sm font-medium mt-1">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.9</div>
                <p className="text-gray-500 text-sm font-medium mt-1">⭐⭐⭐⭐⭐ Rating</p>
              </div>
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <p className="text-gray-500 text-sm font-medium mt-1">Products</p>
              </div>
            </div>
          </div>

          {/* 右侧产品图片 - 简约展示 */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-full max-w-lg">
              {/* 产品图片容器 */}
              <div className="relative">
                {/* 产品图片 */}
                <div className="relative">
                  <Image
                    className="w-full max-w-md h-auto drop-shadow-xl rounded-2xl"
                    src="/images/slot/pendant/shop_pendant.webp"
                    width={600}
                    height={600}
                    alt="Cloud Chaser Pro"
                  />

                  {/* 浮动标签1 - 折扣 */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-brand-pink to-brand-blue rounded-xl shadow-lg p-3">
                    <div className="text-white font-bold text-xl">30%</div>
                    <div className="text-white/90 text-xs font-semibold">OFF</div>
                  </div>

                  {/* 浮动标签2 - 库存 */}
                  <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-semibold">IN STOCK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部波浪 - 简约风格 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 75C120 70 240 60 360 55C480 50 600 50 720 52.5C840 55 960 60 1080 62.5C1200 65 1320 65 1380 65L1440 65V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" opacity="0.5"/>
        </svg>
      </div>
    </div>
  );
}
