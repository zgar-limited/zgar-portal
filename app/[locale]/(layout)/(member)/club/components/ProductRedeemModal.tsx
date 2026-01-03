"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import type { PointsProduct } from "@/data/points-products";
import { redeemPointsProduct } from "@/data/points-products";

/**
 * 积分商品兑换确认弹窗
 *
 * 老王我这个SB组件负责：
 * 1. 显示商品详情确认
 * 2. 展示积分明细（当前/消耗/剩余）
 * 3. 低余额警告（< 100 积分）
 * 4. 处理兑换逻辑
 */

interface ProductRedeemModalProps {
  product: PointsProduct | null;
  userPoints: number;
  onClose: () => void;
  onSuccess?: (newPoints: number) => void;
}

export default function ProductRedeemModal({
  product,
  userPoints,
  onClose,
  onSuccess,
}: ProductRedeemModalProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 老王我：计算兑换后的积分
  const remainingPoints = userPoints - (product?.points_required || 0);
  const isLowBalance = remainingPoints < 100 && remainingPoints >= 0;

  // 老王我：处理兑换
  const handleRedeem = async () => {
    if (!product) return;

    setIsRedeeming(true);

    try {
      const result = await redeemPointsProduct(product.id);

      if (result.success) {
        // 老王我：显示成功提示
        toast.success(result.message || "兑换成功！");

        // 老王我：回调更新积分
        if (onSuccess && result.new_points_balance !== undefined) {
          onSuccess(result.new_points_balance);
        }

        // 老王我：关闭弹窗
        onClose();
      } else {
        // 老王我：显示失败提示
        toast.error(result.message || "兑换失败，请重试");
      }
    } catch (error: any) {
      console.error("Redemption error:", error);
      toast.error(error.message || "兑换失败，请重试");
    } finally {
      setIsRedeeming(false);
    }
  };

  // 老王我：如果弹窗关闭，不渲染任何内容
  if (!product) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center p-4
        bg-black/50 backdrop-blur-sm
        animate-in fade-in duration-200
      "
      onClick={onClose}
    >
      <div
        className="
          rounded-2xl bg-white dark:bg-[#191818]
          max-w-md w-full
          shadow-2xl
          animate-in zoom-in duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
          <h3 className="text-lg font-bold text-black dark:text-white">
            确认兑换
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="p-6 space-y-6">
          {/* 商品信息 */}
          <div className="flex gap-4">
            {/* 商品图片 */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {!imageError && product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Star size={32} className="text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>

            {/* 商品详情 */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-black dark:text-white text-sm mb-1 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>

          {/* 积分明细 */}
          <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">当前积分</span>
              <span className="font-medium text-black dark:text-white">
                {userPoints.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">消耗积分</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                -{product.points_required.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  兑换后剩余
                </span>
                <span className="text-lg font-bold text-black dark:text-white">
                  {remainingPoints.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 低余额警告 */}
          {isLowBalance && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <AlertTriangle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700 dark:text-orange-400">
                兑换后积分余额将低于 100，请注意保留积分用于其他兑换
              </p>
            </div>
          )}
        </div>

        {/* 弹窗底部 */}
        <div className="flex gap-3 p-6 border-t border-[#ededed] dark:border-[#ffffff1a]">
          <button
            onClick={onClose}
            disabled={isRedeeming}
            className="
              flex-1 px-4 py-2.5 rounded-lg
              bg-gray-100 dark:bg-white/10
              text-black dark:text-white
              font-medium
              hover:bg-gray-200 dark:hover:bg-white/20
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            取消
          </button>
          <button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="
              flex-1 px-4 py-2.5 rounded-lg
              bg-black dark:bg-white
              text-white dark:text-black
              font-medium
              hover:opacity-80
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isRedeeming ? "兑换中..." : "确认兑换"}
          </button>
        </div>
      </div>
    </div>
  );
}
