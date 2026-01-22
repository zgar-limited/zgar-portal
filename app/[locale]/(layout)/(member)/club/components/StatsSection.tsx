"use client";

import { Sparkles, User, Award, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { HttpTypes } from "@medusajs/types";

/**
 * 积分统计卡片
 *
 * 老王我全新设计 - 动效丰富版：
 * 1. 动态粒子背景
 * 2. 浮动动画
 * 3. 鼠标悬停互动
 * 4. 多层渐变叠加
 * 5. 视觉层次丰富
 */

interface StatsSectionProps {
  points: number;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
}

export default function StatsSection({ points, customer }: StatsSectionProps) {
  const t = useTranslations("Club");

  // 老王我：获取用户名
  const userName = customer?.first_name
    ? `${customer.first_name}${customer?.last_name ? " " + customer.last_name : ""}`
    : customer?.email?.split("@")[0] || "Member";

  // 老王我：生成用户头像首字母
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 老王我：添加动画状态
  const [isHovered, setIsHovered] = useState(false);
  const [pulseValue, setPulseValue] = useState(0);

  // 老王我：脉冲动画
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseValue((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* 积分卡片 - 动效丰富版 */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 主卡片 */}
        <div
          className={`
            relative
            overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-brand-pink
            via-brand-pink/95
            to-brand-blue
            p-6
            md:p-10
            transition-all
            duration-500
            ${isHovered ? "scale-[1.02] shadow-2xl shadow-brand-pink/40" : "shadow-xl shadow-brand-pink/20"}
          `}
        >
          {/* 动态背景装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            {/* 流动光晕 1 */}
            <div
              className={`
                absolute
                -top-32
                -right-32
                w-96
                h-96
                bg-gradient-to-br
                from-purple-400/30
                to-pink-400/20
                rounded-full
                blur-3xl
                transition-transform
                duration-700
                ${isHovered ? "scale-110" : "scale-100"}
              `}
            />

            {/* 流动光晕 2 */}
            <div
              className={`
                absolute
                -bottom-32
                -left-32
                w-96
                h-96
                bg-gradient-to-tr
                from-blue-400/30
                to-cyan-400/20
                rounded-full
                blur-3xl
                transition-transform
                duration-700
                delay-100
                ${isHovered ? "scale-110" : "scale-100"}
              `}
            />

            {/* 浮动粒子 */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute
                    w-2
                    h-2
                    bg-white/40
                    rounded-full
                    animate-float
                    shadow-lg
                    shadow-white/50
                  `}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + (i % 2)}s`,
                  }}
                />
              ))}
            </div>

            {/* 网格纹理 */}
            <div
              className="
                absolute
                inset-0
                opacity-10
                bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]
                bg-[size:40px_40px]
              "
            />
          </div>

          {/* 内容 */}
          <div className="relative z-10">
            {/* 用户信息 + 积分标签 */}
            <div className="flex items-start justify-between gap-4 mb-8">
              {/* 用户头像和名字 */}
              <div className="flex items-center gap-4">
                {/* 头像 - 带脉冲效果 */}
                <div className="relative">
                  {/* 脉冲环 */}
                  <div
                    className={`
                      absolute
                      inset-0
                      rounded-2xl
                      bg-white/30
                      animate-ping
                      opacity-75
                      ${pulseValue === 0 ? "duration-1000" : "hidden"}
                    `}
                  />
                  <div
                    className={`
                      absolute
                      inset-0
                      rounded-2xl
                      bg-white/20
                      transition-all
                      duration-300
                      ${isHovered ? "scale-110" : "scale-100"}
                    `}
                  />

                  {/* 头像主体 */}
                  <div
                    className={`
                      relative
                      w-16
                      h-16
                      md:w-20
                      md:h-20
                      rounded-2xl
                      bg-gradient-to-br
                      from-white/30
                      to-white/10
                      backdrop-blur-md
                      flex
                      items-center
                      justify-center
                      border-2
                      border-white/40
                      shadow-xl
                      transition-all
                      duration-300
                      ${isHovered ? "scale-110 rotate-3" : "scale-100 rotate-0"}
                    `}
                  >
                    {initials ? (
                      <span className="text-white text-2xl md:text-3xl font-black">
                        {initials}
                      </span>
                    ) : (
                      <User size={32} className="text-white" />
                    )}
                  </div>
                </div>

                {/* 用户名 */}
                <div>
                  <p
                    className="
                      text-xs
                      md:text-sm
                      text-white/70
                      mb-1
                      font-medium
                    "
                  >
                    {t("welcome")}
                  </p>
                  <h3
                    className="
                      text-xl
                      md:text-2xl
                      font-black
                      text-white
                      tracking-tight
                    "
                  >
                    {userName}
                  </h3>
                </div>
              </div>

              {/* 积分标签 - 带图标 */}
              <div
                className={`
                  shrink-0
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white/20
                  backdrop-blur-md
                  border
                  border-white/40
                  flex
                  items-center
                  gap-2
                  transition-all
                  duration-300
                  ${isHovered ? "scale-105" : "scale-100"}
                `}
              >
                <Sparkles
                  size={18}
                  className="text-yellow-300 animate-pulse"
                />
                <span
                  className="
                    text-sm
                    font-bold
                    text-white
                    whitespace-nowrap
                  "
                >
                  {t("yourBalance")}
                </span>
              </div>
            </div>

            {/* 积分数值 - 带阴影和动效 */}
            <div className="mb-3 relative">
              {/* 背景装饰 */}
              <div
                className="
                  absolute
                  -left-4
                  -top-2
                  w-full
                  h-full
                  bg-white/10
                  blur-xl
                  rounded-lg
                "
              />

              <div
                className={`
                  relative
                  transition-all
                  duration-300
                  ${isHovered ? "scale-105" : "scale-100"}
                `}
              >
                <div
                  className="
                    text-6xl
                    md:text-7xl
                    font-black
                    text-white
                    tracking-tight
                    leading-none
                    drop-shadow-2xl
                  "
                >
                  {points.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 提示文字 + 装饰 */}
            <div className="flex items-center gap-3">
              <p className="text-white/90 text-base md:text-lg font-medium">
                {t("pointsAvailable")}
              </p>

              {/* 装饰图标 */}
              <div
                className={`
                  flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-white/10
                  backdrop-blur-sm
                  border
                  border-white/20
                  transition-all
                  duration-300
                  ${isHovered ? "opacity-100 translate-x-1" : "opacity-70"}
                `}
              >
                <Award size={14} className="text-yellow-300" />
                <TrendingUp size={14} className="text-green-300" />
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线条 */}
        <div
          className={`
            absolute
            -bottom-1
            left-1/2
            -translate-x-1/2
            w-32
            h-1
            bg-gradient-to-r
            from-transparent
            via-white/50
            to-transparent
            rounded-full
            transition-all
            duration-500
            ${isHovered ? "w-48" : "w-32"}
          `}
        />
      </div>
    </div>
  );
}
