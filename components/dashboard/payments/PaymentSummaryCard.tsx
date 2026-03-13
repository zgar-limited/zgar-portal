// 支付汇总卡片组件（新架构 - 多次支付）
// 设计风格：Tesla极简风格
// 参考：订单详情页面
//
// 显示支付统计信息：
// - 总应付金额
// - 已付金额
// - 剩余金额
// - 支付进度条
//
// 淡化区域设计：
// - 移除背景色和边框
// - 用留白和间距代替
// - 更简洁的布局
// - 无卡片样式

import React from "react";
import { PaymentSummary } from "@/data/payments";
import { useTranslations } from "next-intl";

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

// 格式化金额
const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
};

/**
 * 支付汇总卡片组件
 *
 * 显示支付统计信息：
 * - 总应付金额
 * - 已付金额
 * - 剩余金额
 * - 支付进度条
 *
 * 设计风格：Tesla极简风格
 */
export default function PaymentSummaryCard({ summary }: PaymentSummaryCardProps) {
  const t = useTranslations("PaymentSummary");

  // 计算进度百分比
  const progress = summary.payment_progress ?? 0;
  const isFullyPaid = progress >= 100 && (summary.remaining_amount ?? 0) <= 0;

  // 获取数据
  const totalPayable = summary.total_payable_amount ?? 0;
  const totalPaid = summary.total_paid_amount ?? 0;
  const remaining = summary.remaining_amount ?? 0;

  // 审核中金额提示
  const reviewingAmount = summary.reviewing_amount ?? 0;
  // 拒绝金额警告
  const rejectedAmount = summary.rejected_amount ?? 0;

  return (
    <div className="py-8 mb-6 relative overflow-hidden">
      {/* 已支付全款水印 - 手绘风格印章 */}
      {isFullyPaid && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative">
            {/* 印章主体 - 手绘不规则效果 */}
            <div className="relative w-32 h-32 flex items-center justify-center rotate-[-8deg]">
              {/* 手绘风格圆圈 - 使用多个略微错位的边框模拟 */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 外圈 - 手绘不规则路径 */}
                <path
                  d="M50 5 C75 5, 92 20, 95 50 C98 75, 80 95, 50 95 C25 95, 5 80, 5 50 C5 25, 22 8, 50 5"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="2 4"
                  fill="none"
                  opacity="0.7"
                />
                {/* 内圈 - 手绘路径 */}
                <path
                  d="M50 18 C68 18, 82 32, 82 50 C82 68, 68 82, 50 82 C32 82, 18 68, 18 50 C18 32, 34 18, 50 18"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
                {/* 手绘勾选 */}
                <path
                  d="M30 52 L44 66 L72 38"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>

              {/* 手绘文字 - PAID */}
              <div className="relative z-10 mt-16">
                <span
                  className="text-lg font-bold text-green-600 tracking-widest"
                  style={{
                    fontFamily: "Comic Sans MS, cursive, sans-serif",
                    transform: "rotate(3deg)",
                    textShadow: "1px 1px 0 rgba(34, 197, 94, 0.3)",
                  }}
                >
                  PAID
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 标题 */}
      <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">{t("title")}</h2>

      {/* 统计数据 - 淡化 */}
      <div className="grid grid-cols-3 gap-6 py-4">
        {/* 总应付 */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("totalPayable")}</p>
          <p className="text-xl font-light text-gray-900 tracking-tight">
            {formatAmount(totalPayable)}
          </p>
        </div>

        {/* 已付金额 */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("totalPaid")}</p>
          <div className="flex items-baseline">
            <p className="text-xl font-light text-gray-900 tracking-tight">
              {formatAmount(totalPaid)}
            </p>
            {reviewingAmount > 0 && (
              <p className="text-xs text-gray-400 font-medium mt-1">
                {t("reviewingAmount", { amount: formatAmount(reviewingAmount) })}
              </p>
            )}
          </div>
        </div>

        {/* 勿检查剩余金额 */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t("remaining")}</p>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {formatAmount(remaining)}
          </p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">
            {progress.toFixed(0)}%
          </span>
          <div className="w-full bg-gray-100 h-1 overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
