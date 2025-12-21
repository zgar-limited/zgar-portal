"use client";
import {Link} from '@/i18n/routing';
import Image from "next/image";
import ProductCard1 from "@/components/productCards/ProductCard1";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function Products2() {
  return (
    <div className="themesFlat">
      <div className="container-full">
        <div className="h1 sect-title text-black fw-medium text-center wow fadeInUp">
          Shop This Look
        </div>
        <div className="row">
          <div className="col-xl-4">
            <div className="box-image_V01 hover-img mb-xl-0 wow fadeInUp">
              <Link
                href={`/shop-default`}
                className="box-image_image img-style"
              >
                <Image
                  src="/images/section/box-image-1.jpg"
                  alt="Image"
                  className="lazyload"
                  width={1152}
                  height={1230}
                />
              </Link>
              <div className="box-image_content">
                <Link
                  href={`/shop-default`}
                  className="title text-display fw-semibold text-white link"
                >
                  Lookbook
                </Link>
                <span className="sub-title h5 text-white">347 product</span>
                <Link
                  href={`/shop-default`}
                  className="tf-btn-line style-white"
                >
                  EXPLORE NOW
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
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
                  slidesPerView: 3,
                  spaceBetween: 48,
                },
              }}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd13",
              }}
            >
              {products2.map((product, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <ProductCard1 product={product} />
                </SwiperSlide>
              ))}

              <div className="sw-dot-default tf-sw-pagination spd13" />
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
