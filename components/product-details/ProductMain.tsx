"use client";
import React, { useState } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

interface ProductMainProps {
  product: StoreProduct;
}

export default function ProductMain({ product }: ProductMainProps) {
  const [selectedVariant, setSelectedVariant] = useState<StoreProductVariant | undefined>(
    product.variants?.[0]
  );

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Gallery + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-1">
            <ProductGallery
              product={product}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
            />
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24" style={{ zIndex: 1 }}>
              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                onVariantSelect={setSelectedVariant}
              />
            </div>
          </div>
        </div>

        {/* Tabs / Bottom Section */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <ProductTabs product={product} />
        </div>
      </div>
    </section>
  );
}
