"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, AlertCircle, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PointsProduct } from "@/data/points-products";

/**
 * 积分商品卡片组件
 *
 * 老王我这个SB组件负责：
 * 1. 展示商品信息（图片、名称、描述）
 * 2. 显示积分需求
 * 3. 处理兑换按钮的3种状态
 * 4. 触发兑换确认弹窗
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

  // 老王我：判断兑换状态
  const canAfford = userPoints >= product.points_required;
  const isOutOfStock = !product.is_available || product.stock <= 0;

  // 老王我：分类标签颜色
  const getCategoryColor = (category: PointsProduct["category"]) => {
    switch (category) {
      case "discount":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "product":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "gift":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
      case "exclusive":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // 老王我：分类名称
  const getCategoryName = (category: PointsProduct["category"]) => {
    switch (category) {
      case "discount":
        return "优惠券";
      case "product":
        return "实物商品";
      case "gift":
        return "礼品";
      case "exclusive":
        return "会员专享";
      default:
        return "其他";
    }
  };

  return (
    <div
      className="
        rounded-2xl border border-[#ededed] dark:border-[#ffffff1a]
        bg-white dark:bg-[#191818]
        overflow-hidden
        hover:border-black/20 dark:hover:border-white/20
        transition-all
      "
    >
      {/* 商品图片 */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        {!imageError && product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Star size={48} className="text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* 分类标签（左上角） */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-medium
              flex items-center gap-1
              ${getCategoryColor(product.category)}
            `}
          >
            <Tag size={12} />
            {getCategoryName(product.category)}
          </span>
        </div>

        {/* 库存标签（右上角） */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              仅剩 {product.stock} 件
            </span>
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        {/* 商品名称 */}
        <h3 className="font-semibold text-black dark:text-white text-base mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* 商品描述 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 h-10">
          {product.description}
        </p>

        {/* 积分需求 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-black dark:text-white">
              {product.points_required.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              积分
            </span>
          </div>

          {/* 库存显示 */}
          {product.stock > 0 && product.stock <= 50 && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              库存: {product.stock}
            </span>
          )}
        </div>

        {/* 兑换按钮 */}
        <button
          onClick={() => onRedeem(product)}
          disabled={!canAfford || isOutOfStock}
          className={`
            w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all
            ${
              isOutOfStock
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : canAfford
                ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isOutOfStock ? (
            <span className="flex items-center justify-center gap-1.5">
              {t("outOfStock")}
            </span>
          ) : !canAfford ? (
            <span className="flex items-center justify-center gap-1.5">
              <AlertCircle size={14} />
              {t("insufficientPoints")}
            </span>
          ) : (
            t("redeemNow")
          )}
        </button>

        {/* 积分不足提示 */}
        {!canAfford && !isOutOfStock && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
            还需要 {(product.points_required - userPoints).toLocaleString()} 积分
          </p>
        )}
      </div>
    </div>
  );
}
