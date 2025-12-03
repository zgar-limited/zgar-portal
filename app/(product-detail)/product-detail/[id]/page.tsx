import React from "react";
import { notFound } from "next/navigation";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import ProductMain from "@/components/product-details/ProductMain";
import { medusaFetch } from "@/utils/medusa-fetch";
import { StoreProductResponse } from "@medusajs/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  try {
      const { product } = await medusaFetch<StoreProductResponse>(`/store/products/${id}`);
      return {
          title: `${product.title} | Zgar Shop`,
          description: product.description || "Zgar Product Details",
      };
  } catch (e) {
      return {
          title: "Product Details | Zgar Shop",
      };
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let product;
  try {
    const data = await medusaFetch<StoreProductResponse>(`/store/products/${id}`, {
        next: { revalidate: 60 }
    });
    product = data.product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return notFound();
  }

  if (!product) return notFound();

  return (
    <>
      <HomeHeader />
      <main>
          <ProductMain product={product} />
      </main>
      <HomeFooter />
    </>
  );
}
