import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { StrapiBanner } from "@/data/articles";

/**
 * 老王我：Care 页面 Banner 组件 - Vibrant Blocks 风格
 * 纯图片展示，宽屏，高度自动
 */
interface CareBannerProps {
  banner: StrapiBanner;
}

export default function CareBanner({ banner }: CareBannerProps) {
  // 老王我：Banner 图片 URL
  const imageUrl = banner.image?.url
    ? `${process.env.STRAPI_URL}${banner.image.url}`
    : "/images/care/banner.webp"; // 降级到默认图片

  // 老王我：纯图片 Banner（跟 About Us 和 Partner 保持一致）
  const BannerContent = () => (
    <section className="w-full">
      <Image
        src={imageUrl}
        alt={banner.title || "Care Banner"}
        width={1920}
        height={0}
        className="w-full h-auto"
        priority
      />
    </section>
  );

  // 老王我：如果有链接，用 Link 组件包裹
  if (banner.link?.url) {
    return (
      <Link href={banner.link.url}>
        <BannerContent />
      </Link>
    );
  }

  return <BannerContent />;
}
