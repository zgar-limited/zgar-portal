"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { StoreProduct } from "@medusajs/types";
import { ArrowUpDown, Package } from "lucide-react";

interface ProductGridProps {
  initialProducts: StoreProduct[];
}

/**
 * 产品网格组件（增强版）
 *
 * 设计特点：
 * - 北欧简约风格
 * - 优化的网格布局
 * - 排序功能
 * - 美观的空状态
 * - 流畅的动画效果
 */
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
    <section className="py-4 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        {/* 顶部工具栏 - 标题 + 排序 */}
        <div className="flex items-center justify-between mb-6">
          {/* 左侧：产品数量 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-pink to-brand-blue rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Products
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                {displayedProducts.length} items
              </p>
            </div>
          </div>

          {/* 右侧：排序 */}
          <div className="relative group">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="
                appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200
                rounded-lg text-xs md:text-sm font-medium text-gray-700
                hover:bg-gray-100 hover:border-gray-300
                focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink
                transition-all duration-200 cursor-pointer
              "
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 产品网格 - 优化布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-full animate-fade-slide-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* 空状态 - 增强版 */}
        {displayedProducts.length === 0 && (
          <div className="py-24 text-center">
            <div className="max-w-md mx-auto space-y-8">
              {/* 占位符图标 */}
              <div className="relative inline-block">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-16 shadow-inner">
                  <Package className="w-24 h-24 text-gray-300 mx-auto" />
                </div>
                {/* 浮动装饰 */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-pink/20 rounded-full animate-float" style={{ animationDelay: "0s" }} />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brand-blue/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              </div>

              {/* 文字说明 */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  No Products Found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try adjusting your filters to find what you're looking for
                </p>
              </div>

              {/* 清除筛选按钮 */}
              <button
                onClick={() => setSortOption("default")}
                className="
                  group px-8 py-4 bg-white border-2 border-gray-200
                  text-gray-700 rounded-2xl font-semibold
                  hover:bg-gradient-to-r hover:from-brand-pink hover:to-brand-blue
                  hover:text-white hover:border-transparent
                  hover:shadow-xl hover:scale-105
                  transition-all duration-300
                  flex items-center gap-3 mx-auto
                "
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
