"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 会员轮播 Banner
 *
 * 老王我全新设计 - 左右分屏布局：
 * 1. 左侧40%：深蓝背景 + 文字内容
 * 2. 右侧60%：亮蓝背景 + 3D插图
 * 3. 底部圆点分页器
 * 4. 自动播放 + 手动切换
 */

interface BannerSlide {
  id: number;
}

const slides: BannerSlide[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

export default function HeroCarousel() {
  const t = useTranslations("Club");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 老王我：获取当前slide的翻译内容
  const currentSlide = {
    id: slides[currentIndex].id,
    title: t(`slide${slides[currentIndex].id}Title`),
    subtitle: t(`slide${slides[currentIndex].id}Subtitle`),
    primaryCta: t(`slide${slides[currentIndex].id}PrimaryCta`),
    secondaryCta: t(`slide${slides[currentIndex].id}SecondaryCta`),
  };

  // 老王我：自动轮播 - 5秒切换
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // 老王我：手动切换
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="
        relative
        w-screen
        h-[540px]
        overflow-hidden
        left-0
        right-0
      "
    >
      {/* 轮播内容容器 */}
      <div
        className="relative h-full"
        style={{
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* 左右分屏布局 */}
        <div className="flex w-full h-full">
          {/* 左侧 40% - 深蓝背景 + 文字内容 */}
          <div
            className="
              w-2/5
              bg-[#0F172A]
              relative
              flex
              items-center
              px-8
              md:px-16
              lg:px-20
            "
          >
            {/* 背景装饰 - 径向渐变增加深度 */}
            <div
              className="
                absolute
                inset-0
                bg-radial-gradient
                opacity-50
              "
              style={{
                background:
                  "radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 1) 100%)",
              }}
            />

            {/* 文字内容 */}
            <div className="relative z-10 w-full">
              {/* 主标题 */}
              <h1
                className="
                  text-3xl
                  md:text-4xl
                  lg:text-5xl
                  font-bold
                  text-white
                  mb-4
                  leading-tight
                  animate-fade-in
                "
              >
                {currentSlide.title}
              </h1>

              {/* 副标题 */}
              <p
                className="
                  text-lg
                  md:text-xl
                  text-white/90
                  mb-8
                  leading-relaxed
                "
              >
                {currentSlide.subtitle}
              </p>

              {/* CTA 按钮组 */}
              <div className="flex flex-wrap gap-4">
                {/* 主按钮 - 粉紫渐变 */}
                <button
                  className="
                    group
                    px-6
                    md:px-8
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-pink-500
                    to-indigo-500
                    text-white
                    font-semibold
                    text-base
                    md:text-lg
                    hover:shadow-2xl
                    hover:shadow-pink-500/30
                    hover:scale-105
                    transition-all
                    duration-300
                  "
                >
                  {currentSlide.primaryCta}
                </button>

                {/* 次按钮 - 白色背景 + 蓝色边框 */}
                <button
                  className="
                    group
                    px-6
                    md:px-8
                    py-3
                    rounded-2xl
                    bg-white
                    text-[#0F172A]
                    font-semibold
                    text-base
                    md:text-lg
                    border-2
                    border-indigo-500
                    hover:shadow-2xl
                    hover:shadow-indigo-500/20
                    hover:scale-105
                    transition-all
                    duration-300
                  "
                >
                  {currentSlide.secondaryCta}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧 60% - 亮蓝背景 + 3D插图 */}
          <div
            className="
              w-3/5
              bg-[#1E40AF]
              relative
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >
            {/* 背景装饰 - 中心亮径向渐变 */}
            <div
              className="
                absolute
                inset-0
                bg-radial-gradient
                opacity-60
              "
              style={{
                background:
                  "radial-gradient(circle at center, rgba(30, 64, 175, 0.8) 0%, rgba(30, 64, 175, 1) 100%)",
              }}
            />

            {/* 3D插图占位区 - 老王我用CSS搞个炫酷的3D效果 */}
            <div className="relative z-10">
              {/* 礼物盒主体 */}
              <div className="relative">
                {/* 礼物盒主体 - 3D效果 */}
                <div
                  className="
                    w-64
                    h-64
                    md:w-80
                    md:h-80
                    bg-gradient-to-br
                    from-pink-400
                    to-pink-600
                    rounded-3xl
                    shadow-2xl
                    shadow-pink-500/50
                    transform
                    hover:scale-110
                    hover:rotate-3
                    transition-transform
                    duration-500
                    animate-float
                  "
                />

                {/* 丝带 - 垂直 */}
                <div
                  className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-16
                    h-full
                    bg-gradient-to-b
                    from-yellow-300
                    to-yellow-500
                  "
                />

                {/* 丝带 - 水平 */}
                <div
                  className="
                    absolute
                    top-1/2
                    left-0
                    -translate-y-1/2
                    w-full
                    h-16
                    bg-gradient-to-r
                    from-yellow-300
                    to-yellow-500
                  "
                />

                {/* 蝴蝶结 */}
                <div
                  className="
                    absolute
                    -top-12
                    left-1/2
                    -translate-x-1/2
                    w-24
                    h-24
                    bg-gradient-to-br
                    from-yellow-300
                    to-yellow-500
                    rounded-full
                    shadow-xl
                    animate-pulse
                  "
                />

                {/* 金币装饰 */}
                <div
                  className="
                    absolute
                    -right-12
                    top-12
                    w-16
                    h-16
                    bg-gradient-to-br
                    from-yellow-300
                    to-yellow-500
                    rounded-full
                    shadow-lg
                    animate-bounce
                  "
                />
                <div
                  className="
                    absolute
                    -left-8
                    bottom-20
                    w-12
                    h-12
                    bg-gradient-to-br
                    from-yellow-300
                    to-yellow-500
                    rounded-full
                    shadow-lg
                    animate-bounce
                  "
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部圆点分页器 */}
      <div
        className="
          absolute
          bottom-10
          left-1/2
          -translate-x-1/2
          z-20
          flex
          gap-3
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              h-2
              w-2
              rounded-full
              transition-all
              duration-300
              cursor-pointer
              ${
                index === currentIndex
                  ? "bg-[#6366F1] w-8"
                  : "bg-white border-2 border-[#6366F1] hover:w-3 hover:h-3"
              }
              hover:shadow-lg
              hover:shadow-indigo-500/30
            `}
            aria-label={t("goToSlide", { number: index + 1 })}
          />
        ))}
      </div>
    </div>
  );
}
