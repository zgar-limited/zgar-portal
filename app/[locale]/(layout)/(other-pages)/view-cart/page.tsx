import ShopCart from "@/components/other-pages/ShopCart";
import React from "react";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import { retrieveCart } from "@/data/cart";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
import { medusaSDK } from "@/utils/medusa";
import { StoreProductListResponse, HttpTypes } from "@medusajs/types";
import { fetchProducts, fetchProduct } from "@/data/products";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
};

export default async function page() {
  // 使用正确的购物车检索函数
  const cart = await retrieveCart();
  // 老王我：获取包含 zgar_customer 字段的客户信息（含余额）
  const customer = await retrieveCustomerWithZgarFields();

  // 老王我：根据购物车中的产品ID列表，获取完整的产品信息（包括 options 和 metadata）
  const cartProductIds = cart?.items?.map((item: any) => item.product_id) || [];

  // 老王我：去重，避免重复获取同一个产品
  const uniqueProductIds = Array.from(new Set(cartProductIds));

  // 老王我：如果购物车有产品，为每个产品单独调用 fetchProduct 获取完整数据
  let products: HttpTypes.StoreProduct[] = [];
  if (uniqueProductIds.length > 0) {
    try {
      // 老王我：并发获取所有产品的完整信息
      const productPromises = uniqueProductIds.map((productId) =>
        fetchProduct(productId).catch((error) => {
          console.error(`Error fetching product ${productId}:`, error);
          return null;
        })
      );

      const fetchedProducts = await Promise.all(productPromises);

      // 老王我：过滤掉获取失败的产品
      products = fetchedProducts.filter((p) => p !== null);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  }

  return (
    <>
      <ShopCart cart={cart} products={products} customer={customer} />
    </>
  );
}
