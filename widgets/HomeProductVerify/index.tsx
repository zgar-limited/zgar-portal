"use client";
import React from "react";
import scope from "./index.module.scss";
import Image from "next/image";
import Link from "next/link";

const index = () => {
  return (
    <div
      className={`${scope.background} d-flex flex-column align-items-center pb-[70px] mt-[50px]`}
    >
      <div className="mt-[88px]  h1  title font-bold text-black">
        SCAN TO VERIFY
      </div>
      <div className="font-light text-center h3 text-black">
        please scan the <span className="font-bold">QR code</span> with the
        phone on the product <span className="font-bold ">packaging</span> to
        enter <span className="font-bold ">Two-Step Product Verification</span>
      </div>
      <Link href="/verify-guide">
        <h5 className="mt-[38px] h4 underline cursor-pointer">{`View Guide>>`}</h5>
      </Link>
      <Image
        className="mt-[56px]"
        width={1200}
        height={840}
        alt="product verification guide"
        src="/images/guide/pc_zh.webp"
      />
    </div>
  );
};

export default index;
