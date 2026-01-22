"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Crown } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import type { PointsProduct } from "@/data/points-products";
import HeroCarousel from "./HeroCarousel";
import RewardsBenefits from "./RewardsBenefits";
import KickOffRewards from "./KickOffRewards";
import StatsSection from "./StatsSection";
import PointsProductList from "./PointsProductList";
import ProductRedeemModal from "./ProductRedeemModal";

/**
 * Zgar Club 主页面容器组件
 *
 * 老王我完全重构了这个SB组件：
 *
 * 未登录/非会员：
 * 1. 全屏轮播Hero Banner（左右分屏设计）
 * 2. What can ZGAR Club rewards do for you 价值展示区（左图右文）
 * 3. Let's kick things off for you! 积分奖励区（3步骤引导）
 *
 * 已登录会员：
 * 1. 快捷统计区（积分、优惠券、订单）
 * 2. 商品列表展示
 */

interface ClubPageProps {
  isLoggedIn: boolean;
  isMember: boolean;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
  initialProducts: PointsProduct[];
}

export default function ClubPage({
  isLoggedIn,
  isMember,
  customer,
  initialProducts,
}: ClubPageProps) {
  const t = useTranslations("Club");

  // 老王我：积分状态管理
  const [userPoints, setUserPoints] = useState<number>(
    customer?.zgar_customer?.points || 0
  );

  // 老王我：兑换弹窗状态
  const [selectedProduct, setSelectedProduct] = useState<PointsProduct | null>(
    null
  );

  // 老王我：处理兑换点击
  const handleRedeemClick = (product: PointsProduct) => {
    setSelectedProduct(product);
  };

  // 老王我：处理积分更新
  const handlePointsUpdate = (newPoints: number) => {
    setUserPoints(newPoints);
  };

  // 老王我：未登录或非会员 - 显示完整引导页面
  if (!isLoggedIn || !isMember) {
    return (
      <>
        {/* 1. 全屏轮播Hero Banner（左右分屏设计） */}
        <HeroCarousel />

        {/* 2. What can ZGAR Club rewards do for you 价值展示区（左图右文） */}
        <RewardsBenefits />

        {/* 3. Let's kick things off for you! 积分奖励区（3步骤引导） */}
        <KickOffRewards />
      </>
    );
  }

  // 老王我：主页面布局 - 已登录会员直接显示功能页面
  return (
    <div className="w-full bg-white pt-20">
      {/* 1. 快捷统计区 */}
      <StatsSection points={userPoints} customer={customer} />

      {/* 2. 商品列表区域 */}
      <div className="w-full px-6 pb-20 max-w-7xl mx-auto">
        {/* 区域标题 */}
        <div className="mb-12">
          <h2
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-gray-900
              mb-3
              tracking-tight
            "
          >
            {t("title")}
          </h2>
          <p className="text-gray-500 text-base">
            {t("subtitle")}
          </p>
        </div>

        {/* 商品网格 */}
        <PointsProductList
          products={initialProducts}
          userPoints={userPoints}
          onRedeem={handleRedeemClick}
          onPointsUpdate={handlePointsUpdate}
        />
      </div>

      {/* 3. 兑换确认弹窗 */}
      <ProductRedeemModal
        product={selectedProduct}
        userPoints={userPoints}
        onClose={() => setSelectedProduct(null)}
        onSuccess={handlePointsUpdate}
      />
    </div>
  );
}
