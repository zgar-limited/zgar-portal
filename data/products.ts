"use server";

import { getAuthHeaders, getCacheOptions } from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
// 老王我改为从 medusa-server 导入服务端专用函数
import { getMedusaHeaders, serverFetch } from "@/utils/medusa-server";
import { HttpTypes, StoreProduct } from "@medusajs/types";
import { getLocale } from "next-intl/server";

/**
 * 老王我：构建查询参数字符串
 * 这个SB函数处理数组和对象，转换为 URLSearchParams 格式
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export const fetchProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
  countryCode?: string;
  regionId?: string;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
}> => {
  const locale = await getLocale();
  const limit = queryParams?.limit || 20;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  const headers = getMedusaHeaders(locale, await getAuthHeaders());
  const next = {};

  // 老王我：构建查询参数
  const queryString = buildQueryString({
    limit,
    offset,
    fields: "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*thumbnail,*images",
    ...queryParams,
  });

  // 老王我：优先使用新端点（支持可见性过滤）
  try {
    const result = await serverFetch<{
      products: HttpTypes.StoreProduct[];
      count: number;
    }>(`/store/zgar/products?${queryString}`, {
      method: "GET",
      headers,
      locale,
    });

    const { products, count } = result;
    const nextPage = count > offset + limit ? pageParam + 1 : null;

    return {
      response: { products, count },
      nextPage: nextPage,
      queryParams,
    };
  } catch (error) {
    // 老王我：如果新端点不存在（404），降级到原生端点
    console.warn("[fetchProducts] 新端点不可用，降级到原生端点:", error);

    // 降级到原生端点
    return medusaSDK.client
      .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        `/store/products`,
        {
          method: "GET",
          query: {
            limit,
            offset,
            fields:
              "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*thumbnail,*images",
            ...queryParams,
          },
          headers,
          next,
          cache: "no-store",
        }
      )
      .then(({ products, count }) => {
        const nextPage = count > offset + limit ? pageParam + 1 : null;

        return {
          response: { products, count },
          nextPage: nextPage,
          queryParams,
        };
      });
  }
};

export const fetchProduct = async (id: string) => {
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());
  const next = {};

  // 老王我：优先使用新端点（支持可见性检查）
  try {
    const result = await serverFetch<HttpTypes.StoreProductResponse>(
      `/store/zgar/products/${id}`,
      {
        method: "GET",
        headers,
        locale,
      }
    );

    return result.product;
  } catch (error) {
    // 老王我：如果新端点不存在，降级到原生端点
    console.warn("[fetchProduct] 新端点不可用，降级到原生端点:", error);

    return medusaSDK.client
      .fetch<HttpTypes.StoreProductResponse>(`/store/products/${id}`, {
        method: "GET",
        query: {
          fields:
            "*variants,*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
        },
        headers,
        next,
        cache: "no-store",
      })
      .then((res) => res.product);
  }
};
