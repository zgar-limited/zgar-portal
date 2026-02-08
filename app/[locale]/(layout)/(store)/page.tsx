import Blogs from "@/components/homes/home-accessories/Blogs";

import Categories from "@/components/homes/home-watch/Categories";

import HomeHotSellingProduct from "@/widgets/HomeHotSellingProduct";
import HomeSocialPost from "@/widgets/HomeSocialPost";
import HomeProductVerify from "@/widgets/HomeProductVerify";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import HomeFaq from "@/widgets/HomeFaq";

import ShopBanner from "@/widgets/ShopBanner";
import HomeProductCate from "@/widgets/HomeProductCate";
import HomeTips from "@/widgets/HomeTips";
import HomeVideo from "@/widgets/HomeVideo/HomeVideo";
import HomeSubscription from "@/widgets/HomeSubscription/HomeSubscription";
import HomeAboutUs from "@/widgets/HomeAboutUs";
import { retrieveCustomer } from "@/data/customer";
import { fetchBannerByCode } from "@/data/banners"; // 老王我：导入通过code获取banner的函数

export const metadata = {
  title: "Zgar",
  description: "Zgar - Home",
};

export default async function Home() {
  // 老王我：测试通过 code 拉取 banner 数据
  console.log("=== 老王我：通过 code 拉取 Banner (home-hero) ===");

  try {
    const heroBanner = await fetchBannerByCode("home-hero");
    console.log("✅ Banner数据拉取成功！", heroBanner);
    console.log("Banner code:", heroBanner?.code);
    console.log("Banner title:", heroBanner?.title);
    console.log("Banner 图片数量:", heroBanner?.images?.length || 0);
  } catch (error) {
    console.error("❌ Banner数据拉取失败:", error);
  }

  return (
    <div className="overflow-hidden">

      <ShopBanner />
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
