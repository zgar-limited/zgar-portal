"use client";
import Link from "next/link";
import Image from "next/image";
import { galleryImages } from "@/data/instagramPosts";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function InstagramPosts() {
  return (
    <section className="pt-0 flat-spacing pb-xl-0">
      <div className="container">
        <div className="text-center sect-title wow fadeInUp">
          <div className="mb-16 h1 title">Follow Us On Media</div>
          <h6>
            @ZGAR:
            <span className="text-main fw-normal">Follow us and get</span> 20%
            off coupon
          </h6>
        </div>
      </div>
      <Swiper
        dir="ltr"
        className="swiper tf-swiper wow fadeInUp"
        breakpoints={{
          0: { slidesPerView: 2, slidesPerGroup: 2 },
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
          el: ".spd10",
        }}
      >
        {galleryImages.map((imgSrc, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <div className="gallery-item hover-img hover-overlay">
              <div className="image img-style">
                <Image
                  className="lazyload"
                  src={imgSrc}
                  alt="Image"
                  width={640}
                  height={640}
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
        <div className="sw-dot-default tf-sw-pagination spd10" />
      </Swiper>
    </section>
  );
}
