"use client";

import { Sparkles, User, Award, TrendingUp, Gift, Ticket, Package } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { useTranslations } from "next-intl";

/**
 * 积分统计卡片 - 超大分屏色块
 *
 * 老王我全新设计：
 * - 左60%：粉色积分块
 * - 右40%：蓝色统计块
 * - 全屏高度
 */

interface StatsSectionProps {
  points: number;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
}

export default function StatsSection({ points, customer }: StatsSectionProps) {
  const t = useTranslations("Club");

  const userName = customer?.first_name
    ? `${customer.first_name}${customer?.last_name ? " " + customer.last_name : ""}`
    : customer?.email?.split("@")[0] || "Member";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-full max-w-7xl mx-auto" style={{ height: '45vh' }}>
      {/* 老王我：超大分屏色块 */}
      <div className="flex w-full h-full">
        {/* 左60% - 粉色积分块 */}
        <div
          className="w-3/5 h-full relative flex items-center"
          style={{ backgroundColor: '#f496d3' }}
        >
          {/* 装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-20 -left-20 w-96 h-96 opacity-10"
              style={{
                backgroundColor: 'white',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(-25deg)'
              }}
            ></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 px-16 w-full">
            {/* 用户信息 */}
            <div className="flex items-center gap-6 mb-8">
              <div
                className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ borderRadius: '4px', transform: 'rotate(-3deg)' }}
              >
                {initials ? (
                  <span className="text-white text-3xl font-black">
                    {initials}
                  </span>
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>

              <div>
                <p className="text-sm text-white/70 mb-1 font-semibold">
                  {t("welcome")}
                </p>
                <h3 className="text-2xl font-black text-white">
                  {userName}
                </h3>
              </div>

              <div
                className="ml-auto px-6 py-3 bg-white/20 backdrop-blur-sm border-2 flex items-center gap-3"
                style={{
                  borderRadius: '4px',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <Sparkles size={20} className="text-yellow-300 animate-pulse" />
                <span className="text-base font-bold text-white">
                  {t("yourBalance")}
                </span>
              </div>
            </div>

            {/* 积分数值 */}
            <div className="mb-6">
              <div
                className="text-8xl md:text-9xl font-black text-white leading-none"
                style={{ fontFamily: 'sans-serif' }}
              >
                {points.toLocaleString()}
              </div>
            </div>

            {/* 提示 */}
            <div className="flex items-center gap-4">
              <p className="text-white/90 text-2xl font-medium">
                {t("pointsAvailable")}
              </p>

              <div
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border"
                style={{
                  borderRadius: '4px',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <Award size={18} className="text-yellow-300" />
                <TrendingUp size={18} className="text-green-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 右40% - 蓝色统计块 */}
        <div
          className="w-2/5 h-full relative"
          style={{ backgroundColor: '#0047c7' }}
        >
          {/* 装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -bottom-20 -right-20 w-80 h-80 opacity-10 rounded-sm"
              style={{ backgroundColor: 'white' }}
            ></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 h-full flex flex-col justify-center px-12 gap-8">
            {/* 优惠券 */}
            <div className="flex items-center gap-6">
              <div
                className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ borderRadius: '4px', transform: 'rotate(-3deg)' }}
              >
                <Ticket size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-5xl font-black text-white mb-1">
                  0
                </div>
                <p className="text-white/80 text-base font-semibold">
                  可用优惠券
                </p>
              </div>
            </div>

            {/* 订单 */}
            <div className="flex items-center gap-6">
              <div
                className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ borderRadius: '4px', transform: 'rotate(3deg)' }}
              >
                <Package size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-5xl font-black text-white mb-1">
                  0
                </div>
                <p className="text-white/80 text-base font-semibold">
                  待处理订单
                </p>
              </div>
            </div>

            {/* 等级 */}
            <div className="flex items-center gap-6">
              <div
                className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ borderRadius: '4px', transform: 'rotate(-2deg)' }}
              >
                <Award size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-black text-white mb-1">
                  普通会员
                </div>
                <p className="text-white/80 text-sm font-semibold">
                  还需 650 积分升级
                </p>
                <div
                  className="w-full h-2 bg-white/20 rounded-sm mt-2 overflow-hidden"
                  style={{ borderRadius: '2px' }}
                >
                  <div
                    className="h-full bg-white"
                    style={{ width: '35%', borderRadius: '2px' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 签到 */}
            <button
              className="flex items-center gap-6 px-8 py-6 bg-white/10 hover:bg-white/20 transition-all duration-300"
              style={{ borderRadius: '4px' }}
            >
              <div
                className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ borderRadius: '4px', transform: 'rotate(2deg)' }}
              >
                <Gift size={32} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-2xl font-black text-white mb-1">
                  签到领积分
                </p>
                <p className="text-white/80 text-sm font-semibold">
                  每日签到 +10 积分
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
