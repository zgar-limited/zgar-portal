
import { retrieveCustomer } from "@/data/customer";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import Image from "next/image";
import React from "react";
import BlogList from "@/components/blogs/BlogList2"
const CarePage = async () => {
  const customer = await retrieveCustomer();
  return (
    <>
      <HomeHeader customer={customer} />
      <div className="overflow-hidden page_image">
        <Image
          className="lazyload ani-zoom"
          src="/images/care/banner.webp"
          alt="Banner"
          width={2880}
          height={750}
        />
      </div>
      <BlogList/>
      <HomeFooter />
    </>
  );
};

export default CarePage;
