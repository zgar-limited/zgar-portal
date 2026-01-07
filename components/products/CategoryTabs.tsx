"use client";

import { useState } from "react";
import { categories11 } from "@/data/categories";
import { Package, Zap, Droplet, Sparkles } from "lucide-react";

interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void;
}

/**
 * 顶部分类标签栏组件（增强版）- 美观的分类筛选
 *
 * 设计特点：
 * - 北欧简约风格，粉蓝配色
 * - 带图标的卡片式分类按钮
 * - 横向滚动布局，移动端友好
 * - 选中状态用渐变高亮 + 图标动画
 * - 符合 KISS 原则：简单直观
 */
export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  // 分类配置 - 包含图标
  const categoryConfig = [
    { id: "all", label: "全部", icon: Sparkles, color: "from-brand-pink to-brand-blue" },
    { id: "CLOSE-SYSTEM", label: "CLOSE-SYSTEM", icon: Package, color: "from-blue-400 to-brand-blue" },
    { id: "OPEN-SYSTEM", label: "OPEN-SYSTEM", icon: Zap, color: "from-purple-400 to-purple-600" },
    { id: "DISPOSABLE", label: "DISPOSABLE", icon: Sparkles, color: "from-pink-400 to-brand-pink" },
    { id: "Z-LIQ", label: "Z-LIQ", icon: Droplet, color: "from-cyan-400 to-blue-500" },
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // 触发分类变化回调
    if (onCategoryChange) {
      onCategoryChange(category === "全部" ? "" : category);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* 分类标签容器 - 移动端可横向滚动，紧凑版 */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-4 md:py-5">
          {categoryConfig.map((category) => {
            const isSelected = selectedCategory === category.label;
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.label)}
                className={`
                  group relative flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl
                  font-semibold text-xs md:text-sm whitespace-nowrap
                  transition-all duration-300 ease-out
                  cursor-pointer
                  ${
                    isSelected
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl hover:scale-105`
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-sm hover:shadow-md"
                  }
                `}
              >
                {/* 图标 */}
                <div className={`
                  flex items-center justify-center w-5 h-5 rounded-full
                  transition-all duration-300
                  ${isSelected ? 'bg-white/20' : 'bg-gray-200 group-hover:bg-gray-300'}
                `}>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
                </div>

                {/* 文字 */}
                <span>{category.label}</span>

                {/* 选中指示器 - 底部发光条 */}
                {isSelected && (
                  <div className={`
                    absolute -bottom-1 left-1/2 -translate-x-1/2
                    w-12 h-1 bg-white rounded-full
                    shadow-lg shadow-white/50
                  `} />
                )}
              </button>
            );
          })}
        </div>

        {/* 装饰性渐变线条 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />
      </div>
    </div>
  );
}
