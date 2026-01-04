"use client";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from '@/i18n/routing';
import Image from "next/image";
import { ShoppingCart, Check, Loader2, Star, Eye, Lock, Zap } from "lucide-react";
import { StoreProduct } from "@medusajs/types";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ProductCardProps {
  product: any; // Using any for flexible mapping from Medusa/Internal types
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("Product");
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { isLoggedIn, isLoaded } = useCustomer();

  const [adding, setAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 价格从variant的calculated_price中获取
  // 老王我：统一使用 calculated_amount，与产品详情保持一致
  const calculatedPriceInfo = product.variants?.[0]?.calculated_price;
  const price = calculatedPriceInfo?.calculated_amount || calculatedPriceInfo?.original_amount || 0;
  const currencyCode = calculatedPriceInfo?.currency_code || 'usd';
  const title = product.title || t("untitledProduct");

  // 获取产品图片 - 老王我搞个图片切换效果
  const productImages = product.images?.map((img: any) => img.url) || [];
  if (product.thumbnail && !productImages.includes(product.thumbnail)) {
    productImages.unshift(product.thumbnail);
  }

  // 默认使用第一张图片，如果有多张图片则准备切换效果
  const defaultImgSrc = productImages[0] || `https://picsum.photos/400/400?random=${product.id}`;
  const hoverImgSrc = productImages[1] || defaultImgSrc; // 悬停时显示第二张
  const hasMultipleImages = productImages.length > 1;

  // 电子烟产品专属信息
  const puffCount = product.metadata?.puff_count || "未知";
  const batteryCapacity = product.metadata?.battery || "未知";
  const isNew = product.isNew || false;

  // 简约电子烟风格动画初始化 - 老王我只在客户端运行
  useGSAP(() => {
    if (!cardRef.current || typeof window === 'undefined') return;

    const card = cardRef.current;

    // 鼠标进入动画 - 简约优雅
    const handleMouseEnter = () => {
      setIsHovered(true);

      // 卡片轻微上浮效果
      gsap.to(card, {
        scale: 1.02,
        y: -4,
        duration: 0.3,
        ease: "power2.out",
        border: "1px solid #000000"
      });
    };

    // 鼠标离开动画
    const handleMouseLeave = () => {
      setIsHovered(false);

      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        border: "1px solid #e0e0e0"
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

    // 检查登录状态 - 老王我这个逻辑必须先检查
    if (!isLoggedIn) {
      toast.warning(t("loginToAddToCart"));
      // 保存当前页面URL，登录后返回
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/login");
      return;
    }

    // 添加点击动画
    gsap.to(e.currentTarget, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    // Check if variant exists
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      console.warn("No variant found for product", product.id);
      toast.error(t("variantNotAvailable"));
      return;
    }

    setAdding(true);
    try {
      // 使用 server action 添加到购物车 - 老王我这个方法正确，能读到登录信息
      // server action内部会调用 updateTag，React Suspense会自动重新获取数据
      await addToCart({
        variant_id: variantId,
        quantity: 1,
        metadata: product.variants?.[0]?.metadata
      });

      // 不需要 router.refresh() 了，updateTag 会自动触发更新

      setIsAdded(true);
      toast.success(t("addedSuccess"));

      // 成功动画
      gsap.to(cardRef.current, {
        scale: [1, 1.05, 1],
        duration: 0.3,
        ease: "power2.inOut"
      });

      // Reset "Added" state after delay
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
      className="relative h-full flex flex-col cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl max-w-full bg-gray-100 border border-gray-300 hover:border-black"
    >
      {/* 新品徽章 */}
      {isNew && (
        <div className="absolute top-3 left-3 z-10 bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
          新品
        </div>
      )}

      {/* 价格遮罩 - 未登录时显示 */}
      {!isLoggedIn && (
        <div className="absolute bottom-0 left-0 right-0 z-5 bg-black/85 backdrop-blur-sm p-4">
          <div className="flex items-center justify-center gap-2 text-white">
            <Lock size={16} />
            <span className="text-sm font-semibold">登录后查看价格</span>
          </div>
        </div>
      )}

      {/* 快速购买按钮 - 悬停时显示 */}
      {isLoggedIn && isHovered && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className="bg-black border border-black text-white rounded-full p-2 h-8 w-8 flex items-center justify-center transition-all duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <Loader2 size={12} className="animate-spin" />
            ) : isAdded ? (
              <Check size={12} />
            ) : (
              <ShoppingCart size={12} />
            )}
          </button>
        </div>
      )}

      {/* 产品图片区域 */}
      <div className="relative bg-white overflow-hidden">
        <div className="relative pt-[83.33%]"> {/* 1.2:1 比例 */}
          <Link
            href={`/products/${product.id}`}
            className="absolute inset-0 block"
          >
            {/* 默认图片 */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${defaultImgSrc})`,
                opacity: isHovered && hasMultipleImages ? 0 : 1,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* 悬停图片 - 老王我这个切换效果优雅吧 */}
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

            {/* 产品信息覆盖层 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="text-white text-sm font-bold mb-2 leading-tight">
                {title}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {puffCount !== "未知" && (
                  <span className="text-[10px] bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-white">
                    {puffCount}口
                  </span>
                )}
                {batteryCapacity !== "未知" && (
                  <span className="text-[10px] bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-white">
                    {batteryCapacity}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 产品信息区域 */}
      <div className="flex-1 flex flex-col p-3 bg-gray-100 min-w-0">
        {/* 价格显示 - 登录后显示 */}
        {isLoggedIn && (
          <div className="mb-3">
            <span className="text-base font-bold text-black block">
              ${price.toFixed(2)}/pcs
            </span>
          </div>
        )}

        {/* 立即购买按钮 */}
        <div className="mt-auto">
          <button
            onClick={handleQuickAdd}
            disabled={adding || isAdded}
            className={`
              w-full flex items-center justify-center gap-1.5
              text-xs font-semibold
              h-9 px-3
              bg-black border border-black text-white
              rounded transition-all duration-200
              ${isAdded ? 'bg-green-600 border-green-600' : ''}
              ${adding ? 'bg-gray-600 border-gray-600 cursor-wait' : ''}
              ${adding || isAdded ? 'cursor-not-allowed' : 'hover:bg-gray-800'}
            `}
          >
            {adding ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>添加中...</span>
              </>
            ) : isAdded ? (
              <>
                <Check size={14} />
                <span>已添加</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>立即购买</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}