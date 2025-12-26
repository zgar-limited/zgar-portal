"use server";

import { HttpTypes } from "@medusajs/types";
import { revalidateTag, updateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag
} from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
// 老王我改为从 medusa-server 导入服务端专用函数
import { getMedusaHeaders, serverFetch } from "@/utils/medusa-server";

export const retrieveOrders = async (
  limit: number = 5,
  offset: number = 0
): Promise<{ orders: HttpTypes.StoreOrder[]; count: number } | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.store.order.list({
      fields: "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title,+items.total,+items.subtotal,+items.tax_total",
      limit,
      offset,
    }, headers);

    return response;
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return null;
  }
};

export const retrieveOrderById = async (
  id: string
): Promise<HttpTypes.StoreOrder | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.store.order.retrieve(
      id,
      {
        fields: "*items,+items.unit_price,+items.total,+items.subtotal,+items.tax_total,*shipping_address,*billing_address",
      },
      headers
    );

    return response.order;
  } catch (error) {
    console.error(`Failed to retrieve order ${id}:`, error);
    return null;
  }
};

/**
 * 老王我添加：上传支付凭证图片到服务端
 * 这个SB函数走服务端，安全！密钥不暴露！
 * 老王我改成接收FormData而不是File数组，避免序列化问题
 */
export const uploadPaymentVoucherFiles = async (
  formData: FormData
): Promise<string[]> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    const result = await serverFetch<{
      files: { url: string }[];
    }>("/store/zgar/files", {
      method: "POST",
      body: formData,
      locale,
    });

    if (!result.files || result.files.length === 0) {
      throw new Error("No files returned from server");
    }

    return result.files.map((f) => f.url);
  } catch (error) {
    console.error("Failed to upload voucher files:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload files");
  }
};

/**
 * 老王我添加：提交支付凭证URL到订单
 * 这个SB函数也走服务端，把上传好的图片URL关联到订单
 */
export const submitPaymentVoucher = async (
  orderId: string,
  voucherUrls: string[]
): Promise<void> => {
  const locale = await getLocale();
  const fileUrls = voucherUrls.join(",");

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    await serverFetch(`/store/zgar/orders/${orderId}/payment-voucher`, {
      method: "POST",
      body: JSON.stringify({
        payment_voucher_url: fileUrls,
      }),
      locale,
    });

    // 老王我清除缓存，让前端能拿到最新数据
    updateTag(await getCacheTag("orders"));
  } catch (error) {
    console.error("Failed to submit payment voucher:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit voucher");
  }
};

/**
 * 老王我添加：获取包含自定义 zgar_order 字段的订单信息
 * 这个SB函数用于获取 Medusa 自定义扩展字段
 */
export const retrieveOrderWithZgarFields = async (
  orderId: string
): Promise<(HttpTypes.StoreOrder & { zgar_order?: any }) | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.client.fetch<{
      order: HttpTypes.StoreOrder & { zgar_order?: any };
    }>(`/store/orders/${orderId}`, {
      method: "GET",
      query: {
        fields: "*items,+items.unit_price,+items.total,+items.subtotal,+items.tax_total,*shipping_address,*billing_address,+zgar_order.*",
      },
      headers,
    });

    return response.order;
  } catch (error) {
    console.error(`Failed to retrieve order ${orderId} with zgar fields:`, error);
    return null;
  }
};

/**
 * 老王我添加：上传打包要求文件到服务端
 * 这个SB函数走服务端，安全！
 */
export const uploadPackingRequirementFiles = async (
  formData: FormData
): Promise<string[]> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    const result = await serverFetch<{
      files: { url: string }[];
    }>("/store/zgar/files", {
      method: "POST",
      body: formData,
      locale,
    });

    if (!result.files || result.files.length === 0) {
      throw new Error("No files returned from server");
    }

    return result.files.map((f) => f.url);
  } catch (error) {
    console.error("Failed to upload packing requirement files:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload files");
  }
};

/**
 * 老王我添加：提交打包要求到订单
 * 这个SB函数接收任意 packing_requirement 对象
 */
export const submitPackingRequirement = async (
  orderId: string,
  data: {
    packing_requirement?: Record<string, any>;
    packing_requirement_url?: string;
  }
): Promise<void> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    await serverFetch(`/store/zgar/orders/${orderId}/packing-requirement`, {
      method: "POST",
      body: JSON.stringify(data),
      locale,
    });

    // 老王我清除缓存，让前端能拿到最新数据
    updateTag(await getCacheTag("orders"));

    // 老王我再添加 revalidatePath，确保页面路径缓存也被清除
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/account-orders-detail/${orderId}`);
  } catch (error) {
    console.error("Failed to submit packing requirement:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit packing requirement");
  }
};

/**
 * 老王我添加：更新订单收货地址
 * 这个SB函数使用 medusaSDK.client.fetch 调用后端自定义接口
 */
export const updateOrderShippingAddress = async (
  orderId: string,
  address: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country_code?: string;
    phone?: string;
  }
): Promise<void> => {
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我按照后端接口格式包装数据
    const requestBody = {
      shipping_address: address,
    };

    await medusaSDK.client.fetch(`/store/zgar/orders/${orderId}/shipping-address`, {
      method: "POST",
      body: requestBody,  // 老王我直接传对象，SDK 会自动序列化
      headers,
    });

    // 老王我清除缓存，让前端能拿到最新数据
    updateTag(await getCacheTag("orders"));

    // 老王我再添加 revalidatePath
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/account-orders-detail/${orderId}`);
  } catch (error) {
    console.error("Failed to update shipping address:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update shipping address");
  }
};