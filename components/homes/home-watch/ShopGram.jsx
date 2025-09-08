"use client";

import Image from "next/image";
import { galleryItems2 } from "@/data/instagramPosts";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";

export default function ShopGram() {
  return (
    <div className="flat-spacing pt-0 pb-xl-0">
      <Swiper
        dir="ltr"
        className="swiper tf-swiper wow fadeInUp"
        spaceBetween={12}
        breakpoints={{
          0: { slidesPerView: 2 },
          575: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 6,
          },
        }}
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".spd136",
        }}
      >
        {galleryItems2.map((item, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className="gallery-item hover-img hover-overlay">
              <div className="image img-style">
                <Image
                  className="lazyload"
                  src={item.imgSrc}
                  alt={item.alt}
                  width={620}
                  height={616}
                />
              </div>
              <Link
                href={`/product-detail/1`}
                className="box-icon hover-tooltip"
              >
                <span className="icon icon-instagram-logo" />
                <span className="tooltip">View product</span>
              </Link>
            </div>
          </SwiperSlide>
        ))}
        <div className="sw-dot-default tf-sw-pagination spd136" />
      </Swiper>
    </div>
  );
}
