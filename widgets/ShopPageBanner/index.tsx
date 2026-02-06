"use client";

import React from "react";
import Image from "next/image";

/**
 * Shop 页面创意 Banner 组件（高对比度版）
 *
 * 设计特点：
 * - 现代冲击力
 * - 高对比度
 * - 大胆排版
 * - 艺术浮动
 */
export default function ShopPageBanner() {
  // 浮动产品配置 - 更有设计感
  const floatingProducts = [
    { x: "8%", y: "25%", size: 56, rotation: -12, color: "from-brand-pink to-rose-400", delay: 0 },
    { x: "85%", y: "30%", size: 64, rotation: 15, color: "from-brand-blue to-blue-400", delay: 1.5 },
    { x: "20%", y: "65%", size: 40, rotation: -8, color: "from-purple-400 to-purple-500", delay: 0.8 },
    { x: "75%", y: "70%", size: 48, rotation: 12, color: "from-pink-400 to-rose-500", delay: 2.2 },
    { x: "45%", y: "15%", size: 36, rotation: -20, color: "from-cyan-400 to-blue-500", delay: 0.4 },
    { x: "12%", y: "50%", size: 32, rotation: 25, color: "from-brand-pink to-purple-400", delay: 1.8 },
    { x: "88%", y: "55%", size: 28, rotation: -18, color: "from-blue-400 to-brand-blue", delay: 2.6 },
  ];

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* 不规则图形装饰 - 粉蓝融合 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* 大型粉色 Blob - 左上 */}
        <svg
          className="absolute -top-20 -left-20 w-96 h-96 opacity-10 animate-pulse"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M200 50C280 50 350 100 370 180C390 260 350 340 280 370C210 400 120 380 60 320C20 260 40 180 100 120C140 80 170 50 200 50Z"
            fill="url(#pinkGradient)"
          />
          <defs>
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f496d3" />
              <stop offset="100%" stopColor="#ff7aa8" />
            </linearGradient>
          </defs>
        </svg>

        {/* 大型蓝色 Blob - 右下 */}
        <svg
          className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] opacity-10"
          viewBox="0 0 400 400"
          fill="none"
          style={{ animationDelay: "1s" }}
        >
          <path
            d="M180 60C260 60 320 100 350 170C380 240 360 320 300 360C240 400 140 380 80 320C40 260 60 180 120 120C150 90 170 60 180 60Z"
            fill="url(#blueGradient)"
          />
          <defs>
            <linearGradient id="blueGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0047c7" />
              <stop offset="100%" stopColor="#369eff" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中型融合 Blob - 右上 */}
        <svg
          className="absolute top-10 right-1/4 w-64 h-64 opacity-5 animate-float"
          viewBox="0 0 300 300"
          fill="none"
        >
          <path
            d="M150 30C200 30 250 60 270 110C290 160 270 220 230 260C190 300 110 280 70 240C30 200 50 140 80 100C100 70 130 30 150 30Z"
            fill="url(#fusionGradient1)"
          />
          <defs>
            <linearGradient id="fusionGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f496d3" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#c455a4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0047c7" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* 小型融合 Blob - 左中 */}
        <svg
          className="absolute top-1/2 left-10 w-48 h-48 opacity-5 animate-float"
          viewBox="0 0 200 200"
          fill="none"
          style={{ animationDelay: "2s" }}
        >
          <path
            d="M100 20C140 20 170 50 180 90C190 130 170 170 140 185C100 195 60 180 30 150C10 120 20 80 40 50C60 30 80 20 100 20Z"
            fill="url(#fusionGradient2)"
          />
          <defs>
            <linearGradient id="fusionGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0047c7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#7cc4ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f496d3" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>

        {/* 波浪形状 - 底部 */}
        <svg
          className="absolute bottom-0 left-0 w-full h-32 opacity-5"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,60 1440,30 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f496d3" />
              <stop offset="50%" stopColor="#c455a4" />
              <stop offset="100%" stopColor="#0047c7" />
            </linearGradient>
          </defs>
        </svg>

        {/* 抽象曲线 - 顶部 */}
        <svg
          className="absolute top-0 left-0 w-full h-24 opacity-5"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,0 L0,0 Z"
            fill="url(#curveGradient)"
          />
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0047c7" />
              <stop offset="50%" stopColor="#7cc4ff" />
              <stop offset="100%" stopColor="#f496d3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 主要内容区 */}
      <div className="relative z-30 container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 左侧：标题区 */}
          <div className="text-left space-y-6">
            {/* 大标签 */}
            <div className="inline-flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-brand-pink to-brand-blue rounded-full" />
              <span className="text-sm font-bold tracking-widest text-gray-600 uppercase">
                Premium Collection 2024
              </span>
            </div>

            {/* 主标题 - 超大字体 */}
            <h1 className="font-['Poppins'] text-5xl md:text-6xl lg:text-7xl font-black leading-none text-gray-900">
              SHOP
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">
                VAPING
              </span>
              <br />
              PRODUCTS
            </h1>

            {/* 副标题 */}
            <p className="text-lg md:text-xl text-gray-600 max-w-md leading-relaxed">
              Discover premium vaping devices and accessories. Quality meets innovation in every product.
            </p>

            {/* 统计数据 */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-black text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Products</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">100%</div>
                <div className="text-sm text-gray-500">Authentic</div>
              </div>
            </div>
          </div>

          {/* 右侧：浮动产品展示区 */}
          <div className="relative h-64 md:h-80 lg:h-96">
            {/* 浮动产品 */}
            {floatingProducts.map((product, index) => {
              const colorMap = {
                "from-brand-pink to-rose-400": "from-brand-pink to-rose-400",
                "from-brand-blue to-blue-400": "from-brand-blue to-blue-400",
                "from-purple-400 to-purple-500": "from-purple-400 to-purple-500",
                "from-pink-400 to-rose-500": "from-pink-400 to-rose-500",
                "from-cyan-400 to-blue-500": "from-cyan-400 to-blue-500",
              };

              return (
                <div
                  key={index}
                  className="absolute animate-float"
                  style={{
                    left: product.x,
                    top: product.y,
                    animationDelay: `${product.delay}s`,
                  }}
                >
                  <div
                    className={`rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br ${colorMap[product.color] || product.color}`}
                    style={{
                      width: `${product.size}px`,
                      height: `${product.size}px`,
                      transform: `rotate(${product.rotation}deg)`,
                    }}
                  >
                    <span className="text-white text-2xl md:text-3xl">📦</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}
