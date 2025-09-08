import Features from "@/components/common/Features";
import MarqueeSlider from "@/components/common/MarqueeSlider";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar5 from "@/components/header/Topbar5";
import Banner from "@/components/homes/home-gym/Banner";
import BannerParallax from "@/components/homes/home-gym/BannerParallax";
import Blogs from "@/components/homes/home-gym/Blogs";
import Collections from "@/components/homes/home-gym/Collections";
import Hero from "@/components/homes/home-gym/Hero";
import Products1 from "@/components/homes/home-gym/Products1";
import Products2 from "@/components/homes/home-gym/Products2";
import Shopgram from "@/components/homes/home-gym/Shopgram";
import Testimonials from "@/components/homes/home-gym/Testimonials";

import React from "react";

export const metadata = {
  title: "Home Gym || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <Topbar5 />
      <Header1 parentClass="tf-header header-fix" containerFull />
      <Hero />
      <Collections />
      <Products1 />
      <MarqueeSlider />
      <BannerParallax />
      <Banner />
      <Products2 />
      <Testimonials />
      <Blogs />
      <Features parentClass="flat-spacing pt-0" />
      <Shopgram />
      <Footer1 parentClass="tf-footer style-color-white style-4 bg-black" />
    </>
  );
}
