// 老王我：Banner轮播组件
// 创建时间：2026-02-08
// 说明：从 Strapi 获取 Banner 数据，使用 Swiper 展示轮播图

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { fetchBanners } from "@/data/banners";
import { StrapiBanner } from "@/data/banners/types";
import { getStrapiMedia } from "@/utils/strapi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface BannerSliderProps {
  page?: "care" | "home" | "blog";
  limit?: number;
  autoplay?: boolean;
  className?: string;
}

export function BannerSlider({
  page = "home",
  limit = 5,
  autoplay = true,
  className = "",
}: BannerSliderProps) {
  const [banners, setBanners] = useState<StrapiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // 老王我：获取 Banner 数据
  useEffect(() => {
    async function loadBanners() {
      try {
        setLoading(true);
        const data = await fetchBanners({ page, limit });
        setBanners(data);
      } catch (error) {
        console.error("老王我：加载Banner失败", error);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, [page, limit]);

  // 老王我：加载中占位
  if (loading) {
    return (
      <div className={`w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          加载中...
        </div>
      </div>
    );
  }

  // 老王我：没有数据
  if (banners.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={
          autoplay
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={banners.length > 1}
        className="w-full rounded-lg overflow-hidden"
        style={{
          "--swiper-pagination-color": "#000",
          "--swiper-pagination-bullet-inactive-color": "#999",
          "--swiper-pagination-bullet-size": "8px",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        } as React.CSSProperties}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <BannerItem banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// 老王我：单个Banner项 - 支持多图轮播
function BannerItem({ banner }: { banner: StrapiBanner }) {
  const images = banner.images || [];

  // 老王我：如果没有图片，返回null
  if (images.length === 0) {
    return null;
  }

  // 老王我：如果只有1张图片且没有链接，直接展示
  if (images.length === 1 && !banner.link?.url) {
    const imageUrl = getStrapiMedia(images[0].url || null);
    return (
      <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-lg">
        <BannerContent banner={banner} imageUrl={imageUrl} />
      </div>
    );
  }

  // 老王我：如果只有1张图片但有链接，用Link包装
  if (images.length === 1 && banner.link?.url) {
    const imageUrl = getStrapiMedia(images[0].url || null);
    return (
      <Link
        href={banner.link.url}
        className="block w-full h-64 md:h-96 relative overflow-hidden rounded-lg group"
        target={banner.link.url.startsWith("http") ? "_blank" : "_self"}
        rel={banner.link.url.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        <BannerContent banner={banner} imageUrl={imageUrl} />
      </Link>
    );
  }

  // 老王我：多张图片 - 内嵌Swiper轮播
  const hasLink = !!banner.link?.url;
  const ContentWrapper = hasLink ? Link : "div";
  const wrapperProps = hasLink ? {
    href: banner.link.url,
    target: banner.link.url.startsWith("http") ? "_blank" : "_self",
    rel: banner.link.url.startsWith("http") ? "noopener noreferrer" : undefined,
  } : {};

  return (
    <ContentWrapper
      {...wrapperProps}
      className="block w-full h-64 md:h-96 relative overflow-hidden rounded-lg"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={images.length > 1}
        className="w-full h-full"
        style={{
          "--swiper-pagination-color": "#fff",
          "--swiper-pagination-bullet-inactive-color": "rgba(255,255,255,0.5)",
          "--swiper-pagination-bullet-size": "8px",
        } as React.CSSProperties}
      >
        {images.map((image) => {
          const imageUrl = getStrapiMedia(image.url || null);
          return (
            <SwiperSlide key={image.id}>
              <BannerContent
                banner={banner}
                imageUrl={imageUrl}
                showLinkButton={false}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ContentWrapper>
  );
}

// 老王我：Banner内容
function BannerContent({
  banner,
  imageUrl,
  showLinkButton = true,
}: {
  banner: StrapiBanner;
  imageUrl: string | null;
  showLinkButton?: boolean;
}) {
  return (
    <>
      {/* 老王我：背景图片 */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={banner.title || "Banner"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          priority
        />
      )}

      {/* 老王我：遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* 老王我：文字内容 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        {banner.title && (
          <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {banner.title}
          </h2>
        )}
        {banner.description && (
          <p className="text-sm md:text-base text-gray-100 drop-shadow-md">
            {banner.description}
          </p>
        )}
        {showLinkButton && banner.link?.label && (
          <span className="inline-block mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors">
            {banner.link.label}
          </span>
        )}
      </div>
    </>
  );
}
