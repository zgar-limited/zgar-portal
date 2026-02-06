import { Newspaper } from "lucide-react";
import ArticleCard from "./ArticleCard";
import type { StrapiArticle, StrapiCategory } from "@/data/articles";

/**
 * 老王我：Care 文章分类区域组件 - Vibrant Blocks 风格
 * 每个分类独立展示，带标题色块
 */
interface CareCategorySectionProps {
  articles: StrapiArticle[];
  category: StrapiCategory | null;
}

export default function CareCategorySection({
  articles,
  category,
}: CareCategorySectionProps) {
  // 老王我：如果没有文章，不渲染
  if (articles.length === 0) {
    return null;
  }

  // 老王我：分类标题
  const categoryTitle = category?.name || "全部文章";

  return (
    <section className="mb-16">
      {/* 老王我：分类标题区 - Vibrant Blocks 风格 */}
      <div className="flex items-center gap-4 mb-8">
        {/* 装饰性色块 */}
        <div className="w-2 h-12 bg-brand-pink"></div>
        {/* 图标 + 标题 */}
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-brand-pink" />
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            {categoryTitle}
          </h2>
        </div>
        {/* 文章数量 */}
        <div className="ml-auto">
          <span className="inline-block bg-brand-pink text-white px-4 py-2 text-sm font-black">
            {articles.length} 篇
          </span>
        </div>
      </div>

      {/* 老王我：文章网格 - 3列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* 老王我：装饰性分隔线 */}
      <div className="mt-12 h-1 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>
    </section>
  );
}
