"use server";

import { getLocale } from "next-intl/server";
import { strapiSDK } from "@/utils/strapi";
import { getStrapiLocale } from "@/utils/strapi-server";
import type {
  StrapiArticle,
  StrapiBanner,
  StrapiCategory,
  ArticlesResponse,
} from "./types";

/**
 * 老王我：使用官方 @strapi/client 解决 403 认证错误
 * 这个SB库会自动处理 Bearer token，不需要手动配置 headers
 */

/**
 * 老王我：获取文章列表
 * @param params - 查询参数（分类、分页等）
 * @returns 文章列表和分页信息
 */
export async function fetchArticles(params?: {
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<ArticlesResponse> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const articles = strapiSDK.collection("articles");

    // 老王我：构建查询参数
    const queryParams: Record<string, any> = {
      locale: strapiLocale,
      populate: "*", // 填充所有关联字段（图片、分类等）
      sort: ["publishedAt:desc"], // 按发布时间倒序排序
      pagination: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 12,
      },
    };

    // 老王我：按分类筛选（如果有）
    if (params?.category) {
      queryParams.filters = {
        category: {
          slug: { $eq: params.category },
        },
      };
    }

    const response = await articles.find(queryParams);

    return {
      articles: response.data || [],
      pagination: response.meta?.pagination || {
        page: 1,
        pageSize: 12,
        pageCount: 0,
        total: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    // 老王我：返回空数据而不是抛出错误，确保页面不会崩溃
    return {
      articles: [],
      pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 },
    };
  }
}

/**
 * 老王我：根据 slug 获取单篇文章
 * @param slug - 文章的 URL 别名
 * @returns 文章对象，不存在时返回 null
 */
export async function fetchArticleBySlug(slug: string): Promise<StrapiArticle | null> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const articles = strapiSDK.collection("articles");

    // 老王我：根据 slug 查找文章
    const response = await articles.find({
      locale: strapiLocale,
      populate: "*",
      filters: {
        slug: { $eq: slug },
      },
    });

    // 老王我：返回第一篇文章（如果找到）
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    return null;
  }
}

/**
 * 老王我：获取分类列表
 * @returns 分类数组
 */
export async function fetchCategories(): Promise<StrapiCategory[]> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const categories = strapiSDK.collection("categories");

    const response = await categories.find({
      locale: strapiLocale,
      sort: ["name:asc"], // 按名称升序排序
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * 老王我：获取 Banner 列表（按页面类型筛选）
 * @param params - 查询参数（页面类型、数量限制）
 * @returns Banner 数组
 */
export async function fetchBanners(params?: {
  page?: "care" | "home" | "blog";
  limit?: number;
}): Promise<StrapiBanner[]> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const banners = strapiSDK.collection("banners");

    // 老王我：简化查询参数，先测试不带 filters 的版本
    const queryParams: Record<string, any> = {
      locale: strapiLocale,
      populate: "*",
      sort: ["priority:desc"], // 按优先级降序排序
      pagination: {
        limit: params?.limit || 10,
      },
    };

    // 老王我：暂时注释掉 filters，先测试基本功能
    // TODO: 确认 Strapi 中的字段名称后再添加 filters
    // filters: {
    //   active: { $eq: true },
    //   ...(params?.page && { page: { $eq: params.page } }),
    // },

    const response = await banners.find(queryParams);

    return response.data || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

/**
 * 老王我：获取相关文章（同分类的其他文章）
 * @param articleId - 当前文章 ID（用于排除）
 * @param categorySlug - 分类 slug（可选）
 * @param limit - 返回数量限制
 * @returns 相关文章数组
 */
export async function fetchRelatedArticles(
  articleId: number,
  categorySlug?: string,
  limit: number = 3
): Promise<StrapiArticle[]> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const articles = strapiSDK.collection("articles");

    // 老王我：构建查询参数
    const queryParams: Record<string, any> = {
      locale: strapiLocale,
      populate: "*",
      sort: ["publishedAt:desc"], // 按发布时间倒序排序
      pagination: {
        pageSize: limit,
      },
    };

    // 老王我：按分类筛选（如果有）
    if (categorySlug) {
      queryParams.filters = {
        category: { slug: { $eq: categorySlug } },
        id: { $ne: articleId }, // 排除当前文章
      };
    } else {
      queryParams.filters = {
        id: { $ne: articleId }, // 排除当前文章
      };
    }

    const response = await articles.find(queryParams);

    return response.data || [];
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}
