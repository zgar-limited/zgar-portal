import ProductGrid from "@/components/products/ProductGrid";
import FilterSidebarNew from "@/components/products/FilterSidebarNew";

import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "Shop ",
  description: "",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 主内容区 - 侧边栏布局 */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* 左侧筛选边栏 - 固定 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebarNew />
          </aside>

          {/* 右侧主内容 */}
          <main className="flex-1 min-w-0">
            {/* 产品网格 */}
            <ProductGrid initialProducts={response.products} />
          </main>
        </div>
      </div>
    </div>
  );
}
