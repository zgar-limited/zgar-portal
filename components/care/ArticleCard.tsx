import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { StrapiArticle } from "@/data/articles";

/**
 * 老王我：文章卡片组件 - Vibrant Blocks 风格
 * 柔和阴影立体效果 + 清晰层次
 */
interface ArticleCardProps {
  article: StrapiArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // 老王我：文章封面图片 URL
  const coverUrl = article.cover?.url
    ? `${process.env.STRAPI_URL}${article.cover.url}`
    : "/images/placeholder.webp";

  // 老王我：格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 老王我：阅读时长估算（假设 300 字/分钟）
  const readingTime = article.content
    ? Math.max(1, Math.ceil(article.content.length / 300))
    : 3;

  return (
    <Link
      href={`/care/${article.slug}`}
      className="group relative bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl rounded-2xl"
    >
      {/* 老王我：封面图片 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={coverUrl}
          alt={article.title || "Article Cover"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 老王我：装饰性色块 - 右上角粉色三角形 */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[32px] border-l-transparent border-t-[24px] border-t-brand-pink"></div>
      </div>

      {/* 老王我：文章内容 */}
      <div className="p-6">
        {/* 老王我：分类标签 */}
        {article.category && (
          <div className="inline-block bg-brand-blue text-white px-3 py-1 text-xs font-black uppercase tracking-wider mb-4">
            {article.category.name}
          </div>
        )}

        {/* 老王我：文章标题 */}
        <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-pink transition-colors">
          {article.title}
        </h3>

        {/* 老王我：文章摘要 */}
        {article.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        )}

        {/* 老王我：元信息栏 - 日期 + 阅读时长 */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {article.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{readingTime} 分钟阅读</span>
          </div>
        </div>

        {/* 老王我：阅读更多按钮 */}
        <div className="flex items-center gap-2 text-sm font-black text-brand-pink group-hover:text-brand-blue transition-colors">
          <span>阅读更多</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
