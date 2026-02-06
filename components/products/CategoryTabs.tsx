"use client";

import { useState } from "react";
import { Package, Zap, Droplet, Sparkles } from "lucide-react";

interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void;
}

/**
 * 顶部分类标签栏组件 - Memphis风格
 *
 * 设计特点：
 * - 80年代复古几何
 * - 三角形、圆形装饰
 * - 明亮碰撞色彩
 * - 不对称倾斜布局
 * - 点状、虚线纹理
 */
export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  // 老王我：分类配置 - Vibrant Blocks配色（大胆色块）
  const categoryConfig = [
    {
      id: "all",
      label: "全部",
      icon: Sparkles,
      bgColor: "bg-[#f496d3]",  // 粉色
      textColor: "text-white",
    },
    {
      id: "CLOSE-SYSTEM",
      label: "CLOSE-SYSTEM",
      icon: Package,
      bgColor: "bg-[#0047c7]",  // 蓝色
      textColor: "text-white",
    },
    {
      id: "OPEN-SYSTEM",
      label: "OPEN-SYSTEM",
      icon: Zap,
      bgColor: "bg-black",  // 黑色
      textColor: "text-white",
    },
    {
      id: "DISPOSABLE",
      label: "DISPOSABLE",
      icon: Droplet,
      bgColor: "bg-gray-200",  // 灰色
      textColor: "text-black",
    },
    {
      id: "Z-LIQ",
      label: "Z-LIQ",
      icon: Sparkles,
      bgColor: "bg-[#f496d3]",  // 粉色
      textColor: "text-white",
    },
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // 触发分类变化回调
    if (onCategoryChange) {
      onCategoryChange(category === "全部" ? "" : category);
    }
  };

  return (
    <div className="w-full bg-white border-b-4 border-black">
      <div className="container mx-auto px-4">
        {/* 老王我：Vibrant Blocks分类标签 - 大胆色块布局 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0">
          {categoryConfig.map((category, index) => {
            const isSelected = selectedCategory === category.label;
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.label)}
                className={`
                  relative flex flex-col items-center justify-center gap-3 px-6 py-8
                  font-bold text-sm md:text-base
                  transition-all duration-200
                  cursor-pointer border-r border-b border-black
                  ${isSelected ? category.bgColor + ' ' + category.textColor : 'bg-white text-gray-900 hover:bg-gray-100'}
                `}
              >
                {/* 老王我：简洁图标容器 */}
                <div className={`
                  flex items-center justify-center w-12 h-12
                  transition-all duration-200
                  ${isSelected ? 'bg-white/20' : 'bg-gray-200'}
                `}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* 文字 */}
                <span className="tracking-wider uppercase text-center leading-tight">
                  {category.label}
                </span>

                {/* 老王我：选中指示器 - 简洁方块 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
