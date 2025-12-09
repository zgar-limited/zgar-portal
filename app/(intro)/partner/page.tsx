
import { retrieveCustomer } from "@/data/customer";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import Image from "next/image";
import React from "react";

const PartnerPage = async () => {
  const customer = await retrieveCustomer();
  return (
    <>
      <HomeHeader customer={customer} />
      <div className="overflow-hidden page_image">
        <Image
          className="lazyload ani-zoom"
          src="/images/partner/banner.webp"
          alt="Banner"
          width={2880}
          height={1350}
        />
      </div>
      <div className="container">
        <h1 className="my-12">Asia</h1>
        <div className="mb-12 row justify-content-center">
          {["my", "id", "jp", "hk"].map(code => {
            return <div key={code} className="col-6 col-xl-3 row align-items-center justify-content-center">
              <a className="col-6">
                <Image
                  className="lazyload ani-zoom"
                  src={`/images/national-flag/${code}.svg`}
                  alt={code}
                  width={2560}
                  height={1829}
                />
              </a>
              <a className="col-6 h4">{code}</a>


            </div>
          })}
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default PartnerPage;
