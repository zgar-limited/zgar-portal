"use client";
import { brandMarqueeSwiperParams } from "@/constants/swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

const BrandArea = () => {
  const brandItems = [
    "Love",
    "Peace",
    "Professional",
    "Love",
    "Peace",
    "Professional",
    "Love",
    "Peace",
    "Professional",
    "Love",
    "Peace",
    "Professional",
    "Love",
    "Peace",
    "Professional",
    "Love",
    "Peace",
    "Professional",
  ];

  return (
    <div className="tp-brand-area ">
      {/* First Brand Slider */}
      <div className="bg-black tp-brand-wrapper z-index-1">
        <Swiper {...brandMarqueeSwiperParams} className="tp-brand-active fix">
          {brandItems.map((item, index) => (
            <SwiperSlide key={`first-${index}`}>
              <div className="tp-brand-item">
                <span className="text-white tp-brand-title">{item}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Second Brand Slider (RTL) */}
      <div
        style={{
          background:
            "linear-gradient(315deg, rgba(69, 212, 251, 1) 0%, rgba(157, 251, 211, 1) 74%)",
        }}
        className=" tp-brand-wrapper tp-brand-style-2"
      >
        <Swiper
          {...brandMarqueeSwiperParams}
          className="tp-brand-active fix"
          dir="rtl"
        >
          {brandItems.map((item, index) => (
            <SwiperSlide key={`second-${index}`}>
              <div className="tp-brand-item">
                <span className="tp-brand-title">{item}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandArea;
