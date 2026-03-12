import { retrieveCart } from "@/data/cart";
import { retrieveCustomer } from "@/data/customer";
import { fetchProducts } from "@/data/products";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";
import GlobalEffectsProvider from "@/components/common/GlobalEffectProvider"; // 老王我添加：全局效果Provider
import { Toaster } from "sonner";
import FloatingBatchCartButton from "@/components/common/FloatingBatchCartButton"; // 老王我添加：批量加购悬浮按钮

export default async function RootLayout({ children }) {
  const customer = await retrieveCustomer();
  const cart = await retrieveCart()

  // 老王我：获取产品列表供批量加购弹框使用
  let products = [];
  try {
    const { response } = await fetchProducts({ queryParams: { limit: 100 } });
    products = response.products;
  } catch (error) {
    console.error("Failed to fetch products for floating cart button:", error);
  }

  return (
    <>
      <GlobalEffectsProvider customer={customer} /> {/* 老王我添加：全局效果Provider */}
      <HomeTips></HomeTips>
      <HomeHeader cart={cart} customer={customer}></HomeHeader>
      {children}
      <HomeFooter />
      {/* 老王我添加：批量加购悬浮按钮（仅首页显示） */}
      <FloatingBatchCartButton cart={cart} products={products} />
      {/* 老王我添加shadcn的Toaster组件 */}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
