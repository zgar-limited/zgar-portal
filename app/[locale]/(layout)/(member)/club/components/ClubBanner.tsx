"use client";

import { useTranslations } from "next-intl";

/**
 * Zgar Club 全屏 Hero Banner
 *
 * 老王我全新设计：
 * 1. 占满屏幕宽度（100%）
 * 2. 巨大的视觉冲击力
 * 3. 动态背景效果
 * 4. 现代化排版
 */

export default function ClubBanner() {
  const t = useTranslations("Club");
  return (
    <div
      className="
        relative
        w-full
        h-[500px]
        overflow-hidden
        bg-[#000000]
      "
    >
      {/* 动态背景 */}
      <div className="absolute inset-0">
        {/* 渐变背景 */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-brand-pink/20
            via-brand-blue/20
            to-brand-pink/10
          "
        />

        {/* 流动光球 */}
        <div
          className="
            absolute
            top-0
            left-1/4
            w-[600px]
            h-[600px]
            bg-brand-pink/30
            rounded-full
            blur-[120px]
            animate-pulse
          "
        />
        <div
          className="
            absolute
            bottom-0
            right-1/4
            w-[500px]
            h-[500px]
            bg-brand-blue/30
            rounded-full
            blur-[100px]
            animate-pulse
          "
          style={{ animationDelay: '1s' }}
        />

        {/* 网格纹理 */}
        <div
          className="
            absolute
            inset-0
            opacity-10
            bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
                    linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
            bg-[size:50px_50px]
          "
        />
      </div>

      {/* 内容 */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >
        {/* 标签 */}
        <div
          className="
            mb-8
            px-6
            py-2.5
            rounded-full
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-white/80
              tracking-wider
              uppercase
            "
          >
            {t("membersOnly")}
          </span>
        </div>

        {/* 主标题 */}
        <h1
          className="
            text-7xl
            md:text-8xl
            font-black
            text-white
            mb-6
            tracking-tight
            leading-none
          "
        >
          {t("title")}
        </h1>

        {/* 副标题 */}
        <p
          className="
            text-xl
            md:text-2xl
            text-white/60
            max-w-2xl
            mb-10
          "
        >
          {t("subtitle")}
        </p>

        {/* CTA按钮 */}
        <button
          className="
            px-8
            py-4
            rounded-xl
            bg-gradient-to-r
            from-brand-pink
            to-brand-blue
            text-white
            font-bold
            text-lg
            hover:opacity-90
            transition-opacity
            shadow-2xl
            shadow-brand-pink/30
          "
        >
          {t("redeemNow")}
        </button>
      </div>

      {/* 底部波浪装饰 */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
        "
      >
        <svg
          className="w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 64L60 58.7C120 53.3 240 42.7 360 37.3C480 32 600 32 720 34.7C840 37.3 960 42.7 1080 45.3C1200 48 1320 48 1380 48L1440 48V64H1380C1320 64 1200 64 1080 64C960 64 840 64 720 64C600 64 480 64 360 64C240 64 120 64 60 64H0Z"
            fill="#000000"
          />
        </svg>
      </div>
    </div>
  );
}
