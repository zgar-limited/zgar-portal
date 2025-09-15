"use client";
import Link from "next/link";
import Image from "next/image";
import { sliderItems } from "@/data/heroSlides";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
export default function Hero() {
  return (
    <div className="tf-slideshow type-abs tf-btn-swiper-main hover-sw-nav">
      <Swiper
        dir="ltr"
        className="swiper tf-swiper sw-slide-show slider_effect_fade"
        loop
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        autoplay={{
          delay: 30000,
        }}
        effect="fade"
        pagination={{
          clickable: true,
          el: ".spd9",
        }}
        navigation={{
          prevEl: ".snbp9",
          nextEl: ".snbn9",
        }}
      >
        {sliderItems.map((item, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className="slider-wrap">
              <div className="sld_image">
                <Image
                  src={item.imgSrc}
                  alt="Image"
                  className="lazyload"
                  width={2880}
                  height={1380}
                />
              </div>
              <div className="sld_content">
                <div className="container">
                  <div className="content-sld_wrap">
                    <h1
                      className="title_sld text-display fade-item fade-item-1"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <p className="text-black sub-text_sld h5 fade-item fade-item-2">
                      {item.description}
                    </p>
                    <div className="fade-item fade-item-3">
                      <Link
                        href={`/shop`}
                        className="tf-btn animate-btn fw-semibold"
                      >
                        Shop now
                        <i className="icon icon-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="sw-dot-default tf-sw-pagination spd9" />
      </Swiper>
      <div className="tf-sw-nav nav-prev-swiper snbp9">
        <i className="icon icon-caret-left" />
      </div>
      <div className="tf-sw-nav nav-next-swiper snbn9">
        <i className="icon icon-caret-right" />
      </div>
    </div>
  );
}
