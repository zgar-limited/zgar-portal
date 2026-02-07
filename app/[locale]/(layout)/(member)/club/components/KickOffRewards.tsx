"use client";

import { User, Shield, Gift, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 积分奖励区 - 超大分屏色块
 *
 * 老王我全新设计：
 * - 3分屏横向排列
 * - 第1屏：粉色
 * - 第2屏：蓝色
 * - 第3屏：粉色
 * - 全屏高度
 */

interface Step {
  id: number;
  icon: React.ReactNode;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: <User size={48} />,
    color: '#f496d3',
  },
  {
    id: 2,
    icon: <Shield size={48} />,
    color: '#0047c7',
  },
  {
    id: 3,
    icon: <Gift size={48} />,
    color: '#f496d3',
  },
];

export default function KickOffRewards() {
  const t = useTranslations("Club");
  return (
    <section className="relative w-full max-w-7xl mx-auto" style={{ height: '70vh' }}>
      {/* 老王我：3分屏横向排列 */}
      <div className="flex w-full h-full">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex-1 h-full relative flex flex-col items-center justify-center px-8"
            style={{ backgroundColor: step.color }}
          >
            {/* 序号 */}
            <div
              className="absolute top-8 left-8 w-16 h-16 flex items-center justify-center text-3xl font-black"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white'
              }}
            >
              0{step.id}
            </div>

            {/* 图标 */}
            <div
              className="w-32 h-32 bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8"
              style={{ borderRadius: '4px', transform: 'rotate(-3deg)' }}
            >
              <div className="text-white">{step.icon}</div>
            </div>

            {/* 标题 */}
            <h3 className="text-3xl font-black text-white mb-4 text-center">
              {t(`kickOffStep${step.id}Title`)}
            </h3>

            {/* 描述 */}
            <p className="text-white/90 text-lg text-center leading-relaxed max-w-sm">
              {t(`kickOffStep${step.id}Desc`)}
            </p>
          </div>
        ))}
      </div>

      {/* 老王我：底部CTA条 */}
      <div className="absolute bottom-0 left-0 right-0">
        <div
          className="px-12 py-8 flex items-center justify-between"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <div>
            <h4 className="text-3xl font-black text-white mb-2">
              {t("kickOffTitle")}
            </h4>
            <p className="text-gray-400">{t("kickOffDesc")}</p>
          </div>

          <button
            className="group px-12 py-5 text-white font-black text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
              borderRadius: '4px'
            }}
          >
            {t("startNow")}
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
