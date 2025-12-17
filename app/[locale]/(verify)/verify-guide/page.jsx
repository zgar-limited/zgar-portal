import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <Topbar1 />
      <Header1 parentClass="" />
      <Image
        className="w-full h-auto "
        src="/images/guide/detail_pc_zh/title.webp"
        alt="verify title"
        width={2880}
        height={290}
      />
      <div className=" container mt-[24px] space-y-[24px]">
        {[1, 2, 3, 4].map((step) => {
          return (
            <Image
              key={step}
              className="block w-[calc(100%_-_24px)] h-auto mx-auto "
              src={`/images/guide/detail_pc_zh/${step}.webp`}
              alt={"verify step " + step}
              width={1442}
              height={684}
            />
          );
        })}
        
      </div>
      <Image
          className="w-full h-auto mt-[24px]"
          src="/images/guide/detail_pc_zh/end.webp"
          alt="verify title"
          width={2880}
          height={290}
        />
      <Footer1 />
    </>
  );
};

export default page;
