"use client";

import { User, Shield, Gift } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 积分奖励区
 *
 * 老王我全新设计 - 3步骤引导：
 * 1. 标题："Let's kick things off for you!"
 * 2. 3个横向卡片（圆形渐变图标 + 文字描述）
 * 3. CTA按钮："Start now"
 */

interface Step {
  id: number;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    icon: <User size={32} />,
  },
  {
    id: 2,
    icon: <Shield size={32} />,
  },
  {
    id: 3,
    icon: <Gift size={32} />,
  },
];

export default function KickOffRewards() {
  const t = useTranslations("Club");
  return (
    <section
      className="
        relative
        w-full
        py-24
        px-6
        bg-white
      "
    >
      {/* 内容容器 - 最大宽度1280px，居中 */}
      <div className="max-w-7xl mx-auto">
        {/* 区域标题 */}
        <div
          className="
            text-center
            mb-16
          "
        >
          <h2
            className="
              text-4xl
              md:text-5xl
              font-black
              text-gray-900
              mb-4
              tracking-tight
            "
          >
            {t("kickOffTitle")}
          </h2>
        </div>

        {/* 3步骤卡片 - 横向排列 */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
            mb-16
          "
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="
                group
                flex
                flex-col
                items-center
                text-center
                p-6
              "
            >
              {/* 圆形渐变图标 */}
              <div
                className="
                  mb-6
                  w-20
                  h-20
                  rounded-full
                  bg-gradient-to-br
                  from-purple-500
                  to-pink-500
                  flex
                  items-center
                  justify-center
                  text-white
                  border-4
                  border-white
                  shadow-lg
                  group-hover:scale-110
                  group-hover:shadow-xl
                  transition-all
                  duration-300
                "
              >
                {step.icon}
              </div>

              {/* 步骤文字 */}
              <p
                className="
                  text-lg
                  text-gray-700
                  leading-relaxed
                  font-medium
                "
              >
                {t(`step${step.id}Title`)}
              </p>

              {/* 步骤编号（可选装饰） */}
              <div
                className="
                  mt-4
                  text-6xl
                  font-black
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-br
                  from-purple-200
                  to-pink-200
                  opacity-30
                "
              >
                0{step.id}
              </div>
            </div>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="flex justify-center">
          <button
            className="
              group
              inline-flex
              items-center
              justify-center
              px-12
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-purple-500
              to-pink-500
              text-white
              font-bold
              text-xl
              hover:shadow-2xl
              hover:shadow-purple-500/40
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Start now
          </button>
        </div>
      </div>
    </section>
  );
}
