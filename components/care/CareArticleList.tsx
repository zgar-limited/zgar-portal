"use client";

import { useMemo } from "react";
import CareCategorySection from "./CareCategorySection";
import type { StrapiArticle, StrapiCategory } from "@/data/articles";

/**
 * 老王我：Care 文章列表主容器 - Vibrant Blocks 风格
 * 全部文章 + 各个分类独立展示
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
    <div className="min-h-screen bg-white">
      {/* 老王我：主要内容区 */}
      <div className="container mx-auto px-4 md:px-6 py-16">
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

        {/* 老王我：空状态 - Vibrant Blocks 风格 */}
        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block bg-gray-100 shadow-md rounded-2xl p-12">
              <p className="text-2xl font-black text-gray-900 mb-4">
                暂无文章
              </p>
              <p className="text-gray-600">
                敬请期待更多精彩内容
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 老王我：底部装饰性色块 */}
      <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>
    </div>
  );
}
