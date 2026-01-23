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
            {/* 老王我：Vibrant Blocks 风格分类标签 - 大胆几何形状 */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-brand-blue transform rotate-2 rounded-2xl"></div>
              <span className="relative inline-block bg-brand-blue text-white px-6 py-3 text-base font-black uppercase tracking-widest rounded-2xl border-4 border-white shadow-xl">
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

        {/* 老王我：价格展示 - Vibrant Blocks 适中尺寸 */}
        <div className="relative inline-block group">
          {/* 老王我：装饰性几何形状 */}
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-brand-pink/20 rounded-2xl transform -rotate-12 group-hover:rotate-6 transition-transform duration-300"></div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue/20 rounded-xl transform rotate-12 group-hover:-rotate-6 transition-transform duration-300"></div>

          <div className="relative bg-gradient-to-br from-brand-pink via-brand-pink to-brand-blue p-6 rounded-2xl shadow-xl border-2 border-white">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                ${price.toFixed(2)}
              </span>
              <span className="text-base text-white/95 font-semibold">{t("perPiece")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 老王我：分隔线 - 粗壮渐变线条 */}
      <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-full shadow-md"></div>

      {/* 老王我：描述预览 */}
      {product.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
      )}

      {/* 老王我：规格选择 - 极简紧凑布局 */}
      <div className="space-y-4">
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
            <div key={option.id} className="space-y-3">
              {/* 老王我：标题 + 已选值（紧凑单行） */}
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-black ${titleColor}`}>
                  {localizedTitle}
                </h3>
                {selectedOptions[option.id] && (
                  <span className="text-sm font-semibold text-gray-600">
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

              {/* 老王我：规格按钮 - 紧凑网格布局 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {option.values?.map((val: any, index: number) => {
                  const optionValueKey = `option_value_${localeKey}_${val.id}`;
                  const localizedValue = (product.metadata as any)?.[optionValueKey] || val.value;

                  const isSelected = selectedOptions[option.id] === val.value;

                  return (
                    <button
                      key={val.value}
                      onClick={() => handleOptionSelect(option.id, val.value)}
                      className={`
                        px-4 py-2.5 text-sm font-bold rounded-lg border-2
                        transition-all duration-200 cursor-pointer
                        ${isSelected
                          ? `${titleColor.replace('text-', 'bg-')} text-white border-current shadow-md`
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-pink hover:shadow-sm"
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

      {/* 老王我：分隔线 */}
      <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-full shadow-md"></div>

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

        {/* 老王我：加入购物车按钮 - Vibrant Blocks 超大胆设计 */}
        <button
          data-add-to-cart-button
          onClick={handleAddToCart}
          disabled={!currentVariant || isAdding || isAdded}
          className={`
            relative overflow-hidden group w-full
            flex items-center justify-center gap-4 py-6 px-8
            rounded-2xl font-black text-xl tracking-wide
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
            </>
          )}

          {/* 老王我：按钮内容 */}
          <div className="relative flex items-center gap-4">
            {isAdding ? (
              <Loader2 size={28} className="animate-spin" />
            ) : isAdded ? (
              <Check size={28} />
            ) : (
              <ShoppingCart size={28} />
            )}
            <span className="text-xl">
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

      {/* 老王我：服务承诺 - Vibrant Blocks 大胆色块布局 */}
      <div className="grid grid-cols-3 gap-4 pt-6">
        {/* 老王我：配送服务 - 粉色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-pink transform rounded-2xl translate-y-1 group-hover:translate-y-2 transition-transform duration-200"></div>
          <div className="relative bg-gradient-to-br from-brand-pink to-brand-pink/80 text-white text-center p-6 rounded-2xl border-2 border-brand-pink shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm font-black tracking-wide">免费配送</p>
          </div>
        </div>

        {/* 老王我：正品保证 - 蓝色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-blue transform rounded-2xl translate-y-1 group-hover:translate-y-2 transition-transform duration-200"></div>
          <div className="relative bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white text-center p-6 rounded-2xl border-2 border-brand-blue shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm font-black tracking-wide">正品保证</p>
          </div>
        </div>

        {/* 老王我：退换服务 - 灰色块 */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gray-800 transform rounded-2xl translate-y-1 group-hover:translate-y-2 transition-transform duration-200"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-700 text-white text-center p-6 rounded-2xl border-2 border-gray-800 shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <RotateCcw className="w-7 h-7 text-white" />
            </div>
            <p className="text-sm font-black tracking-wide">7天退换</p>
          </div>
        </div>
      </div>

      {/* 老王我：箱规和重量信息 */}
      {product?.metadata && (
        <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-pink" />
            {t("productSpecs")}
          </h3>

          <div className="space-y-3">
            {Object.keys(product.metadata)
              .filter(key => key.startsWith('package_spec_'))
              .sort((a, b) => {
                const order = [
                  'package_spec_shipment_box_contains',
                  'package_spec_product_size',
                  'package_spec_product_weight',
                  'package_spec_packaging_box_size',
                  'package_spec_packaging_box_weight',
                  'package_spec_outer_box_size',
                  'package_spec_outer_box_weight',
                  'package_spec_shipment_box_size',
                  'package_spec_shipment_box_weight'
                ];
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
              })
              .map(key => {
                const value = product.metadata[key];
                if (!value) return null;

                const labelKey = key.replace('package_spec_', '');
                const labelText = t(`spec_${labelKey}`);

                let displayValue = value;
                if (key.includes('_weight')) {
                  displayValue = formatWeight(value, locale);
                }

                return (
                  <div key={key} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm">
                    <div className="w-8 h-8 bg-brand-pink/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package size={16} className="text-brand-pink" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">{labelText}</p>
                      <p className="text-sm font-black text-gray-900">{displayValue}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

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
