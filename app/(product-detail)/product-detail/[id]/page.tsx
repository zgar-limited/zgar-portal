import React from "react";
import { notFound } from "next/navigation";
import HomeHeader from "@/widgets/HomeHeader";
import HomeFooter from "@/widgets/HomeFooter";
import ProductMain from "@/components/product-details/ProductMain";

import { StoreProductResponse } from "@medusajs/types";
import { medusaSDK } from "@/utils/medusa";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const { product } = await medusaSDK.client.fetch<StoreProductResponse>(
      `/store/products/${id}`
    );
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

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  let product;
  try {
    // const data = await medusaSDK.store.product.retrieve(id, {
    //   fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
    //   // region_id: process.env.REGION_ID,

    // });
    const data = await medusaSDK.client.fetch("/store/products", {
      method: "GET",
      query: {
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
        limit: 100,
        offset: 0,
      },
    });
    product = data.product;
    console.log(
      "%c [ product ]-47",
      "font-size:13px; background:pink; color:#bf2c9f;",
      product
    );
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
