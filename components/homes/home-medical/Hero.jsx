"use client";
import Link from "next/link";
import Image from "next/image";
import { sliders2 } from "@/data/heroSlides";
import React from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Hero() {
  return (
    <div className="tf-slideshow-2 tf-btn-swiper-main">
      <div className="container">
        <div className="slideshow-container width-2">
          {/*  data-delay="3000" data-auto="true" */}
          <Swiper
            dir="ltr"
            className="swiper tf-swiper sw-slide-show slider_effect_fade"
            loop
            modules={[Autoplay, EffectFade, Pagination]}
            autoplay={{
              delay: 30000,
            }}
            effect="fade"
            pagination={{
              clickable: true,
              el: ".spd95",
            }}
          >
            {sliders2.map((item, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div className="slider-wrap style-5">
                  <div className="sld_image type-radius">
                    <Image
                      src={item.imgSrc}
                      alt={item.imgAlt}
                      width={item.imgWidth}
                      height={item.imgHeight}
                      className="lazyload scale-item sale-item-1"
                    />
                  </div>
                  <div className="sld_content type-space-x">
                    <h4 className="sub-title_sld mb-8 text-primary fade-item fade-item-1">
                      {item.subtitle}
                    </h4>
                    <h2
                      className="title_sld h2 type-semibold mb-16 fade-item fade-item-2"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <div className="fade-item fade-item-4">
                      <Link
                        href={`/shop-default-list`}
                        className="tf-btn bg-primary primary-3 animate-btn"
                      >
                        Shop now <i className="icon icon-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="sw-dot-default-2 style-primary primary-3 tf-sw-pagination spd95" />
          </Swiper>
          <div className="col-right d-none d-md-grid">
            <div className="box-image_V06 type-space-3 pst-center-y hover-img">
              <Link
                href={`/shop-default`}
                className="box-image_image img-style"
              >
                <Image
                  src="/images/section/box-image-22.jpg"
                  alt="IMG"
                  className="lazyload"
                  width={760}
                  height={515}
                />
              </Link>
              <div className="box-image_content">
                <p className="sub-title h5 fw-semibold text-primary">
                  SALE OFF 50%
                </p>
                <h4 className="title">
                  <Link href={`/shop-default`} className="link">
                    30 Eye and <br />
                    Eyelash Wipes
                  </Link>
                </h4>
                <Link
                  href={`/shop-default`}
                  className="tf-btn type-small-5 animate-btn bg-primary primary-3"
                >
                  Shop now
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>
            <div className="box-image_V06 type-space-3 pst-center-y hover-img">
              <Link
                href={`/shop-default`}
                className="box-image_image img-style"
              >
                <Image
                  src="/images/section/box-image-23.jpg"
                  alt="IMG"
                  className="lazyload"
                  width={772}
                  height={516}
                />
              </Link>
              <div className="box-image_content">
                <p className="sub-title h5 fw-semibold text-primary">
                  SALE OFF 50%
                </p>
                <h4 className="title">
                  <Link href={`/shop-default`} className="link">
                    Eye Care <br />
                    Eyelid Cleaning Spray
                  </Link>
                </h4>
                <Link
                  href={`/shop-default`}
                  className="tf-btn type-small-5 animate-btn bg-primary primary-3"
                >
                  Shop now
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
