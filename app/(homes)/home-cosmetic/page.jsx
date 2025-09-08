import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import FixedHeader from "@/components/header/FixedHeader";
import Header4 from "@/components/header/Header4";
import Topbar1 from "@/components/header/Topbar1";
import Blogs from "@/components/homes/home-cosmetic/Blogs";
import Categories from "@/components/homes/home-cosmetic/Categories";
import Hero from "@/components/homes/home-cosmetic/Hero";
import Prouducts1 from "@/components/homes/home-cosmetic/Products1";
import Products2 from "@/components/homes/home-cosmetic/Products2";
import Products3 from "@/components/homes/home-cosmetic/Products3";
import ShopGram from "@/components/homes/home-cosmetic/ShopGram";
import Testimonials from "@/components/homes/home-cosmetic/Testimonials";
import React from "react";

export const metadata = {
  title:
    "Home Cosmetic || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <FixedHeader />
      <Header4 />
      <Hero />
      <Features parentClass="flat-spacing" />
      <Categories />
      <Prouducts1 />
      <Products2 />
      <Products3 />
      <Testimonials />
      <Blogs />
      <ShopGram />
      <Footer1 parentClass="tf-footer style-color-white bg-black" />
    </>
  );
}
