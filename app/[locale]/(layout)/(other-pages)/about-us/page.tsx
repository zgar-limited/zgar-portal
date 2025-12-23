import About from "@/components/other-pages/about/About";
import BrandStory from "@/components/other-pages/about/BrandStory";
import Hero from "@/components/other-pages/about/Hero";
import PageTitle from "@/components/other-pages/about/PageTitle";
import HomeHeader from "@/widgets/HomeHeader"
import HomeFooter from "@/widgets/HomeFooter"

export const metadata = {
  title: "About || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default function page() {
  return (
    <>


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
