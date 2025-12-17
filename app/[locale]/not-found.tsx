import Link from "next/link";
import Image from "next/image";

import React from "react";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";

export const metadata = {
  title:
    "Page Not Found || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      
      <section className="s-404 flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
              <div className="image">
                <Image
                  className="lazyload"
                  src="/images/section/404.svg"
                  alt=""
                  width={944}
                  height={588}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="wrap">
                <div className="content">
                  <h1 className="title">Something’s Missing</h1>
                  <p className="sub-title h6">
                    This page is missing or you assembled the link incorrectly
                  </p>
                </div>
                <div className="group-btn">
                  <Link href={`/`} className="tf-btn animate-btn">
                    Back to home page
                  </Link>
                  <Link
                    href={`/shop-default-list`}
                    className="tf-btn style-line"
                  >
                    Product list
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
