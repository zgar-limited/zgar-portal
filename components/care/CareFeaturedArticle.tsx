"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 首篇大图文章组件（无动效版本）
 */
interface CareFeaturedArticleProps {
  article: StrapiArticle;
  className?: string;
}

export default function CareFeaturedArticle({
  article,
  className = "",
}: CareFeaturedArticleProps) {
  // 老王我：检查是否有封面图
  const hasCover = !!article.cover?.url;
  const imageUrl = hasCover
    ? `${process.env.STRAPI_URL}${article.cover.url}`
    : "";

  return (
    <Link href={`/care/article/${article.slug}`}>
      <div className={`group relative overflow-hidden rounded-3xl bg-gray-900 shadow-xl ${className}`}>
        {/* 老王我：图片区域 */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
          {hasCover ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            // 老王我：没有图片时显示优雅的占位背景
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <span className="text-9xl font-bold text-gray-600">
                {article.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* 老王我：渐变遮罩 + 内容叠加 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
          {/* 分类 Badge */}
          {article.category && (
            <Badge className="mb-4 w-fit bg-white/20 text-white backdrop-blur-sm border-white/30">
              {article.category.name}
            </Badge>
          )}

          {/* 标题 */}
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl line-clamp-2 group-hover:text-gray-100 transition-colors">
            {article.title}
          </h2>

          {/* 描述 */}
          {article.description && (
            <p className="mt-4 text-base sm:text-lg text-gray-200 line-clamp-2">
              {article.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
