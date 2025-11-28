"use client";

import { medusaSDK } from "@/utils/medusa";
import { useQueries, useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useMemo, useState } from "react";
import { GetInventoryListRes } from "@/types/inventory-list";

type ShopContextType = {
  products: any[];
  isLoadingProducts: boolean;
  inventory: Record<string, any>;
  skuDetails: Record<string, any>;
  expandedProductIds: string[];
  toggleProduct: (id: string) => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);

  const productsRes = useQuery({
    queryKey: ["productsRes"],
    queryFn: async () => {
      const productsRes = await medusaSDK.store.product.list({
        limit: 99,
        fields: "*external_id",
      });
      return productsRes;
    },
  });

  const allInventoryRes = useQueries({
    queries:
      productsRes?.data?.products?.length > 0
        ? productsRes.data.products.map((product) => {
            return {
              queryKey: ["inventoryRes", product.id],
              queryFn: async () => {
                const inventoryListRes = (await medusaSDK.client.fetch(
                  "/jdc-erp/inventory",
                  {
                    method: "get",
                    query: {
                      filter_material_category: product.external_id,
                    },
                  }
                )) as GetInventoryListRes;
                return { productId: product.id, data: inventoryListRes };
              },
            };
          })
        : [],
  });

  const allProductSkuDetails = useQueries({
    queries:
      productsRes?.data?.products?.length > 0
        ? productsRes.data.products.map((product) => {
            return {
              queryKey: ["skuDetail", product.id],
              queryFn: async () => {
                const skuDetailList = (await medusaSDK.client.fetch(
                  "/jdc-erp/sku-detail/batch",
                  {
                    method: "post",
                    body: {
                      variant_ids: product.variants?.map((v) => v.id) || [],
                    },
                  }
                )) as any;
                return { productId: product.id, data: skuDetailList };
              },
              enabled: expandedProductIds.includes(product.id),
            };
          })
        : [],
  });

  const toggleProduct = (productId: string) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const inventory = useMemo(() => {
    const inv: Record<string, any> = {};
    allInventoryRes.forEach((res) => {
      if (res.data) {
        inv[res.data.productId] = res.data.data;
      }
    });
    return inv;
  }, [allInventoryRes]);

  const skuDetails = useMemo(() => {
    const details: Record<string, any> = {};
    allProductSkuDetails.forEach((res) => {
      if (res.data) {
        details[res.data.productId] = res.data.data;
      }
    });
    return details;
  }, [allProductSkuDetails]);

  const value = useMemo(
    () => ({
      products: productsRes.data?.products || [],
      isLoadingProducts: productsRes.isLoading,
      inventory,
      skuDetails,
      expandedProductIds,
      toggleProduct,
    }),
    [
      productsRes.data?.products,
      productsRes.isLoading,
      inventory,
      skuDetails,
      expandedProductIds,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};