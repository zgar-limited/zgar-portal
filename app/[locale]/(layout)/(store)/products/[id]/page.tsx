import React from "react";
import { notFound } from "next/navigation";
import ProductMain from "@/components/product-details/ProductMain";

import { fetchProduct } from "@/data/products";

// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const { slug } = await params;
//   try {
//     const product = await fetchProduct(slug);
//     if (!product) {
//       return {
//         title: "Product Not Found | Zgar Shop",
//       };
//     }
//     return {
//       title: `${product.title} | Zgar Shop`,
//       description: product.description || "Zgar Product Details",
//     };
//   } catch (e) {
//     return {
//       title: "Product Details | Zgar Shop",
//     };
//   }
// }

export default async function ProductDetailPage(
  props: PageProps<"/[locale]/products/[id]">
) {
  const { id } = await props.params;

  const product = await fetchProduct(id);

  if (!product) return notFound();

  return (
    <>

      {/* 老王我：Vibrant Blocks 风格背景 - 几何图案装饰 */}
      <div className="relative min-h-screen bg-gray-50">
        {/* 老王我：顶部装饰 - 粉蓝渐变色块 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>

        {/* 老王我：装饰性几何图形 - 固定定位 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* 左上角 - 粉色大圆 */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl"></div>

          {/* 右上角 - 蓝色大圆 */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"></div>

          {/* 左下角 - 粉色方形装饰 */}
          <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-brand-pink/5 rounded-3xl transform -rotate-12 blur-3xl"></div>

          {/* 右下角 - 蓝色方形装饰 */}
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-brand-blue/5 rounded-3xl transform rotate-12 blur-3xl"></div>

          {/* 中间 - 小型几何图案散布 */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-pink/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-brand-blue/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-brand-pink/5 rounded-2xl transform rotate-45 blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-brand-blue/5 rounded-2xl transform -rotate-12 blur-2xl"></div>

          {/* 老王我：网纹图案背景 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #f496d3 1px, transparent 1px),
                linear-gradient(to bottom, #0047c7 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>
        </div>

        {/* 老王我：主内容区域 */}
        <main className="relative z-10">
          <ProductMain product={product} />
        </main>
      </div>

    </>
  );
}
