import ProductGrid from "@/components/products/ProductGrid";
import ShopBanner from "@/widgets/ShopBanner";
import Categories from "@/components/products/Categories";

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
    countryCode: "us",
    // queryParams: {
    //   limit: 12,
    // },
  });
  console.log(
    "%c [ response ]-25",
    "font-size:13px; background:pink; color:#bf2c9f;",
    response
  );

  return (
    <>
      <ShopBanner />
      <Categories />
      <ProductGrid initialProducts={response.products} />
    </>
  );
}
