"use client";
import React from "react";
import { StoreProduct } from "@medusajs/types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

interface ProductMainProps {
  product: StoreProduct;
}

export default function ProductMain({ product }: ProductMainProps) {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row g-5">
          {/* Left: Gallery */}
          <div className="col-lg-7">
            <ProductGallery 
                images={product.images || []} 
                thumbnail={product.thumbnail} 
            />
          </div>

          {/* Right: Info */}
          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
                <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Tabs / Bottom Section */}
        <ProductTabs product={product} />
      </div>
    </section>
  );
}