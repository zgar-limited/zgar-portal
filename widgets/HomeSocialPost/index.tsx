"use client";

import PhotoProviderWrapper from "@/components/shared/PhotoProviderWrapper";
import { InstagramThree } from "@/svg/social-icons/Instagram";
import Image from "next/image";
import { PhotoView } from "react-photo-view";
import BrandArea from "@/components/brand-area/BrandArea";
import { useState } from "react";

// 老王我：Instagram图片数据，添加不同尺寸实现Masonry效果
const socialPosts = [
  {
    id: "1",
    image: "/images/slot/social/1.webp",
    alt: "Zgar social post 1",
    size: "large", // large = 2x2
  },
  {
    id: "2",
    image: "/images/slot/social/2.webp",
    alt: "Zgar social post 2",
    size: "small", // small = 1x1
  },
  {
    id: "3",
    image: "/images/slot/social/3.webp",
    alt: "Zgar social post 3",
    size: "small",
  },
  {
    id: "4",
    image: "/images/slot/social/4.webp",
    alt: "Zgar social post 4",
    size: "wide", // wide = 2x1
  },
  {
    id: "5",
    image: "/images/slot/social/5.webp",
    alt: "Zgar social post 5",
    size: "small",
  },
  {
    id: "6",
    image: "/images/slot/social/5.webp",
    alt: "Zgar social post 6",
    size: "small",
  },
  {
    id: "7",
    image: "/images/slot/social/5.webp",
    alt: "Zgar social post 7",
    size: "tall", // tall = 1x2
  },
  {
    id: "8",
    image: "/images/slot/social/5.webp",
    alt: "Zgar social post 8",
    size: "small",
  },
];

export default function InstagramPosts() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="mt-48 overflow-hidden">
      <BrandArea />

      {/* 老王我：粉蓝玻璃画廊标题 */}
      <div className="text-center mt-16 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink bg-clip-text text-transparent">
            FOLLOW US
          </span>
        </h2>
        <p className="text-gray-600 text-lg">@zgar.official</p>
      </div>

      {/* 老王我：Masonry网格布局 */}
      <div className="container mx-auto px-4 pb-16">
        <PhotoProviderWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {socialPosts.map((post) => {
              // 老王我：根据尺寸设置grid跨度
              const gridSpan = {
                small: "col-span-1 row-span-1",
                wide: "col-span-2 row-span-1",
                tall: "col-span-1 row-span-2",
                large: "col-span-2 row-span-2",
              }[post.size];

              return (
                <div
                  key={post.id}
                  className={`relative ${gridSpan} group cursor-pointer overflow-hidden rounded-2xl`}
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* 老王我：粉蓝渐变边框 - 悬停时显示 */}
                  <div
                    className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                      hoveredId === post.id ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background: "linear-gradient(135deg, #f496d3 0%, #0047c7 100%)",
                      padding: "3px",
                    }}
                  >
                    <div className="w-full h-full rounded-2xl bg-white" />
                  </div>

                  {/* 老王我：图片容器 */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <PhotoView src={post.image}>
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </PhotoView>

                    {/* 老王我：毛玻璃遮罩层 - 悬停时显示 */}
                    <div
                      className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 ${
                        hoveredId === post.id ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, rgba(244, 150, 211, 0.7) 0%, rgba(0, 71, 199, 0.7) 100%)",
                      }}
                    >
                      {/* Instagram图标 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`transition-all duration-300 ${
                            hoveredId === post.id
                              ? "scale-100 rotate-12"
                              : "scale-0 rotate-0"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            <InstagramThree className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* 文字信息 */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p
                          className={`text-white font-semibold text-lg transition-all duration-300 ${
                            hoveredId === post.id
                              ? "translate-y-0 opacity-100"
                              : "translate-y-4 opacity-0"
                          }`}
                        >
                          @zgar.official
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PhotoProviderWrapper>
      </div>
    </section>
  );
}
