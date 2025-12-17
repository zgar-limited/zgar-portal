"use client";
import Link from "next/link";
import Image from "next/image";
import { sliderItems5 } from "@/data/heroSlides";
import React, { useEffect } from "react";
import {
  Autoplay,
  EffectFade,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Hero() {


  return (
    <div className="w-full " >
      <Swiper
        // dir="ltr"
        className="w-full slider_effect_fade"
        // loop
        modules={[Autoplay, EffectFade, Pagination, EffectCoverflow]}
        // autoplay={{
        //   delay: 30000,
        // }}
        // spaceBetween={50}
        slidesPerView="auto"
        grabCursor
        centeredSlides
        effect="coverflow"
        pagination={{
          clickable: true,
          el: ".home-banner-pagination",
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 600,
          modifier: 1,
          slideShadows: true,
        }}
        initialSlide={1}
      >
        {[...sliderItems5, ...sliderItems5].map((item, index) => (
          <SwiperSlide className="h-auto md:w-[65vw] sm:w-screen">
            <div className="h-full w-full border-[3px] border-white border-solid rounded-[16px] overflow-hidden">
              <Image
                src={item.imgSrc}
                alt={item.alt}
                className="w-full h-full lazyload"
                width={item.width}
                height={item.height}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="sw-dot-default mt-[16px]! cursor-pointer style-black home-banner-pagination" />
      </Swiper>
    </div>
  );
}
