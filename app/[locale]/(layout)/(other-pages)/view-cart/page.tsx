import ShopCart from "@/components/other-pages/ShopCart";
import React from "react";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import { retrieveCart } from "@/data/cart";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { medusaSDK } from "@/utils/medusa";
import { StoreProductListResponse } from "@medusajs/types";
import { fetchProducts } from "@/data/products";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
};

export default async function page() {
  // 使用正确的购物车检索函数
  const cart = await retrieveCart();
  // 老王我：获取包含 zgar_customer 字段的客户信息（含余额）
  const customer = await retrieveCustomerWithZgarFields();

  const { response } = await fetchProducts({
    countryCode: "us",
    queryParams: {
      limit: 50,
    },
  });

  return (
    <>
      <ShopCart cart={cart} products={response.products} customer={customer} />
    </>
  );
}
