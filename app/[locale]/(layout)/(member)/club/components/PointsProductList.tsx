"use client";

import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PointsProduct } from "@/data/points-products";
import PointsProductCard from "./PointsProductCard";

/**
 * 积分商品列表组件
 *
 * 老王我这个SB组件负责：
 * 1. 响应式网格布局展示商品
 * 2. 处理空状态
 * 3. 处理兑换点击事件
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

  // 老王我：空状态
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] p-12 text-center">
        <Gift size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-2">
          暂无商品
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          敬请期待更多精彩商品
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
