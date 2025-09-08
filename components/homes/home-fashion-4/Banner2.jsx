import Link from "next/link";
import Image from "next/image";
import React from "react";
import TextCircle from "@/components/common/TextCircle";

export default function Banner2() {
  return (
    <div className="themesFlat">
      <div
        className="banner-V05 flat-spacing-2 parallaxie"
        style={{ backgroundImage: 'url("/images/banner/bannerV05.jpg")' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-md-6">
              <div className="banner_content text-center wow fadeInUp">
                <div className="wg-curve-text">
                  <span className="icon">
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25.0001 8V21C25.0001 21.2652 24.8947 21.5196 24.7072 21.7071C24.5196 21.8946 24.2653 22 24.0001 22C23.7349 22 23.4805 21.8946 23.293 21.7071C23.1054 21.5196 23.0001 21.2652 23.0001 21V10.4137L8.70757 24.7075C8.51993 24.8951 8.26543 25.0006 8.00007 25.0006C7.7347 25.0006 7.48021 24.8951 7.29257 24.7075C7.10493 24.5199 6.99951 24.2654 6.99951 24C6.99951 23.7346 7.10493 23.4801 7.29257 23.2925L21.5863 9H11.0001C10.7349 9 10.4805 8.89464 10.293 8.70711C10.1054 8.51957 10.0001 8.26522 10.0001 8C10.0001 7.73478 10.1054 7.48043 10.293 7.29289C10.4805 7.10536 10.7349 7 11.0001 7H24.0001C24.2653 7 24.5196 7.10536 24.7072 7.29289C24.8947 7.48043 25.0001 7.73478 25.0001 8Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                  <div className="text-rotate">
                    <div className="circle">
                      <TextCircle />
                    </div>
                  </div>
                </div>
                <Link
                  href={`/shop-default`}
                  className="h1 fw-medium link title"
                >
                  Ochaka. Store
                </Link>
                <p className="sub-title">
                  Up to 50% off Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit
                </p>
                <p className="sub-text h6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  arcu urna, interdum sit amet nibh ac, pulvinar placerat lacus.
                  Ut lobortis quam vel ligula semper laoreet. Fusce non iaculis
                  erat, eu gravida tortor
                </p>
                <Link href={`/shop-default`} className="tf-btn animate-btn">
                  View more
                  <i className="icon icon-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
