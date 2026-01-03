"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CareArticleDetailHero from "./CareArticleDetailHero";
import CareArticleMeta from "./CareArticleMeta";
import CareArticleBody from "./CareArticleBody";
import CareRelatedArticles from "./CareRelatedArticles";
import { useCopyLink } from "@/hooks/useCopyLink";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：Care 文章详情主容器组件（重构版）
 * 使用 shadcn/ui + Tailwind CSS + Strapi Blocks
 */
interface CareArticleDetailProps {
  article: StrapiArticle;
  relatedArticles?: StrapiArticle[];
}

export default function CareArticleDetail({
  article,
  relatedArticles = [],
}: CareArticleDetailProps) {
  const router = useRouter();
  const { copyLink } = useCopyLink();

  const handleShare = () => {
    copyLink();
    // TODO: 添加 Toast 提示
    console.log("链接已复制");
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* 顶部大图横幅 */}
      <CareArticleDetailHero article={article} />

      {/* 元信息 + 分享 */}
      <CareArticleMeta article={article} onShare={handleShare} />

      {/* 描述 */}
      {article.description && (
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {article.description}
        </p>
      )}

      {/* Strapi Blocks 内容 */}
      {article.blocks && article.blocks.length > 0 && (
        <CareArticleBody blocks={article.blocks} />
      )}

      {/* 相关文章推荐 */}
      {relatedArticles.length > 0 && (
        <CareRelatedArticles articles={relatedArticles} maxArticles={3} />
      )}

      {/* 返回按钮 */}
      <div className="mt-12">
        <Button variant="outline" onClick={() => router.push("/care")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回文章列表
        </Button>
      </div>
    </article>
  );
}
