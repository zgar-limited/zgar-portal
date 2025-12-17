import Image from "next/image";
import React from "react";

export default function ShopBanner() {
  return (
    <div className="container relative pt-5 pt-md-0 ">
      <div className="absolute top-0 bottom-0  left-0 right-0  h-auto z-[-1] ">
        <Image
          src="/images/banner/shop_banner_1.webp"
          fill
          className="container"
        />
      </div>

      <div className="container row align-items-center">
        <div className="text-center col-md-6 col-12 ">
          <p className="h2 text-white">
            Cloud Chaser Pro Supreme Vaping Experience Awaits
          </p>
          <p className="h-3 text-white">
            The Cloud Chaser Pro delivers a powerful and sleek vaping
            experience.
          </p>
        </div>
        <div className="mt-5 ms-auto col-md-6 col-12 mt-md-0">
          <Image
            className="w-full h-auto "
            src="/images/slot/pendant/shop_pendant.webp"
            width={1305}
            height={900}
          />
        </div>
      </div>
    </div>
  );
}
