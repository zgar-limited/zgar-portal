"use client";

import Image from "next/image";
import { useState } from "react";
import { Newspaper, Calendar, Clock, ArrowRight, Heart, Shield, Zap, Globe, Filter } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * 老王我：Care 页面 - Vibrant Blocks 风格（与 shop 页面一致）
 * 带分类筛选功能
 */

export default function CarePage() {
  const t = useTranslations("CarePage");

  // 老王我：分类数据（带图标）
  const categoryFilters = [
    { id: "all", name: t("filters.all"), slug: "all", icon: Newspaper },
    { id: "product-knowledge", name: t("filters.productKnowledge"), slug: "product-knowledge", icon: Zap },
    { id: "health-guide", name: t("filters.healthGuide"), slug: "health-guide", icon: Heart },
    { id: "company-culture", name: t("filters.companyCulture"), slug: "company-culture", icon: Globe },
  ];

  // 老王我：文章数据
  const articles = [
    {
      id: 1,
      title: t("article1.title"),
      slug: "complete-vaping-guide",
      description: t("article1.description"),
      cover: "/images/care/article1.webp",
      category: { name: t("filters.productKnowledge"), slug: "product-knowledge" },
      publishedAt: "2024-01-15",
      content: "电子烟产品完全指南内容...",
    },
    {
      id: 2,
      title: t("article2.title"),
      slug: "how-to-choose-vaping-device",
      description: t("article2.description"),
      cover: "/images/care/article2.webp",
      category: { name: t("filters.productKnowledge"), slug: "product-knowledge" },
      publishedAt: "2024-01-10",
      content: "如何选择电子烟设备...",
    },
    {
      id: 3,
      title: t("article3.title"),
      slug: "atomizer-technology",
      description: t("article3.description"),
      cover: "/images/care/article3.webp",
      category: { name: t("filters.productKnowledge"), slug: "product-knowledge" },
      publishedAt: "2024-01-05",
      content: "雾化器技术解析...",
    },
    {
      id: 4,
      title: t("article4.title"),
      slug: "vaping-and-health",
      description: t("article4.description"),
      cover: "/images/care/article4.webp",
      category: { name: t("filters.healthGuide"), slug: "health-guide" },
      publishedAt: "2024-01-12",
      content: "电子烟与健康...",
    },
    {
      id: 5,
      title: t("article5.title"),
      slug: "nicotine-replacement-therapy",
      description: t("article5.description"),
      cover: "/images/care/article5.webp",
      category: { name: t("filters.healthGuide"), slug: "health-guide" },
      publishedAt: "2024-01-08",
      content: "尼古丁替代疗法...",
    },
    {
      id: 6,
      title: t("article6.title"),
      slug: "zgar-brand-story",
      description: t("article6.description"),
      cover: "/images/care/article6.webp",
      category: { name: t("filters.companyCulture"), slug: "company-culture" },
      publishedAt: "2024-01-20",
      content: "Zgar 品牌故事...",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredArticles =
    selectedFilter === "all"
      ? articles
      : articles.filter((a) => a.category?.slug === selectedFilter);

  const currentFilter = categoryFilters.find((f) => f.slug === selectedFilter);
  const FilterIcon = currentFilter?.icon || Newspaper;

  // 老王我：文章卡片组件
  function ArticleCard({ article }: { article: typeof articles[0] }) {
    const readingTime = Math.max(1, Math.ceil((article.content?.length || 300) / 300));

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const locale = document.documentElement.lang || "en-US";
      return new Date(dateString).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <Link
        href={`/care/${article.slug}`}
        className="group relative bg-white overflow-hidden transition-all duration-200 hover:shadow-xl"
        style={{ borderRadius: '4px', border: '3px solid #f496d3' }}
      >
        {/* 老王我：封面图片 */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100" style={{ borderBottom: '3px solid #0047c7' }}>
          <Image
            src={article.cover || "/images/placeholder.webp"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* 老王我：文章内容 */}
        <div className="p-6">
          {/* 老王我：分类标签 - 方块风格 */}
          {article.category && (
            <div
              className="inline-block text-white px-3 py-1.5 text-xs font-black uppercase tracking-wider mb-4"
              style={{ backgroundColor: '#0047c7', borderRadius: '2px' }}
            >
              {article.category.name}
            </div>
          )}

          {/* 老王我：文章标题 */}
          <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f496d3] transition-colors" style={{ fontFamily: 'sans-serif' }}>
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
              <span>{readingTime} {t("articles.minRead")}</span>
            </div>
          </div>

          {/* 老王我：阅读更多按钮 */}
          <div className="flex items-center gap-2 text-sm font-black transition-colors" style={{ color: '#f496d3' }}>
            <span>{t("articles.readMore")}</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* 老王我：装饰性角落 */}
        <div className="absolute top-0 right-0 w-8 h-8" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
          <div className="w-full h-full" style={{ backgroundColor: '#f496d3' }}></div>
        </div>
      </Link>
    );
  }

  // 老王我：分类筛选器组件
  function CategoryFilter({
    filters,
    selectedFilter,
    onSelectFilter,
  }: {
    filters: typeof categoryFilters;
    selectedFilter: string;
    onSelectFilter: (slug: string) => void;
  }) {
    return (
      <div className="mb-12">
        {/* 老王我：筛选器标题 */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6" style={{ color: '#f496d3' }} />
          <h2 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'sans-serif' }}>{t("filters.title")}</h2>
        </div>

        {/* 老王我：筛选按钮网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilter === filter.slug;

            return (
              <button
                key={filter.id}
                onClick={() => onSelectFilter(filter.slug)}
                className={`
                  relative flex items-center justify-center gap-3 px-6 py-4
                  font-black text-sm md:text-base
                  transition-all duration-200
                  ${isSelected ? 'text-white shadow-lg' : 'text-gray-700 shadow-md hover:shadow-lg'}
                `}
                style={{
                  borderRadius: '4px',
                  backgroundColor: isSelected ? '#f496d3' : 'white',
                  border: isSelected ? 'none' : '2px solid #f496d3'
                }}
              >
                {/* 图标 */}
                <Icon className="w-5 h-5" />
                {/* 文字 */}
                <span>{filter.name}</span>
                {/* 选中指示器 */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-sm"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 老王我：文章网格组件
  function ArticleGrid({
    articles,
    title,
    icon: Icon,
  }: {
    articles: typeof articles;
    title: string;
    icon: any;
  }) {
    if (articles.length === 0) {
      return (
        <div className="text-center py-16">
          <div
            className="inline-block shadow-md p-12"
            style={{ backgroundColor: '#f0f0f0', borderRadius: '4px', border: '3px solid #0047c7' }}
          >
            <p className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'sans-serif' }}>
              {t("articles.noArticles")}
            </p>
            <p className="text-gray-600">
              {t("articles.stayTuned")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <section className="mb-16">
        {/* 老王我：标题区 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-12" style={{ backgroundColor: '#f496d3' }}></div>
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8" style={{ color: '#f496d3' }} />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900" style={{ fontFamily: 'sans-serif' }}>
              {title}
            </h2>
          </div>
          <div className="ml-auto">
            <span
              className="inline-block text-white px-4 py-2 text-sm font-black"
              style={{ backgroundColor: '#f496d3', borderRadius: '4px' }}
            >
              {articles.length} {t("hero.articlesCount")}
            </span>
          </div>
        </div>

        {/* 老王我：文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* 老王我：装饰性分隔线 */}
        <div
          className="mt-12 h-1"
          style={{ background: 'linear-gradient(90deg, #f496d3 0%, #0047c7 50%, #f496d3 100%)' }}
        ></div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：Vibrant Blocks Hero Banner */}
      <section className="relative overflow-hidden">
        {/* 老王我：三分屏色块布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
          {/* 左侧色块 - 粉色 */}
          <div
            className="p-8 md:p-12 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: '#f496d3' }}
          >
            {/* 装饰性方块 */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/20"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16" style={{ backgroundColor: '#0047c7' }}></div>

            {/* 内容 */}
            <div className="relative z-10">
              <div className="inline-block bg-black text-white px-6 py-3 mb-6" style={{ borderRadius: '4px' }}>
                <span className="font-black text-sm tracking-widest">
                  {t("hero.newKnowledgeHub")}
                </span>
              </div>
            </div>
          </div>

          {/* 中间色块 - 蓝色 */}
          <div
            className="p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{ backgroundColor: '#0047c7' }}
          >
            {/* 装饰性方块 */}
            <div className="absolute top-8 right-8 w-24 h-24" style={{ backgroundColor: '#f496d3' }}></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/30"></div>

            {/* 主标题 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight relative z-10" style={{ fontFamily: 'sans-serif' }}>
              {t("hero.exploreZgar")}
              <br />
              <span style={{ color: '#f496d3' }}>{t("hero.zgar")}</span>
              <br />
              {t("hero.knowledge")}
            </h1>

            {/* 描述 */}
            <p className="text-lg md:text-xl font-bold text-white/90 max-w-md">
              {t("hero.categories")}
            </p>
          </div>

          {/* 右侧色块 - 白色带粉色 accent */}
          <div className="bg-white p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* 装饰性色块 */}
            <div className="absolute top-0 right-0 w-full h-1/3" style={{ backgroundColor: '#f496d3' }}></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-1/4" style={{ backgroundColor: '#0047c7' }}></div>

            {/* 文章数量 */}
            <div className="relative z-10">
              <div className="bg-black text-white p-8 md:p-10" style={{ borderRadius: '4px' }}>
                <div className="text-6xl md:text-7xl font-black mb-4" style={{ fontFamily: 'sans-serif' }}>
                  {articles.length}
                </div>
                <div className="text-xl font-bold">
                  {t("hero.articlesCount")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：分类标签 */}
      <section className="py-6" style={{ borderBottom: '4px solid black' }}>
        <div className="max-w-7xl mx-auto px-6">
          <CategoryFilter
            filters={categoryFilters}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        </div>
      </section>

      {/* 老王我：主要内容区 */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* 老王我：文章列表 */}
        <ArticleGrid
          articles={filteredArticles}
          title={currentFilter?.name || t("filters.all")}
          icon={FilterIcon}
        />
      </div>

      {/* 老王我：底部装饰性色块 */}
      <div
        className="h-2"
        style={{ background: 'linear-gradient(90deg, #f496d3 0%, #0047c7 50%, #f496d3 100%)' }}
      ></div>
    </div>
  );
}
