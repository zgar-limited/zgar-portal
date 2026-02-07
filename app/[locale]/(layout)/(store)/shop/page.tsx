import ProductGrid from "@/components/products/ProductGrid";
import CategoryTabs from "@/components/products/CategoryTabs";
import ShopPageBanner from "@/widgets/ShopPageBanner";
import ShopPageContent from "./ShopPageContent";

import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "Shop - Zgar电子烟产品",
  description: "探索Zgar全系列电子烟产品，一次性电子烟、换弹系列、开放式系统",
};

export default async function Page({
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

  return <ShopPageContent products={response.products} />;
}
