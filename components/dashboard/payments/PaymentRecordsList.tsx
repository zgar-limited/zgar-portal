// 支付记录列表组件（新架构 - 多次支付）
// 设计风格：商务风格，直角设计，匹配订单详情页面

import React from "react";
import { Plus, Upload, Calendar, AlertCircle, CheckCircle, Wallet, CreditCard } from "lucide-react";
import { PaymentRecord, PaymentSummary } from "@/data/payments";
import { useTranslations } from "next-intl";

interface PaymentRecordsListProps {
  records: PaymentRecord[];
  summary: PaymentSummary;
  orderAuditStatus: string;
  isCompleted?: boolean;
  onCreatePayment: () => void;
  onUpdateVoucher: (recordId: string) => void;
}

/**
 * 返回支付状态标签的样式类名 - 商务风格
 */
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "approved":
      return "bg-gray-900 text-white";
    case "reviewing":
      return "bg-gray-700 text-white";
    case "rejected":
      return "bg-gray-500 text-white";
    case "pending":
    default:
      return "bg-gray-200 text-gray-900";
  }
};

/**
 * 返回支付状态的标签（使用国际化）
 */
const getStatusLabel = (status: string, t: (key: string) => string): string => {
  switch (status) {
    case "approved":
      return t("status.approved");
    case "reviewing":
      return t("status.reviewing");
    case "rejected":
      return t("status.rejected");
    case "pending":
    default:
      return t("status.pending");
  }
};

/**
 * 安全的金额格式化函数
 */
const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
};

/**
 * 支付记录列表组件
 *
 * 显示所有支付记录，包括：
 * - 创建支付按钮（条件显示）
 * - 支付记录卡片列表
 * - 每条记录显示金额、方式、状态、审核信息
 * - 上传凭证按钮（打款支付且pending状态时显示）
 *
 * 设计风格：商务风格，直角设计，参考订单详情页面
 */
export default function PaymentRecordsList({
  records,
  summary,
  orderAuditStatus,
  isCompleted = false,
  onCreatePayment,
  onUpdateVoucher,
}: PaymentRecordsListProps) {
  const t = useTranslations("PaymentRecords");

  // 判断是否可以创建支付
  const canCreatePayment = () => {
    if (orderAuditStatus !== "approved") return false;
    const remainingAmount = summary.remaining_amount ?? 0;
    if (remainingAmount <= 0) return false;
    if (isCompleted) return false;
    return true;
  };

  // 判断是否已付清全部金额
  const remainingAmount = summary.remaining_amount ?? 0;
  const isFullyPaid = remainingAmount === 0 && records.length > 0;

  return (
    <div className="bg-white border border-gray-200">
      {/* 标题栏 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Wallet size={18} className="text-gray-700" strokeWidth={2} />
            {t("title")}
          </h3>
          {records.length > 0 && (
            <span className="text-xs text-gray-500 font-medium">
              {t("totalRecords", { n: records.length })}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* 已付清全部金额时的恭喜提示 */}
        {isFullyPaid && (
          <div className="p-3 bg-gray-900">
            <p className="text-sm text-white flex items-center gap-2">
              <CheckCircle size={16} strokeWidth={2.5} />
              <span className="font-semibold">{t("fullyPaid")}</span>
            </p>
          </div>
        )}

        {/* 创建支付按钮 - 条件显示 */}
        {canCreatePayment() && (
          <button
            onClick={onCreatePayment}
            className="w-full h-11 text-sm font-semibold border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            {t("paymentButton")}
          </button>
        )}

        {/* 订单未审核时的提示 */}
        {orderAuditStatus !== "approved" && !isCompleted && (
          <div className="p-3 bg-gray-100 border border-gray-300">
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <AlertCircle size={16} strokeWidth={2} />
              <span className="font-medium">{t("needApproval")}</span>
            </p>
          </div>
        )}

        {/* 支付记录列表 */}
        {records.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 border border-gray-200 mb-4">
              <Wallet size={32} className="text-gray-400" strokeWidth={2} />
            </div>
            <p className="text-gray-900 font-semibold mb-1">{t("noRecords")}</p>
            <p className="text-sm text-gray-500">
              {canCreatePayment()
                ? t("createPaymentHint")
                : t("waitApprovalHint")}
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
                      <div className={`flex items-center justify-center w-10 h-10 border ${
                        record.payment_method === "balance"
                          ? "bg-white border-gray-300"
                          : "bg-white border-gray-300"
                      }`}>
                        {record.payment_method === "balance" ? (
                          <Wallet size={18} className="text-gray-700" strokeWidth={2} />
                        ) : (
                          <CreditCard size={18} className="text-gray-700" strokeWidth={2} />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-gray-900">
                          {record.description || t("installment", { n: record.installment_number })}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1 font-medium">
                          <span>
                            {record.payment_method === "balance"
                              ? t("balancePayment")
                              : t("bankTransfer")}
                          </span>
                          <span>•</span>
                          <span className="font-mono">#{record.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 金额 */}
                  <div className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'monospace' }}>
                    {formatAmount(record.amount)}
                  </div>
                </div>

                {/* 状态标签 */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(
                      record.payment_status
                    )}`}
                  >
                    {getStatusLabel(record.payment_status, t)}
                  </span>
                </div>

                {/* 拒绝原因提示 */}
                {record.payment_status === "rejected" && (
                  <div className="mb-3 p-3 bg-gray-200 border border-gray-300">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-gray-700 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">{t("rejectionReason")}</p>
                        <p className="text-sm text-gray-700">
                          {record.admin_remark || record.cfo_remark || t("noReason")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 创建时间 */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar size={14} strokeWidth={2} />
                  <span className="font-medium">
                    {new Date(record.created_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* 支付凭证预览 - 显示多张图片 */}
                {record.payment_voucher_urls && record.payment_voucher_urls.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">{t("paymentVoucher")}</div>
                    <div className="flex gap-2 flex-wrap">
                      {record.payment_voucher_urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <img
                            src={url}
                            alt={t("voucherNumber", { n: index + 1 })}
                            className="w-20 h-20 object-cover border-2 border-gray-200 hover:border-gray-900 transition-colors"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 修改凭证按钮 - manual 支付且状态为 pending/reviewing/rejected 时显示 */}
                {record.payment_method === "manual" &&
                  ["pending", "reviewing", "rejected"].includes(record.payment_status) && (
                    <button
                      onClick={() => onUpdateVoucher(record.id)}
                      className="text-sm font-semibold h-9 px-4 border border-gray-900 bg-white text-gray-900 hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
                    >
                      <Upload size={14} strokeWidth={2.5} className="mr-2" />
                      {record.payment_status === "rejected"
                        ? t("reuploadVoucher")
                        : (record.payment_voucher_urls && record.payment_voucher_urls.length > 0
                          ? t("updateVoucher")
                          : t("uploadVoucher"))
                      }
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
