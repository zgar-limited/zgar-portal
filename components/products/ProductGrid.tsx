"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { StoreProduct } from "@medusajs/types";
import { Filter } from "lucide-react";

interface ProductGridProps {
  initialProducts: StoreProduct[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [sortOption, setSortOption] = useState("default");

  // Minimal client-side sorting/filtering if needed, primarily relying on initial fetch for now
  const displayedProducts = useMemo(() => {
    let sorted = [...initialProducts];
    if (sortOption === "price-asc") {
        sorted.sort((a: any, b: any) => (a.variants?.[0]?.prices?.[0]?.amount || 0) - (b.variants?.[0]?.prices?.[0]?.amount || 0));
    } else if (sortOption === "price-desc") {
        sorted.sort((a: any, b: any) => (b.variants?.[0]?.prices?.[0]?.amount || 0) - (a.variants?.[0]?.prices?.[0]?.amount || 0));
    }
    return sorted;
  }, [initialProducts, sortOption]);

  return (
    <section className="py-5 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Control Bar */}
        <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-black mb-0">Our Products</h2>
            <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm font-medium">
              {displayedProducts.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-gray-600 text-sm hidden sm:inline">Sort by:</span>
             <div className="relative">
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-transparent border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors duration-200 text-sm font-medium"
                  onClick={() => {
                    // 简单的排序切换，不依赖Bootstrap
                    const options = ['default', 'price-asc', 'price-desc'];
                    const currentIndex = options.indexOf(sortOption);
                    setSortOption(options[(currentIndex + 1) % options.length]);
                  }}
                >
                  {sortOption === 'default' ? 'Featured' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </button>
             </div>
          </div>
        </div>

        {/* Product Grid - 最小尺寸下也显示两列 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product, index) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {displayedProducts.length === 0 && (
            <div className="py-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
                    <span className="text-4xl text-gray-500">📦</span>
                  </div>
                  <h5 className="text-gray-600 text-xl font-semibold mb-2">No products found</h5>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
            </div>
        )}
      </div>
    </section>
  );
}