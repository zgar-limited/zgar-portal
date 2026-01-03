import { retrieveCustomer } from "@/data/customer";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/data/articles";
import { notFound } from "next/navigation";
import CareArticleDetail from "@/components/care/CareArticleDetail";

/**
 * 老王我：Care 文章详情页面（重构版）
 * 使用 Tailwind CSS + shadcn/ui，移除 Bootstrap 栅格系统
 */
interface ArticlePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  // 老王我：Next.js 15+ 需要await params
  const { slug } = await params;
  const customer = await retrieveCustomer();

  // 老王我：根据 slug 获取文章数据
  const article = await fetchArticleBySlug(slug);

  // 老王我：如果文章不存在，显示 404 页面
  if (!article) {
    notFound();
  }

  // 老王我：获取相关文章
  const relatedArticles = await fetchRelatedArticles(
    article.id,
    article.category?.slug
  );

  return (
    <>
      {/* <HomeHeader customer={customer} /> */}

      {/* 老王我：文章详情 - 移除 Bootstrap 栅格，使用 Tailwind CSS */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <CareArticleDetail
            article={article}
            relatedArticles={relatedArticles}
          />
        </main>
      </div>

      {/* <HomeFooter /> */}
    </>
  );
};

export default ArticlePage;
