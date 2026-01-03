"use client";

import { Star, Crown, TrendingUp } from "lucide-react";

/**
 * 积分余额卡片组件
 *
 * 老王我这个SB组件展示用户的积分余额
 * 使用精美的渐变背景和装饰元素
 */

interface PointsBalanceCardProps {
  points: number;
  memberTier?: string;
  nextTier?: string;
  tierProgress?: number;
}

export default function PointsBalanceCard({
  points,
  memberTier = "普通会员",
  nextTier,
  tierProgress = 0,
}: PointsBalanceCardProps) {
  return (
    <div
      className="
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        dark:from-gray-800 dark:via-gray-700 dark:to-gray-900
        relative
        shadow-2xl
      "
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 左侧：积分信息 */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <p className="text-sm text-gray-300">可用积分</p>
            </div>

            {/* 积分数值 */}
            <div className="flex items-baseline justify-center md:justify-start gap-1 mb-3">
              <p
                className="
                  text-4xl sm:text-5xl md:text-6xl font-bold
                  bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100
                  bg-clip-text text-transparent
                "
              >
                {points.toLocaleString()}
              </p>
            </div>

            {/* 会员等级 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Crown size={14} className="text-yellow-500" />
              <span className="text-sm font-medium text-white">
                {memberTier}
              </span>
            </div>
          </div>

          {/* 右侧：升级进度 */}
          {nextTier && (
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-purple-400" />
                  <p className="text-xs text-gray-300">
                    距离 {nextTier} 还差
                  </p>
                </div>

                {/* 进度条 */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 text-right">
                  {tierProgress}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部渐变条 */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
    </div>
  );
}
