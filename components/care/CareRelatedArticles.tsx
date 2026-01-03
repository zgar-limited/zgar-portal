"use client";

import CareArticleCard from "./CareArticleCard";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 相关文章推荐组件
 * 显示同分类或其他推荐文章
 */
interface CareRelatedArticlesProps {
  articles: StrapiArticle[];
  maxArticles?: number;
  className?: string;
}

export default function CareRelatedArticles({
  articles,
  maxArticles = 3,
  className = "",
}: CareRelatedArticlesProps) {
  const displayArticles = articles.slice(0, maxArticles);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <div className={`mt-16 pt-8 border-t ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        相关文章
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayArticles.map((article) => (
          <CareArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
