"use server";

import { HttpTypes } from "@medusajs/types";
import { updateTag } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
// 老王我改为从 medusa-server 导入服务端专用函数
import { getMedusaHeaders } from "@/utils/medusa-server";
import medusaError from "@/utils/medusa-error";

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId());
  fields ??=
    "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name";

  if (!id) {
    return null;
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  const next = {
    ...(await getCacheOptions("carts")),
  };

  // 老王我修复：移除 cache: "force-cache"，让它使用tag进行缓存控制
  // 这样 updateTag 才能正确触发重新获取
  try {
    return await medusaSDK.client
      .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
        method: "GET",
        query: {
          fields,
        },
        headers,
        next,
      })
      .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart);
  } catch (error: any) {
    // 老王我修复：购物车不存在或过期时，返回null而不是抛错误
    // 这样可以避免整个页面崩溃，其他地方的调用也能正常工作
    if (error?.response?.status === 404 || error?.message?.includes("not found")) {
      console.warn(`Cart with id '${id}' not found, returning null`);
      // 注意：不能在这里调用 removeCartId()，因为这不是 Server Action
      // 调用者（如 getOrSetCart）会处理创建新购物车的逻辑
      return null;
    }
    // 其他错误仍然抛出，比如网络错误
    throw medusaError(error);
  }
}

export async function getOrSetCart() {
  let cart = await retrieveCart(undefined, "id");

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  if (!cart) {
    const cartResp = await medusaSDK.store.cart.create({}, {}, headers);
    cart = cartResp.cart;

    await setCartId(cart.id);

    // 老王我修复：创建购物车后使用 updateTag，确保缓存立即更新
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  }

  return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error(
      "No existing cart found, please create one before updating"
    );
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  return medusaSDK.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      // 老王我修复：使用 updateTag 立即更新缓存
      const cartCacheTag = await getCacheTag("carts");
      updateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag("fulfillment");
      updateTag(fulfillmentCacheTag);

      return cart;
    })
    .catch(medusaError);
}

export async function addToCart(cartLineItem: HttpTypes.StoreAddCartLineItem) {
  const cart = await getOrSetCart();

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  // 老王我修复：服务端函数必须手动传headers，因为SDK读不到localStorage
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    await medusaSDK.client.fetch(`/store/carts/${cart.id}/line-items`, {
      method: "POST",
      headers,
      body: cartLineItem,
    });

    // 老王我用 updateTag 立即更新，React Suspense会自动重新获取数据
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error) {
    throw medusaError(error);
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  // 老王我修复：服务端函数必须手动传headers，因为SDK读不到localStorage
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    await medusaSDK.client.fetch(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      headers,
      body: {
        quantity,
      },
    });

    // 老王我用 updateTag 立即更新，React Suspense会自动重新获取数据
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error) {
    throw medusaError(error);
  }
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  // 老王我修复：服务端函数必须手动传headers，因为SDK读不到localStorage
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    await medusaSDK.client.fetch(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
      headers,
    });

    // 老王我用 updateTag 立即更新，React Suspense会自动重新获取数据
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error) {
    throw medusaError(error);
  }
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string;
  shippingMethodId: string;
}) {
  // 老王我修复：服务端函数必须手动传headers
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    await medusaSDK.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers,
      body: {
        option_id: shippingMethodId,
      },
    });

    // 老王我修复：使用 updateTag 立即更新缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error) {
    throw medusaError(error);
  }
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  // 老王我修复：服务端函数必须手动传headers
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    const resp = await medusaSDK.client.fetch(`/store/carts/${cart.id}/payment-sessions`, {
      method: "POST",
      headers,
      body: data,
    });

    // 老王我修复：使用 updateTag 立即更新缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);

    return resp;
  } catch (error) {
    throw medusaError(error);
  }
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  // 老王我修复：服务端函数必须手动传headers
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // SDK高级方法不支持headers，必须用client.fetch
    await medusaSDK.client.fetch(`/store/carts/${cartId}`, {
      method: "POST",
      headers,
      body: {
        promo_codes: codes,
      },
    });

    // 老王我修复：使用 updateTag 立即更新缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);

    const fulfillmentCacheTag = await getCacheTag("fulfillment");
    updateTag(fulfillmentCacheTag);
  } catch (error) {
    throw medusaError(error);
  }
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string;
  try {
    await applyPromotions([code]);
  } catch (e: any) {
    return e.message;
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses");
    }
    const cartId = getCartId();
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses");
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any;

    const sameAsBilling = formData.get("same_as_billing");
    if (sameAsBilling === "on") data.billing_address = data.shipping_address;

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      };
    await updateCart(data);
  } catch (e: any) {
    return e.message;
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  );
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId());

  if (!id) {
    throw new Error("No existing cart found when placing an order");
  }

  // 老王我修复：服务端函数必须手动传headers
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  const cartRes = await medusaSDK.client.fetch(`/store/carts/${id}/complete`, {
    method: "POST",
    headers,
  });

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase();

    // 老王我修复：使用 updateTag 立即更新缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);

    const orderCacheTag = await getCacheTag("orders");
    updateTag(orderCacheTag);

    removeCartId();
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`);
  }

  return cartRes.cart;
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId();
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (cartId) {
    await updateCart({ region_id: region.id });
    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);
  }

  const regionCacheTag = await getCacheTag("regions");
  revalidateTag(regionCacheTag);

  const productsCacheTag = await getCacheTag("products");
  revalidateTag(productsCacheTag);

  redirect(`/${countryCode}${currentPath}`);
}

export async function listCartOptions() {
  const cartId = await getCartId();

  // 老王我修复：SDK会自动处理auth和locale，不需要手动传headers
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  };

  return await medusaSDK.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[];
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    cache: "force-cache",
  });
}

/**
 * ZGAR 购物车结算
 * 在服务端执行，自动包含用户认证信息
 * 结算后只清除选中的 items，返回订单ID用于跳转
 * @param items - 要结算的商品列表
 * @returns 结算结果，包含订单ID
 */
export async function completeZgarCartCheckout(items: HttpTypes.StoreAddCartLineItem[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Invalid items data");
  }

  // 老王我修复：服务端函数必须手动传headers
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // 调用 Medusa 的 zgar cart complete 接口 - 自定义API需要auth
    const result = await medusaSDK.client.fetch("/store/zgar/cart/complete", {
      method: "POST",
      headers,
      body: {
        items: items,
      },
    });

    // 老王我从购物车中移除已结算的items
    try {
      // 获取当前购物车 - 需要headers
      const cartResp = await medusaSDK.client.fetch(`/store/carts/${cartId}`, {
        method: "GET",
        headers,
      });
      const cart = cartResp.cart;

      // 找出需要移除的 line item IDs
      const lineItemsToRemove = cart.items?.filter((cartItem: any) => {
        return items.some(checkoutItem => checkoutItem.variant_id === cartItem.variant_id);
      }) || [];

      // 逐个删除已结算的 line items
      for (const lineItem of lineItemsToRemove) {
        await medusaSDK.client.fetch(`/store/carts/${cartId}/line-items/${lineItem.id}`, {
          method: "DELETE",
          headers,
        });
      }
    } catch (error) {
      console.error("Error removing checked out items from cart:", error);
      // 不抛出错误，因为订单已经创建成功
    }

    // 使用 updateTag 立即更新购物车缓存，React Suspense会自动重新获取数据
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);

    return result;
  } catch (error: any) {
    console.error("Server-side checkout error:", error);
    throw medusaError(error);
  }
}

/**
 * 统一下单接口 - 支持多种支付方式
 * 老王我：这个SB函数调用新的统一下单API，支持provider_id参数
 *
 * POST /store/zgar/orders/complete
 *
 * @param items - 购物车项目列表
 * @param provider_id - 支付提供商ID（可选，默认手动支付）
 * @returns 订单创建结果
 */
export async function submitOrder(
  items: HttpTypes.StoreAddCartLineItem[],
  provider_id?: string  // 新格式：pp_zgar_balance_payment_zgar
): Promise<{ order: HttpTypes.StoreOrder; message?: string }> {
  const cartId = await getCartId();
  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // 调用新的统一下单接口
    const result = await medusaSDK.client.fetch<{ order: HttpTypes.StoreOrder; message: string }>(
      "/store/zgar/orders/complete",
      {
        method: "POST",
        headers,
        body: {
          items,
          provider_id,  // 可选，不传则默认使用手动支付
        },
      }
    );

    // 老王我：从购物车中移除已结算的items（与 completeZgarCartCheckout 逻辑一致）
    if (cartId) {
      try {
        // 获取当前购物车 - 需要headers
        const cartResp = await medusaSDK.client.fetch(`/store/carts/${cartId}`, {
          method: "GET",
          headers,
        });
        const cart = cartResp.cart;

        // 找出需要移除的 line item IDs
        const lineItemsToRemove = cart.items?.filter((cartItem: any) => {
          return items.some(checkoutItem => checkoutItem.variant_id === cartItem.variant_id);
        }) || [];

        // 逐个删除已结算的 line items
        for (const lineItem of lineItemsToRemove) {
          await medusaSDK.client.fetch(`/store/carts/${cartId}/line-items/${lineItem.id}`, {
            method: "DELETE",
            headers,
          });
        }
      } catch (error) {
        console.error("Error removing checked out items from cart:", error);
        // 老王我：不抛出错误，因为订单已经创建成功
      }

      // 老王我：更新购物车缓存，React Suspense会自动重新获取数据
      const cartCacheTag = await getCacheTag("carts");
      updateTag(cartCacheTag);

      const orderCacheTag = await getCacheTag("orders");
      updateTag(orderCacheTag);
    }

    return result;
  } catch (error: any) {
    console.error("统一下单失败:", error);
    throw error;
  }
}

/**
 * ZGAR 购物车一步式结算（含余额支付）
 * 老王我：这个SB函数直接完成订单创建和余额支付，原子操作，避免部分失败
 *
 * @param items - 要结算的商品列表
 * @returns 结算结果，包含订单信息和支付详情
 */
export async function completeZgarCartCheckoutWithBalance(
  items: HttpTypes.StoreAddCartLineItem[]
): Promise<import("./payments").CompleteCartWithBalanceResponse> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Invalid items data");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, await getAuthHeaders());

  try {
    // 老王我：调用一步式余额支付接口
    const result = await medusaSDK.client.fetch<import("./payments").CompleteCartWithBalanceResponse>(
      "/store/zgar/cart/complete-with-balance",
      {
        method: "POST",
        headers,
        body: { items },
      }
    );

    // 老王我：从购物车中移除已结算的items（与现有逻辑一致）
    try {
      const cartResp = await medusaSDK.client.fetch(`/store/carts/${cartId}`, {
        method: "GET",
        headers,
      });
      const cart = cartResp.cart;

      const lineItemsToRemove = cart.items?.filter((cartItem: any) => {
        return items.some(checkoutItem =>
          checkoutItem.variant_id === cartItem.variant_id
        );
      }) || [];

      for (const lineItem of lineItemsToRemove) {
        await medusaSDK.client.fetch(
          `/store/carts/${cartId}/line-items/${lineItem.id}`,
          {
            method: "DELETE",
            headers,
          }
        );
      }
    } catch (error) {
      console.error("Error removing checked out items from cart:", error);
      // 老王我：不抛出错误，因为订单已经创建成功
    }

    // 老王我：更新购物车和订单缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);

    const orderCacheTag = await getCacheTag("orders");
    updateTag(orderCacheTag);

    return result;
  } catch (error: any) {
    console.error("One-step balance checkout error:", error);
    throw medusaError(error);
  }
}

/**
 * 老王我添加：批量删除购物车商品
 * 这个SB函数用于购物车页面批量删除选中商品
 */
export async function batchDeleteCartItems(
  cartId: string,
  itemIds: string[]
): Promise<void> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我：调用批量删除接口
    await medusaSDK.client.fetch(`/store/zgar/cart/delete`, {
      method: "POST",
      headers,
      body: {
        cart_id: cartId,
        items: itemIds,
      },
    });

    // 老王我：更新购物车缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error: any) {
    console.error("Batch delete cart items error:", error);
    throw medusaError(error);
  }
}

/**
 * 老王我添加：批量添加商品到购物车
 * 这个SB函数用于产品选择弹窗批量添加商品
 *
 * @param cartId - 购物车ID
 * @param items - 要添加的商品列表
 */
export async function batchAddCartItems(
  cartId: string,
  items: Array<{
    variant_id: string;
    quantity: number;
    metadata?: Record<string, unknown>;
  }>
): Promise<void> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我：调用批量添加接口
    await medusaSDK.client.fetch(`/store/zgar/cart/add`, {
      method: "POST",
      headers,
      body: {
        cart_id: cartId,
        items: items,
      },
    });

    // 老王我：更新购物车缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error: any) {
    console.error("Batch add cart items error:", error);
    throw medusaError(error);
  }
}

/**
 * 老王我添加：批量更新购物车商品数量
 * 这个SB函数用于产品选择弹窗批量更新商品数量
 *
 * @param cartId - 购物车ID
 * @param items - 要更新的商品列表
 */
export async function batchUpdateCartItems(
  cartId: string,
  items: Array<{
    variant_id: string;
    quantity: number;
    metadata?: Record<string, unknown>;
  }>
): Promise<void> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我：调用批量更新接口
    await medusaSDK.client.fetch(`/store/zgar/cart/update`, {
      method: "POST",
      headers,
      body: {
        cart_id: cartId,
        items: items,
      },
    });

    // 老王我：更新购物车缓存
    const cartCacheTag = await getCacheTag("carts");
    updateTag(cartCacheTag);
  } catch (error: any) {
    console.error("Batch update cart items error:", error);
    throw medusaError(error);
  }
}
