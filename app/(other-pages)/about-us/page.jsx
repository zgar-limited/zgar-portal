import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import About from "@/components/other-pages/about/About";
import BrandStory from "@/components/other-pages/about/BrandStory";
import Hero from "@/components/other-pages/about/Hero";
import PageTitle from "@/components/other-pages/about/PageTitle";
import ShopGram from "@/components/other-pages/about/ShopGram";
import Testimonials from "@/components/other-pages/about/Testimonials";
import HomeHeader from "@/widgets/HomeHeader"
import HomeFooter from "@/widgets/HomeFooter"

export const metadata = {
  title: "About || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>

      <HomeHeader/>
      <PageTitle />
      <Hero />
      <About />
      <BrandStory />
      {/* <Testimonials /> */}
      {/* <ShopGram /> */}
      <HomeFooter />
    </>
  );
}
