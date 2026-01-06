"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { StoreProduct } from "@medusajs/types";

interface ProductGridProps {
  initialProducts: StoreProduct[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [sortOption, setSortOption] = useState("default");

  // 客户端排序
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
    <section className="py-12 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        {/* 产品网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-full animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* 空状态 - 简约风格 */}
        {displayedProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="bg-gray-100 rounded-full p-12">
                  <span className="text-7xl block">📦</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">No Products Found</h3>
                <p className="text-gray-500 text-base">
                  调整筛选条件试试看
                </p>
              </div>

              <button className="group px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 mx-auto">
                <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                清除筛选
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
