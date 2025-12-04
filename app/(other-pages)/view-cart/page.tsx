import Link from "next/link";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import ShopCart from "@/components/other-pages/ShopCart";
import React from "react";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import { getCart } from "@/utils/server-cart";
import { medusaSDK } from "@/utils/medusa";
import { StoreProductListResponse } from "@medusajs/types";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
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
      }
    );
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function page() {
  // const cart = await getCart();
  // const products = await getProducts();
  const [cart, products] = await Promise.all([getCart(), getProducts()]);
  console.log(
    "%c [ cart ]-19",
    "font-size:13px; background:pink; color:#bf2c9f;",
    cart
  );

  return (
    <>
      <HomeTips />
      <HomeHeader cart={cart} />

      <ShopCart cart={cart} products={products} />
      <HomeFooter />
    </>
  );
}
