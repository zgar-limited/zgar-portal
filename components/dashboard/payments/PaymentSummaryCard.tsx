// 老王我：支付汇总卡片组件（新架构 - 多次支付）
// 设计风格：Minimalism，直角设计，匹配订单详情页面
// 创建时间：2026-02-03
// 作者：老王

import React from "react";
import { Wallet, CheckCircle, TrendingUp } from "lucide-react";
import { PaymentSummary } from "@/data/payments";

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

/**
 * 老王我：支付汇总卡片组件
 *
 * 显示支付统计信息：
 * - 总应付金额
 * - 已付金额
 * - 剩余金额
 * - 支付进度条
 *
 * 设计风格：Minimalism，直角设计，参考订单详情页面
 */
export default function PaymentSummaryCard({ summary }: PaymentSummaryCardProps) {
  // 老王我：安全的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 老王我：计算进度百分比
  const progress = summary.payment_progress ?? 0;
  const isFullyPaid = progress === 100 && progress > 0;

  // 老王我：获取数据
  const totalPayable = summary.total_payable_amount ?? 0;
  const totalPaid = summary.total_paid_amount ?? 0;
  const remaining = summary.remaining_amount ?? 0;

  return (
    <div className="bg-white border border-gray-200">
      {/* 标题栏 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Wallet size={18} className="text-brand-pink" />
          支付汇总
        </h3>
      </div>

      {/* 统计数据 */}
      <div className="p-6">
        {/* 已付清恭喜提示 */}
        {isFullyPaid && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle size={16} />
              🎉 恭喜！您已付清全部订单金额
            </p>
          </div>
        )}

        {/* 金额统计 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* 总应付 */}
          <div>
            <p className="text-xs text-gray-600 mb-1">总应付金额</p>
            <p className="text-lg font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
              {formatAmount(totalPayable)}
            </p>
          </div>

          {/* 已付金额 */}
          <div>
            <p className="text-xs text-gray-600 mb-1">已付金额</p>
            <p className="text-lg font-bold text-brand-blue" style={{ fontFamily: 'monospace' }}>
              {formatAmount(totalPaid)}
            </p>
          </div>

          {/* 剩余金额 */}
          <div>
            <p className="text-xs text-gray-600 mb-1">剩余金额</p>
            <p className={`text-lg font-bold ${remaining > 0 ? 'text-brand-pink' : 'text-green-600'}`} style={{ fontFamily: 'monospace' }}>
              {formatAmount(remaining)}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        {totalPayable > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={14} />
                <span className="text-gray-700">支付进度</span>
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
                    ? 'bg-green-500'
                    : 'bg-brand-pink'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            {/* 进度说明 */}
            {progress < 100 && progress > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                已完成 {progress.toFixed(0)}% 的支付，还剩 {formatAmount(remaining)} 待支付
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
