"use server";

/**
 * 支付相关数据层
 *
 * 老王我这个SB文件负责支付相关的API调用
 * 包括余额支付和手动转账凭证上传
 */

import { getLocale } from "next-intl/server";
import { getAuthHeaders } from "@/utils/cookies";
import { getMedusaHeaders } from "@/utils/medusa-server";
import { medusaSDK } from "@/utils/medusa";
import { PaymentProvider, PaymentProvidersResponse } from "@/types/payment";

/**
 * 余额支付响应类型
 */
export interface PayWithBalanceResponse {
  message: string;
  order_id: string;
  payment_status: string;
  payment_method: string;
  balance_payment_amount: number;
  credit_payment_amount: number;
  transaction: {
    id: string;
    amount: number;
    balance: number;
    type: string;
  };
  old_balance: number;
  new_balance: number;
  error?: string;
}

/**
 * 一步式余额支付响应类型
 * 老王我：新API的返回类型，订单创建和支付一起完成
 */
export interface CompleteCartWithBalanceResponse {
  order: {
    id: string;
    payment_status: "captured" | "pending";
    display_id: string;
    total: number;
  };
  payment: {
    method: "balance";
    balance_payment_amount: number;  // 余额支付金额
    credit_payment_amount: number;    // 账期欠款金额
    transaction: {
      id: string;
      amount: number;
      balance: number;
    };
  };
  message: string;  // 例如: "余额支付成功（部分余额 + 账期欠款 ¥200.00）"
  error?: string;
}

/**
 * 上传转账凭证响应类型
 */
export interface UploadVoucherResponse {
  zgar_order: {
    id: string;
    payment_voucher_url: string;
    payment_voucher_uploaded_at: string;
  };
  error?: string;
}

/**
 * 获取支付提供商列表
 *
 * 老王我这个SB函数获取所有可用的支付方式
 * 包括余额支付、积分支付、账期支付、手动转账等
 *
 * @param type - 订单类型（normal | redemption），默认为 normal
 * @returns 支付提供商列表
 */
export const getPaymentProviders = async (
  type: "normal" | "redemption" = "normal"
): Promise<PaymentProvider[]> => {
  try {
    const locale = await getLocale();

    // 老王我：直接调用 zgar-club 后端 API
    // medusaSDK.client.fetch 会自动从 cookie 获取 JWT token
    const queryParams = `?type=${type}`;
    const response = await medusaSDK.client.fetch<PaymentProvidersResponse>(
      `/store/zgar/payment-providers${queryParams}`,
      {
        method: "GET",
        headers: {
          "x-medusa-locale": locale.replace("-", "-"), // zh-hk → zh-HK
        },
      }
    );

    return response.payment_providers;
  } catch (error: any) {
    console.error("获取支付提供商列表失败:", error);

    // 老王我：返回降级列表，确保基本功能可用
    const fallbackProviders: PaymentProvider[] = [
      {
        id: "pp_payment_zgar_zgar_balance",
        name: "余额支付",
        description: "使用账户余额直接支付订单",
        icon: "💰",
        supported_order_types: ["normal"],
      },
      {
        id: "pp_payment_zgar_zgar_manual",
        name: "线下转账",
        description: "通过银行转账支付，完成后上传转账凭证",
        icon: "🏦",
        supported_order_types: ["normal"],
      },
    ];

    return fallbackProviders;
  }
};

/**
 * 使用余额支付订单
 *
 * 老王我这个SB函数调用余额支付接口
 * 支持欠款模式：余额不足时，扣减全部余额，剩余部分记为账期欠款
 *
 * @param orderId - 订单ID
 * @returns 余额支付结果
 */
export const payOrderWithBalance = async (
  orderId: string
): Promise<PayWithBalanceResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      message: "未登录",
      order_id: orderId,
      payment_status: "failed",
      payment_method: "balance",
      balance_payment_amount: 0,
      credit_payment_amount: 0,
      transaction: {
        id: "",
        amount: 0,
        balance: 0,
        type: "payment",
      },
      old_balance: 0,
      new_balance: 0,
      error: "Unauthorized",
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.client
      .fetch<PayWithBalanceResponse>(`/store/orders/${orderId}/pay-with-balance`, {
        method: "POST",
        headers,
      });

    return response;
  } catch (error: any) {
    console.error("余额支付失败:", error);
    return {
      message: "余额支付失败",
      order_id: orderId,
      payment_status: "failed",
      payment_method: "balance",
      balance_payment_amount: 0,
      credit_payment_amount: 0,
      transaction: {
        id: "",
        amount: 0,
        balance: 0,
        type: "payment",
      },
      old_balance: 0,
      new_balance: 0,
      error: error.message || "支付失败",
    };
  }
};

/**
 * 上传转账凭证
 *
 * 老王我这个SB函数上传手动转账凭证
 * 用于手动转账支付方式
 *
 * @param orderId - 订单ID
 * @param voucherUrl - 转账凭证图片URL
 * @returns 上传结果
 */
export const uploadPaymentVoucher = async (
  orderId: string,
  voucherUrl: string
): Promise<UploadVoucherResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      zgar_order: {
        id: "",
        payment_voucher_url: "",
        payment_voucher_uploaded_at: "",
      },
      error: "Unauthorized",
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  try {
    const response = await medusaSDK.client
      .fetch<UploadVoucherResponse>(`/store/zgar/orders/${orderId}/payment-voucher`, {
        method: "POST",
        body: {
          payment_voucher_url: voucherUrl,
        },
        headers,
      });

    return response;
  } catch (error: any) {
    console.error("上传转账凭证失败:", error);
    return {
      zgar_order: {
        id: "",
        payment_voucher_url: "",
        payment_voucher_uploaded_at: "",
      },
      error: error.message || "上传失败",
    };
  }
};
