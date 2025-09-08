import Link from "next/link";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import CustomerPhotos from "@/components/product-details/CustomerPhotos";
import Details1 from "@/components/product-details/Details1";
import Features from "@/components/product-details/Features";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import SimilerProducts from "@/components/product-details/SimilerProducts";
import StickyProduct from "@/components/product-details/StickyProduct";
import React from "react";
import { allProducts } from "@/data/products";
import { notFound } from "next/navigation";
import ProductSpecifications4 from "@/components/product-details/ProductSpecifications4";

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
      <Topbar1 />
      <Header1 parentClass="tf-header header-fix bg-off-white" />
      <section className="s-page-title style-2">
        <div className="container">
          <div className="content">
            <ul className="breadcrumbs-page">
              <li>
                <Link href={`/`} className="h6 link">
                  Home
                </Link>
              </li>
              <li className="d-flex">
                <i className="icon icon-caret-right" />
              </li>
              <li>
                <Link href={`/shop-default`} className="h6 link">
                  Shop
                </Link>
              </li>
              <li className="d-flex">
                <i className="icon icon-caret-right" />
              </li>
              <li>
                <h6 className="current-page fw-normal">{product.title}</h6>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Details1 product={product} features={["varientPicker"]} />
      <CustomerPhotos />
      <ProductSpecifications4 />
      <Features />
      <SimilerProducts />
      <RelatedProducts />
      <StickyProduct />
      <Footer1 />
    </>
  );
}
