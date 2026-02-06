"use client";

import { ArrowRight, Sparkles, User, Shield, Gift, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Zgar Club 会员价值展示区 - 超大分屏色块
 *
 * 老王我全新设计：
 * - 上一半：白色块（60%）
 * - 下一半：黑色块（40%）
 * - 全屏宽度
 * - 超大视觉冲击
 */

export default function RewardsBenefits() {
  const t = useTranslations("Club");
  return (
    <>
      {/* 老王我：上60% - 白色块 */}
      <section className="relative w-full max-w-7xl mx-auto px-6" style={{ height: '60vh', backgroundColor: 'white' }}>
        <div className="h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* 左列 - 文字 */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 mb-6"
                style={{
                  backgroundColor: '#f496d3',
                  borderRadius: '4px'
                }}
              >
                <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                <span className="text-sm font-black text-white">MEMBER BENEFITS</span>
              </div>

              <h2
                className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: 'sans-serif' }}
              >
                {t("rewardsSectionTitle")}
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("startEarningDesc")}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: '#f496d3', borderRadius: '4px' }}
                  >
                    <User className="text-white" size={24} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{t("dailyCheckIn")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: '#0047c7', borderRadius: '4px' }}
                  >
                    <Shield className="text-white" size={24} />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{t("completeTasks")}</p>
                </div>
              </div>
            </div>

            {/* 右列 - 图标 */}
            <div className="flex justify-center">
              <div
                className="w-64 h-64 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
                  borderRadius: '4px',
                  transform: 'rotate(-3deg)'
                }}
              >
                <div className="text-center">
                  <div className="text-8xl">💎</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 老王我：下40% - 黑色块 */}
      <section className="relative w-full max-w-7xl mx-auto px-6" style={{ height: '40vh', backgroundColor: '#0a0a0a' }}>
        <div className="h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* 左列 - 图标 */}
            <div className="flex justify-center">
              <div
                className="w-64 h-64 flex items-center justify-center"
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '4px',
                  border: '3px solid #f496d3'
                }}
              >
                <div className="text-center">
                  <div className="text-8xl">🎁</div>
                </div>
              </div>
            </div>

            {/* 右列 - 文字 + CTA */}
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {t("loyaltyRewards")}
              </h3>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {t("productAuthRewards")}
              </p>

              <button
                className="group px-10 py-5 text-white font-black text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
                  borderRadius: '4px'
                }}
              >
                {t("startNow")}
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-6 text-sm text-gray-500">
                {t("joinBonusPoints")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
