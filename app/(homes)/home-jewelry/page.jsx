import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import FixedHeader from "@/components/header/FixedHeader";
import Header6 from "@/components/header/Header6";
import BannerCountdown from "@/components/homes/home-jewelry/BannerCountdown";
import Blogs from "@/components/homes/home-jewelry/Blogs";
import Categories from "@/components/homes/home-jewelry/Categories";
import CollectionBanner from "@/components/homes/home-jewelry/CollectionBanner";
import Hero from "@/components/homes/home-jewelry/Hero";
import Products1 from "@/components/homes/home-jewelry/Products1";
import Products2 from "@/components/homes/home-jewelry/Products2";
import ShopGram from "@/components/homes/home-jewelry/ShopGram";
import SingleProduct from "@/components/homes/home-jewelry/SingleProduct";
import Testimonials from "@/components/homes/home-jewelry/Testimonials";
import React from "react";

export const metadata = {
  title:
    "Home Jewelry || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>
      <FixedHeader />
      <Header6 />
      <Hero />
      <Categories />
      <CollectionBanner />
      <Products1 />
      <BannerCountdown />
      <Products2 />
      <SingleProduct />
      <Testimonials />
      <Blogs />
      <Features parentClass="themesFlat" />
      <ShopGram />
      <Footer1
        hasLineTop={false}
        parentClass="tf-footer style-color-white bg-black"
      />
    </>
  );
}
