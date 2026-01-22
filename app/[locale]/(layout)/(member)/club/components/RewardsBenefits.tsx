"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 会员价值展示区
 *
 * 老王我全新设计 - 左图右文布局：
 * 1. 全宽居中标题
 * 2. 左右两列布局（50%-50%）
 * 3. 左列：深色背景 + 3D插图
 * 4. 右列：浅色背景 + 描述文字 + CTA按钮
 */

export default function RewardsBenefits() {
  const t = useTranslations("Club");
  return (
    <section
      className="
        relative
        w-full
        bg-white
      "
    >
      {/* 内容容器 - 最大宽度1280px，居中 */}
      <div className="max-w-7xl mx-auto">
        {/* 区域标题 - 全宽居中 */}
        <div
          className="
            text-center
            py-20
            px-6
          "
        >
          <h2
            className="
              text-4xl
              md:text-5xl
              font-black
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-brand-pink
              to-brand-blue
              mb-4
              tracking-tight
            "
          >
            {t("rewardsSectionTitle")}
          </h2>
        </div>

        {/* 两列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左列 - 深色背景 + 图片 */}
          <div
            className="
              relative
              min-h-[500px]
              bg-[#0A0E27]
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >
            {/* 背景装饰 - 渐变光晕 */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-brand-pink/20
                to-brand-blue/20
                opacity-50
              "
            />

            {/* 3D插图占位区 - 老王我用CSS搞个炫酷的占位效果 */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* 占位图标/插图区域 */}
              <div
                className="
                  relative
                  w-64
                  h-64
                  md:w-80
                  md:h-80
                  rounded-full
                  bg-gradient-to-br
                  from-brand-pink/30
                  to-brand-blue/30
                  flex
                  items-center
                  justify-center
                  animate-float
                "
              >
                {/* 内圈 */}
                <div
                  className="
                    w-48
                    h-48
                    md:w-60
                    md:h-60
                    rounded-full
                    bg-gradient-to-br
                    from-brand-pink/40
                    to-brand-blue/40
                    flex
                    items-center
                    justify-center
                  "
                >
                  {/* 核心圆 */}
                  <div
                    className="
                      w-32
                      h-32
                      md:w-40
                      md:h-40
                      rounded-full
                      bg-gradient-to-br
                      from-brand-pink
                      to-brand-blue
                      flex
                      items-center
                      justify-center
                      shadow-2xl
                      shadow-brand-pink/50
                    "
                  >
                    {/* 金币图标 */}
                    <div className="text-white text-center">
                      <div className="text-6xl md:text-7xl font-black">G</div>
                      <div className="text-xs md:text-sm font-bold tracking-wider">
                        POINTS
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部装饰文字 */}
              <div className="mt-8 text-white/80 text-center">
                <p className="text-lg font-semibold">{t("earnRedeem")}</p>
                <p className="text-sm opacity-70">{t("loyaltyRewards")}</p>
              </div>
            </div>
          </div>

          {/* 右列 - 浅灰色背景 + 文字内容 */}
          <div
            className="
              relative
              min-h-[500px]
              bg-[#F5F5F7]
              flex
              flex-col
              items-center
              justify-center
              px-8
              md:px-16
              py-16
            "
          >
            {/* 内容 */}
            <div className="max-w-md">
              {/* 标题徽章 */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  mb-6
                  px-4
                  py-2
                  rounded-full
                  bg-brand-gradient
                  text-white
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                "
              >
                <span>✨</span>
                {t("memberBenefits")}
              </div>

              {/* 主标题 */}
              <h3
                className="
                  text-3xl
                  md:text-4xl
                  font-black
                  text-gray-900
                  mb-6
                  leading-tight
                "
              >
                {t("startEarningTitle")}
              </h3>

              {/* 描述文字 */}
              <p
                className="
                  text-lg
                  text-gray-600
                  mb-8
                  leading-relaxed
                "
              >
                {t("startEarningDesc")}
              </p>

              {/* 亮点列表 */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-pink flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    {t("dailyCheckIn")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    {t("completeTasks")}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    {t("productAuthRewards")}
                  </p>
                </div>
              </div>

              {/* CTA 按钮 */}
              <button
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-brand-pink
                  to-brand-blue
                  text-white
                  font-bold
                  text-lg
                  hover:shadow-2xl
                  hover:shadow-brand-pink/40
                  hover:scale-105
                  transition-all
                  duration-300
                  w-full
                  md:w-auto
                "
              >
                {t("startNow")}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* 底部提示 */}
              <p className="mt-6 text-sm text-gray-500 text-center">
                {t("joinBonusPoints")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
