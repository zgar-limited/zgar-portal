// 老王我：计算支付审核状态工具函数
// 创建时间：2026-02-05
// 作者：老王
//
// 功能：基于 PaymentRecord 状态计算支付审核状态显示
// 用途：前端实时显示审核状态，替代 ZgarOrder.payment_audit_status 字段

/**
 * 支付审核状态类型（用于前端显示）
 */
export type PaymentAuditStatusDisplay =
  | "not_uploaded"    // 未上传凭证（无支付记录）
  | "pending_upload"  // 待上传凭证（有 pending 状态的记录）
  | "reviewing"      // 审核中（有 reviewing 状态的记录）
  | "approved"       // 审核通过（有 approved 状态的记录）
  | "rejected";      // 审核拒绝（只有 rejected 状态，无 approved）

/**
 * 老王我：计算支付审核状态（用于前端显示）
 */
export function calculatePaymentAuditStatus(
  paymentRecords: Array<{ payment_status: string }>
): {
  label: string;
  variant: string;
  status: PaymentAuditStatusDisplay;
} {
  if (!paymentRecords || paymentRecords.length === 0) {
    return {
      label: "未上传凭证",
      variant: "bg-gray-100 text-gray-800 border border-gray-200",
      status: "not_uploaded",
    };
  }

  const hasPending = paymentRecords.some((r) => r.payment_status === "pending");
  const hasReviewing = paymentRecords.some((r) => r.payment_status === "reviewing");
  const hasApproved = paymentRecords.some((r) => r.payment_status === "approved");
  const hasRejected = paymentRecords.some((r) => r.payment_status === "rejected");

  // 优先级：approved > rejected > reviewing > pending
  if (hasApproved) {
    return {
      label: "审核通过",
      variant: "bg-green-100 text-green-800 border border-green-200",
      status: "approved",
    };
  }

  if (hasRejected && !hasApproved) {
    return {
      label: "审核拒绝",
      variant: "bg-red-100 text-red-800 border border-red-200",
      status: "rejected",
    };
  }

  if (hasReviewing) {
    return {
      label: "审核中",
      variant: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      status: "reviewing",
    };
  }

  if (hasPending) {
    return {
      label: "待上传凭证",
      variant: "bg-gray-100 text-gray-800 border border-gray-200",
      status: "pending_upload",
    };
  }

  return {
    label: "未上传凭证",
    variant: "bg-gray-100 text-gray-800 border border-gray-200",
    status: "not_uploaded",
  };
}
