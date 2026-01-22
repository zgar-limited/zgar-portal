import Image from "next/image";
import { Newspaper, Calendar, Clock, ArrowRight, Heart, Shield, Zap, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";

/**
 * 老王我：Care 页面 - 静态假数据展示（Vibrant Blocks 风格）
 */

// 老王我：假数据 - 分类
const categories = [
  { id: 1, name: "产品知识", slug: "product-knowledge" },
  { id: 2, name: "健康指南", slug: "health-guide" },
  { id: 3, name: "企业文化", slug: "company-culture" },
];

// 老王我：假数据 - 文章列表
const articles = [
  // 产品知识分类
  {
    id: 1,
    title: "电子烟产品完全指南：从入门到精通",
    slug: "complete-vaping-guide",
    description: "深入了解电子烟的工作原理、产品类型、使用方法和保养技巧。无论你是新手还是经验丰富的用户，这篇文章都会为你提供全面的知识。",
    cover: "/images/care/article1.webp",
    category: { name: "产品知识", slug: "product-knowledge" },
    publishedAt: "2024-01-15",
    content: "电子烟产品完全指南内容...",
  },
  {
    id: 2,
    title: "如何选择适合你的电子烟设备？",
    slug: "how-to-choose-vaping-device",
    description: "面对市面上琳琅满目的电子烟产品，如何选择最适合自己的一款？本文将从使用场景、口感偏好、预算等多个维度为你提供选购建议。",
    cover: "/images/care/article2.webp",
    category: { name: "产品知识", slug: "product-knowledge" },
    publishedAt: "2024-01-10",
    content: "如何选择电子烟设备...",
  },
  {
    id: 3,
    title: "电子烟雾化器技术解析",
    slug: "atomizer-technology",
    description: "雾化器是电子烟的核心部件，了解它的工作原理和技术特点，能帮助你更好地使用和维护你的电子烟设备。",
    cover: "/images/care/article3.webp",
    category: { name: "产品知识", slug: "product-knowledge" },
    publishedAt: "2024-01-05",
    content: "雾化器技术解析...",
  },

  // 健康指南分类
  {
    id: 4,
    title: "电子烟与健康：科学认知与理性使用",
    slug: "vaping-and-health",
    description: "关于电子烟对健康的影响，有哪些科学研究和结论？如何正确使用电子烟以降低潜在风险？本文为你提供客观、科学的分析。",
    cover: "/images/care/article4.webp",
    category: { name: "健康指南", slug: "health-guide" },
    publishedAt: "2024-01-12",
    content: "电子烟与健康...",
  },
  {
    id: 5,
    title: "尼古丁替代疗法：电子烟的角色",
    slug: "nicotine-replacement-therapy",
    description: "电子烟作为尼古丁替代疗法的一种形式，在戒烟过程中发挥着怎样的作用？本文将从医学角度分析其有效性和注意事项。",
    cover: "/images/care/article5.webp",
    category: { name: "健康指南", slug: "health-guide" },
    publishedAt: "2024-01-08",
    content: "尼古丁替代疗法...",
  },

  // 企业文化分类
  {
    id: 6,
    title: "Zgar 品牌故事：从创立到全球",
    slug: "zgar-brand-story",
    description: "了解 Zgar 品牌的发展历程、核心价值观和未来愿景。从一个小团队到服务全球用户，我们始终坚持品质第一。",
    cover: "/images/care/article6.webp",
    category: { name: "企业文化", slug: "company-culture" },
    publishedAt: "2024-01-20",
    content: "Zgar 品牌故事...",
  },
];

// 老王我：文章卡片组件
function ArticleCard({ article }: { article: typeof articles[0] }) {
  // 老王我：阅读时长估算
  const readingTime = Math.max(1, Math.ceil((article.content?.length || 300) / 300));

  // 老王我：格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link
      href={`/care/${article.slug}`}
      className="group relative bg-white border-2 border-black overflow-hidden transition-all duration-200 hover:shadow-lg"
    >
      {/* 老王我：封面图片 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={article.cover || "/images/placeholder.webp"}
          alt={article.title}
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

// 老王我：分类区域组件
function CategorySection({
  title,
  articles,
  icon: Icon,
}: {
  title: string;
  articles: typeof articles;
  icon: any;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-16">
      {/* 老王我：分类标题区 - Vibrant Blocks 风格 */}
      <div className="flex items-center gap-4 mb-8">
        {/* 装饰性色块 */}
        <div className="w-2 h-12 bg-brand-pink"></div>
        {/* 图标 + 标题 */}
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-brand-pink" />
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            {title}
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

export default function CarePage() {
  // 老王我：按分类分组文章
  const productKnowledgeArticles = articles.filter(
    (a) => a.category?.slug === "product-knowledge"
  );
  const healthGuideArticles = articles.filter(
    (a) => a.category?.slug === "health-guide"
  );
  const companyCultureArticles = articles.filter(
    (a) => a.category?.slug === "company-culture"
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：Banner - 纯图片 */}
      <section className="w-full">
        <Image
          src="/images/care/banner.webp"
          alt="Care Banner"
          width={1920}
          height={0}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* 老王我：主要内容区 */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* 老王我：全部文章区域 */}
        <CategorySection title="全部文章" articles={articles} icon={Newspaper} />

        {/* 老王我：产品知识区域 */}
        <CategorySection
          title="产品知识"
          articles={productKnowledgeArticles}
          icon={Zap}
        />

        {/* 老王我：健康指南区域 */}
        <CategorySection
          title="健康指南"
          articles={healthGuideArticles}
          icon={Heart}
        />

        {/* 老王我：企业文化区域 */}
        <CategorySection
          title="企业文化"
          articles={companyCultureArticles}
          icon={Globe}
        />
      </div>

      {/* 老王我：底部装饰性色块 */}
      <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>
    </div>
  );
}
