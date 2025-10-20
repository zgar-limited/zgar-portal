import Footer from "@/components/footers/Footer6";
import Blogs from "@/components/homes/home-accessories/Blogs";

import Categories from "@/components/homes/home-watch/Categories";

import HomeProductPreview from "@/widgets/HomeProductPreview";
import HomeSocialPost from "@/widgets/HomeSocialPost";
import HomeProductVerify from "@/widgets/HomeProductVerify";
import HomeHeader from "@/widgets/HomeHeader";
import HomeBgColor from "@/widgets/HomeBgColor";
import HomeBanner from "@/widgets/HomeBanner";
import HomeTips from "@/widgets/HomeTips";
import FlowingMenu from "@/components/banner/menu/flowing-menu/FlowingMenu";
import HomeSpecialProducts from "@/widgets/HomeSpecialProducts";
import Header1 from "@/components/header/Header1";
import HomeFooter from "@/widgets/HomeFooter";
import Faqs from "@/components/other-pages/Faqs";
import HomeFaq from "@/widgets/HomeFaq";
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
    <div>
      {/* <HomeBgColor /> */}
      {/* <HomeTips /> */}
      <div className="primary-gradient-bg">
        {/* <Header1/> */}
        <HomeHeader />
        <HomeBanner />
        {/* <HomeSpecialProducts  /> */}
        <Categories />
      </div>
      <HomeProductPreview />
      <HomeProductVerify />
      <HomeFaq />
      
      <Blogs />
      <HomeSocialPost />

      <HomeFooter />
    </div>
  );
}
