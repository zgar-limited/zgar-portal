"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 文章卡片组件（无动效版本）
 */
interface CareArticleCardProps {
  article: StrapiArticle;
  priority?: boolean;
  className?: string;
}

export default function CareArticleCard({
  article,
  priority = false,
  className = "",
}: CareArticleCardProps) {
  // 老王我：检查是否有封面图
  const hasCover = !!article.cover?.url;
  const imageUrl = hasCover
    ? `${process.env.STRAPI_URL}${article.cover.url}`
    : "";

  // 老王我：格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={className}>
      <Link href={`/care/article/${article.slug}`}>
        <Card className="group overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl">
          {/* 老王我：图片区域 */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            {hasCover ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              // 老王我：没有图片时显示优雅的占位背景
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-300 dark:text-gray-700">
                  {article.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* 老王我：分类 Badge */}
            {article.category && (
              <Badge className="absolute left-4 top-4 bg-white/90 text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                {article.category.name}
              </Badge>
            )}
          </div>

          {/* 老王我：内容区域 */}
          <CardContent className="flex flex-col space-y-3 p-6">
            {/* 标题 */}
            <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* 描述 */}
            {article.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {article.description}
              </p>
            )}

            {/* 发布日期 */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(article.publishedAt)}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
