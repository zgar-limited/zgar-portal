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

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

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
      setTimeout(() => setIsAdded(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error(t("addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 移动端：底部固定栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        {/* 收起状态 */}
        {!isExpanded && (
          <div
            className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{productName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-gray-900">{formatAmount(productPrice)}</span>
                <span className="text-xs text-gray-500">/件</span>
                <span className="text-xs text-gray-500">x{quantity}</span>
              </div>
            </div>

            <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!variantId || isAdding || isAdded}
              className={`ml-3 px-5 py-3 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer ${
                isAdded
                  ? "bg-green-600 text-white"
                  : !variantId
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isAdded ? (
                <Check size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
              <span className="flex-shrink-0">
                {isAdding ? t("adding") : isAdded ? t("added") : t("addToCart")}
              </span>
            </button>
          </div>
        )}

        {/* 展开状态 */}
        {isExpanded && (
          <div className="bg-white">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">购物车</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-4 py-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">{productName}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatAmount(productPrice)}</p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3">
                <span className="text-sm font-semibold text-gray-700">数量</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 50}
                    className={`w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer ${
                      quantity <= 50
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Minus size={18} strokeWidth={2} />
                  </button>

                  <div className="min-w-[80px] text-center">
                    <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                  </div>

                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center bg-white text-gray-900 border border-gray-900 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                  >
                    <Plus size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">总价</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatAmount(productPrice * quantity)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!variantId || isAdding || isAdded}
                className={`w-full flex items-center justify-center gap-3 py-4 font-semibold text-base transition-colors cursor-pointer ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : !variantId
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isAdding ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : isAdded ? (
                  <Check size={22} />
                ) : (
                  <ShoppingCart size={22} />
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
              bg-white border border-gray-200 shadow-lg overflow-hidden transition-all duration-300
              ${isExpanded ? "w-80 opacity-100 scale-100" : "w-0 h-0 opacity-0 scale-95"}
            `}
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">快速购买</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{productName}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatAmount(productPrice)}</p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3">
                <span className="text-sm font-semibold text-gray-700">数量</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 50}
                    className={`w-9 h-9 flex items-center justify-center font-bold transition-colors cursor-pointer ${
                      quantity <= 50
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Minus size={16} strokeWidth={2} />
                  </button>

                  <div className="min-w-[70px] text-center">
                    <span className="text-xl font-bold text-gray-900">{quantity}</span>
                  </div>

                  <button
                    onClick={handleIncrement}
                    className="w-9 h-9 flex items-center justify-center bg-white text-gray-900 border border-gray-900 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">总价</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatAmount(productPrice * quantity)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!variantId || isAdding || isAdded}
                className={`w-full flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-colors cursor-pointer ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : !variantId
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isAdding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isAdded ? (
                  <Check size={18} />
                ) : (
                  <ShoppingCart size={18} />
                )}
                <span>{isAdding ? t("adding") : isAdded ? t("added") : t("confirmAddToCart")}</span>
              </button>
            </div>
          </div>

          {/* 浮动触发按钮 */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="group bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-3 px-5 py-4 cursor-pointer"
            >
              <ShoppingCart size={22} />
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">加入购物车</p>
                <p className="text-xs text-gray-300">{formatAmount(productPrice)}</p>
              </div>
              <div className="bg-white/20 w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold">{quantity}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 移动端底部占位 */}
      <div className="lg:hidden h-20" />
    </>
  );
}
