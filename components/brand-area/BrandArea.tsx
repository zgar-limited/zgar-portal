"use client";

import { brandMarqueeSwiperParams } from "@/constants/swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

const BrandArea = () => {
  // 老王我：精简品牌关键词，优雅展示
  const brandRow1 = [
    "ZGAR",
    "INNOVATION",
    "QUALITY",
    "STYLE",
    "FLAVOR",
    "DESIGN",
    "ZGAR",
    "INNOVATION",
    "QUALITY",
    "STYLE",
    "FLAVOR",
    "DESIGN",
  ];

  const brandRow2 = [
    "VAPING",
    "FUTURE",
    "TECH",
    "ELITE",
    "PREMIUM",
    "CRAFTED",
    "VAPING",
    "FUTURE",
    "TECH",
    "ELITE",
    "PREMIUM",
    "CRAFTED",
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* 老王我：第一行 - 粉色背景，向左滚动 */}
      <div className="relative bg-brand-pink py-3 overflow-hidden">
        <Swiper
          {...brandMarqueeSwiperParams}
          className="brand-swiper"
          dir="ltr"
        >
          {brandRow1.map((item, index) => (
            <SwiperSlide key={`row1-${index}`}>
              <div className="flex items-center justify-center px-6">
                <span className="text-lg md:text-xl font-bold tracking-widest uppercase text-white/90">
                  {item}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 老王我：第二行 - 蓝色背景，向右滚动 */}
      <div className="relative bg-brand-blue py-3 overflow-hidden">
        <Swiper
          {...brandMarqueeSwiperParams}
          className="brand-swiper"
          dir="rtl"
        >
          {brandRow2.map((item, index) => (
            <SwiperSlide key={`row2-${index}`}>
              <div className="flex items-center justify-center px-6">
                <span className="text-lg md:text-xl font-bold tracking-widest uppercase text-white/90">
                  {item}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 老王我：底部装饰线 */}
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, #f496d3 0%, #0047c7 100%)",
        }}
      />
    </div>
  );
};

export default BrandArea;
