"use client";

import { Trophy, ShoppingBag, TrendingUp, Calendar } from "lucide-react";

/**
 * 统计数据卡片组件
 *
 * 老王我这个SB组件展示会员的统计数据
 * 使用精美的卡片设计和渐变图标
 */

interface StatsCardsProps {
  totalPoints?: number;
  totalRedemptions?: number;
  currentTier?: string;
  memberSince?: string;
}

export default function StatsCards({
  totalPoints = 0,
  totalRedemptions = 0,
  currentTier = "普通会员",
  memberSince = "2025",
}: StatsCardsProps) {
  const stats = [
    {
      icon: Trophy,
      value: totalPoints.toLocaleString(),
      label: "累计积分",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: ShoppingBag,
      value: totalRedemptions.toString(),
      label: "兑换次数",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: TrendingUp,
      value: currentTier,
      label: "会员等级",
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Calendar,
      value: memberSince,
      label: "加入时间",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`
              rounded-xl p-4
              ${stat.bgColor}
              border border-gray-200 dark:border-white/10
              hover:shadow-md transition-all duration-300
            `}
          >
            <div className="flex items-center gap-3">
              {/* 图标 */}
              <div
                className={`
                  w-10 h-10 rounded-lg
                  bg-gradient-to-br ${stat.color}
                  flex items-center justify-center
                  flex-shrink-0
                  shadow-md
                `}
              >
                <Icon size={20} className="text-white" />
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-black dark:text-white truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
