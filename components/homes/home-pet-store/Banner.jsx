import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Banner() {
  return (
    <section className="themesFlat">
      <div className="banner-V03">
        <div className="banner_img">
          <Image
            src="/images/banner/bannerV03.jpg"
            alt=""
            className="lazyload"
            width={2880}
            height={957}
          />
        </div>
        <div className="banner_content wow fadeInUp animated">
          <div className="container">
            <div className="row">
              <div className="col-8">
                <h4 className="sub-title text-secondary">SALE upto 50%</h4>
                <h1 className="title">
                  <Link
                    href={`/shop-default`}
                    className="link text-white text-line-clamp-2"
                  >
                    The Best Way Pet Food Conner
                  </Link>
                </h1>
                <p className="sub-text text-white text-line-clamp-2">
                  Immune Support &amp; Overall Health for All Dogs! Boost your
                  dog’s natural defenses with this nutrient -rich dog
                </p>
                <Link href={`/shop-default`} className="tf-btn btn-secondary">
                  Shop now
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
