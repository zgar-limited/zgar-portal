import ShopCart from "@/components/other-pages/ShopCart";
import { retrieveCart } from "@/data/cart";
import { fetchProducts } from "@/data/products";
import { requireAuth } from "@/data/auth";

export const metadata = {
  title: "View Cart  ",
  description: "zgar ",
};

export default async function page() {
  // 老王我：统一认证检查（处理未登录和 token 过期）
  const customer = await requireAuth();

  // 使用正确的购物车检索函数
  const cart = await retrieveCart();

  // 老王我：获取所有产品（跟 shop 页面一致），ProductsSelectModal 需要完整产品列表
  const { response } = await fetchProducts({});

  return (
    <>
      <ShopCart cart={cart} products={response.products} customer={customer} />
    </>
  );
}
