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
