"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 横向滚动文章卡片
 * 用于分类区域的横向滚动列表
 */
interface CareHorizontalCardProps {
  article: StrapiArticle;
  className?: string;
}

export default function CareHorizontalCard({
  article,
  className = "",
}: CareHorizontalCardProps) {
  // 老王我：检查是否有封面图
  const hasCover = !!article.cover?.url;
  const imageUrl = hasCover
    ? `${process.env.STRAPI_URL}${article.cover.url}`
    : "";

  // 老王我：格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link
      href={`/care/article/${article.slug}`}
      className={`flex-shrink-0 w-72 group ${className}`}
    >
      <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl">
        {/* 老王我：图片区域 */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {hasCover ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-300 dark:text-gray-700">
                {article.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* 分类 Badge */}
          {article.category && (
            <Badge className="absolute left-3 top-3 bg-white/90 text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
              {article.category.name}
            </Badge>
          )}
        </div>

        {/* 老王我：内容区域 */}
        <div className="p-4">
          {/* 标题 */}
          <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* 发布日期 */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(article.publishedAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
