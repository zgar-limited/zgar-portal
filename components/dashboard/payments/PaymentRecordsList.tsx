// 老王我：支付记录列表组件（新架构 - 多次支付）
// 设计风格：Minimalism，直角设计，匹配订单详情页面
// 创建时间：2026-02-03
// 作者：老王

import React from "react";
import { Plus, Upload, Calendar, AlertCircle, CheckCircle, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentRecord, PaymentSummary } from "@/data/payments";

interface PaymentRecordsListProps {
  records: PaymentRecord[];
  summary: PaymentSummary;
  orderAuditStatus: string;
  isCompleted?: boolean;
  onCreatePayment: () => void;
  onUpdateVoucher: (recordId: string) => void;  // 老王注：改名（2026-02-05）
}

/**
 * 老王我：返回支付状态标签的样式类名
 */
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border border-green-200";
    case "reviewing":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 border border-red-200";
    case "pending":
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

/**
 * 老王我：返回支付状态的中文标签
 */
const getStatusLabel = (status: string): string => {
  switch (status) {
    case "approved":
      return "已批准";
    case "reviewing":
      return "审核中";
    case "rejected":
      return "已拒绝";
    case "pending":
    default:
      return "待处理";
  }
};

/**
 * 老王我：安全的金额格式化函数
 */
const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
};

/**
 * 老王我：支付记录列表组件
 *
 * 显示所有支付记录，包括：
 * - 创建支付按钮（条件显示）
 * - 支付记录卡片列表
 * - 每条记录显示金额、方式、状态、审核信息
 * - 上传凭证按钮（打款支付且pending状态时显示）
 *
 * 设计风格：Minimalism，直角设计，参考订单详情页面
 */
export default function PaymentRecordsList({
  records,
  summary,
  orderAuditStatus,
  isCompleted = false,
  onCreatePayment,
  onUpdateVoucher,
}: PaymentRecordsListProps) {
  // 老王我：判断是否可以创建支付
  const canCreatePayment = () => {
    if (orderAuditStatus !== "approved") return false;
    const remainingAmount = summary.remaining_amount ?? 0;
    if (remainingAmount <= 0) return false;
    if (isCompleted) return false;
    return true;
  };

  // 老王我：判断是否已付清全部金额
  const remainingAmount = summary.remaining_amount ?? 0;
  const isFullyPaid = remainingAmount === 0 && records.length > 0;

  return (
    <div className="bg-white border border-gray-200">
      {/* 标题栏 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Wallet size={18} className="text-brand-pink" />
            支付记录
          </h3>
          {records.length > 0 && (
            <span className="text-xs text-gray-500">
              共 {records.length} 条
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* 老王我：已付清全部金额时的恭喜提示 */}
        {isFullyPaid && (
          <div className="p-3 bg-green-50 border border-green-200">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle size={16} />
              🎉 恭喜！您已付清全部订单金额
            </p>
          </div>
        )}

        {/* 老王我：创建支付按钮 - 条件显示 */}
        {canCreatePayment() && (
          <Button
            variant="outline"
            className="w-full h-11 text-sm font-semibold"
            onClick={onCreatePayment}
          >
            <Plus size={16} className="mr-2" />
            付款
          </Button>
        )}

        {/* 老王我：订单未审核时的提示 */}
        {orderAuditStatus !== "approved" && !isCompleted && (
          <div className="p-3 bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <AlertCircle size={16} />
              ⚠️ 订单需要审核通过后才能创建支付
            </p>
          </div>
        )}

        {/* 老王我：支付记录列表 */}
        {records.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
              <Wallet size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">暂无支付记录</p>
            <p className="text-sm text-gray-500">
              {canCreatePayment()
                ? "点击上方按钮创建支付"
                : "订单审核通过后即可创建支付"}
            </p>
          </div>
        ) : (
          /* 支付记录列表 */
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="p-5 bg-gray-50 border border-gray-200"
              >
                {/* 支付基本信息 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* 支付方式图标 */}
                      <div className={`flex items-center justify-center w-10 h-10 ${
                        record.payment_method === "balance"
                          ? "bg-brand-pink/10"
                          : "bg-brand-blue/10"
                      }`}>
                        {record.payment_method === "balance" ? (
                          <Wallet size={18} className="text-brand-pink" />
                        ) : (
                          <CreditCard size={18} className="text-brand-blue" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-gray-900">
                          {record.description || `第${record.installment_number}期付款`}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <span>
                            {record.payment_method === "balance"
                              ? "余额支付"
                              : "银行转账"}
                          </span>
                          <span>•</span>
                          <span className="font-mono">#{record.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 金额 */}
                  <div className="text-xl font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
                    {formatAmount(record.amount)}
                  </div>
                </div>

                {/* 状态标签 */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg ${getStatusBadgeClass(
                      record.payment_status
                    )}`}
                  >
                    {getStatusLabel(record.payment_status)}
                  </span>
                </div>

                {/* 创建时间 */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar size={14} />
                  <span>
                    {new Date(record.created_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* 老王我：修改凭证按钮 - 仅打款支付且状态为 pending 或 reviewing 时显示（2026-02-05） */}
                {record.payment_method === "manual" &&
                  ["pending", "reviewing"].includes(record.payment_status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateVoucher(record.id)}
                      className="text-sm font-medium h-9 px-4"
                    >
                      <Upload size={14} className="mr-2" />
                      {record.payment_voucher_urls && record.payment_voucher_urls.length > 0
                        ? "修改凭证"
                        : "上传凭证"}
                    </Button>
                  )}

                {/* 老王我：审核信息 - 如果已审核 */}
                {(record.admin_audit_amount || record.cfo_audit_amount) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-bold text-gray-900 mb-3">
                      审核信息
                    </div>
                    <div className="space-y-2">
                      {record.admin_audit_amount && (
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Admin 审核</span>
                          <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
                            {formatAmount(record.admin_audit_amount)}
                          </span>
                        </div>
                      )}
                      {record.cfo_audit_amount && (
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">CFO 审核</span>
                          <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
                            {formatAmount(record.cfo_audit_amount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
