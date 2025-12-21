import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";

export default function CollectionBanner() {
  return (
    <div className="themesFlat">
      <div className="container">
        <div className="tf-grid-layout lg-col-2">
          <div className="box-image_V02 type-space-3 hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                src="/images/section/box-image-8.jpg"
                alt=""
                className="lazyload"
                width={1044}
                height={938}
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <span className="sub-text h4 text-white mb-8">Sale OFF 2%</span>
              <Link
                href={`/shop-default`}
                className="title link text-display-2 fw-medium text-white"
              >
                Diamond Jewelry
              </Link>
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark"
              >
                Shop now
                <i className="icon icon-arrow-right" />
              </Link>
            </div>
          </div>
          <div className="box-image_V02 type-space-3 hover-img">
            <Link href={`/shop-default`} className="box-image_image img-style">
              <Image
                src="/images/section/box-image-9.jpg"
                alt=""
                className="lazyload"
                width={1044}
                height={938}
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <span className="sub-text h4 text-white mb-8">
                Get our 5% OFF coupon
              </span>
              <Link
                href={`/shop-default`}
                className="title link text-display-2 fw-medium text-white"
              >
                Birthstone Jewelry
              </Link>
              <Link
                href={`/shop-default`}
                className="tf-btn btn-white animate-btn animate-dark"
              >
                Shop now
                <i className="icon icon-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
