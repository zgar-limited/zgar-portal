import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";

export default function Categories() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="text-center sect-title wow fadeInUp">
          <h2 className="mb-8 s-title h1 fw-medium">Product Categories</h2>
          {/* <p className="s-subtitle h6">
            Up to 50% off Lorem ipsum dolor sit amet, consectetur adipiscing
            elit
          </p> */}
        </div>
        <div className="watch-grid wow fadeInUp">
          <div className="item aa box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/1.webp"
                alt="Image"
                width={782}
                height={1140}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type A</span>
              </Link>
            </div>
          </div>
          <div className="item bb box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/2.webp"
                alt="Image"
                width={1220}
                height={546}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type B</span>
              </Link>
            </div>
          </div>
          <div className="item cc box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/3.webp"
                alt="Image"
                width={586}
                height={546}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type C</span>
              </Link>
            </div>
          </div>
          <div className="item dd box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/9.webp"
                alt="Image"
                width={586}
                height={546}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type D</span>
              </Link>
            </div>
          </div>
          <div className="item ee box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/4.webp"
                alt="Image"
                width={782}
                height={1140}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type E</span>
              </Link>
            </div>
          </div>
          <div className="item ff box-image_category hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                className="lazyload"
                src="/images/slot/social/5.webp"
                alt="Image"
                width={782}
                height={1140}
              />
            </Link>
            <div className="box-image_content">
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark rounded-0 px-xxl-32"
              >
                <span className="h6 fw-medium">Type F</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
