"use server";

import { getAuthHeaders, getCacheOptions } from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
import { HttpTypes, StoreProduct } from "@medusajs/types";

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

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("products")),
  };

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
        cache: "no-cache",
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
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions(`product-${id}`)),
  };

  return medusaSDK.client
    .fetch<HttpTypes.StoreProductResponse>(`/store/products/${id}`, {
      method: "GET",
      query: {
        fields:
          "*variants,*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
      },
      headers,
      next,
      cache: "no-cache",
    })
    .then((res) => res.product);
};
