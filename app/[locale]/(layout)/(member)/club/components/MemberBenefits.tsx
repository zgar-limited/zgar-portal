"use client";

import { Crown, Gift, Star, Percent, HeadphonesIcon, Truck } from "lucide-react";

/**
 * 会员权益展示组件
 *
 * 老王我这个SB组件展示会员专享权益
 * 使用精美的卡片设计和渐变背景
 */

export default function MemberBenefits() {
  const benefits = [
    {
      icon: Star,
      title: "积分奖励",
      description: "购物累积积分，兑换精美礼品",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: Gift,
      title: "生日礼品",
      description: "会员专享生日礼包",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      icon: Percent,
      title: "专属优惠",
      description: "会员限时折扣活动",
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Truck,
      title: "免费配送",
      description: "满额免费配送到家",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: HeadphonesIcon,
      title: "专属客服",
      description: "优先客服支持服务",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: Crown,
      title: "等级特权",
      description: "会员等级提升奖励",
      color: "from-amber-400 to-yellow-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <Crown size={24} className="text-yellow-500 fill-yellow-500" />
        <h2 className="text-xl font-bold text-black dark:text-white">
          会员专享权益
        </h2>
      </div>

      {/* 权益卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className={`
                rounded-xl p-5
                ${benefit.bgColor}
                border border-gray-200 dark:border-white/10
                hover:shadow-lg transition-all duration-300
                group
                relative overflow-hidden
              `}
            >
              {/* 背景装饰圆圈 */}
              <div
                className={`
                  absolute -right-8 -top-8 w-24 h-24 rounded-full
                  bg-gradient-to-br ${benefit.color}
                  opacity-10 group-hover:opacity-20 transition-opacity
                `}
              />

              <div className="relative">
                {/* 图标 */}
                <div
                  className={`
                    w-12 h-12 rounded-xl
                    bg-gradient-to-br ${benefit.color}
                    flex items-center justify-center
                    mb-3
                    shadow-md
                  `}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* 标题 */}
                <h3 className="font-semibold text-black dark:text-white text-base mb-1.5">
                  {benefit.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
