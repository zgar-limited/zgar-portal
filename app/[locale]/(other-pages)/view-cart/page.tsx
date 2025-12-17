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
import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
};

export default async function page() {
  const cart = await getCart();
  const { response } = await fetchProducts({
    countryCode: "us",
    queryParams: {
      limit: 50,
    },
  });

  return (
    <>
      <HomeTips />
      <HomeHeader cart={cart} />

      <ShopCart cart={cart} products={response.products} />
      <HomeFooter />
    </>
  );
}
