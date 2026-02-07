"use client";
import BreathingImage from "@/components/breathing-image/BreathingImage";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';


type Props = {};

const HomeAboutUs = (props: Props) => {
  const t = useTranslations('HomeAboutUs');

  // 老王我：品牌数据
  const brandStats = [
    { id: 1, value: "2018", label: t('founded'), icon: "🎯" },
    { id: 2, value: "500+", label: t('products'), icon: "⚡" },
    { id: 3, value: "50+", label: t('countries'), icon: "🌍" },
    { id: 4, value: "1M+", label: t('users'), icon: "👥" },  // 老王我：把中文"100万+"改成"1M+"
  ];
  return (
    <section className="relative mt-20 overflow-hidden">
      {/* 老王我：斜切蓝粉背景标题区 */}
      <div className="relative h-[280px] lg:h-[320px] overflow-hidden">
        {/* 斜切背景容器 */}
        <div className="absolute inset-0 flex">
          {/* 蓝色左半边 */}
          <div className="w-1/2 h-full bg-brand-blue origin-bottom" style={{
            transform: 'skewY(-4deg) translateY(5%)',
          }}></div>

          {/* 粉色右半边 */}
          <div className="w-1/2 h-full bg-brand-pink origin-bottom" style={{
            transform: 'skewY(-4deg) translateY(5%)',
          }}></div>
        </div>

        {/* 标题内容 - 反向倾斜保持直立 */}
        <div className="relative z-10 h-full flex items-center justify-center" style={{
          transform: 'skewY(4deg)',
        }}>
          <div className="text-center">
            <h2 className="font-black text-5xl md:text-7xl text-white tracking-tight">
              {t('title')}
            </h2>
            <p className="mt-4 text-white/90 text-lg md:text-xl font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>
      </div>

      {/* 老王我：内容区域 */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：图片 */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={"/images/slot/social/1.webp"}
                alt={t('title')}
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              {/* 粉蓝渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/20 via-brand-blue/10 to-transparent"></div>
            </div>

            {/* 装饰性小图片 */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src={"/images/slot/social/2.webp"}
                alt={t('altProductShowcase')}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 右侧：内容 */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('brandStory')}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('brandStoryDesc')}
                {t('commitmentDesc')}
              </p>
            </div>

            {/* 数据网格 */}
            <div className="grid grid-cols-2 gap-4">
              {brandStats.map((stat) => (
                <div
                  key={stat.id}
                  className="p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA 按钮 */}
            <Link
              href="/about-us"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-blue text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <span className="text-lg">{t('learnMore')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* 老王我：浮动产品图片装饰 */}
      <BreathingImage
        animation={{ duration: 2 }}
        className="absolute top-[15%] left-[5%] w-[20%] max-w-[300px] opacity-40"
        src={"/images/production/transparent/A-1.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 1.5 }}
        className="absolute top-[20%] right-[8%] w-[18%] max-w-[280px] opacity-40"
        src={"/images/production/transparent/Nex_2_0003.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 2.5 }}
        className="absolute bottom-[10%] right-[3%] w-[22%] max-w-[320px] opacity-40"
        src={"/images/production/transparent/zenith_10_0003.webp"}
        width={100}
        height={100}
        alt="production"
      />
      <BreathingImage
        animation={{ duration: 1.8 }}
        className="absolute bottom-[15%] left-[3%] w-[20%] max-w-[300px] opacity-40"
        src={"/images/production/transparent/PULSE_4000_9_0009.webp"}
        width={100}
        height={100}
        alt="production"
      />
    </section>
  );
};

export default HomeAboutUs;
