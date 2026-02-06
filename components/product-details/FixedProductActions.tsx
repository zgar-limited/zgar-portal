"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, X, Check, Loader2, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/data/cart";

interface FixedProductActionsProps {
  variantId: string | undefined;
  variantMetadata: any;
  productName: string;
  productPrice: number;
  isVisible: boolean;
  onClose?: () => void;
}

export default function FixedProductActions({
  variantId,
  variantMetadata,
  productName,
  productPrice,
  isVisible,
  onClose,
}: FixedProductActionsProps) {
  const t = useTranslations("Product");
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 重置状态当variant变化时
  useEffect(() => {
    setIsAdded(false);
  }, [variantId]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 50);
  };

  const handleDecrement = () => {
    if (quantity > 50) {
      setQuantity((prev) => prev - 50);
    }
  };

  const handleAddToCart = async () => {
    if (!variantId) {
      toast.warning(t("pleaseSelectOptions"));
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        quantity,
        variant_id: variantId,
        metadata: variantMetadata,
      });
      setIsAdded(true);
      toast.success(t("addedSuccess"));

      // 重置状态
      setTimeout(() => setIsAdded(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error(t("addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  // 老王我：如果不显示，返回null
  if (!isVisible) return null;

  return (
    <>
      {/* 移动端：底部固定栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
        {/* 老王我：收起状态 */}
        {!isExpanded && (
          <div
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white cursor-pointer hover:from-gray-100 transition-all"
            onClick={() => setIsExpanded(true)}
          >
            {/* 左侧：产品信息和价格 */}
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{productName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-black">{formatAmount(productPrice)}</span>
                <span className="text-xs text-gray-500">/件</span>
                <span className="text-xs text-gray-500">x{quantity}</span>
              </div>
            </div>

            {/* 中间：展开指示器 */}
            <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />

            {/* 右侧：加入购物车按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!variantId || isAdding || isAdded}
              className={`ml-3 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 transition-all ${
                isAdded
                  ? "bg-green-600 text-white"
                  : !variantId
                  ? "bg-gray-300 text-gray-500"
                  : "bg-black text-white shadow-lg"
              }`}
            >
              {isAdding ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isAdded ? (
                <Check size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
              <span className="flex-shrink-0">
                {isAdding ? t("adding") : isAdded ? t("added") : t("addToCart")}
              </span>
            </button>
          </div>
        )}

        {/* 老王我：展开状态 - 数量调整和确认 */}
        {isExpanded && (
          <div className="bg-white">
            {/* 顶部栏：关闭按钮 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">购物车</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="px-4 py-4 space-y-4">
              {/* 产品信息 */}
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">{productName}</p>
                <p className="text-lg font-bold text-black mt-1">{formatAmount(productPrice)}</p>
              </div>

              {/* 数量选择器 */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-semibold text-gray-700">数量</span>
                <div className="flex items-center gap-3">
                  {/* 减号按钮 */}
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 50}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg transition-all ${
                      quantity <= 50
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-black border-2 border-gray-300 hover:border-gray-400 shadow-sm"
                    }`}
                  >
                    <Minus size={18} strokeWidth={3} />
                  </button>

                  {/* 数量显示 */}
                  <div className="min-w-[80px] text-center">
                    <span className="text-2xl font-bold text-black">{quantity}</span>
                  </div>

                  {/* 加号按钮 */}
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black border-2 border-gray-300 hover:border-gray-400 shadow-sm font-bold transition-all"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* 总价 */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">总价</span>
                <span className="text-xl font-bold text-black">
                  {formatAmount(productPrice * quantity)}
                </span>
              </div>

              {/* 确认加入购物车按钮 */}
              <button
                onClick={handleAddToCart}
                disabled={!variantId || isAdding || isAdded}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
                  isAdded
                    ? "bg-green-600 text-white shadow-lg"
                    : !variantId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white shadow-xl hover:bg-gray-800"
                }`}
              >
                {isAdding ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : isAdded ? (
                  <Check size={24} />
                ) : (
                  <ShoppingCart size={24} />
                )}
                <span>
                  {isAdding ? t("adding") : isAdded ? t("added") : t("confirmAddToCart")}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 桌面端：右下角浮动按钮 */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3 items-end">
          {/* 展开的主面板 */}
          <div
            className={`
              bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden transition-all duration-300
              ${isExpanded ? "w-80 opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-95"}
            `}
          >
            <div className="p-5 space-y-4">
              {/* 关闭按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">快速购买</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 产品信息 */}
              <div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{productName}</p>
                <p className="text-xl font-bold text-black mt-1">{formatAmount(productPrice)}</p>
              </div>

              {/* 数量选择器 */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-semibold text-gray-700">数量</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 50}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all ${
                      quantity <= 50
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-black border-2 border-gray-300 hover:border-gray-400 shadow-sm"
                    }`}
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>

                  <div className="min-w-[70px] text-center">
                    <span className="text-xl font-bold text-black">{quantity}</span>
                  </div>

                  <button
                    onClick={handleIncrement}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-black border-2 border-gray-300 hover:border-gray-400 shadow-sm font-bold transition-all"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* 总价 */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">总价</span>
                <span className="text-lg font-bold text-black">
                  {formatAmount(productPrice * quantity)}
                </span>
              </div>

              {/* 确认按钮 */}
              <button
                onClick={handleAddToCart}
                disabled={!variantId || isAdding || isAdded}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all ${
                  isAdded
                    ? "bg-green-600 text-white shadow-lg"
                    : !variantId
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white shadow-xl hover:bg-gray-800"
                }`}
              >
                {isAdding ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isAdded ? (
                  <Check size={20} />
                ) : (
                  <ShoppingCart size={20} />
                )}
                <span>{isAdding ? t("adding") : isAdded ? t("added") : t("confirmAddToCart")}</span>
              </button>
            </div>
          </div>

          {/* 浮动触发按钮 */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className={`
                group bg-black text-white rounded-full shadow-2xl hover:shadow-xl hover:bg-gray-800 transition-all duration-300
                flex items-center gap-3 px-6 py-4
                hover:scale-105 active:scale-95
              `}
            >
              <ShoppingCart size={24} />
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">加入购物车</p>
                <p className="text-xs opacity-80">{formatAmount(productPrice)}</p>
              </div>
              <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold">{quantity}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 老王我：移动端底部占位，防止内容被遮挡 */}
      <div className="lg:hidden h-20" />
    </>
  );
}
