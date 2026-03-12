"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ShoppingCart, Check, Loader2, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";
import FixedProductActions from "./FixedProductActions";

interface ProductInfoProps {
  product: StoreProduct;
  selectedVariant?: StoreProductVariant;
  onVariantSelect?: (variant: StoreProductVariant) => void;
}

export default function ProductInfo({ product, selectedVariant, onVariantSelect }: ProductInfoProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Product");
  const { isLoggedIn } = useCustomer();

  // 统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showFixedActions, setShowFixedActions] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      const addToCartButton = document.querySelector('[data-add-to-cart-button]');
      if (addToCartButton) {
        const rect = addToCartButton.getBoundingClientRect();
        const isButtonOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        setShowFixedActions(isButtonOutOfView);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 初始化选项 - 只在产品变化时初始化，避免规格选择时重置
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variantToUse = product.variants[0];
      const initialOptions: Record<string, string> = {};
      variantToUse.options?.forEach((opt: any) => {
        initialOptions[opt.option_id] = opt.value;
      });
      setSelectedOptions(initialOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // 查找当前选中的variant
  const currentVariant = useMemo(() => {
    if (selectedVariant) return selectedVariant;

    if (!product.variants) return undefined;

    return product.variants.find((variant) => {
      return variant.options?.every((opt: any) => {
        return selectedOptions[opt.option_id] === opt.value;
      });
    });
  }, [product, selectedOptions, selectedVariant]);

  // 处理选项选择
  const handleOptionSelect = (optionId: string, value: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionId]: value,
    };

    setSelectedOptions(newOptions);

    const newVariant = product.variants?.find((variant) => {
      return variant.options?.every((opt: any) => {
        return newOptions[opt.option_id] === opt.value;
      });
    });

    if (newVariant && onVariantSelect) {
      onVariantSelect(newVariant);
    }
  };

  // 加入购物车
  const handleAddToCart = async () => {
    if (!currentVariant) {
      toast.warning(t("pleaseSelectOptions"));
      return;
    }

    if (!isLoggedIn) {
      toast.warning(t("loginToAddToCart"));
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        quantity,
        variant_id: currentVariant.id,
        metadata: currentVariant.metadata,
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

  // 计算价格
  const price = useMemo(() => {
    if (currentVariant?.calculated_price?.calculated_amount) {
      return currentVariant.calculated_price.calculated_amount;
    }
    if (currentVariant?.prices?.[0]?.amount) {
      return currentVariant.prices[0].amount;
    }

    const firstVariant = product.variants?.[0];
    if (firstVariant?.calculated_price?.calculated_amount) {
      return firstVariant.calculated_price.calculated_amount;
    }
    return firstVariant?.prices?.[0]?.amount || 0;
  }, [currentVariant, product]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header - 分类标签 + 标题 */}
      <div>
        {product.collection && (
          <div className="mb-4">
            <span className="inline-block bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-widest">
              {product.collection.title}
            </span>
          </div>
        )}
        <h1 className="mb-2 text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
          {product.title}
        </h1>

        {/* 价格展示 */}
        <div className="mt-6">
          {isLoggedIn ? (
            <div className="border border-gray-200 bg-white px-6 py-4 inline-block">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                  {formatAmount(price)}
                </span>
                <span className="text-sm text-gray-500">{t("perPiece")}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="border border-gray-900 bg-gray-900 text-white px-6 py-4 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                <div className="text-left">
                  <p className="text-base font-semibold">登录查看价格</p>
                  <p className="text-sm text-gray-300">会员专享价</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-px bg-gray-200"></div>

      {/* 规格选择 */}
      <div className="space-y-6">
        {product.options?.map((option, optionIndex) => {
          const localeKey = locale.toLowerCase().replace('-', '_');
          const optionTitleKey = `option_title_${localeKey}_opt_${option.id}`;
          const localizedTitle = (product.metadata as any)?.[optionTitleKey] || option.title;

          return (
            <div key={option.id} className="space-y-3">
              {/* 标题 */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {localizedTitle}
                </h3>
                {selectedOptions[option.id] && (
                  <span className="text-sm text-gray-600">
                    {(() => {
                      const selectedValue = selectedOptions[option.id];
                      const selectedValueObj = option.values?.find((v: any) => v.value === selectedValue);
                      if (selectedValueObj?.id) {
                        const optionValueKey = `option_value_${localeKey}_${selectedValueObj.id}`;
                        return (product.metadata as any)?.[optionValueKey] || selectedValue;
                      }
                      return selectedValue;
                    })()}
                  </span>
                )}
              </div>

              {/* 规格按钮 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {option.values?.map((val: any) => {
                  const optionValueKey = `option_value_${localeKey}_${val.id}`;
                  const localizedValue = (product.metadata as any)?.[optionValueKey] || val.value;
                  const isSelected = selectedOptions[option.id] === val.value;
                  const isLongText = localizedValue.length > 8;

                  return (
                    <button
                      key={val.value}
                      onClick={() => handleOptionSelect(option.id, val.value)}
                      className={`
                        relative px-4 py-3 text-sm font-medium border transition-all cursor-pointer min-w-[80px]
                        ${isSelected
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }
                      `}
                      aria-label={`选择 ${localizedValue}`}
                    >
                      <span className={`block ${isLongText ? 'leading-tight text-xs' : ''}`}>
                        {localizedValue}
                      </span>

                      {/* Tooltip for long text */}
                      {isLongText && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {localizedValue}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 分隔线 */}
      <div className="h-px bg-gray-200"></div>

      {/* Actions */}
      <div className="flex flex-col gap-6">
        {/* 数量选择 */}
        <div>
          <label className="block mb-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {t("quantity")}
            </h3>
          </label>

          <div className="flex items-center gap-3">
            {/* 减少按钮 */}
            <button
              onClick={() => setQuantity(quantity > 50 ? quantity - 50 : 50)}
              disabled={quantity <= 50}
              className="w-12 h-12 flex items-center justify-center border border-gray-900 text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="减少数量"
            >
              <Minus size={20} strokeWidth={2} />
            </button>

            {/* 数量输入 */}
            <input
              className="w-24 h-12 text-center text-xl font-semibold text-gray-900 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors"
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 50) setQuantity(val);
              }}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 50) setQuantity(50);
                else setQuantity(Math.round(val / 50) * 50);
              }}
              min={50}
              step={50}
              aria-label="数量"
            />

            {/* 增加按钮 */}
            <button
              onClick={() => setQuantity(quantity + 50)}
              className="w-12 h-12 flex items-center justify-center border border-gray-900 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="增加数量"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* 加入购物车按钮 */}
        <button
          data-add-to-cart-button
          onClick={handleAddToCart}
          disabled={!currentVariant || isAdding || isAdded}
          className={`
            w-full flex items-center justify-center gap-4 py-5 px-8 font-semibold text-lg tracking-wide transition-all cursor-pointer
            ${!currentVariant
              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }
          `}
          aria-label={t("addToCart")}
        >
          {isAdding ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isAdded ? (
            <Check size={24} />
          ) : (
            <ShoppingCart size={24} />
          )}
          <span className="text-lg">
            {isAdding
              ? t("adding")
              : isAdded
                ? t("addedToCart")
                : !currentVariant
                  ? t("selectOptions")
                  : t("addToCart")}
          </span>
        </button>
      </div>

      {/* 服务承诺 */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        {[
          { icon: Truck, label: "免费配送" },
          { icon: Shield, label: "正品保证" },
          { icon: RotateCcw, label: "7天退换" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="border border-gray-200 p-4 text-center hover:border-gray-400 transition-colors"
            >
              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-700" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* 固定购物车按钮 */}
      <FixedProductActions
        variantId={currentVariant?.id}
        variantMetadata={currentVariant?.metadata}
        productName={currentVariant?.title || product.title}
        productPrice={price}
        isVisible={showFixedActions}
      />
    </div>
  );
}
