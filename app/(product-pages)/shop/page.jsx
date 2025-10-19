import Link from "next/link";

import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import Categories from "@/components/products/Categories";
import Products1 from "@/components/products/Products1";
import React from "react";
import Image from "next/image";
import ShopBanner from "@/widgets/ShopBanner";

export const metadata = {
  title: "Shop || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header1 parentClass="tf-header header-fix" />
      <ShopBanner />
      <Categories />
      <Products1 />
      <Features parentClass="flat-spacing" />
      <Footer1 />
    </>
  );
}
