"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { categories11 } from "@/data/categories";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Categories() {
  return (
    <div className="py-10 md:py-14 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* 分类标题 - 简约风格 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            SHOP BY
            <span className="text-brand-pink ml-2">CATEGORY</span>
          </h2>
          <p className="text-gray-500 text-base">✨ Find your perfect vaping device</p>
          <div className="w-16 h-1 bg-gradient-to-r from-brand-pink to-brand-blue mx-auto mt-3 rounded-full"></div>
        </div>

        <Swiper
          dir="ltr"
          className="swiper tf-swiper !pb-12"
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 12 },
            575: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spdc1",
          }}
        >
          {categories11.map((item, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <Link href={`/shop-default`} className="group block">
                <div className="relative overflow-hidden rounded-2xl transition-all duration-300 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg">
                  {/* 分类图片 */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={item.imgSrc}
                      alt={item.alt}
                      width={512}
                      height={592}
                    />

                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300"></div>
                  </div>

                  {/* 分类标签 - 简约风格 */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="relative inline-block">
                      <div className="bg-gradient-to-r from-brand-pink to-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold text-base shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
                        {item.label}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
          <div className="sw-dot-default tf-sw-pagination spdc1 !bottom-0" />
        </Swiper>
      </div>
    </div>
  );
}
