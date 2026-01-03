"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Crown } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import type { PointsProduct } from "@/data/points-products";
import ClubBanner from "./ClubBanner";
import StatsCards from "./StatsCards";
import PointsBalanceCard from "./PointsBalanceCard";
import MemberBenefits from "./MemberBenefits";
import PointsProductList from "./PointsProductList";
import RedemptionHistory from "./RedemptionHistory";
import ProductRedeemModal from "./ProductRedeemModal";

/**
 * Zgar Club 主页面容器组件
 *
 * 老王我这个SB组件负责：
 * 1. 判断会员状态
 * 2. 展示精美的页面布局
 * 3. 管理标签切换（商品列表/兑换记录）
 * 4. 更新积分状态
 */

interface ClubPageProps {
  isMember: boolean;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
  initialProducts: PointsProduct[];
}

export default function ClubPage({
  isMember,
  customer,
  initialProducts,
}: ClubPageProps) {
  const t = useTranslations("Club");

  // 老王我：积分状态管理
  const [userPoints, setUserPoints] = useState<number>(
    customer?.zgar_customer?.points || 0
  );

  // 老王我：标签切换状态
  const [activeTab, setActiveTab] = useState<"products" | "history">(
    "products"
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

  // 老王我：非会员提示
  if (!isMember) {
    return (
      <div className="space-y-6">
        {/* 非会员 Banner */}
        <div
          className="
            rounded-2xl overflow-hidden
            bg-gradient-to-br from-gray-900 via-gray-800 to-black
            dark:from-gray-800 dark:via-gray-700 dark:to-gray-900
            relative
            shadow-2xl
          "
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-center">
            <Crown size={64} className="text-yellow-500 mx-auto mb-6" />
            <h2
              className="
                text-4xl font-bold mb-4
                bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100
                bg-clip-text text-transparent
              "
            >
              {t("notMemberTitle")}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {t("notMemberDescription")}
            </p>
            <button
              className="
                px-8 py-3 rounded-xl
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white font-medium
                hover:from-yellow-500 hover:to-orange-600
                transition-all
                shadow-lg hover:shadow-xl
              "
            >
              {t("joinNow")}
            </button>
          </div>
        </div>

        {/* 非会员权益预览 */}
        <MemberBenefits />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 顶部 Banner */}
      <ClubBanner />

      {/* 统计数据卡片 */}
      <StatsCards
        totalPoints={customer?.zgar_customer?.total_points || userPoints}
        totalRedemptions={customer?.zgar_customer?.total_redemptions || 0}
        currentTier={customer?.zgar_customer?.member_tier || "普通会员"}
        memberSince={customer?.created_at?.substring(0, 4) || "2025"}
      />

      {/* 积分余额卡片 */}
      <PointsBalanceCard
        points={userPoints}
        memberTier={customer?.zgar_customer?.member_tier || "普通会员"}
      />

      {/* 会员权益展示 */}
      <MemberBenefits />

      {/* 积分商城和兑换记录 */}
      <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] overflow-hidden">
        {/* 标签头部 */}
        <div className="border-b border-[#ededed] dark:border-[#ffffff1a] bg-gray-50 dark:bg-white/5">
          <div className="flex">
            <button
              onClick={() => setActiveTab("products")}
              className={`
                flex-1 px-6 py-4 text-sm font-medium transition-all relative
                ${
                  activeTab === "products"
                    ? "text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }
              `}
            >
              {activeTab === "products" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500" />
              )}
              积分商城
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`
                flex-1 px-6 py-4 text-sm font-medium transition-all relative
                ${
                  activeTab === "history"
                    ? "text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }
              `}
            >
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500" />
              )}
              兑换记录
            </button>
          </div>
        </div>

        {/* 标签内容 */}
        <div className="p-6">
          {activeTab === "products" ? (
            <PointsProductList
              products={initialProducts}
              userPoints={userPoints}
              onRedeem={handleRedeemClick}
              onPointsUpdate={handlePointsUpdate}
            />
          ) : (
            <RedemptionHistory />
          )}
        </div>
      </div>

      {/* 兑换确认弹窗 */}
      <ProductRedeemModal
        product={selectedProduct}
        userPoints={userPoints}
        onClose={() => setSelectedProduct(null)}
        onSuccess={handlePointsUpdate}
      />
    </div>
  );
}
