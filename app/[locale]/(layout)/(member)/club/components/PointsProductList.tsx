"use client";

import { Gift, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PointsProduct } from "@/data/points-products";
import PointsProductCard from "./PointsProductCard";

/**
 * 积分商品列表组件
 *
 * 老王我全新设计 - 现代网格布局：
 * 1. 优雅的空状态
 * 2. 响应式网格
 * 3. 充足的间距和呼吸感
 */

interface PointsProductListProps {
  products: PointsProduct[];
  userPoints: number;
  onRedeem: (product: PointsProduct) => void;
  onPointsUpdate?: (newPoints: number) => void;
}

export default function PointsProductList({
  products,
  userPoints,
  onRedeem,
  onPointsUpdate,
}: PointsProductListProps) {
  const t = useTranslations("Club");

  // 老王我：处理兑换点击（传递给父组件处理弹窗）
  const handleRedeemClick = (product: PointsProduct) => {
    onRedeem(product);
  };

  // 老王我：优雅的空状态
  if (products.length === 0) {
    return (
      <div
        className="
          w-full
          py-24
          text-center
        "
      >
        <div
          className="
            w-24
            h-24
            mx-auto
            mb-6
            rounded-full
            bg-gradient-to-br
            from-brand-pink/10
            to-brand-blue/10
            flex
            items-center
            justify-center
          "
        >
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h3
          className="
            text-2xl
            font-bold
            text-gray-900
            mb-3
          "
        >
          {t("noProducts")}
        </h3>
        <p className="text-gray-500 text-lg">
          {t("noProductsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
        md:gap-6
      "
    >
      {products.map((product) => (
        <PointsProductCard
          key={product.id}
          product={product}
          userPoints={userPoints}
          onRedeem={handleRedeemClick}
        />
      ))}
    </div>
  );
}
