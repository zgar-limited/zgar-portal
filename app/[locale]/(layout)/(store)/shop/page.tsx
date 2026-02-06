import ProductGrid from "@/components/products/ProductGrid";
import CategoryTabs from "@/components/products/CategoryTabs";
import ShopPageBanner from "@/widgets/ShopPageBanner";

import { fetchProducts } from "@/data/products";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Shop - Zgar电子烟产品",
  description: "探索Zgar全系列电子烟产品，一次性电子烟、换弹系列、开放式系统",
};

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { response } = await fetchProducts({
    // countryCode: "us",
    // queryParams: {
    //   limit: 12,
    // },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：Vibrant Blocks Hero Banner - 大胆色块分割 */}
      <section className="relative overflow-hidden">
        {/* 老王我：三分屏色块布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
          {/* 左侧色块 - 粉色 */}
          <div className="bg-[#f496d3] p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
            {/* 装饰性方块 */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/20"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-[#0047c7]"></div>

            {/* 内容 */}
            <div className="relative z-10">
              <div className="inline-block bg-black text-white px-6 py-3 mb-6">
                <span className="font-black text-sm tracking-widest">
                  全新产品系列
                </span>
              </div>
            </div>
          </div>

          {/* 中间色块 - 蓝色 */}
          <div className="bg-[#0047c7] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* 装饰性方块 */}
            <div className="absolute top-8 right-8 w-24 h-24 bg-[#f496d3]"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/30"></div>

            {/* 主标题 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight relative z-10">
              探索
              <br />
              <span className="text-[#f496d3]">ZGAR</span>
              <br />
              产品
            </h1>

            {/* 描述 */}
            <p className="text-lg md:text-xl font-bold text-white/90 max-w-md">
              一次性电子烟 · 换弹系列 · 开放式系统
            </p>
          </div>

          {/* 右侧色块 - 白色带粉色 accent */}
          <div className="bg-white p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* 装饰性色块 */}
            <div className="absolute top-0 right-0 w-full h-1/3 bg-[#f496d3]"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-1/4 bg-[#0047c7]"></div>

            {/* 产品数量 - 块状设计 */}
            <div className="relative z-10">
              <div className="bg-black text-white p-8 md:p-10">
                <div className="text-6xl md:text-7xl font-black mb-4">
                  {response.products.length}
                </div>
                <div className="text-xl font-bold">
                  款产品可选
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：Neubrutalism分类标签 - 白色背景 */}
      <section className="bg-white border-b-4 border-black py-6">
        <div className="max-w-7xl mx-auto px-6">
          <CategoryTabs />
        </div>
      </section>

      {/* 老王我：产品网格区域 */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* 工具栏标题 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                全部产品
              </h2>
            </div>
          </div>

          {/* 产品网格 */}
          <ProductGrid initialProducts={response.products} />
        </div>
      </section>

      {/* 老王我：Vibrant Blocks CTA横幅 - 大胆色块分割 */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左侧色块 - 蓝色 */}
          <div className="bg-[#0047c7] p-12 md:p-16 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                需要帮助？
              </h2>
              <p className="text-lg md:text-xl font-bold opacity-90">
                联系我们的客服团队获取专业建议
              </p>
            </div>
          </div>

          {/* 右侧色块 - 黑色带按钮 */}
          <div className="bg-black p-12 md:p-16 flex items-center justify-center">
            <div className="text-center">
              <button className="w-full md:w-auto px-12 py-6 bg-white text-black font-black text-xl hover:bg-[#f496d3] hover:text-white transition-all duration-200 flex items-center justify-center gap-4">
                <span>联系我们</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
