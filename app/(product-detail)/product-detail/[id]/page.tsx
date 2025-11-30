import Link from "next/link";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import CustomerPhotos from "@/components/product-details/CustomerPhotos";
import ProductSpecifications1 from "@/components/product-details/ProductSpecifications1";
import Details1 from "@/components/product-details/Details1";
import Features from "@/components/product-details/Features";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import SimilerProducts from "@/components/product-details/SimilerProducts";
import StickyProduct from "@/components/product-details/StickyProduct";
import React from "react";
import { allProducts } from "@/data/products";
import { notFound } from "next/navigation";
import HomeTips from "@/widgets/HomeTips";
import HomeHeader from "@/widgets/HomeHeader";

export const metadata = {
  title:
    "Product Details || Ochaka - Multipurpose eCommerce React Nextjs Template",
  description: "Ochaka - Multipurpose eCommerce React Nextjs Template",
};
export default async function page({ params }) {
  const { id } = await params;

  const product = allProducts.find((p) => p.id == id);

  if (!product) return notFound();

  return (
    <>
      <HomeTips />
      <HomeHeader />

      <Details1
        product={product}
        features={["countdown-style-1", "varientPicker"]}
      />
      <ProductSpecifications1 />
      <StickyProduct />
      <Footer1 />
    </>
  );
}
