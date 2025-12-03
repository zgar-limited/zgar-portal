import Link from "next/link";
import Features from "@/components/common/Features";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import ProductGrid from "@/components/products/ProductGrid";
import React from "react";
import ShopBanner from "@/widgets/ShopBanner";
import Categories from "@/components/products/Categories";
import { medusaFetch } from "@/utils/medusa-fetch";
import { StoreProductListResponse } from "@medusajs/types";
import { medusaSDK } from "@/utils/medusa";

export const metadata = {
  title: "Shop || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};

async function getProducts() {
  try {

    const data = await medusaSDK.client.fetch<StoreProductListResponse>(
      "/store/products",
      {
        method: "GET",
        query: {
          limit: 50,
          fields: "*variants.calculated_price,+variants.inventory_quantity",
          region_id: "reg_01K9M1A9NHMN4MXBACKAS5F4V1",
        },

        cache: "no-cache",
        // next: { revalidate: 60 },
      }
    );

    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function page() {
  const products = await getProducts();

  return (
    <>
      <HomeHeader />
      <ShopBanner />
      <Categories />
      <ProductGrid initialProducts={products} />
      <HomeFooter />
    </>
  );
}
