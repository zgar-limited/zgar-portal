"use client";

import { useMemo } from "react";
import CareCategorySection from "./CareCategorySection";
import type { StrapiArticle, StrapiCategory } from "@/data/articles";

/**
 * 老王我：Care 文章列表主容器（重构版）
 * 新布局：分类区域 + 横向滚动列表（Netflix 风格）
 */
interface CareArticleListProps {
  articles: StrapiArticle[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  categories?: StrapiCategory[];
}

export default function CareArticleList({
  articles,
  pagination,
  categories = [],
}: CareArticleListProps) {
  // 老王我：按分类分组文章
  const { allArticles, articlesByCategory } = useMemo(() => {
    // 全部文章
    const allArticles = articles;

    // 按分类分组
    const grouped: Record<string, StrapiArticle[]> = {};
    categories.forEach((cat) => {
      grouped[cat.slug] = articles.filter(
        (article) => article.category?.slug === cat.slug
      );
    });

    return { allArticles, articlesByCategory: grouped };
  }, [articles, categories]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      {/* 老王我：全部文章区域 */}
      <CareCategorySection articles={allArticles} category={null} />

      {/* 老王我：各个分类区域 */}
      {categories.map((cat) => (
        <CareCategorySection
          key={cat.slug}
          articles={articlesByCategory[cat.slug] || []}
          category={cat}
        />
      ))}

      {/* 老王我：空状态 */}
      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            暂无文章
          </p>
        </div>
      )}
    </div>
  );
}
