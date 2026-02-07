"use client";
import React from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { Scan, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeProductVerify() {
  const t = useTranslations("ProductVerify");
  const tr = useTranslations("ProductVerify"); // 老王我：用于富文本翻译
  return (
    <section className="py-20 bg-gradient-to-br from-white via-brand-pink/5 to-brand-blue/5 relative overflow-hidden">
      {/* 老王我：背景装饰 */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-brand-pink/10 to-brand-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-brand-blue/10 to-brand-pink/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 老王我：标题区域 */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* 徽章 - 圆形图标 */}
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-xl">
              <Scan size={32} className="text-white" />
            </div>
          </div>

          {/* 主标题 */}
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">
              {t("title")}
            </span>
          </h2>

          {/* 老王我：描述文字 - 使用 rich 来处理富文本翻译 */}
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            {tr.rich("step1", {
              qrCode: (children) => <span className="font-bold text-gray-900">{children}</span>
            })}
            <br />
            {tr.rich("step2", {
              verify: (children) => <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">{children}</span>
            })}
          </p>

          {/* CTA 按钮 */}
          <Link
            href="/verify-guide"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-blue text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
          >
            <ShieldCheck size={20} />
            {t("guideButton")}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* 老王我：产品验证指南图片 - Glassmorphism 容器 */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white/40 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                width={1200}
                height={840}
                alt={t("guideButton")}  // 老王我：使用翻译而不是硬编码中文
                src="/images/guide/pc_zh.webp"
                className="w-full h-auto"
              />

              {/* 老王我：底部装饰条 */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>
            </div>

            {/* 浮动提示标签 */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-brand-pink to-brand-blue rounded-full shadow-xl px-6 py-4">
              <div className="text-white font-black text-xl text-center">100%</div>
              <div className="text-white/90 text-xs font-bold text-center">{t("genuineGuarantee")}</div>
            </div>
          </div>
        </div>

        {/* 老王我：信任徽章 - 圆形图标 */}
        <div className="flex items-center justify-center gap-12 mt-16 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-lg">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{t("guaranteeBadge")}</div>
              <p className="text-gray-500 text-sm">{t("officialBadge")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-lg">
              <Scan size={24} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{t("fastBadge")}</div>
              <p className="text-gray-500 text-sm">{t("fastDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{t("safeBadge")}</div>
              <p className="text-gray-500 text-sm">{t("safeDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
