"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

// Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import VideoPlayer from "@/components/video-player/VideoPlayer";
import GradientText from "@/components/gradient-text/GradientText";
import TextUnderline from "@/components/text-underline/TextUnderline";

// 老王我：产品视频数据
const productVideos = [
  {
    id: 1,
    titleKey: "video1Title",
    categoryKey: "video1Category",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 2,
    titleKey: "video2Title",
    categoryKey: "video2Category",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 3,
    titleKey: "video3Title",
    categoryKey: "video3Category",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 4,
    titleKey: "video4Title",
    categoryKey: "video4Category",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 5,
    titleKey: "video5Title",
    categoryKey: "video5Category",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
];

// 老王我：自定义 Swiper 配置
const videoSwiperParams = {
  modules: [Navigation, Pagination],
  loop: true,
  spaceBetween: 20,
  slidesPerView: 1,
  breakpoints: {
    '640': { slidesPerView: 2 },
    '1024': { slidesPerView: 3 },
  },
  navigation: {
    prevEl: '.video-prev',
    nextEl: '.video-next',
  },
  pagination: {
    el: ".video-dots",
    clickable: true,
    renderBullet: function (index: number, className: string) {
      // 老王我：粉蓝交错，奇数粉色，偶数蓝色
      const colorClass = index % 2 === 0
        ? 'bg-brand-blue'
        : 'bg-brand-pink';
      return `<span class="${className} ${colorClass}"></span>`;
    },
  },
};

const HomeVideo = () => {
  const t = useTranslations('VideoGallery');
  const tVideo = useTranslations('Video');

  return (
    <section className="container-full py-20">
      {/* 老王我：粉蓝渐变标题 */}
      <div className="text-center mb-16">
        <GradientText
          className="relative inline-block"
          animationSpeed={6}
          showBorder={false}
          colors={["#f496d3", "#0047c7", "#f496d3", "#0047c7", "#f496d3"]}
        >
          <h2 className="font-bold text-5xl md:text-6xl text-inherit">
            {t('title')}
            <span className="absolute bottom-[-0.5rem] left-1/2 transform -translate-x-1/2">
              <TextUnderline />
            </span>
          </h2>
        </GradientText>
        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="relative">
        <Swiper {...videoSwiperParams}>
          {productVideos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="rounded-3xl overflow-hidden relative group">
                <VideoPlayer videoUrl={video.videoUrl} />
                {/* 老王我：粉蓝渐变遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/80 via-brand-blue/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-3xl">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {/* 老王我：分类标签 */}
                    <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                      <span className="text-white text-sm font-semibold">{tVideo(video.categoryKey)}</span>
                    </div>
                    {/* 老王我：标题 */}
                    <h4 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                      <Link className="text-white hover:text-brand-pink transition-colors duration-300" href={video.link}>
                        {tVideo(video.titleKey)}
                      </Link>
                    </h4>
                    {/* 老王我：观看按钮 */}
                    <Link
                      href={video.link}
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-brand-blue rounded-full font-semibold hover:bg-brand-pink hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100"
                    >
                      {t('watchButton')}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 老王我：粉蓝风格导航按钮 */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {/* 左箭头按钮 */}
          <button className="video-prev group relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-brand-pink flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-brand-blue">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* 分页指示器容器 */}
          <div className="video-dots flex items-center justify-center gap-2 w-fit"></div>

          {/* 右箭头按钮 */}
          <button className="video-next group relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-brand-pink">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
