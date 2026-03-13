// 支付汇总卡片组件（新架构 - 多次支付）
// 设计风格：商务风格，直角设计，匹配订单详情页面

import React from "react";
import { Wallet, CheckCircle, TrendingUp } from "lucide-react";
import { PaymentSummary } from "@/data/payments";
import { useTranslations } from "next-intl";

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

/**
 * 支付汇总卡片组件
 *
 * 显示支付统计信息：
 * - 总应付金额
 * - 已付金额
 * - 剩余金额
 * - 支付进度条
 *
 * 设计风格：商务风格，直角设计，参考订单详情页面
 */
export default function PaymentSummaryCard({ summary }: PaymentSummaryCardProps) {
  const t = useTranslations("PaymentSummary");

  // 安全的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 计算进度百分比
  const progress = summary.payment_progress ?? 0;
  const isFullyPaid = progress === 100 && progress > 0;

  // 获取数据
  const totalPayable = summary.total_payable_amount ?? 0;
  const totalPaid = summary.total_paid_amount ?? 0;
  const remaining = summary.remaining_amount ?? 0;

  return (
    <div className="bg-white border border-gray-200">
      {/* 标题栏 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Wallet size={18} className="text-gray-700" strokeWidth={2} />
          {t("title")}
        </h3>
      </div>

      {/* 统计数据 */}
      <div className="p-6">
        {/* 审核中金额提示 */}
        {summary.reviewing_amount > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span className="font-semibold">{t("reviewingNote", { amount: formatAmount(summary.reviewing_amount) })}</span>
            </p>
          </div>
        )}

        {/* 未通过审核金额警告提示 */}
        {summary.rejected_amount > 0 && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300">
            <p className="text-sm text-gray-900 flex items-center gap-2">
              <span className="font-semibold">{t("rejectedNote", { amount: formatAmount(summary.rejected_amount) })}</span>
            </p>
          </div>
        )}

        {/* 已付清恭喜提示 */}
        {isFullyPaid && (
          <div className="mb-4 p-3 bg-gray-900">
            <p className="text-sm text-white flex items-center gap-2">
              <CheckCircle size={16} strokeWidth={2.5} />
              <span className="font-semibold">{t("fullyPaid")}</span>
            </p>
          </div>
        )}

        {/* 金额统计 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* 总应付 */}
          <div>
            <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">{t("totalPayable")}</p>
            <p className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'monospace' }}>
              {formatAmount(totalPayable)}
            </p>
          </div>

          {/* 已付金额 */}
          <div>
            <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">{t("totalPaid")}</p>
            <div className="flex flex-col">
              <p className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'monospace' }}>
                {formatAmount(totalPaid)}
              </p>
              {summary.reviewing_amount > 0 && (
                <p className="text-xs text-gray-500 font-medium">
                  {t("reviewingAmount", { amount: formatAmount(summary.reviewing_amount) })}
                </p>
              )}
            </div>
          </div>

          {/* 剩余金额 */}
          <div>
            <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">{t("remaining")}</p>
            <p className={`text-lg font-bold tracking-tight ${remaining > 0 ? 'text-gray-900' : 'text-gray-700'}`} style={{ fontFamily: 'monospace' }}>
              {formatAmount(remaining)}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        {totalPayable > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={14} strokeWidth={2} />
                <span className="text-gray-700 font-medium">{t("paymentProgress")}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {progress.toFixed(0)}%
              </span>
            </div>

            {/* 进度条 */}
            <div className="w-full h-2 bg-gray-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  progress >= 100
                    ? 'bg-gray-900'
                    : 'bg-gray-700'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* 进度说明 */}
            {progress < 100 && progress > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {t("progressDescription", { n: progress.toFixed(0), amount: formatAmount(remaining) })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
