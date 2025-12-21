"use client";
import ProductCard17 from "@/components/productCards/ProductCard17";

import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products2() {
  return (
    <div className="pt-0 flat-spacing">
      <div className="container">
        <div className="text-center text-black h1 sect-title fw-medium wow fadeInUp">
          BEST SELLER
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-swiper wrap-sw-over wow fadeInUp"
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 2 },
            575: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 48,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd81",
          }}
        >
          {gymProducts2.map((product, i) => (
            <SwiperSlide className="swiper-slide">
              <ProductCard17 product={product} />
            </SwiperSlide>
          ))}
          <div className="sw-dot-default tf-sw-pagination spd81" />
        </Swiper>
      </div>
    </div>
  );
}
