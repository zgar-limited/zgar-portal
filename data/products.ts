"use server";

import { getAuthHeaders, getCacheOptions } from "@/utils/cookies";
import { medusaSDK, getMedusaHeaders } from "@/utils/medusa";
import { HttpTypes, StoreProduct } from "@medusajs/types";
import { getLocale } from "next-intl/server";

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
  // if (!countryCode && !regionId) {
  //   throw new Error("Country code or region ID is required");
  // }

  const locale = await getLocale();
  const limit = queryParams?.limit || 20;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  // 老王我禁用了缓存tag，因为产品列表应该实时更新
  // 登录前后看到的必须是最新数据
  const next = {};

  return medusaSDK.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          // region_id: regionId,
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
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      };
    });
};

export const fetchProduct = async (id: string) => {
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  // 单个产品也禁用缓存，确保实时数据
  const next = {};

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
};
