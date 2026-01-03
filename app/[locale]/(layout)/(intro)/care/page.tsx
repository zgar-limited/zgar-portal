import { retrieveCustomer } from "@/data/customer";
import { fetchArticles, fetchBanners, fetchCategories } from "@/data/articles";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import CareBanner from "@/components/care/CareBanner";
import CareArticleList from "@/components/care/CareArticleList";

/**
 * 老王我：Care 页面 - 对接 Strapi CMS
 * 显示动态 Banner + 文章列表
 */
const CarePage = async () => {
  const customer = await retrieveCustomer();

  // 老王我：并行获取 Banner、文章和分类数据
  const [banners, articlesData, categories] = await Promise.all([
    fetchBanners({ limit: 1 }), // 获取1个优先级最高的 Banner
    fetchArticles({ page: 1, pageSize: 12 }), // 获取第1页，每页12篇文章
    fetchCategories(), // 获取所有分类
  ]);

  // 老王我：调试日志
  console.log("🔍 Care Page Debug:");
  console.log("- Banners:", banners);
  console.log("- Articles count:", articlesData.articles.length);
  console.log("- STRAPI_URL:", process.env.STRAPI_URL);

  // 老王我：使用第一个 Banner（如果有的话）
  const banner = banners[0];

  return (
    <>
      {/* <HomeHeader customer={customer} /> */}

      {/* 老王我：动态 Banner（如果有） */}
      {banner && <CareBanner banner={banner} />}

      {/* 老王我：文章列表（带分类筛选） */}
      <CareArticleList
        articles={articlesData.articles}
        pagination={articlesData.pagination}
        categories={categories}
      />

      {/* <HomeFooter /> */}
    </>
  );
};

export default CarePage;
