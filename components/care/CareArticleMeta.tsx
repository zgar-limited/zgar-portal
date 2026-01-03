"use client";

import { Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 文章元信息组件
 * 显示标题、日期、分类、作者和分享按钮
 */
interface CareArticleMetaProps {
  article: StrapiArticle;
  onShare?: () => void;
  className?: string;
}

export default function CareArticleMeta({
  article,
  onShare,
  className = "",
}: CareArticleMetaProps) {
  // 老王我：格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`mb-8 ${className}`}>
      {/* 标题 */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {article.title}
      </h1>

      {/* 元信息行 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        {/* 日期 */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>

        {/* 分类 */}
        {article.category && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {article.category.name}
          </Badge>
        )}

        {/* 作者 */}
        {article.author && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {article.author.firstname} {article.author.lastname}
            </span>
          </div>
        )}
      </div>

      {/* 分享按钮 */}
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share2 className="mr-2 h-4 w-4" />
        复制链接
      </Button>

      {/* 分隔线 */}
      <Separator className="mt-6" />
    </div>
  );
}
