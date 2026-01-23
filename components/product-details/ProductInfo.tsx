"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ShoppingCart, Check, Loader2, Truck, Shield, RotateCcw, Package } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
import QuantitySelect from "../common/QuantitySelect";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";
import { formatWeight } from "@/utils/weight-utils";
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

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showFixedActions, setShowFixedActions] = useState(false);

  // 老王我：监听滚动，当加入购物车按钮滚出视口时显示固定按钮
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

  // 初始化选项
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variantToUse = selectedVariant || product.variants[0];
      const initialOptions: Record<string, string> = {};
      variantToUse.options?.forEach((opt: any) => {
        initialOptions[opt.option_id] = opt.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [product, selectedVariant]);

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
      {/* 老王我：Header - 分类标签 + 标题 */}
      <div>
        {product.collection && (
          <div className="mb-6 inline-block">
            {/* 老王我：Vibrant Blocks 超大分类标签 */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-brand-blue transform rotate-3 rounded-2xl shadow-lg"></div>
              <span className="relative inline-block bg-brand-blue text-white px-8 py-4 text-lg font-black uppercase tracking-widest rounded-2xl border-[5px] border-white shadow-2xl">
                {product.collection.title}
              </span>
            </div>
          </div>
        )}
        <h1 className="mb-4 text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
          {currentVariant?.title || product.title}
        </h1>
        {currentVariant?.title && currentVariant.title !== product.title && (
          <p className="mb-6 text-xl text-gray-600 font-semibold">{product.title}</p>
        )}

        {/* 老王我：价格展示 - 超大胆色块 */}
        <div className="relative inline-block group">
          {/* 老王我：大装饰块 */}
          <div className="absolute -top-2 -left-2 w-14 h-14 bg-brand-pink/30 rounded-2xl transform -rotate-12 group-hover:rotate-6 transition-transform duration-300 shadow-md"></div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand-blue/30 rounded-xl transform rotate-12 group-hover:-rotate-6 transition-transform duration-300 shadow-md"></div>
          <div className="absolute top-1/2 -left-8 w-3 h-20 bg-brand-pink -translate-y-1/2 rounded-lg shadow-md transform -rotate-12"></div>
          <div className="absolute top-1/2 -right-8 w-3 h-20 bg-brand-blue -translate-y-1/2 rounded-lg shadow-md transform rotate-12"></div>

          <div className="relative bg-gradient-to-br from-brand-pink via-brand-pink to-brand-blue p-6 rounded-2xl shadow-2xl border-[5px] border-white">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                ${price.toFixed(2)}
              </span>
              <span className="text-base text-white/95 font-semibold">{t("perPiece")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 老王我：分隔线 - 超粗渐变线条 */}
      <div className="h-3 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-full shadow-lg"></div>

      {/* 老王我：描述预览 */}
      {product.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
      )}

      {/* 老王我：规格选择 - 大胆色块装饰 */}
      <div className="space-y-6">
        {product.options?.map((option, optionIndex) => {
          const localeKey = locale.toLowerCase().replace('-', '_');
          const optionTitleKey = `option_title_${localeKey}_opt_${option.id}`;
          const localizedTitle = (product.metadata as any)?.[optionTitleKey] || option.title;

          // 老王我：规格标题循环使用粉蓝颜色
          const titleColors = [
            "text-brand-pink",
            "text-brand-blue",
            "text-gray-900",
          ];
          const titleColor = titleColors[optionIndex % titleColors.length];

          return (
            <div key={option.id} className="space-y-4">
              {/* 老王我：标题区域带装饰 */}
              <div className="relative">
                <div className="absolute -left-2 top-1/2 w-2 h-12 bg-brand-pink -translate-y-1/2 rounded-lg transform -rotate-6"></div>
                <div className="flex items-center justify-between pl-4">
                  <h3 className={`text-lg font-black ${titleColor}`}>
                    {localizedTitle}
                  </h3>
                  {selectedOptions[option.id] && (
                    <span className="text-base font-semibold text-gray-700 bg-brand-pink/10 px-4 py-2 rounded-xl border-2 border-brand-pink/30">
                      {
                        (() => {
                          const selectedValue = selectedOptions[option.id];
                          const selectedValueObj = option.values?.find((v: any) => v.value === selectedValue);
                          if (selectedValueObj?.id) {
                            const optionValueKey = `option_value_${localeKey}_${selectedValueObj.id}`;
                            return (product.metadata as any)?.[optionValueKey] || selectedValue;
                          }
                          return selectedValue;
                        })()
                      }
                    </span>
                  )}
                </div>
              </div>

              {/* 老王我：规格按钮 - 超大号网格布局 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {option.values?.map((val: any, index: number) => {
                  const optionValueKey = `option_value_${localeKey}_${val.id}`;
                  const localizedValue = (product.metadata as any)?.[optionValueKey] || val.value;

                  const isSelected = selectedOptions[option.id] === val.value;

                  return (
                    <button
                      key={val.value}
                      onClick={() => handleOptionSelect(option.id, val.value)}
                      className={`
                        px-5 py-3 text-base font-black rounded-xl border-[3px]
                        transition-all duration-200 cursor-pointer transform hover:scale-105
                        ${isSelected
                          ? `${titleColor.replace('text-', 'bg-')} text-white border-current shadow-xl`
                          : "bg-white text-gray-700 border-gray-300 hover:border-brand-pink hover:shadow-md"
                        }
                      `}
                      aria-label={`选择 ${localizedValue}`}
                    >
                      {localizedValue}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 老王我：分隔线 - 超粗 */}
      <div className="h-3 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-full shadow-lg"></div>

      {/* 老王我：Actions */}
      <div className="flex flex-col gap-6">
        {/* 数量选择 */}
        <div>
          <label className="block text-sm font-black text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-pink/10 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-brand-pink" />
            </div>
            {t("quantity")}
          </label>
          <QuantitySelect
            quantity={quantity}
            setQuantity={setQuantity}
            step={50}
          />
        </div>

        {/* 老王我：加入购物车按钮 - Vibrant Blocks 超超大号设计 */}
        <button
          data-add-to-cart-button
          onClick={handleAddToCart}
          disabled={!currentVariant || isAdding || isAdded}
          className={`
            relative overflow-hidden group w-full
            flex items-center justify-center gap-5 py-8 px-10
            rounded-2xl font-black text-2xl tracking-wide
            transition-all duration-300 transform
            ${isAdded
              ? "bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02] shadow-2xl"
              : !currentVariant
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-pink via-brand-pink to-brand-blue text-white hover:scale-[1.02] shadow-2xl"
            }
          `}
        >
          {/* 老王我：装饰性几何背景 */}
          {!isAdded && currentVariant && (
            <>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
              {/* 老王我：额外装饰块 */}
              <div className="absolute top-4 left-8 w-6 h-6 bg-white/20 rounded-lg transform -rotate-12"></div>
              <div className="absolute bottom-4 right-8 w-6 h-6 bg-white/20 rounded-lg transform rotate-12"></div>
            </>
          )}

          {/* 老王我：按钮内容 */}
          <div className="relative flex items-center gap-5">
            {isAdding ? (
              <Loader2 size={32} className="animate-spin" />
            ) : isAdded ? (
              <Check size={32} />
            ) : (
              <ShoppingCart size={32} />
            )}
            <span className="text-2xl">
              {isAdding
                ? t("adding")
                : isAdded
                ? t("addedToCart")
                : !currentVariant
                ? t("selectOptions")
                : t("addToCart")}
            </span>
          </div>
        </button>
      </div>

      {/* 老王我：服务承诺 - Vibrant Blocks 超大色块布局 */}
      <div className="grid grid-cols-3 gap-5 pt-8">
        {/* 老王我：配送服务 - 超大粉色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-pink transform rounded-2xl translate-y-1.5 group-hover:translate-y-2 transition-transform duration-200 shadow-lg"></div>
          <div className="relative bg-gradient-to-br from-brand-pink to-brand-pink/80 text-white text-center p-7 rounded-2xl border-3 border-brand-pink shadow-xl transform transition-transform">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-md">
              <Truck className="w-9 h-9 text-white" />
            </div>
            <p className="text-base font-black tracking-wide">免费配送</p>
          </div>
        </div>

        {/* 老王我：正品保证 - 超大蓝色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-blue transform rounded-2xl translate-y-1.5 group-hover:translate-y-2 transition-transform duration-200 shadow-lg"></div>
          <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white text-center p-7 rounded-2xl border-3 border-brand-blue shadow-xl transform transition-transform">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-md">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <p className="text-base font-black tracking-wide">正品保证</p>
          </div>
        </div>

        {/* 老王我：退换服务 - 超大灰色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gray-800 transform rounded-2xl translate-y-1.5 group-hover:translate-y-2 transition-transform duration-200 shadow-lg"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 text-white text-center p-7 rounded-2xl border-3 border-gray-800 shadow-xl transform transition-transform">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-md">
              <RotateCcw className="w-9 h-9 text-white" />
            </div>
            <p className="text-base font-black tracking-wide">7天退换</p>
          </div>
        </div>
      </div>

      {/* 老王我：固定购物车按钮 */}
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
