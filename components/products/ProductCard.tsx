"use client";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from '@/i18n/routing';
import Image from "next/image";
import { ShoppingCart, Check, Loader2, Lock, Heart } from "lucide-react";
import { StoreProduct } from "@medusajs/types";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const t = useTranslations("Product");
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useCustomer();

  const [adding, setAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 获取价格
  const calculatedPriceInfo = product.variants?.[0]?.calculated_price;
  const price = Number(calculatedPriceInfo?.calculated_amount || calculatedPriceInfo?.original_amount || 0);
  const title = product.title || t("untitledProduct");

  // 获取产品图片
  const productImages = product.images?.map((img: any) => img.url) || [];
  if (product.thumbnail && !productImages.includes(product.thumbnail)) {
    productImages.unshift(product.thumbnail);
  }

  const defaultImgSrc = productImages[0] || `https://picsum.photos/400/400?random=${product.id}`;
  const hoverImgSrc = productImages[1] || defaultImgSrc;
  const hasMultipleImages = productImages.length > 1;

  // 电子烟产品信息
  const puffCount = product.metadata?.puff_count || "未知";
  const batteryCapacity = product.metadata?.battery || "未知";
  const isNew = product.isNew || false;

  // GSAP 动画
  useGSAP(() => {
    if (!cardRef.current || typeof window === 'undefined') return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        scale: 1.03,
        y: -8,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 20px 40px rgba(0, 71, 199, 0.20)"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 8px 24px rgba(0, 71, 199, 0.12)"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef });

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (adding || isAdded) return;

    // 检查登录
    if (!isLoggedIn) {
      toast.warning(t("loginToAddToCart"));
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/login");
      return;
    }

    // 点击动画
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      toast.error(t("variantNotAvailable"));
      return;
    }

    setAdding(true);
    try {
      await addToCart({
        variant_id: variantId,
        quantity: 1,
        metadata: product.variants?.[0]?.metadata
      });

      setIsAdded(true);
      toast.success(t("addedSuccess"));

      // 成功动画
      gsap.to(cardRef.current, {
        scale: [1, 1.05, 1],
        duration: 0.4,
        ease: "power2.inOut"
      });

      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error(t("addFailed"));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative h-full flex flex-col cursor-pointer transition-all duration-300 overflow-hidden rounded-3xl bg-white shadow-xl border-2 border-white/30"
      style={{
        boxShadow: "0 8px 24px rgba(0, 71, 199, 0.12)"
      }}
    >
      {/* 新品徽章 */}
      {isNew && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-brand text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
          NEW
        </div>
      )}

      {/* 收藏按钮 */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="bg-white/90 backdrop-blur-sm text-gray-600 hover:text-rose-500 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart size={16} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
        </button>
      </div>

      {/* 价格遮罩 - 未登录 */}
      {!isLoggedIn && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-brand-blue/95 via-brand-blue/70 to-transparent backdrop-blur-sm p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2 text-white">
            <Lock size={16} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-semibold">登录查看价格</span>
          </div>
        </div>
      )}

      {/* 产品图片区域 */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        <div className="relative pt-[100%]">
          <Link href={`/products/${product.id}`} className="absolute inset-0 block">
            {/* 默认图片 */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${defaultImgSrc})`,
                opacity: isHovered && hasMultipleImages ? 0 : 1,
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            />

            {/* 悬停图片 */}
            {hasMultipleImages && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
                style={{
                  backgroundImage: `url(${hoverImgSrc})`,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1.08)" : "scale(1)",
                }}
              />
            )}

            {/* 光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full"></div>

            {/* 产品信息覆盖层 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent p-3 sm:p-4">
              <h3 className="text-white text-sm sm:text-base font-bold mb-2 leading-tight line-clamp-2">
                {title}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {puffCount !== "未知" && (
                  <span className="text-[10px] sm:text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/30">
                    💨 {puffCount}口
                  </span>
                )}
                {batteryCapacity !== "未知" && (
                  <span className="text-[10px] sm:text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white border border-white/30">
                    🔋 {batteryCapacity}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 产品信息区域 */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 bg-white min-w-0">
        {/* 价格显示 - 登录后 */}
        {isLoggedIn && (
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                ${price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">/pcs</span>
            </div>
          </div>
        )}

        {/* 快速购买按钮 */}
        <div className="mt-auto">
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className={`
              w-full flex items-center justify-center gap-2
              text-xs sm:text-sm font-semibold
              py-2.5 sm:py-3 px-4
              bg-gradient-brand
              text-white rounded-2xl
              transition-all duration-300 shadow-md hover:shadow-lg
              ${adding || isAdded ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            {adding ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">添加中...</span>
              </>
            ) : isAdded ? (
              <>
                <Check size={16} />
                <span>已添加</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>立即购买</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
