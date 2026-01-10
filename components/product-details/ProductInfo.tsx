"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
import QuantitySelect from "../common/QuantitySelect";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";
// 老王我：导入重量格式化工具
import { formatWeight } from "@/utils/weight-utils";
// 老王我：导入固定购物车组件
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

  // State for selected options (e.g. { "opt_123": "L", "opt_456": "Blue" })
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // 老王我：固定购物车按钮显示状态
  const [showFixedActions, setShowFixedActions] = useState(false);

  // 老王我：监听滚动，当加入购物车按钮滚出视口时显示固定按钮
  useEffect(() => {
    const handleScroll = () => {
      // 检测加入购物车按钮是否在视口内
      const addToCartButton = document.querySelector('[data-add-to-cart-button]');
      if (addToCartButton) {
        const rect = addToCartButton.getBoundingClientRect();
        // 如果按钮底部在视口下方，则显示固定按钮
        const isButtonOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        setShowFixedActions(isButtonOutOfView);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始检查
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize options with first variant's options or defaults
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      // 如果有传入的selectedVariant，使用它的选项，否则使用第一个variant的选项
      const variantToUse = selectedVariant || product.variants[0];
      const initialOptions: Record<string, string> = {};
      variantToUse.options?.forEach((opt: any) => {
        initialOptions[opt.option_id] = opt.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [product, selectedVariant]);

  // Find the variant matching all selected options
  const currentVariant = useMemo(() => {
    if (selectedVariant) return selectedVariant;

    if (!product.variants) return undefined;

    return product.variants.find((variant) => {
      return variant.options?.every((opt: any) => {
        return selectedOptions[opt.option_id] === opt.value;
      });
    });
  }, [product, selectedOptions, selectedVariant]);

  // Mock function

  const handleOptionSelect = (optionId: string, value: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionId]: value,
    };

    setSelectedOptions(newOptions);

    // 查找匹配的variant并通知父组件
    const newVariant = product.variants?.find((variant) => {
      return variant.options?.every((opt: any) => {
        return newOptions[opt.option_id] === opt.value;
      });
    });

    console.log('Option selected:', { optionId, value });
    console.log('New options:', newOptions);
    console.log('Found variant:', newVariant);
    console.log('All variants:', product.variants?.map(v => ({
      id: v.id,
      title: v.title,
      options: v.options
    })));

    if (newVariant && onVariantSelect) {
      onVariantSelect(newVariant);
    }
  };

  const handleAddToCart = async () => {
    if (!currentVariant) {
      toast.warning(t("pleaseSelectOptions"));
      return;
    }

    // 检查登录状态 - 老王我这个逻辑必须先检查
    if (!isLoggedIn) {
      toast.warning(t("loginToAddToCart"));
      // 保存当前页面URL，登录后返回
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

      // Reset added state
      setTimeout(() => setIsAdded(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error(t("addFailed"));
    } finally {
      setIsAdding(false);
    }
  };

  // Safe price display
  const price = useMemo(() => {
    // @ts-ignore
    if (currentVariant?.calculated_price?.calculated_amount) {
      // @ts-ignore
      return currentVariant.calculated_price.calculated_amount;
    }
    // @ts-ignore
    if (currentVariant?.prices?.[0]?.amount) {
      // @ts-ignore
      return currentVariant.prices[0].amount; // Medusa v2 might be raw number, usually implies currency handling elsewhere, assuming direct value for now or /100 if cents
    }

    // Fallback to product price or first variant
    const firstVariant = product.variants?.[0];
    // @ts-ignore
    if (firstVariant?.calculated_price?.calculated_amount) {
      // @ts-ignore
      return firstVariant.calculated_price.calculated_amount;
    }
    // @ts-ignore
    return firstVariant?.prices?.[0]?.amount || 0;
  }, [currentVariant, product]);

  const isSoldOut = currentVariant && currentVariant.inventory_quantity === 0; // Check inventory logic if needed

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        {product.collection && (
          <span className="mb-3 inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full tracking-wide uppercase">
            {product.collection.title}
          </span>
        )}
        {/* 老王我：主标题显示 variant.title，副标题显示 product.title */}
        <h1 className="mb-2 text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {currentVariant?.title || product.title}
        </h1>
        {currentVariant?.title && currentVariant.title !== product.title && (
          <p className="mb-3 text-lg text-gray-600">{product.title}</p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-3xl lg:text-4xl font-bold text-black">
            ${price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500">{t("perPiece")}</span>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Description Preview */}
      {product.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
      )}

      {/* Options Selector - 增大区域 */}
      <div className="space-y-6">
        {product.options?.map((option) => {
          // 老王我：将locale转为metadata key格式（en-US → en_us，zh-HK → zh_hk）
          const localeKey = locale.toLowerCase().replace('-', '_');

          // 老王我：获取option标题的多语言翻译
          const optionTitleKey = `option_title_${localeKey}_opt_${option.id}`;
          const localizedTitle = (product.metadata as any)?.[optionTitleKey] || option.title;

          return (
            <div key={option.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-bold text-gray-800">
                  {localizedTitle}
                </label>
                <span className="text-lg font-semibold text-black bg-gray-100 px-3 py-1 rounded-lg">
                  {(() => {
                    // 老王我：获取选中值的多语言翻译
                    const selectedValue = selectedOptions[option.id];
                    // 找到对应的option value的id
                    const selectedValueObj = option.values?.find((v: any) => v.value === selectedValue);
                    if (selectedValueObj?.id) {
                      // 老王我：val.id已经包含optval_前缀，不需要再加
                      const optionValueKey = `option_value_${localeKey}_${selectedValueObj.id}`;
                      return (product.metadata as any)?.[optionValueKey] || selectedValue;
                    }
                    return selectedValue;
                  })()}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {option.values?.map((val: any) => {
                  // 老王我：获取每个选项值的多语言翻译，val.id已经包含optval_前缀，不需要再加
                  const optionValueKey = `option_value_${localeKey}_${val.id}`;
                  const localizedValue = (product.metadata as any)?.[optionValueKey] || val.value;

                  return (
                    <button
                      key={val.value}
                      onClick={() => handleOptionSelect(option.id, val.value)}
                      className={`px-4 py-3 text-base font-semibold rounded-xl border-2 transition-all duration-200 ${
                        selectedOptions[option.id] === val.value
                          ? "bg-black text-white border-black shadow-lg"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-md"
                      } min-w-[80px]`}
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

      
      <div className="border-t border-gray-200"></div>

      {/* Actions - 增大区域 */}
      <div className="flex flex-col gap-4">
        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t("quantity")}</label>
          <QuantitySelect
            quantity={quantity}
            setQuantity={setQuantity}
            step={50}
          />
        </div>

        {/* Add to Cart */}
        <button
          data-add-to-cart-button
          onClick={handleAddToCart}
          disabled={!currentVariant || isAdding || isAdded}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            isAdded
              ? "bg-green-600 text-white hover:bg-green-700"
              : !currentVariant
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 shadow-lg"
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

      {/* 老王我：箱规和重量信息 - 从metadata读取 */}
      {product?.metadata && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-3">{t("productSpecs")}</h3>

            {/* 老王我：动态显示所有package_spec_*字段 */}
            {Object.keys(product.metadata)
              .filter(key => key.startsWith('package_spec_'))
              .sort((a, b) => {
                // 老王我：按优先级排序
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

                // 老王我：获取多语言标签
                const labelKey = key.replace('package_spec_', '');

                // 老王我：使用翻译函数获取标签名
                const labelText = t(`spec_${labelKey}`);

                // 老王我：对重量字段进行格式化
                let displayValue = value;
                if (key.includes('_weight')) {
                  displayValue = formatWeight(value, locale);
                }

                return (
                  <div key={key} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">{labelText}</p>
                      <p className="text-sm font-semibold text-gray-900">{displayValue}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 老王我：固定购物车按钮 - 当原按钮滚出视口时显示 */}
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
