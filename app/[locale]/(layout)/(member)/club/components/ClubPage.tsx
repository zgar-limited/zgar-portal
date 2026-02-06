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

      {/* 2. 商品列表区域标题 - 超大渐变文字风格 */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="relative py-8">
          {/* 老王我：装饰性背景元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 左上大圆圈 */}
            <div
              className="absolute -top-16 -left-16 w-64 h-64 opacity-5"
              style={{
                background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
                borderRadius: '50%'
              }}
            ></div>
            {/* 右下小方块 */}
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 opacity-5"
              style={{
                backgroundColor: '#f496d3',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(-45deg)'
              }}
            ></div>
            {/* 装饰性线条 */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-pink/10 to-transparent"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent"></div>
          </div>

          {/* 老王我：主要内容 */}
          <div className="relative z-10">
            {/* 超大渐变标题 */}
            <div className="mb-4">
              <h2
                className="text-5xl md:text-6xl font-black leading-tight"
                style={{
                  fontFamily: 'sans-serif',
                  background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 50%, #f496d3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {t("title")}
              </h2>
            </div>

            {/* 装饰性标签 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2" style={{ backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <span className="text-sm font-black" style={{ color: '#f496d3', letterSpacing: '0.2em' }}>
                  POINTS MALL
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-brand-pink/20 via-brand-blue/20 to-transparent"></div>
            </div>

            {/* 副标题 */}
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>

            {/* 装饰性小圆点 */}
            <div className="flex items-center gap-2 mt-6">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f496d3' }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0047c7' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 商品网格列表 */}
      <div className="w-full px-6 pb-20 max-w-7xl mx-auto">

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
