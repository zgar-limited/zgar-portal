import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { StrapiBanner } from "@/data/articles";

/**
 * 老王我：Care 页面 Banner 组件
 * 从 Strapi CMS 动态获取 Banner 数据，支持图片、标题、描述和链接
 */
interface CareBannerProps {
  banner: StrapiBanner;
}

export default function CareBanner({ banner }: CareBannerProps) {
  // 老王我：Banner 图片 URL
  const imageUrl = banner.image?.url
    ? `${process.env.STRAPI_URL}${banner.image.url}`
    : "/images/care/banner.webp"; // 降级到默认图片

  // 老王我：Banner 内容组件
  const BannerContent = () => (
    <div className="overflow-hidden page_image">
      <Image
        className="lazyload ani-zoom"
        src={imageUrl}
        alt={banner.title || "Care Banner"}
        width={2880}
        height={750}
        priority
      />
      {/* 老王我：可选的标题和描述 */}
      {(banner.title || banner.description) && (
        <div className="banner-content" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 10,
        }}>
          {banner.title && (
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}>
              {banner.title}
            </h1>
          )}
          {banner.description && (
            <p style={{
              fontSize: '1.25rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              {banner.description}
            </p>
          )}
        </div>
      )}
    </div>
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
