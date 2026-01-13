import ShopCart from "@/components/other-pages/ShopCart";
import { retrieveCart } from "@/data/cart";
import { retrieveCustomerWithZgarFields } from "@/data/customer";
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

  // 老王我：获取所有产品（跟 shop 页面一致），ProductsSelectModal 需要完整产品列表
  const { response } = await fetchProducts({});

  return (
    <>
      <ShopCart cart={cart} products={response.products} customer={customer} />
    </>
  );
}
