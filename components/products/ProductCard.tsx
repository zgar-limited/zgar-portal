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

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

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
      className="group relative h-full flex flex-col cursor-pointer overflow-hidden bg-white border-2 border-black transition-all duration-300 hover:shadow-lg"
    >
      {/* 老王我：Vibrant Blocks新品徽章 - 简洁色块 */}
      {isNew && (
        <div className="absolute top-0 left-0 z-20 bg-[#f496d3] px-4 py-2">
          <span className="text-white font-black text-xs uppercase tracking-wider">
            NEW
          </span>
        </div>
      )}

      {/* 老王我：Vibrant Blocks收藏按钮 - 简洁色块 */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          className="bg-black p-2 hover:bg-[#f496d3] transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart size={16} className="sm:w-4 sm:h-4 w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* 老王我：价格遮罩 - 未登录 - 简洁色块 */}
      {!isLoggedIn && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black p-3 sm:p-4">
          <div className="flex items-center justify-center gap-2 text-white font-black">
            <Lock size={14} className="sm:w-3.5 sm:h-3.5 w-3 h-3" />
            <span className="text-xs sm:text-sm">登录查看价格</span>
          </div>
        </div>
      )}

      {/* 产品图片区域 - 简约风格 */}
      <div className="relative bg-gray-100 overflow-hidden">
        <div className="relative pt-[100%]">
          <Link href={`/products/${product.id}`} className="absolute inset-0 block">
            {/* 默认图片 */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${defaultImgSrc})`,
                opacity: isHovered && hasMultipleImages ? 0 : 1,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* 悬停图片 */}
            {hasMultipleImages && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
                style={{
                  backgroundImage: `url(${hoverImgSrc})`,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              />
            )}

            {/* 老王我：产品信息覆盖层 - Vibrant Blocks风格 */}
            <div className="absolute bottom-0 left-0 right-0 bg-black p-3 sm:p-4">
              <h3 className="text-white text-sm sm:text-base font-black mb-2 leading-tight line-clamp-2">
                {title}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {puffCount !== "未知" && (
                  <span className="text-[10px] sm:text-xs bg-[#f496d3] px-2.5 py-1 text-white font-black">
                    💨 {puffCount}
                  </span>
                )}
                {batteryCapacity !== "未知" && (
                  <span className="text-[10px] sm:text-xs bg-[#0047c7] px-2.5 py-1 text-white font-black">
                    🔋 {batteryCapacity}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 老王我：产品信息区域 - Vibrant Blocks风格 */}
      <div className="flex-1 flex flex-col p-4 bg-white border-t-2 border-black min-w-0">
        {/* 价格显示 - 登录后 */}
        {isLoggedIn && (
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {formatAmount(price)}
              </span>
              <span className="text-xs font-bold text-gray-600">/pcs</span>
            </div>
          </div>
        )}

        {/* 老王我：快速购买按钮 - Vibrant Blocks风格 */}
        <div className="mt-auto">
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className={`
              w-full flex items-center justify-center gap-2
              text-xs sm:text-sm font-black
              py-3 sm:py-3 px-4
              bg-black text-white
              transition-all duration-200
              hover:bg-[#f496d3]
              ${adding || isAdded ? 'opacity-75 cursor-not-allowed' : ''}
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
                <span>已添加 ✓</span>
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
