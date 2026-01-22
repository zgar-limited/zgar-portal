"use client";
import { LeftArrowIcon, RightArrowIcon } from "@/svg";

import Image from "next/image";
import { Link } from '@/i18n/routing';

// Import Swiper components and modules
import { project_swiper_params } from "@/constants/swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoPlayer from "@/components/video-player/VideoPlayer";
import GradientText from "@/components/gradient-text/GradientText";
import TextUnderline from "@/components/text-underline/TextUnderline";

// 老王我：产品视频数据
const productVideos = [
  {
    id: 1,
    title: "一次性电子烟使用指南",
    category: "产品教程",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 2,
    title: "换弹系列快速上手",
    category: "产品教程",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 3,
    title: "烟油口味推荐",
    category: "使用技巧",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 4,
    title: "产品配件安装教程",
    category: "使用技巧",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
  {
    id: 5,
    title: "限量版产品介绍",
    category: "产品展示",
    videoUrl: "https://cdn.shopify.com/videos/c/o/v/a83ad0e9827442c7b0ea3d9032916e33.mp4",
    link: "/products",
  },
];

const HomeVideo = () => {
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
            精彩视频教程
            <span className="absolute bottom-[-0.5rem] left-1/2 transform -translate-x-1/2">
              <TextUnderline />
            </span>
          </h2>
        </GradientText>
        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          观看产品使用教程，快速掌握使用技巧
        </p>
      </div>

      <div className="text-center it-project-slider-wrap">
        <Swiper className="it-project-active " {...project_swiper_params}>
          {productVideos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="rounded-3xl overflow-hidden relative group">
                <VideoPlayer videoUrl={video.videoUrl} />
                {/* 老王我：粉蓝渐变遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/80 via-brand-blue/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 rounded-3xl">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {/* 老王我：分类标签 */}
                    <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                      <span className="text-white text-sm font-semibold">{video.category}</span>
                    </div>
                    {/* 老王我：标题 */}
                    <h4 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                      <Link className="text-white hover:text-brand-pink transition-colors duration-300" href={video.link}>
                        {video.title}
                      </Link>
                    </h4>
                    {/* 老王我：观看按钮 */}
                    <Link
                      href={video.link}
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-brand-blue rounded-full font-semibold hover:bg-brand-pink hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100"
                    >
                      立即观看
                      <RightArrowIcon width="14" height="14" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-16 it-project-arrow">
          <button className="it-project-prev">
            <span>
              <LeftArrowIcon
                width="14"
                height="14"
                viewBox="0 0 14 14"
                strokeWidth={2}
                pathValue="M13 7H1M1 7L7 1M1 7L7 13"
              />
            </span>
          </button>
          <button className="it-project-next">
            <span>
              <RightArrowIcon
                width="14"
                height="14"
                viewBox="0 0 14 14"
                strokeWidth={2}
                pathValue="M1 7H13M13 7L7 1M13 7L7 13"
              />
            </span>
          </button>
        </div>
        <div className=" it-project-dots"></div>
      </div>
    </section>
  );
};

export default HomeVideo;
