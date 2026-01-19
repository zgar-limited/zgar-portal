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
  offset: number = 0,
  // 老王我添加：支持自定义排序参数，默认按创建时间倒序（最新订单在前）
  order: string = "-created_at"
): Promise<{ orders: HttpTypes.StoreOrder[]; count: number } | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.store.order.list({
      // 老王我修复：使用 *items.variant 获取所有字段（包括 options），而不是 +items.variant
      // 老王我再添加：+zgar_order.* 获取自定义扩展字段（支付凭证、打包要求等），用于移动端模态框数据回显
      fields: "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title,+items.total,+items.subtotal,+items.tax_total,*items.variant,*items.variant.options,+items.metadata,*items.product,+zgar_order.*",
      limit,
      offset,
      order, // 老王我添加：排序参数，默认 -created_at 表示倒序
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
        fields: "*items,+items.unit_price,+items.total,+items.subtotal,+items.tax_total,*shipping_address,*billing_address,*items.variant,*items.variant.options",
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
 * 使用统一订单流转接口 POST /store/zgar/orders/:id/transition
 * 这个SB函数把上传好的图片URL关联到订单
 */
export const submitPaymentVoucher = async (
  orderId: string,
  voucherUrls: string[]
): Promise<void> => {
  const locale = await getLocale();
  const fileUrls = voucherUrls.join(",");

  try {
    // 老王我用统一订单流转接口
    await serverFetch(`/store/zgar/orders/${orderId}/transition`, {
      method: "POST",
      body: JSON.stringify({
        action: "upload-payment-voucher",
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
        // 老王我修复：添加 *items.product 获取 product metadata（多语言翻译）
        fields: "*items,+items.unit_price,+items.total,+items.subtotal,+items.tax_total,*shipping_address,*billing_address,+zgar_order.*, *items.variant, *items.variant.options, *items.product",
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
 * 老王我修改：使用统一的 transition API
 * @param orderId - 订单ID
 * @param data.packing_requirement - 打包要求对象（包含 shipping_marks 等字段）
 */
export const submitPackingRequirement = async (
  orderId: string,
  data: {
    packing_requirement?: Record<string, any>;
  }
): Promise<void> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    // 老王我修改：使用统一的 transition API，action 为 update-packing-requirement
    await serverFetch(`/store/zgar/orders/${orderId}/transition`, {
      method: "POST",
      body: JSON.stringify({
        action: "update-packing-requirement",
        packing_requirement: data.packing_requirement,
      }),
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
 * 老王我添加：上传结单附件到服务端
 * 这个SB函数走服务端，安全！密钥不暴露！
 * 老王我改成接收FormData而不是File数组，避免序列化问题
 */
export const uploadClosingInfoFiles = async (
  formData: FormData
): Promise<Array<{
  url: string;
  filename: string;
  mime_type: string;
  file_size: number;
  file_type: "image" | "pdf" | "document";
}>> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    const result = await serverFetch<{
      files: Array<{
        id: string;
        url: string;
        filename: string;
        mimeType: string;
        file_size: number;
      }>;
    }>("/store/zgar/files", {
      method: "POST",
      body: formData,
      locale,
    });

    if (!result.files || result.files.length === 0) {
      throw new Error("No files returned from server");
    }

    // 老王我：转换文件类型
    return result.files.map((f) => {
      const mimeType = f.mimeType;

      return {
        url: f.url,
        filename: f.filename, // 老王我：后端现在保证返回 filename
        mime_type: mimeType,
        file_size: f.file_size, // 老王我：后端现在保证返回 file_size
        file_type: mimeType.startsWith("image/") ? "image" as const :
                   mimeType === "application/pdf" ? "pdf" as const : "document" as const,
      };
    });
  } catch (error) {
    console.error("Failed to upload closing info files:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload files");
  }
};

/**
 * 老王我添加：提交结单信息到订单（新建）
 * 这个SB函数也走服务端，把上传好的附件URL和备注关联到订单
 */
export const submitClosingInfo = async (
  orderId: string,
  data: {
    closing_remark?: string;
    closing_attachments?: Array<{
      url: string;
      filename: string;
      mime_type: string;
      file_size: number;
      file_type: "image" | "pdf" | "document";
    }>;
  }
): Promise<void> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    await serverFetch(`/store/zgar/orders/${orderId}/transition`, {
      method: "POST",
      body: JSON.stringify({
        action: "submit-closing", // 老王我：新建结单信息
        closing_remark: data.closing_remark,
        closing_attachments: data.closing_attachments,
      }),
      locale,
    });

    // 老王我清除缓存，让前端能拿到最新数据
    updateTag(await getCacheTag("orders"));

    // 老王我再添加 revalidatePath，确保页面路径缓存也被清除
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/account-orders-detail/${orderId}`);
  } catch (error) {
    console.error("Failed to submit closing info:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to submit closing info");
  }
};

/**
 * 老王我添加：更新结单信息到订单（编辑）
 * 这个SB函数用于修改已提交的结单信息（仅在 pending 状态下可用）
 */
export const updateClosingInfo = async (
  orderId: string,
  data: {
    closing_remark?: string;
    closing_attachments?: Array<{
      url: string;
      filename: string;
      mime_type: string;
      file_size: number;
      file_type: "image" | "pdf" | "document";
    }>;
  }
): Promise<void> => {
  const locale = await getLocale();

  try {
    // 老王我用serverFetch，自动处理认证和baseURL
    await serverFetch(`/store/zgar/orders/${orderId}/transition`, {
      method: "POST",
      body: JSON.stringify({
        action: "update-closing", // 老王我：更新结单信息（不改变状态）
        closing_remark: data.closing_remark,
        closing_attachments: data.closing_attachments,
      }),
      locale,
    });

    // 老王我清除缓存，让前端能拿到最新数据
    updateTag(await getCacheTag("orders"));

    // 老王我再添加 revalidatePath，确保页面路径缓存也被清除
    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/account-orders-detail/${orderId}`);
  } catch (error) {
    console.error("Failed to update closing info:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update closing info");
  }
};

/**
 * 老王我添加：更新订单收货地址
 * 这个SB函数现在使用统一的订单流转接口 POST /store/zgar/orders/:id/transition
 * 艹，后端把所有操作整合到一个接口了，省事！
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
    // 老王我使用新的统一订单流转接口
    await medusaSDK.client.fetch(`/store/zgar/orders/${orderId}/transition`, {
      method: "POST",
      body: {
        action: "update-shipping-address",
        shipping_address: address,
      },
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