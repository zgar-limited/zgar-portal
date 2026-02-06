"use client";

import Image from "next/image";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 文章详情 Hero 组件
 * 顶部大图横幅，Apple Newsroom 风格
 */
interface CareArticleDetailHeroProps {
  article: StrapiArticle;
  className?: string;
}

export default function CareArticleDetailHero({
  article,
  className = "",
}: CareArticleDetailHeroProps) {
  // 老王我：检查是否有封面图
  const hasCover = !!article.cover?.url;
  const imageUrl = hasCover
    ? `${process.env.STRAPI_URL}${article.cover.url}`
    : "";

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gray-900 mb-8 ${className}`}>
      {/* 老王我：图片区域 */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] overflow-hidden">
        {hasCover ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
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
    </div>
  );
}
