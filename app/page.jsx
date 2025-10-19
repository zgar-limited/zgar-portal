import Footer1 from "@/components/footers/Footer1";
import Blogs from "@/components/homes/home-1/Blogs";

import Categories from "@/components/homes/home-sneaker/Categories";

import HomeProductPreview from "@/widgets/HomeProductPreview";
import HomeSocialPost from "@/widgets/HomeSocialPost";
import HomeProductVerify from "@/widgets/HomeProductVerify";
import HomeHeader from "@/widgets/HomeHeader";
import HomeBgColor from "@/widgets/HomeBgColor";
import HomeBanner from "@/widgets/HomeBanner";
import HomeTips from "@/widgets/HomeTips";
import FlowingMenu from "@/components/banner/menu/flowing-menu/FlowingMenu";
import HomeSpecialProducts from "@/widgets/HomeSpecialProducts";
import Header1 from "@/components/header/Header1"
export const metadata = {
  title:
    "Home Fashion 01 || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default async function Home() {
  // const res = await fetch(
  //   "https://wp.cloudrainext.cn:10081/wp-json/wp/v2/posts",
  //   { cache: "no-store" }
  // ).then(res => res.json());
  // console.log("🚀 ~ Home ~ res:", res)
  

  // console.log("WP_ORIGIN",process.env.WP_ORIGIN)
  
  return (
    <div className="bg-[#f2f2f2]">
      {/* <HomeBgColor /> */}
      {/* <HomeTips /> */}
      <div className="primary-bg-img">
        {/* <Header1/> */}
        <HomeHeader />
        <HomeBanner />
      </div>

      <HomeSpecialProducts />

      <HomeProductPreview />

      {/* <Products1 /> */}
      {/* <Products2 /> */}
      {/* <Testimonials /> */}
      <Blogs />
      {/* <InstagramPosts /> */}
      <HomeSocialPost />
      <HomeProductVerify />
      <Footer1 />
    </div>
  );
}
