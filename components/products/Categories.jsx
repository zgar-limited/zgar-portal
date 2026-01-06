"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { categories11 } from "@/data/categories";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Categories() {
  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-white via-rose-50/20 to-white">
      <div className="container mx-auto px-4">
        {/* 分类标题 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by <span className="text-rose-500">Category</span>
          </h2>
          <p className="text-gray-600 text-lg">Find your perfect vaping device</p>
          <div className="w-24 h-1 bg-gradient-brand mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          dir="ltr"
          className="swiper tf-swiper !pb-16"
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
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border-2 border-white/20">
                  {/* 分类图片 */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={item.imgSrc}
                      alt={item.alt}
                      width={512}
                      height={592}
                    />

                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  </div>

                  {/* 分类标签 */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-gradient-brand text-white px-6 py-3 rounded-2xl inline-block font-bold text-lg shadow-xl group-hover:scale-105 transition-transform duration-300">
                      {item.label}
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
