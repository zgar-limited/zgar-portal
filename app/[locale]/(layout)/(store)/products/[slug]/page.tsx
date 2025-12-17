import React from "react";
import { notFound } from "next/navigation";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
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
  props: PageProps<"/[locale]/products/[slug]">
) {
  const { slug } = await props.params;

  const product = await fetchProduct(slug);

  if (!product) return notFound();

  return (
    <>


      <main>
        <ProductMain product={product} />
      </main>
      
    </>
  );
}
