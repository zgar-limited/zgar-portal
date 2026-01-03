"use client";

import CareArticleCard from "./CareArticleCard";
import CareFeaturedArticle from "./CareFeaturedArticle";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 文章网格容器（无动效版本）
 * 先确保基本显示正常，后续再优化
 */
interface CareArticleGridProps {
  articles: StrapiArticle[];
  featured?: boolean;
  className?: string;
}

export default function CareArticleGrid({
  articles,
  featured = false,
  className = "",
}: CareArticleGridProps) {
  // 老王我：空状态
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">暂无文章</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {articles.map((article, index) => {
        const isFirstFeatured = featured && index === 0;

        return (
          <div
            key={article.id}
            className={isFirstFeatured ? "col-span-1 sm:col-span-2 lg:col-span-2" : "col-span-1"}
          >
            {isFirstFeatured ? (
              <CareFeaturedArticle article={article} />
            ) : (
              <CareArticleCard article={article} />
            )}
          </div>
        );
      })}
    </div>
  );
}
