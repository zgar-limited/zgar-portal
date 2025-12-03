"use client";

import { medusaSDK } from "@/utils/medusa";
import {
  QueryObserverResult,
  RefetchOptions,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { GetInventoryListRes } from "@/types/inventory-list";
import {
  StoreAddCartLineItem,
  StoreCart,
  StoreCartLineItem,
  StoreCartResponse,
  StoreProduct,
} from "@medusajs/types";
import { allProducts } from "@/data/products";

type ShopContextType = {
  products: StoreProduct[];
  isLoadingProducts: boolean;
  inventory: Record<string, any>;
  skuDetails: Record<string, any>;
  expandedProductIds: string[];
  toggleProduct: (id: string) => void;
  cart: StoreCart | undefined | null;
  cartLoading: boolean;
  addToCart: (cardLineItem: StoreAddCartLineItem) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateCartItem: (
    lineId: string,
    quantity: number,
    metadata?: Record<string, any>
  ) => Promise<void>;
  cartProducts: any[]; // Using any for UI mapped type for now, or define a specific UI type if strictness needed
  totalPrice: number;
  refreshCart: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<StoreCart, Error>>;
  getSkuDetails: (productId: string) => Promise<any>;
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
  const [cartId, setCartId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize cart ID from localStorage
  useEffect(() => {
    const storedCartId = localStorage.getItem("cart_id");
    if (storedCartId) {
      setCartId(storedCartId);
    } else {
      createCart();
    }
  }, []);

  const createCart = async () => {
    try {
      const { cart } = await medusaSDK.store.cart.create({
        sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
        region_id: "reg_01K9M1A9NHMN4MXBACKAS5F4V1",
        currency_code: "usd",
      });
      setCartId(cart.id);
      localStorage.setItem("cart_id", cart.id);
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };

  const {
    data: cart,
    isLoading: cartLoading,
    refetch: refreshCart,
  } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) return null;
      try {
        const { cart } = await medusaSDK.client.fetch<StoreCartResponse>(
          `/store/carts/${cartId}`,
          {
            method: "GET",
            query:{
              fields: "*items,*items.variant_option_values,*items.variant,*items.variant.options,"
            }
          }
        );

        return cart;
      } catch (error) {
        // If cart not found (e.g. expired), create a new one
        console.error("Error fetching cart, creating new one:", error);
        localStorage.removeItem("cart_id");
        const newCart = await createCart();
        return newCart;
      }
    },
    enabled: !!cartId,
  });

  const addToCart = async (cardLineItem: StoreAddCartLineItem) => {
    // Find product and metadata
    value.products.forEach((p) => {
      const variant = p.variants.find((v) => v.id === cardLineItem.variant_id);
      if (variant) {
        cardLineItem.metadata = variant?.metadata;
      }
    });
    try {
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await createCart();
        if (!newCart) throw new Error("Failed to create cart");
        currentCartId = newCart.id;
      }

      await medusaSDK.client.fetch(`/store/carts/${currentCartId}/line-items`, {
        method: "POST",
        body: {
          ...cardLineItem,
        },
        query: {
          // fields: "*items,+items.variants",
        },
      });

      queryClient.invalidateQueries({ queryKey: ["cart", currentCartId] });
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;
    try {
      await medusaSDK.store.cart.deleteLineItem(cartId, lineId);
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    try {
      await medusaSDK.store.cart.updateLineItem(cartId, lineId, {
        quantity,
      });
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  // Map Medusa cart items to the format expected by the UI
  const cartProducts = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item: any) => ({
      id: item.id, // Line item ID for removal/update
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.product_title,
      variantTitle: item.variant_title,
      price: item.unit_price, // Medusa prices are usually in cents, check if division is needed. Assuming unit_price is correct for now or adjust if needed.
      quantity: item.quantity,
      imgSrc: item.thumbnail || "https://picsum.photos/100/100", // Fallback image
      options: item.variant?.options || [],
      metadata: item.metadata || {},
      // Add other necessary fields mapped from Medusa item
    }));
  }, [cart]);

  useEffect(() => {
    if (cart) {
      // Medusa cart total is usually in cents if currency is involved, but let's use the calculated total from items for now to match previous logic or use cart.total / 100
      // Using local calculation based on mapped products to ensure consistency with UI display
      const subtotal = cartProducts.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
      setTotalPrice(subtotal);
    }
  }, [cartProducts, cart]);

  const productsRes = useQuery({
    queryKey: ["productsRes"],
    queryFn: async () => {
      const productsRes = await medusaSDK.store.product.list({
        limit: 99,
        fields: "*external_id,*variants,+variants.metadata",
      });
    
      console.log(
        "%c [ productsRes ]-200",
        "font-size:13px; background:pink; color:#bf2c9f;",
        productsRes
      );
      return productsRes;
    },
  });

  const allInventoryRes = [];
  // const allInventoryRes = useQueries({
  //   queries:
  //     productsRes?.data?.products?.length > 0
  //       ? productsRes.data.products.map((product) => {
  //           return {
  //             queryKey: ["inventoryRes", product.id],
  //             queryFn: async () => {
  //               const inventoryListRes = (await medusaSDK.client.fetch(
  //                 "/jdc-erp/inventory",
  //                 {
  //                   method: "get",
  //                   query: {
  //                     filter_material_category: product.external_id,
  //                   },
  //                 }
  //               )) as GetInventoryListRes;
  //               return { productId: product.id, data: inventoryListRes };
  //             },
  //             staleTime: 1000 * 60 * 5,
  //             refetchOnWindowFocus: false,
  //           };
  //         })
  //       : [],
  // });

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

  const getSkuDetails = async (productId: string) => {
    if (skuDetails[productId]) return skuDetails[productId];

    const product = productsRes.data?.products.find((p) => p.id === productId);
    if (!product) return null;

    try {
      const skuDetailList = await medusaSDK.client.fetch(
        "/jdc-erp/sku-detail/batch",
        {
          method: "post",
          body: {
            variant_ids: product.variants?.map((v) => v.id) || [],
          },
        }
      );

      queryClient.setQueryData(["skuDetail", productId], {
        productId,
        data: skuDetailList,
      });

      return skuDetailList;
    } catch (error) {
      console.error("Error fetching sku details:", error);
      return null;
    }
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
      cart,
      cartLoading,
      addToCart,
      removeFromCart,
      updateCartItem,
      cartProducts,
      totalPrice,
      refreshCart,
      getSkuDetails,
    }),
    [
      productsRes.data?.products,
      productsRes.isLoading,
      inventory,
      skuDetails,
      expandedProductIds,
      cart,
      cartLoading,
      cartProducts,
      totalPrice,
      refreshCart,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
