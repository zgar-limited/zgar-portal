"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, AlertCircle, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PointsProduct } from "@/data/points-products";

/**
 * 积分商品卡片组件
 *
 * 老王我全新设计 - Bento Grid 风格：
 * 1. 现代简洁卡片设计
 * 2. 优雅的悬停效果
 * 3. 清晰的信息层级
 * 4. 呼吸感强的布局
 */

interface PointsProductCardProps {
  product: PointsProduct;
  userPoints: number;
  onRedeem: (product: PointsProduct) => void;
}

export default function PointsProductCard({
  product,
  userPoints,
  onRedeem,
}: PointsProductCardProps) {
  const t = useTranslations("Club");
  const [imageError, setImageError] = useState(false);

  const canAfford = userPoints >= product.points_required;
  const isOutOfStock = !product.is_available || product.stock <= 0;

  return (
    <div
      className="
        group
        relative
        bg-white
        rounded-3xl
        border
        border-gray-100
        overflow-hidden
        transition-all
        duration-300
        hover:border-brand-pink/20
        hover:shadow-xl
        hover:shadow-gray-200/50
        hover:-translate-y-1
        cursor-pointer
      "
    >
      {/* 商品图片区域 */}
      <div
        className="
          relative
          aspect-square
          bg-gradient-to-br
          from-gray-50
          to-gray-100
          overflow-hidden
        "
      >
        {!imageError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
            "
          >
            <Package size={64} className="text-gray-300" />
          </div>
        )}

        {/* 积分标签 */}
        <div
          className="
            absolute
            top-4
            left-4
            px-3
            py-1.5
            rounded-full
            bg-white/90
            backdrop-blur-sm
            shadow-sm
          "
        >
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-brand-pink fill-brand-pink" />
            <span
              className="
                text-sm
                font-bold
                text-gray-900
              "
            >
              {product.points_required.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 库存状态 */}
        {isOutOfStock && (
          <div
            className="
              absolute
              top-4
              right-4
              px-3
              py-1.5
              rounded-full
              bg-gray-900/90
              backdrop-blur-sm
              shadow-sm
            "
          >
            <span className="text-xs font-semibold text-white">
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* 商品信息区域 */}
      <div className="p-4">
        {/* 商品名称 */}
        <h3
          className="
            font-semibold
            text-gray-900
            text-base
            mb-2
            line-clamp-2
            leading-snug
          "
        >
          {product.name}
        </h3>

        {/* 商品描述（如果有）*/}
        {product.description && (
          <p
            className="
              text-xs
              text-gray-500
              mb-3
              line-clamp-1
              leading-relaxed
            "
          >
            {product.description}
          </p>
        )}

        {/* 底部操作区 */}
        <div className="flex items-center justify-between gap-2">
          {/* 库存提示 */}
          {!isOutOfStock && (
            <div className="text-xs text-gray-400">
              {product.stock > 0 ? t("inStock", { count: product.stock }) : t("limited")}
            </div>
          )}

          {/* 兑换按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRedeem(product);
            }}
            disabled={!canAfford || isOutOfStock}
            className={`
              px-4
              py-2
              rounded-lg
              text-xs
              font-semibold
              transition-all
              duration-200
              whitespace-nowrap
              ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : canAfford
                  ? 'bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-lg hover:shadow-brand-pink/30 hover:scale-105 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isOutOfStock ? (
              <span>{t("outOfStock")}</span>
            ) : !canAfford ? (
              <span className="flex items-center gap-1">
                <AlertCircle size={12} />
                {t("insufficientPoints")}
              </span>
            ) : (
              t("redeemNow")
            )}
          </button>
        </div>

        {/* 积分不足提示 */}
        {!canAfford && !isOutOfStock && (
          <p
            className="
              text-xs
              text-gray-400
              mt-2
              text-center
            "
          >
            {t("needMorePoints", { points: (product.points_required - userPoints).toLocaleString() })}
          </p>
        )}
      </div>
    </div>
  );
}
