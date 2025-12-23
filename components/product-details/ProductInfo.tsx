"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import QuantitySelect from "../common/QuantitySelect";
import { addToCart } from "@/data/cart";
import { useCustomer } from "@/hooks/useCustomer";

interface ProductInfoProps {
  product: StoreProduct;
  selectedVariant?: StoreProductVariant;
  onVariantSelect?: (variant: StoreProductVariant) => void;
}

export default function ProductInfo({ product, selectedVariant, onVariantSelect }: ProductInfoProps) {
  const router = useRouter();
  const t = useTranslations("Product");
  const { isLoggedIn } = useCustomer();

  // State for selected options (e.g. { "opt_123": "L", "opt_456": "Blue" })
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

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
        <h1 className="mb-3 text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {product.title}
        </h1>
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
        {product.options?.map((option) => (
          <div key={option.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-lg font-bold text-gray-800">
                {option.title}
              </label>
              <span className="text-lg font-semibold text-black bg-gray-100 px-3 py-1 rounded-lg">
                {selectedOptions[option.id]}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {option.values?.map((val: any) => {
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
                    {val.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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

      {/* Additional Info / Policies */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={16} className="text-green-600" />
          </div>
          <span className="text-base">{t("freeShipping")}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={16} className="text-green-600" />
          </div>
          <span className="text-base">{t("returnPolicy")}</span>
        </div>
      </div>
    </div>
  );
}
