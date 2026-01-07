import ProductGrid from "@/components/products/ProductGrid";
import CategoryTabs from "@/components/products/CategoryTabs";
import ShopPageBanner from "@/widgets/ShopPageBanner";

import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "Shop - Premium Vaping Products",
  description: "Discover our curated selection of premium vaping devices and accessories. Quality meets innovation in every product.",
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
      {/* 创意 Banner - 北欧简约风格（紧凑版） */}
      <ShopPageBanner />

      {/* 顶部分类标签栏 */}
      <CategoryTabs />

      {/* 主内容区 - 全宽布局，紧凑padding */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* 产品网格 */}
        <ProductGrid initialProducts={response.products} />
      </div>
    </div>
  );
}
