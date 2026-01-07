/**
 * 支付相关类型定义
 *
 * 老王我这个SB文件定义所有支付相关的类型
 * 包括支付提供商、支付方式、支付会话等
 */

import { LucideIconName } from "lucide-react";

/**
 * 订单类型
 *
 * 老王我：区分普通订单和积分兑换订单
 */
export type OrderType = "normal" | "redemption";

/**
 * 支付提供商类型
 *
 * 老王我：这个类型对应后端的 Payment Provider
 * 每个提供商代表一种支付方式
 */
export interface PaymentProvider {
  /** 支付提供商唯一标识符（如：pp_payment_zgar_zgar_balance） */
  id: string;

  /** 支付方式显示名称 */
  name: string;

  /** 支付方式描述 */
  description: string;

  /** 图标（Emoji 字符串） */
  icon: string;

  /** 支持的订单类型 */
  supported_order_types: OrderType[];
}

/**
 * 支付提供商列表响应类型
 */
export interface PaymentProvidersResponse {
  /** 支付提供商列表 */
  payment_providers: PaymentProvider[];
}

/**
 * 支付提供商查询参数
 */
export interface PaymentProvidersQuery {
  /** 订单类型过滤 */
  type?: OrderType;
}

/**
 * 支付方式选择上下文类型
 *
 * 老王我：用于传递支付方式相关的上下文信息
 */
export interface PaymentMethodContext {
  /** 选中的支付提供商 ID */
  provider_id: string;

  /** 订单金额 */
  order_amount: number;

  /** 用户信息 */
  customer?: {
    id?: string;
    email?: string;
    /** zgar 扩展字段 */
    zgar_customer?: {
      balance?: number;
      credit_limit?: number;
      points?: number;
    };
  } | null;
}

/**
 * 支付结果类型
 */
export interface PaymentResult {
  /** 支付是否成功 */
  success: boolean;

  /** 支付后的订单 ID */
  order_id?: string;

  /** 支付状态 */
  payment_status?: "captured" | "pending" | "failed";

  /** 错误信息 */
  error?: string;

  /** 支付详情 */
  payment_details?: {
    method: string;
    amount: number;
    transaction_id?: string;
  };
}

/**
 * 余额支付详情
 */
export interface BalancePaymentDetails {
  method: "balance";
  balance_payment_amount: number;  // 余额支付金额
  credit_payment_amount: number;    // 账期欠款金额
  transaction: {
    id: string;
    amount: number;
    balance: number;
  };
}

/**
 * 积分支付详情
 */
export interface PointsPaymentDetails {
  method: "points";
  points_used: number;             // 使用的积分数量
  points_payment_amount: number;   // 积分抵扣金额（通常为0）
  credit_payment_amount: number;   // 账期欠款金额
  transaction?: {
    id: string;
    points: number;
    balance: number;
  };
}

/**
 * 手动转账详情
 */
export interface ManualTransferDetails {
  method: "manual_transfer";
  payment_voucher_url?: string;    // 转账凭证URL
  payment_voucher_uploaded_at?: string;  // 上传时间
}
