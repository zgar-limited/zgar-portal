import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import Blogs from "@/components/homes/home-1/Blogs";

import Hero from "@/components/homes/home-1/Hero";
import InstagramPosts from "@/components/homes/home-1/InstagramPosts";
import Testimonials from "@/components/homes/home-1/Testimonials";

import Categories from "@/components/homes/home-sneaker/Categories";

import Products1 from "@/components/homes/home-sneaker/Products1";
import Products2 from "@/components/homes/home-sneaker/Products2";
import HomeProductPreview from "@/widgets/HomeProductPreview";
import HomeSocialPost from "@/widgets/HomeSocialPost";
import HomeProductVerify from "@/widgets/HomeProductVerify"
export const metadata = {
  title:
    "Home Fashion 01 || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default async function Home() {

  // const res = await fetch("https://wp.cloudrainext.cn:10081/wp-json/wp/v2/media")
  // console.log("🚀 ~ Home ~ res:", res)
  
  return (
    <>
      {/* <Topbar1 containerFull containerFullClass="container-full" /> */}
      {/* <Header1 containerFull /> */}
      <Hero />
      <Categories />

      <HomeProductPreview />
      {/* <Collections /> */}
      {/* <Products1 /> */}
      {/* <Products2 /> */}
      {/* <Testimonials /> */}
      <Blogs />
      {/* <InstagramPosts /> */}
      <HomeSocialPost />
      <HomeProductVerify/>
      <Footer1 />
    </>
  );
}
