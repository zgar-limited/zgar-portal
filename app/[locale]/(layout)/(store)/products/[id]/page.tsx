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

      {/* 老王我：Memphis 风格背景 - 80年代几何装饰 */}
      <div className="relative min-h-screen bg-gray-50">
        {/* 老王我：顶部装饰 - 多色渐变条 */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-400 via-yellow-400 to-teal-400"></div>

        {/* 老王我：Memphis 风格装饰性几何图形 - 固定定位 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* 左上角 - 三角形装饰 */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 bg-pink-400/20"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(-15deg)'
            }}
          ></div>

          {/* 右上角 - 波浪线装饰 */}
          <div className="absolute -top-10 -right-10 w-80 h-40">
            <svg viewBox="0 0 320 160" className="w-full h-full opacity-20">
              <path
                d="M0,80 Q40,40 80,80 T160,80 T240,80 T320,80"
                fill="none"
                stroke="#FFCE5C"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M0,100 Q40,60 80,100 T160,100 T240,100 T320,100"
                fill="none"
                stroke="#86CCCA"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 左下角 - 圆形装饰 */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-400/15 rounded-full"></div>

          {/* 右下角 - 方形装饰（旋转） */}
          <div
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-400/10"
            style={{
              transform: 'rotate(25deg)'
            }}
          ></div>

          {/* 中间散布的小型几何图案 */}
          {/* 圆形 */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full"></div>
          <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-pink-400/20 rounded-full"></div>

          {/* 三角形 */}
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-400/20"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(45deg)'
            }}
          ></div>

          {/* 小方形 */}
          <div
            className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-purple-400/20"
            style={{
              transform: 'rotate(-20deg)'
            }}
          ></div>

          {/* 波点图案背景 */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #FF71CE 2px, transparent 2px)',
              backgroundSize: '30px 30px'
            }}
          ></div>

          {/* 虚线网格图案 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #6A7BB4 1px, transparent 1px),
                linear-gradient(to bottom, #86CCCA 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>

          {/* 装饰性X形 */}
          <div className="absolute top-1/2 left-10 w-8 h-8 opacity-10">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <path
                d="M4,4 L28,28 M28,4 L4,28"
                stroke="#FF71CE"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute top-1/3 right-20 w-6 h-6 opacity-10">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M4,4 L20,20 M20,4 L4,20"
                stroke="#FFCE5C"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute bottom-1/4 left-1/4 w-10 h-10 opacity-10">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M8,8 L32,32 M32,8 L8,32"
                stroke="#86CCCA"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 老王我：主内容区域 */}
        <main className="relative z-10">
          <ProductMain product={product} />
        </main>
      </div>

    </>
  );
}
