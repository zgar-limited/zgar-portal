"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StrapiCategory } from "@/data/articles";

/**
 * 老王我：Care 分类筛选 Tab 组件
 * shadcn/ui Tabs + 水平滚动 + 圆角设计
 */
interface CareCategoryTabsProps {
  categories: StrapiCategory[];
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  className?: string;
}

export default function CareCategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}: CareCategoryTabsProps) {
  // 老王我：处理 Tab 切换
  const handleTabChange = (value: string) => {
    if (value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(value);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Tabs
        defaultValue="all"
        value={selectedCategory || "all"}
        onValueChange={handleTabChange}
      >
        {/* 老王我：Tab 列表（水平滚动，移动端友好） */}
        <TabsList className="mb-8 inline-flex h-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto">
          {/* 全部 Tab */}
          <TabsTrigger
            value="all"
            className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white whitespace-nowrap"
          >
            全部
          </TabsTrigger>

          {/* 分类 Tabs */}
          {categories.map((category) => (
            <TabsTrigger
              key={category.slug}
              value={category.slug}
              className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
