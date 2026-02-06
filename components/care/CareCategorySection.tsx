"use client";

import { FileQuestion } from "lucide-react";
import CareHorizontalCard from "./CareHorizontalCard";
import type { StrapiArticle, StrapiCategory } from "@/data/articles";

/**
 * 老王我：Care 分类区域组件
 * 显示分类标题 + 横向滚动的文章列表
 */
interface CareCategorySectionProps {
  articles: StrapiArticle[];
  category?: StrapiCategory | null;
  className?: string;
}

export default function CareCategorySection({
  articles,
  category,
  className = "",
}: CareCategorySectionProps) {
  // 老王我：空状态
  if (articles.length === 0) {
    return (
      <div className={`mb-12 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {category?.name || "全部"}
        </h2>
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400 border border-dashed rounded-2xl">
          <FileQuestion className="mr-2 h-5 w-5" />
          <span>暂无文章</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-12 ${className}`}>
      {/* 分类标题 */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {category?.name || "全部"}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          ({articles.length})
        </span>
      </h2>

      {/* 横向滚动列表 */}
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
        {articles.map((article) => (
          <CareHorizontalCard key={article.id} article={article} />
        ))}
      </div>

      {/* 老王我：滚动提示（可选，移动端友好） */}
      <div className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 text-right mt-2">
        ← 滑动查看更多 →
      </div>
    </div>
  );
}
