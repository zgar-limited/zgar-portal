"use client";
import Link from "next/link";
import Image from "next/image";
import { categories10 } from "@/data/categories";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function Categories() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-title type-4 wow fadeInUp">
          <h2 className="s-title fw-normal">Shop by category</h2>
        </div>
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
              spaceBetween: 32,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 48,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd39",
          }}
        >
          {categories10.map((item, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <Link
                href={`/shop-default`}
                className="widget-collection style-circle hover-img"
              >
                <div className="collection_image img-style">
                  <Image
                    className="lazyload"
                    src={item.imgSrc}
                    alt=""
                    width={400}
                    height={400}
                  />
                </div>
                <p className="collection_name h5 link">
                  {item.name}{" "}
                  <span className="count text-main-2">({item.count})</span>
                </p>
              </Link>
            </SwiperSlide>
          ))}
          <div className="sw-dot-default tf-sw-pagination spd39" />
        </Swiper>
      </div>
    </section>
  );
}
