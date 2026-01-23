"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 会员轮播 Banner - 超大分屏色块
 *
 * 老王我全新设计 - 大胆分屏：
 * - 左50%：粉色块
 * - 右50%：蓝色块
 * - 全屏高度
 * - 超大色块对比
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
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = {
    id: slides[currentIndex].id,
    title: t(`slide${slides[currentIndex].id}Title`),
    subtitle: t(`slide${slides[currentIndex].id}Subtitle`),
    primaryCta: t(`slide${slides[currentIndex].id}PrimaryCta`),
    secondaryCta: t(`slide${slides[currentIndex].id}SecondaryCta`),
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden" style={{ height: '50vh' }}>
      {/* 老王我：超大分屏色块 */}
      <div className="flex w-full h-full">
        {/* 左50% - 粉色块 */}
        <div
          className="w-1/2 h-full relative flex items-center justify-center"
          style={{ backgroundColor: '#f496d3' }}
        >
          {/* 装饰文字 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div
              className="text-white font-black"
              style={{ fontSize: 'clamp(200px, 30vw, 400px)', lineHeight: 1 }}
            >
              0{slides[currentIndex].id}
            </div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 text-center px-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/20 backdrop-blur-sm border-2"
              style={{
                borderRadius: '4px',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <Sparkles size={16} className="text-yellow-300 animate-pulse" />
              <span className="text-sm font-black text-white">ZGAR CLUB</span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: 'sans-serif' }}
            >
              {currentSlide.title}
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
              {currentSlide.subtitle}
            </p>

            <button
              onClick={() => router.push('/login')}
              className="group px-10 py-5 bg-white text-gray-900 font-black text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-3"
              style={{ borderRadius: '4px' }}
            >
              {currentSlide.primaryCta}
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* 右50% - 蓝色块 */}
        <div
          className="w-1/2 h-full relative flex items-center justify-center"
          style={{ backgroundColor: '#0047c7' }}
        >
          {/* 装饰圆形 */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/4 right-1/4 w-96 h-96 opacity-10 rounded-sm"
              style={{ backgroundColor: 'white' }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/4 w-64 h-64 opacity-10"
              style={{
                backgroundColor: 'white',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(-25deg)'
              }}
            ></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 text-center px-12">
            <div className="mb-12">
              <div
                className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
                style={{ borderRadius: '4px', transform: 'rotate(-3deg)' }}
              >
                <div className="text-6xl">👑</div>
              </div>
              <h2 className="text-4xl font-black text-white mb-4">
                会员专享权益
              </h2>
              <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                加入ZGAR Club，享受积分奖励、专属优惠、生日福利等超多会员权益
              </p>
            </div>

            <button
              onClick={() => router.push('/register')}
              className="px-10 py-5 bg-transparent text-white font-black text-lg border-2 hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-3"
              style={{
                borderRadius: '4px',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {currentSlide.secondaryCta}
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 底部圆点分页器 */}
      <div className="absolute bottom-12 left-0 right-0 z-20">
        <div className="flex items-center justify-center gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="transition-all duration-300 hover:scale-110"
              style={{
                width: currentIndex === index ? '48px' : '16px',
                height: '16px',
                backgroundColor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
