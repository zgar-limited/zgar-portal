"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Star, X, Minus, Plus, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { PointsProduct, PointsProductVariant } from "@/data/points-products";
import { redeemPointsProduct } from "@/data/points-products";

/**
 * 积分商品兑换确认弹窗
 *
 * 老王我全新设计 - 符合主题：
 * 1. 粉蓝渐变主题
 * 2. 支持数量输入
 * 3. 支持规格选择
 * 4. 实时计算积分
 * 5. 现代简洁风格
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
  const t = useTranslations("Club");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 老王我：规格选择状态（默认选第一个）
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // 老王我：选中的选项值（类似商品详情页的 selectedOptions）
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // 老王我：获取当前选中的规格
  const selectedVariant = product?.variants?.[selectedVariantIndex];

  // 老王我：当弹窗打开时，初始化 selectedOptions
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // 使用第一个 variant 的 options 初始化
      const firstVariant = product.variants[0];
      const initialOptions: Record<string, string> = {};
      firstVariant.options?.forEach((opt) => {
        initialOptions[opt.option_id] = opt.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // 老王我：处理选项选择（类似商品详情页的 handleOptionSelect）
  const handleOptionSelect = (optionId: string, value: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionId]: value,
    };
    setSelectedOptions(newOptions);

    // 查找匹配的variant
    const matchedVariant = product?.variants?.find((variant) => {
      return variant.options?.every((opt) => {
        return newOptions[opt.option_id] === opt.value;
      });
    });

    if (matchedVariant) {
      const variantIndex = product?.variants?.findIndex((v) => v.id === matchedVariant.id) ?? 0;
      setSelectedVariantIndex(variantIndex);
    }
  };

  // 老王我：调试 - 打印 product 和 variants 的数据结构
  useEffect(() => {
    if (product) {
      console.log('🔍 老王我调试前端 - product:', product);
      console.log('🔍 老王我调试前端 - product.variants:', product.variants);
      console.log('🔍 老王我调试前端 - product.options:', product.options);
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((v, i) => {
          console.log(`🔍 老王我调试前端 - variant[${i}]:`, {
            id: v.id,
            title: v.title,
            options: v.options,
            points_required: v.points_required
          });
        });
      }
      if (product.options && product.options.length > 0) {
        product.options.forEach((opt, i) => {
          console.log(`🔍 老王我调试前端 - option[${i}]:`, {
            id: opt.id,
            title: opt.title,
            values: opt.values
          });
        });
      } else {
        console.warn('⚠️ 老王我警告 - product.options 为空或不存在！', product.options);
      }
    }
  }, [product]);

  // 老王我：当弹窗打开时，重置状态
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(0);
      setQuantity(1);
      setImageError(false);
    }
  }, [product]);

  // 老王我：计算总积分消耗和剩余积分（基于选中的规格）
  const totalPointsRequired = useMemo(
    () => (selectedVariant?.points_required || product?.points_required || 0) * quantity,
    [selectedVariant, product, quantity]
  );

  const remainingPoints = useMemo(
    () => userPoints - totalPointsRequired,
    [userPoints, totalPointsRequired]
  );

  // 老王我：是否可以兑换
  const canAfford = remainingPoints >= 0;
  const isLowBalance = remainingPoints < 100 && remainingPoints >= 0;
  const currentPointsRequired = selectedVariant?.points_required || product?.points_required || 0;
  const maxQuantity = currentPointsRequired > 0 ? Math.floor(userPoints / currentPointsRequired) : 0;

  // 老王我：处理数量变化
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value) || 1;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  // 老王我：处理兑换（修复：直接传 quantity 而不是循环调用）
  const handleRedeem = async () => {
    if (!product || !selectedVariant || !canAfford) return;

    setIsRedeeming(true);

    try {
      // 老王我：直接传递数量参数，而不是循环调用
      const result = await redeemPointsProduct(selectedVariant.id, quantity);

      if (!result.success) {
        throw new Error(result.message || "兑换失败");
      }

      // 老王我：显示成功提示
      toast.success(`成功兑换 ${quantity} 件商品！`);

      // 老王我：回调更新积分（使用后端返回的新积分）
      if (onSuccess && result.new_points_balance !== undefined) {
        onSuccess(result.new_points_balance);
      } else if (onSuccess) {
        onSuccess(remainingPoints);
      }

      // 老王我：关闭弹窗
      onClose();
    } catch (error: any) {
      console.error("兑换失败:", error);
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
          rounded-3xl bg-white
          max-w-lg w-full
          shadow-2xl
          shadow-gray-900/10
          animate-in zoom-in duration-200
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部装饰条 */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-pink to-brand-blue" />

        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-brand-pink/20
                to-brand-blue/20
                flex
                items-center
                justify-center
              "
            >
              <Sparkles size={20} className="text-brand-pink" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("confirmRedeemTitle")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("confirmRedeemDesc")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-500
              flex
              items-center
              justify-center
              transition-all
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="p-6 pt-4 space-y-6">
          {/* 商品信息 */}
          <div
            className="
              flex gap-4
              p-4
              rounded-2xl
              bg-gradient-to-br
              from-gray-50
              to-gray-100
              border
              border-gray-100
            "
          >
            {/* 商品图片 */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
              {!imageError && product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={40} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* 商品详情 */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>
              {/* 显示选中规格的积分 */}
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-brand-pink fill-brand-pink" />
                <span className="text-sm font-semibold text-gray-900">
                  {currentPointsRequired.toLocaleString()} {t("pointsPerUnit")}
                </span>
                {/* 如果有多个规格，显示当前选中的规格值 */}
                {product.options && product.options.length > 0 && (
                  <span className="text-xs text-gray-500">
                    · {Object.values(selectedOptions).join(" · ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 规格选择器（如果有 product.options） */}
          {product.options && product.options.length > 0 ? (
            <div className="space-y-4">
              {product.options.map((option, optionIndex) => {
                console.log(`🎨 老王我渲染 option[${optionIndex}]:`, {
                  id: option.id,
                  title: option.title,
                  values: option.values,
                  valuesCount: option.values?.length
                });

                return (
                  <div key={option.id}>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      {option.title}
                    </label>
                    {/* 下拉框 */}
                    <div className="relative">
                      <select
                        value={selectedOptions[option.id] || ""}
                        onChange={(e) => handleOptionSelect(option.id, e.target.value)}
                        className="
                          w-full
                          px-4
                          py-3
                          rounded-xl
                          border-2
                          border-gray-200
                          bg-white
                          text-gray-900
                          font-semibold
                          focus:outline-none
                          focus:border-brand-pink
                          focus:ring-4
                          focus:ring-brand-pink/10
                          transition-all
                          appearance-none
                          cursor-pointer
                        "
                      >
                        {option.values && option.values.length > 0 ? (
                          option.values.map((val) => (
                            <option key={val.id} value={val.value}>
                              {val.value}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            无可选值
                          </option>
                        )}
                      </select>

                      {/* 自定义下拉箭头 */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* 显示选中值 */}
                    <div className="mt-2 text-xs text-gray-500">
                      {t("specSelected")}：<span className="font-semibold text-brand-pink">{selectedOptions[option.id] || t("pleaseSelect")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
              ℹ️ {t("noSpec")}
            </div>
          )}

          {/* 数量选择器 */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              {t("redeemQuantity")}
            </label>
            <div className="flex items-center gap-3">
              {/* 减少按钮 */}
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  border-2
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    quantity <= 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink/5'
                  }
                `}
              >
                <Minus size={18} />
              </button>

              {/* 数量输入 */}
              <div className="flex-1">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  min={1}
                  max={maxQuantity}
                  className="
                    w-full
                    h-12
                    text-center
                    text-xl
                    font-bold
                    text-gray-900
                    border-2
                    border-gray-200
                    rounded-xl
                    focus:outline-none
                    focus:border-brand-pink
                    focus:ring-4
                    focus:ring-brand-pink/10
                    transition-all
                  "
                />
              </div>

              {/* 增加按钮 */}
              <button
                onClick={handleIncrease}
                disabled={quantity >= maxQuantity}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  border-2
                  flex
                  items-center
                  justify-center
                  transition-all
                  ${
                    quantity >= maxQuantity
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-brand-pink hover:text-brand-pink hover:bg-brand-pink/5'
                  }
                `}
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {t("maxQuantity", { count: maxQuantity })}
            </p>
          </div>

          {/* 积分明细 */}
          <div
            className="
              rounded-2xl
              bg-gradient-to-br
              from-gray-50
              to-gray-100
              p-5
              border
              border-gray-100
              space-y-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("currentPoints")}</span>
              <span className="text-lg font-bold text-gray-900">
                {userPoints.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t("pointsConsumed")}</span>
              <span className="text-lg font-bold text-brand-pink">
                -{totalPointsRequired.toLocaleString()}
              </span>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {t("remainingAfterRedeem")}
              </span>
              <span
                className={`
                  text-2xl
                  font-black
                  ${canAfford ? 'text-gray-900' : 'text-red-500'}
                `}
              >
                {remainingPoints.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 低余额警告 */}
          {isLowBalance && canAfford && (
            <div
              className="
                flex items-start gap-3
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-orange-50
                to-orange-100
                border-2
                border-orange-200
              "
            >
              <Star size={20} className="text-orange-500 fill-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-700">
                {t("lowBalanceWarningText")}
              </p>
            </div>
          )}

          {/* 积分不足提示 */}
          {!canAfford && (
            <div
              className="
                flex items-start gap-3
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-red-50
                to-red-100
                border-2
                border-red-200
              "
            >
              <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                {t("insufficientPointsMessage")}
              </p>
            </div>
          )}
        </div>

        {/* 弹窗底部 */}
        <div
          className="
            flex
            gap-3
            p-6
            pt-4
            border-t
            border-gray-100
          "
        >
          <button
            onClick={onClose}
            disabled={isRedeeming}
            className="
              flex-1
              px-6
              py-3
              rounded-2xl
              bg-gray-100
              text-gray-700
              font-semibold
              hover:bg-gray-200
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleRedeem}
            disabled={isRedeeming || !canAfford}
            className={`
              flex-1
              px-6
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-brand-pink
              to-brand-blue
              text-white
              font-semibold
              hover:shadow-lg
              hover:shadow-brand-pink/30
              hover:scale-105
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:hover:scale-100
            `}
          >
            {isRedeeming ? (
              <span className="flex items-center justify-center gap-2">
                {t("redeeming")}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={18} />
                {t("confirmRedeem")}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
