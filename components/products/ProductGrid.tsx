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
    <section className="py-12 min-h-screen bg-gradient-to-b from-blue-50 via-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* 产品列表标题和控制栏 */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Featured <span className="text-rose-500">Products</span>
                </h2>
                <span className="bg-gradient-brand text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {displayedProducts.length}
                </span>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                Discover our premium selection of vaping devices and accessories
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl shadow-lg p-2 border border-blue-100">
              <span className="text-gray-600 text-sm px-2 hidden sm:inline">Sort by:</span>
              <div className="flex rounded-xl overflow-hidden text-sm">
                {[
                  { value: 'default', label: 'Featured' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`px-4 py-2.5 font-semibold transition-all duration-300 ${
                      sortOption === option.value
                        ? 'bg-gradient-brand text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSortOption(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 装饰性分隔线 */}
          <div className="relative h-px w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-brand rounded-full"></div>
          </div>
        </div>

        {/* 产品网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-full animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {displayedProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-brand rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-rose-50 to-blue-50 rounded-full p-8">
                  <span className="text-6xl block">📦</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-600 text-lg">
                  Try adjusting your filters or search terms to find what you're looking for
                </p>
              </div>

              <button className="group px-8 py-4 bg-gradient-brand text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto">
                <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
