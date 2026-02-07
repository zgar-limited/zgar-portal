"use server";

import { getLocale } from "next-intl/server";
import { strapiSDK } from "@/utils/strapi";
import { getStrapiLocale } from "@/utils/strapi-server";
import type { StrapiBanner } from "./types";

/**
 * 老王我：使用官方 @strapi/client 解决 403 认证错误
 * 这个SB库会自动处理 Bearer token，不需要手动配置 headers
 */

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

    // 老王我：构建查询参数
    const queryParams: Record<string, any> = {
      locale: strapiLocale,
      populate: "*",
      sort: ["priority:desc"], // 按优先级降序排序
      pagination: {
        limit: params?.limit || 10,
      },
    };

    // 老王我：按页面类型筛选（暂时注释掉，先测试能否拉取到数据）
    // if (params?.page) {
    //   queryParams.filters = {
    //     active: { $eq: true },
    //     page: { $eq: params.page },
    //   };
    // }

    // 老王我：只过滤 active 的 Banner
    queryParams.filters = {
      active: { $eq: true },
    };

    const response = await banners.find(queryParams);

    return response.data || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    // 老王我：返回空数据而不是抛出错误，确保页面不会崩溃
    return [];
  }
}

/**
 * 老王我：根据 ID 获取单个 Banner
 * @param id - Banner ID
 * @returns Banner 对象，不存在时返回 null
 */
export async function fetchBannerById(id: number): Promise<StrapiBanner | null> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const banners = strapiSDK.collection("banners");

    const response = await banners.findOne(id.toString(), {
      locale: strapiLocale,
      populate: "*",
    });

    return response || null;
  } catch (error) {
    console.error(`Error fetching banner ${id}:`, error);
    return null;
  }
}

/**
 * 老王我：通过 code 获取单个 Banner（推荐方式）
 * @param code - Banner 的唯一标识符（如 "home-hero"）
 * @returns Banner 对象，不存在时返回 null
 */
export async function fetchBannerByCode(code: string): Promise<StrapiBanner | null> {
  const locale = await getLocale();
  const strapiLocale = getStrapiLocale(locale);

  try {
    // 老王我：使用 @strapi/client 的 collection API
    const banners = strapiSDK.collection("banners");

    const response = await banners.find({
      locale: strapiLocale,
      populate: "*",
      filters: {
        code: { $eq: code },
        active: { $eq: true },
      },
    });

    // 老王我：code 是唯一的，只取第一个
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Error fetching banner by code "${code}":`, error);
    return null;
  }
}
