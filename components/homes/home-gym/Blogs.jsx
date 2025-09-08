"use client";
import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/data/blogs";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function Blogs() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-title wow fadeInUp">
          <h1 className="s-title mb-8">OUR BLOG</h1>
          <p className="s-subtitle h6">
            Up to 50% off Lorem ipsum dolor sit amet, consectetur adipiscing
            elit
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-swiper"
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 1 },
            575: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 32,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 48,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd77",
          }}
        >
          {blogs.map((blog, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div
                className={`article-blog style-row hover-img4 wow fadeInLeft`}
                {...(blog.wowDelay && { "data-wow-delay": blog.wowDelay })}
              >
                <Link
                  href={`/blog-detail`}
                  className="entry_image img-style4 flex-xl-1"
                >
                  <Image
                    src={blog.imgSrc}
                    alt={blog.alt}
                    className="lazyload"
                    width={486}
                    height={525}
                  />
                </Link>
                <div className="blog-content flex-1">
                  <a href="#" className="entry_date name-tag h6 link">
                    {blog.date}
                  </a>
                  <Link href={`/blog-detail`} className="entry_name link h4">
                    {blog.title}
                  </Link>
                  <p className="text h6">{blog.description}</p>
                  <Link href={`/blog-detail`} className="tf-btn-line">
                    Read more
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-dot-default tf-sw-pagination spd77" />
        </Swiper>
      </div>
    </section>
  );
}
