import Link from "next/link";
import Features from "@/components/common/Features";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import ProductGrid from "@/components/products/ProductGrid";
import React from "react";
import ShopBanner from "@/widgets/ShopBanner";
import Categories from "@/components/products/Categories";

import { StoreProductListResponse } from "@medusajs/types";
import { medusaSDK } from "@/utils/medusa";
import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "Shop || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { response } = await fetchProducts({
    countryCode: "us",
    queryParams: {
      limit: 12,
    },
  });

  return (
    <>
      <HomeHeader />
      <ShopBanner />
      <Categories />
      <ProductGrid initialProducts={response.products} />
      <HomeFooter />
    </>
  );
}
