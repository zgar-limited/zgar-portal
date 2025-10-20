"use client";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function BrandStory() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="text-center sect-title">
          <h1 className="mb-8 s-title">More</h1>
        </div>
        <div className="text-center box-intro has-mb">
          
          <h4 className="slogan fw-normal">
            The brand offers a wide range of closed-pod system products,
            including pod devices, prefilled pods and disposable vapes.
          </h4>
          <h4 className="slogan fw-normal">
            Zgar® products are designed with advanced technology to provide
            satisfying vaping experience and are manufac?tured to the highest
            quality standards with varies international standard recognitions.
          </h4>
          <h4 className="slogan fw-normal">
            Zgar® is committed to providing excellent customer services with
            customizable product, and is now available in 42 countries
            worldwide.
          </h4>
        </div>
        
      </div>
    </section>
  );
}
