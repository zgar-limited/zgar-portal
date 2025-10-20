import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function PageTitle() {
  return (
    <section className="page-title-image">
      <div className="overflow-hidden page_image">
        <Image
          className="lazyload ani-zoom"
          src="/images/about-us/banner.webp"
          alt="Banner"
          width={2880}
          height={1350}
        />
      </div>
      <div className="page_content">
        <div className="container">
          <div className="content">
            <h1 className="text-white heading ">
              {/* WE PRIORITIZE SUSTAINABLE &amp;{" "}
              <br className="d-none d-sm-block" />
              ENVIRONMENTALLY FRIENDLY <br className="d-none d-sm-block" />
              DEVELOPMENT */}
            </h1>
            {/* <Link href={`/shop-default`} className="tf-btn animate-btn">
              Our shop
              <i className="icon icon-caret-right" />
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
