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
import { retrieveCustomer } from "@/data/customer";
export const metadata = {
  title: "Zgar",
  description: "Zgar - Home",
};
export default async function Home() {
  

  return (
    <div className="overflow-hidden">
      
      <ParallaxSlider />
      <HomeProductCate />
      <HomeHotSellingProduct />
      <HomeProductVerify />
      <HomeVideo />
      <HomeAboutUs />
      


      {/* <Blogs /> */}
      <HomeSocialPost />
      <HomeSubscription />


    </div>
  );
}
