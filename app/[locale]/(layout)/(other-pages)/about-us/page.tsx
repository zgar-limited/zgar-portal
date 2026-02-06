import Image from "next/image";
import { Globe, Users, Award, Target } from "lucide-react";

export const metadata = {
  title: "About Us - Zgar 电子烟品牌故事",
  description: "了解 Zgar 品牌的故事、使命、团队和全球业务",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：Banner - 纯图片，宽屏，高度自动 */}
      <section className="w-full">
        <Image
          src="/images/about-us/banner.webp"
          alt="Zgar Banner"
          width={1920}
          height={0}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* 老王我：Who We Are - who-we-are.webp + 色块布局 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* 左侧：图片 */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src="/images/about-us/who-we-are.webp"
                  alt="Who We Are"
                  fill
                  className="object-cover"
                />
              </div>
              {/* 装饰性色块 */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-pink hidden md:block"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-blue hidden md:block"></div>
            </div>

            {/* 右侧：文字内容 */}
            <div>
              <div className="inline-block bg-black text-white px-4 py-2 mb-6">
                <span className="font-black text-sm tracking-widest">WHO WE ARE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                我们是谁
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Zgar 是一家专注于电子烟产品研发和生产的创新型企业。我们致力于通过先进的技术和严格的质量控制，为全球用户提供安全、高品质的电子烟产品。
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                我们的团队由经验丰富的工程师、设计师和行业专家组成，共同打造符合国际标准的产品。
              </p>

              {/* 老王我：三个数据块 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-brand-pink text-white p-6 text-center">
                  <div className="text-3xl md:text-4xl font-black mb-2">10+</div>
                  <div className="text-xs font-bold">年经验</div>
                </div>
                <div className="bg-brand-blue text-white p-6 text-center">
                  <div className="text-3xl md:text-4xl font-black mb-2">50+</div>
                  <div className="text-xs font-bold">个国家</div>
                </div>
                <div className="bg-black text-white p-6 text-center">
                  <div className="text-3xl md:text-4xl font-black mb-2">1M+</div>
                  <div className="text-xs font-bold">用户</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：Product Factory - product-factory.webp + 色块 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* 左侧：文字内容（反向） */}
            <div className="order-2 lg:order-1">
              <div className="inline-block bg-brand-blue text-white px-4 py-2 mb-6">
                <span className="font-black text-sm tracking-widest">OUR PRODUCTS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                优质产品
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                我们的产品涵盖一次性电子烟、换弹系列、开放式系统等多个品类。每一款产品都经过严格的质量测试，确保安全性和可靠性。
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                采用最新的雾化技术和高品质材料，为用户提供纯净、顺滑的吸烟体验。
              </p>

              {/* 老王我：三个特性块 */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-pink flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1">国际认证</h3>
                    <p className="text-gray-600 text-sm">通过 CE、ROHS、FCC 等国际认证</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-blue flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1">严格品控</h3>
                    <p className="text-gray-600 text-sm">每一道工序都经过严格检测</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1">专业团队</h3>
                    <p className="text-gray-600 text-sm">经验丰富的研发和生产团队</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：图片（反向） */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src="/images/about-us/product-factory.webp"
                  alt="Product Factory"
                  fill
                  className="object-cover"
                />
              </div>
              {/* 装饰性色块 */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-black hidden md:block"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-pink hidden md:block"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：Global Reach - world-map.webp + 色块 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-brand-pink text-white px-4 py-2 mb-6">
              <span className="font-black text-sm tracking-widest">GLOBAL REACH</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              全球布局
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们的产品已销往全球 50+ 个国家和地区，服务超过 100 万用户
            </p>
          </div>

          {/* 地图图片 */}
          <div className="relative max-w-5xl mx-auto mb-12">
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src="/images/about-us/world-map.webp"
                alt="Global Reach"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 老王我：四个区域色块 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <div className="bg-brand-pink text-white p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">50+</div>
              <div className="text-sm font-bold">覆盖国家</div>
            </div>
            <div className="bg-brand-blue text-white p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">100+</div>
              <div className="text-sm font-bold">合作伙伴</div>
            </div>
            <div className="bg-black text-white p-8 text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">20+</div>
              <div className="text-sm font-bold">国际认证</div>
            </div>
            <div className="bg-gray-900 text-white p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">24/7</div>
              <div className="text-sm font-bold">客户支持</div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：Contact Us CTA - 纯图片 */}
      <section className="w-full">
        <Image
          src="/images/about-us/contact-us.webp"
          alt="Contact Us"
          width={1920}
          height={0}
          className="w-full h-auto"
        />
      </section>
    </div>
  );
}
