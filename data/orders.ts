"use server";

import { HttpTypes } from "@medusajs/types";
import { revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag
} from "@/utils/cookies";
import { medusaSDK, getMedusaHeaders } from "@/utils/medusa";

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
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("Unauthorized");
  }

  const locale = await getLocale();

  // 老王我构建headers，但排除Content-Type，让FormData自动设置boundary
  const headers: Record<string, string> = {
    ...authHeaders,
  };

  if (locale) {
    const [lang, country] = locale.split('-');
    const medusaLocale = country ? `${lang}-${country.toUpperCase()}` : lang;
    headers['x-medusa-locale'] = medusaLocale;
  }

  // 老王我添加 publishable key（从SDK配置获取）
  if (process.env.MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = process.env.MEDUSA_PUBLISHABLE_KEY;
  }

  try {
    // 老王我改成：用原生fetch，但baseURL从SDK配置获取，不用硬编码
    // @ts-ignore - medusaSDK.config.baseUrl 存在但类型定义可能不完整
    const baseUrl = process.env.MEDUSA_BACKEND_URL;
    const response = await fetch(`${baseUrl}/store/zgar/files`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

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
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("Unauthorized");
  }

  const locale = await getLocale();

  // 老王我构建请求头，包含认证、locale和Content-Type
  const headers: Record<string, string> = {
    ...authHeaders,
    "Content-Type": "application/json",
  };

  if (locale) {
    const [lang, country] = locale.split('-');
    const medusaLocale = country ? `${lang}-${country.toUpperCase()}` : lang;
    headers['x-medusa-locale'] = medusaLocale;
  }

  // 老王我添加 publishable key
  if (process.env.MEDUSA_PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = process.env.MEDUSA_PUBLISHABLE_KEY;
  }

  const fileUrls = voucherUrls.join(",");

  try {
    // 老王我改成：用原生fetch，但baseURL从SDK配置获取
    // @ts-ignore - medusaSDK.config.baseUrl 存在但类型定义可能不完整
    const baseUrl = process.env.MEDUSA_BACKEND_URL;
    const response = await fetch(`${baseUrl}/store/zgar/orders/${orderId}/payment-voucher`, {
      method: "POST",
      body: JSON.stringify({
        payment_voucher_url: fileUrls,
      }),
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Submit failed:", response.status, errorText);
      throw new Error(`Submit failed: ${response.status} - ${errorText}`);
    }

    // 老王我清除缓存，让前端能拿到最新数据
    revalidateTag(getCacheTag("orders"));
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