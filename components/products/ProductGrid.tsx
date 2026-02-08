"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { StoreProduct } from "@medusajs/types";
import { ArrowUpDown, Package } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("ProductGrid");
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
        {/* 老王我：Vibrant Blocks工具栏 - 色块布局 */}
        <div className="flex items-center justify-between mb-8">
          {/* 左侧：产品数量 - 色块风格 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f496d3] flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                PRODUCTS
              </h2>
              <p className="text-sm md:text-base font-bold text-[#0047c7]">
                {displayedProducts.length} items
              </p>
            </div>
          </div>

          {/* 右侧：排序 - 简洁色块风格 */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="
                appearance-none pl-4 pr-10 py-3 bg-black
                text-white
                text-xs md:text-sm font-bold
                focus:outline-none
                transition-all duration-200 cursor-pointer
              "
            >
              <option value="default">{t("sortDefault")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
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

        {/* 老王我：Vibrant Blocks空状态 - 色块风格 */}
        {displayedProducts.length === 0 && (
          <div className="py-24">
            <div className="max-w-md mx-auto">
              {/* 色块布局 */}
              <div className="grid grid-cols-2 gap-0">
                {/* 左上色块 - 粉色 */}
                <div className="bg-[#f496d3] p-8 flex items-center justify-center">
                  <Package className="w-16 h-16 text-white" />
                </div>

                {/* 右上色块 - 蓝色 */}
                <div className="bg-[#0047c7] p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-4xl font-black mb-2">{t("noProducts")}</h3>
                    <p className="text-sm font-bold opacity-90">{t("adjustFilters")}</p>
                  </div>
                </div>

                {/* 左下色块 - 黑色 */}
                <div className="bg-black p-8 col-span-2 flex items-center justify-center">
                  <button
                    onClick={() => setSortOption("default")}
                    className="
                      px-8 py-4 bg-white
                      text-black font-black text-lg
                      hover:bg-[#f496d3] hover:text-white
                      transition-all duration-200
                    "
                  >
                    {t("clearFilters")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
