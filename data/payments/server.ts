// 老王我：支付模块服务端API（带 "use server"）
// 创建时间：2026-02-02
// 作者：老王
// 用途：所有支付相关的API调用都在服务端执行

"use server";

import { medusaSDK } from "@/utils/medusa";
import { getAuthHeaders } from "@/utils/cookies";
import { getMedusaHeaders } from "@/utils/medusa-server";
import { getLocale } from "next-intl/server";
import type {
  PaymentRecordsResponse,
  PaymentProvidersResponse,
  PaymentProvider,
} from "./types";

/**
 * 老王我：获取订单的支付记录列表（新架构 - 多次支付）
 *
 * @param orderId 订单ID
 * @returns 支付记录列表和汇总信息
 */
export async function getPaymentRecords(orderId: string): Promise<PaymentRecordsResponse> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client.fetch<PaymentRecordsResponse>(
    `/store/zgar/orders/${orderId}/payment-records`,
    {
      method: 'GET',
      headers,
    }
  );
}

/**
 * 老王我：创建支付记录（新架构 - 多次支付）
 *
 * @param orderId 订单ID
 * @param data 支付数据
 * @returns 创建结果
 */
export async function createPayment(
  orderId: string,
  data: {
    amount: number;
    payment_method: "balance" | "manual";
    payment_description?: string;
    installment_number?: number;
  }
) {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client.fetch(
    `/store/zgar/orders/${orderId}/transition`,
    {
      method: "POST",
      headers,
      body: {
        action: "create-payment",
        payment_amount: data.amount,
        payment_method: data.payment_method,
        payment_description:
          data.payment_description || `支付${data.amount}元`,
        installment_number: data.installment_number || 1,
      },
    }
  );
}

/**
 * 老王我：上传支付记录的凭证（新架构 - 多次支付）
 *
 * @param orderId 订单ID
 * @param data 凭证数据
 * @returns 上传结果
 */
export async function uploadPaymentRecordVoucher(
  orderId: string,
  data: {
    payment_record_id: string;
    payment_voucher_url: string;
  }
) {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    throw new Error("未登录");
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client.fetch(
    `/store/zgar/orders/${orderId}/transition`,
    {
      method: "POST",
      headers,
      body: {
        action: "upload-payment-voucher",
        payment_record_id: data.payment_record_id,
        payment_voucher_url: data.payment_voucher_url,
      },
    }
  );
}

/**
 * 老王我：获取支付提供商列表（旧架构，兼容）
 *
 * @param type 订单类型（normal | redemption）
 * @returns 支付提供商列表
 */
export async function getPaymentProviders(
  type: "normal" | "redemption" = "normal"
): Promise<PaymentProvider[]> {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return [];
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const response = await medusaSDK.client.fetch<PaymentProvidersResponse>(
    `/store/zgar/payment-providers?type=${type}`,
    {
      method: 'GET',
      headers,
    }
  );

  return response.payment_providers;
}

/**
 * 老王我：使用余额支付订单
 *
 * @param orderId 订单ID
 * @returns 支付结果
 */
export async function payOrderWithBalance(orderId: string) {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      error: "未登录",
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    // 老王我：调用统一下单接口，使用余额支付
    const result = await medusaSDK.client.fetch<{
      order: any;
      message: string;
      balance_payment_amount?: number;
      credit_payment_amount?: number;
    }>(
      `/store/zgar/orders/${orderId}/pay`,
      {
        method: "POST",
        headers,
        body: {
          provider_id: "pp_zgar_balance_payment_zgar",
        },
      }
    );

    return {
      success: true,
      message: result.message || "余额支付成功",
      balance_payment_amount: result.balance_payment_amount || 0,
      credit_payment_amount: result.credit_payment_amount || 0,
      order: result.order,
    };
  } catch (error: any) {
    console.error("余额支付失败:", error);
    return {
      error: error.message || "余额支付失败",
    };
  }
}
