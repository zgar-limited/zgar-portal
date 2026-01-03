"use client";

import { Crown, Sparkles } from "lucide-react";

/**
 * Zgar Club 顶部 Banner 组件
 *
 * 老王我这个SB组件创建精美的顶部 Banner
 * 使用渐变背景和装饰元素
 */

export default function ClubBanner() {
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
      {/* 背景装饰圆圈 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 左侧：文字内容 */}
          <div className="flex-1 text-center md:text-left">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
              <Crown size={16} className="text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">
                会员专享
              </span>
            </div>

            {/* 主标题 */}
            <h1
              className="
                text-4xl md:text-5xl font-bold
                bg-gradient-to-r from-white via-yellow-100 to-yellow-200
                bg-clip-text text-transparent
                mb-3
              "
            >
              Zgar Club
            </h1>

            {/* 副标题 */}
            <p className="text-lg text-gray-300 mb-4">
              积分兑换 · 专属权益 · 会员特权
            </p>

            {/* 描述 */}
            <p className="text-sm text-gray-400 max-w-lg">
              加入 Zgar Club 会员，享受积分奖励、专属优惠、生日礼品等众多特权
            </p>
          </div>

          {/* 右侧：装饰图标 */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* 皇冠图标 */}
              <div
                className="
                  w-24 h-24 md:w-32 md:h-32 rounded-full
                  bg-gradient-to-br from-yellow-400 to-orange-500
                  flex items-center justify-center
                  shadow-2xl
                  animate-pulse
                "
              >
                <Crown size={48} className="text-white md:hidden" />
                <Crown size={64} className="text-white hidden md:block" />
              </div>

              {/* 装饰星星 */}
              <div className="absolute -top-2 -right-2">
                <Sparkles
                  size={20}
                  className="text-yellow-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
              <div className="absolute top-1/2 -left-4">
                <Sparkles
                  size={16}
                  className="text-yellow-300 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <div className="absolute -bottom-2 right-1/4">
                <Sparkles
                  size={18}
                  className="text-yellow-400 animate-bounce"
                  style={{ animationDelay: "0.8s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部渐变条 */}
      <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
    </div>
  );
}
