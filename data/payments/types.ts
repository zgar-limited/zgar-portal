// 老王我：支付模块类型定义
// 创建时间：2026-02-02
// 作者：老王

/**
 * 支付记录类型（新架构 - 多次支付）
 */
export interface PaymentRecord {
  id: string;
  order_id: string;
  amount: number;
  payment_method: "balance" | "manual";
  payment_status: "pending" | "reviewing" | "approved" | "rejected";
  description: string;
  installment_number: number;
  payment_voucher_url: string | null;
  voucher_uploaded_at: string | null;
  admin_audit_amount: number | null;
  cfo_audit_amount: number | null;
  admin_audited_at: string | null;
  cfo_audited_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 支付汇总类型（新架构 - 多次支付）
 */
export interface PaymentSummary {
  total_payable_amount: number | null;
  total_paid_amount: number | null;
  remaining_amount: number | null;
  payment_progress: number | null; // 0-100
  status_counts: {
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  method_counts: {
    balance: number;
    manual: number;
  };
}

/**
 * 获取支付记录的响应类型（新架构）
 */
export interface PaymentRecordsResponse {
  order_id: string;
  payment_records: PaymentRecord[];
  summary: PaymentSummary;
  status_counts: {
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
  };
  method_counts: {
    balance: number;
    manual: number;
  };
}

/**
 * 创建支付请求类型
 */
export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  payment_method: "balance" | "manual";
  payment_description?: string;
  payment_voucher_urls?: string[]; // 老王我：支持多张凭证
  installment_number?: number;
}

/**
 * 上传支付凭证请求类型
 */
export interface UploadPaymentVoucherInput {
  orderId: string;
  payment_record_id: string;
  payment_voucher_url: string;
}

/**
 * 支付提供商类型（旧架构，兼容）
 */
export interface PaymentProvider {
  id: string;
  name: string;
  description: string;
  icon?: string;
  supported_order_types?: ("normal" | "redemption")[];
}

/**
 * 支付提供商列表响应（旧架构，兼容）
 */
export interface PaymentProvidersResponse {
  payment_providers: PaymentProvider[];
}

/**
 * 老王我添加：余额支付完成响应类型
 * 用于 completeCartWithBalance 函数
 */
export interface CompleteCartWithBalanceResponse {
  order: any;
  redemption: {
    points_payment: number;
    points_value: number;
    old_points: number;
    new_points: number;
  };
}
