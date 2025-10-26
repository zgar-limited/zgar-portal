import Blogs from "@/components/homes/home-accessories/Blogs";

import Categories from "@/components/homes/home-watch/Categories";

import HomeHotSellingProduct from "@/widgets/HomeHotSellingProduct";
import HomeSocialPost from "@/widgets/HomeSocialPost";
import HomeProductVerify from "@/widgets/HomeProductVerify";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import HomeFaq from "@/widgets/HomeFaq";

import ParallaxSlider from "@/components/parallax-slider/ParallaxSlider";
import HomeProductCate from "@/widgets/HomeProductCate";
import HomeTips from "@/widgets/HomeTips";
import HomeVideo from "@/widgets/HomeVideo/HomeVideo";
import HomeSubscription from "@/widgets/HomeSubscription/HomeSubscription";
import HomeAboutUs from "@/widgets/HomeAboutUs";
export const metadata = {
  title: "Zgar",
  description: "Zgar - Home",
};
export default async function Home() {
  // const res = await fetch(
  //   "https://wp.cloudrainext.cn:10081/wp-json/wp/v2/posts",
  //   { cache: "no-store" }
  // ).then(res => res.json());
  // console.log("🚀 ~ Home ~ res:", res)

  // console.log("WP_ORIGIN",process.env.WP_ORIGIN)

  return (
    <div className="overflow-hidden">
      <HomeTips />
      <HomeHeader />
      <ParallaxSlider />
      <HomeProductCate />
      <HomeHotSellingProduct />
      <HomeProductVerify />
      <HomeVideo />
      <HomeAboutUs />
      <HomeSubscription />
      {/* <HomeFaq /> */}

      {/* <Blogs /> */}
      {/* <HomeSocialPost /> */}

      <HomeFooter />
    </div>
  );
}
