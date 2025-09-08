"use client";

import Image from "next/image";
import { galleryImagesSet3 } from "@/data/instagramPosts";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function ShopGram() {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="sect-title text-center wow fadeInUp">
          <h1 className="title mb-8">Shop Instagram</h1>
          <p className="s-subtitle h6">
            Up to 50% off Lorem ipsum dolor sit amet, consectetur adipiscing
            elit
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-swiper wow fadeInUp"
          breakpoints={{
            0: { slidesPerView: 2 },
            575: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd51",
          }}
        >
          {galleryImagesSet3.map((imgSrc, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div className="gallery-item hover-img hover-overlay">
                <div className="image img-style">
                  <Image
                    className="lazyload"
                    src={imgSrc}
                    alt=""
                    width={720}
                    height={760}
                  />
                </div>
                <a href="#" className="box-icon hover-tooltip">
                  <span className="icon icon-instagram-logo" />
                  <span className="tooltip">View product</span>
                </a>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-dot-default tf-sw-pagination spd51" />
        </Swiper>
      </div>
    </section>
  );
}
