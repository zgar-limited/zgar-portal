import Link from "next/link";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import ShopCart from "@/components/other-pages/ShopCart";
import React from "react";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
};
export default function page() {
  return (
    <>
      <HomeTips />
      <HomeHeader />

      <ShopCart />
      <HomeFooter/>
    </>
  );
}
