"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { ShoppingCart, Check, Loader2, Truck, Shield, RotateCcw, Plus, Minus } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
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
              <div className="absolute inset-0 bg-brand-blue transform rotate-3 rounded-sm shadow-lg"></div>
              <span className="relative inline-block bg-brand-blue text-white px-8 py-4 text-lg font-black uppercase tracking-widest rounded-sm border-[5px] border-white shadow-2xl">
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

        {/* 老王我：价格展示 - Memphis 风格大卡片 */}
        <div className="relative">
          {isLoggedIn ? (
            <>
              {/* 老王我：Memphis 大卡片容器 - 已登录显示价格 */}
              <div
                className="relative p-6 shadow-xl inline-block"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '3px dashed #f496d3'
                }}
              >
                {/* 老王我：波点图案背景 */}
                <div
                  className="absolute inset-0 opacity-5 rounded-sm"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #f496d3 2px, transparent 2px)',
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none'
                  }}
                ></div>

                {/* 老王我：装饰性几何图形 */}
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 opacity-30"
                  style={{
                    backgroundColor: '#f496d3',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotate(-25deg)'
                  }}
                ></div>
                <div
                  className="absolute -bottom-3 -right-3 w-10 h-10 opacity-20 rounded-sm"
                  style={{ backgroundColor: '#f496d3' }}
                ></div>

                {/* 老王我：价格内容 */}
                <div className="relative z-10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'sans-serif' }}>
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-base text-gray-600 font-semibold">{t("perPiece")}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 老王我：登录提示卡片 - Memphis 风格 */}
              <button
                onClick={() => router.push('/login')}
                className="group relative"
              >
                <div
                  className="relative p-6 shadow-xl"
                  style={{
                    backgroundColor: '#0047c7',
                    borderRadius: '4px',
                    border: '3px dashed rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {/* 老王我：波点图案背景 */}
                  <div
                    className="absolute inset-0 opacity-5 rounded-sm"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                      backgroundSize: '20px 20px',
                      pointerEvents: 'none'
                    }}
                  ></div>

                  {/* 老王我：装饰性几何图形 */}
                  <div
                    className="absolute -top-3 -left-3 w-8 h-8 opacity-30"
                    style={{
                      backgroundColor: '#f496d3',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      transform: 'rotate(-25deg)'
                    }}
                  ></div>
                  <div
                    className="absolute -bottom-3 -right-3 w-10 h-10 opacity-20 rounded-sm"
                    style={{ backgroundColor: '#f496d3' }}
                  ></div>

                  {/* 老王我：提示内容 */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center"
                        style={{ transform: 'rotate(-5deg)' }}
                      >
                        <ShoppingCart size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-white leading-tight" style={{ fontFamily: 'sans-serif' }}>
                          登录查看价格
                        </p>
                        <p className="text-sm text-white/80 font-semibold">点击登录会员专享价</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 老王我：分隔线 - 超粗渐变线条 */}
      <div className="h-3 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-sm shadow-lg"></div>

      {/* 老王我：描述预览 */}
      {product.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
      )}

      {/* 老王我：规格选择 - Memphis 风格几何装饰 */}
      <div className="space-y-6">
        {product.options?.map((option, optionIndex) => {
          const localeKey = locale.toLowerCase().replace('-', '_');
          const optionTitleKey = `option_title_${localeKey}_opt_${option.id}`;
          const localizedTitle = (product.metadata as any)?.[optionTitleKey] || option.title;

          // 老王我：Memphis 明亮色彩
          const memphisColors = [
            { bg: '#f496d3', text: 'text-pink-500', border: 'border-pink-400' },  // 粉
            { bg: '#f496d3', text: 'text-yellow-500', border: 'border-yellow-400' },  // 黄
            { bg: '#0047c7', text: 'text-teal-500', border: 'border-teal-400' },  // 青
            { bg: '#0047c7', text: 'text-purple-500', border: 'border-purple-400' },  // 紫
          ];
          const colorScheme = memphisColors[optionIndex % memphisColors.length];

          return (
            <div key={option.id} className="space-y-4">
              {/* 老王我：Memphis 风格标题 - 波浪线装饰 */}
              <div className="relative">
                <div className="absolute -left-6 top-1/2 w-10 h-10 opacity-40 -translate-y-1/2"
                  style={{
                    backgroundColor: colorScheme.bg,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'translateY(-50%) rotate(-20deg)'
                  }}
                ></div>
                <div className="flex items-center justify-between pl-8">
                  <div>
                    {/* 老王我：波浪线装饰 */}
                    <div className="w-16 h-2 mb-1">
                      <svg viewBox="0 0 96 12" className="w-full h-full">
                        <path
                          d="M0,6 Q12,0 24,6 T48,6 T72,6 T96,6"
                          fill="none"
                          stroke={colorScheme.bg}
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-black ${colorScheme.text}`}>
                      {localizedTitle}
                    </h3>
                  </div>
                  {selectedOptions[option.id] && (
                    <span className="text-sm font-semibold bg-white px-4 py-2 rounded-sm border-2 shadow-sm"
                      style={{
                        borderColor: colorScheme.bg,
                        color: colorScheme.bg
                      }}
                    >
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

              {/* 老王我：Memphis 风格规格按钮 - 虚线+几何装饰 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {option.values?.map((val: any, index: number) => {
                  const optionValueKey = `option_value_${localeKey}_${val.id}`;
                  const localizedValue = (product.metadata as any)?.[optionValueKey] || val.value;

                  const isSelected = selectedOptions[option.id] === val.value;
                  const isLongText = localizedValue.length > 8;

                  // 老王我：每个按钮的装饰位置交替
                  const decorationPosition = index % 2 === 0 ? '-top-1.5 -right-1.5' : '-bottom-1.5 -left-1.5';

                  return (
                    <button
                      key={val.value}
                      onClick={() => handleOptionSelect(option.id, val.value)}
                      className="group relative"
                      aria-label={`选择 ${localizedValue}`}
                      style={{ fontFamily: 'sans-serif' }}
                    >
                      {/* 老王我：Memphis 虚线装饰边框 */}
                      {!isSelected && (
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            border: '2px dashed',
                            borderColor: colorScheme.bg,
                            padding: '4px'
                          }}
                        ></div>
                      )}

                      {/* 老王我：按钮背景 */}
                      <div
                        className="relative px-4 py-3 text-sm font-black rounded-sm border-2 transition-all duration-200 cursor-pointer min-w-[80px]"
                        style={{
                          backgroundColor: isSelected ? colorScheme.bg : 'white',
                          color: isSelected ? 'white' : '#374151',
                          borderColor: isSelected ? colorScheme.bg : '#D1D5DB',
                          transform: isSelected ? 'rotate(-2deg)' : 'rotate(0deg)',
                          boxShadow: isSelected ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'rotate(-2deg) scale(1.05)';
                            e.currentTarget.style.borderColor = colorScheme.bg;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                            e.currentTarget.style.borderColor = '#D1D5DB';
                          }
                        }}
                      >
                        {/* 老王我：文字内容 */}
                        <span className={`block ${isLongText ? 'leading-tight' : ''}`}>
                          {localizedValue}
                        </span>

                        {/* 老王我：Tooltip 巧妙设计 - 仅长文字显示 */}
                        {isLongText && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-sm shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            {localizedValue}
                            {/* 老王我：小三角箭头 */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}

                        {/* 老王我：选中状态装饰几何图形 */}
                        {isSelected && (
                          <div className={`absolute ${decorationPosition} w-5 h-5 bg-white rounded-sm shadow-md flex items-center justify-center`}
                            style={{ border: `3px solid ${colorScheme.bg}` }}
                          >
                            <div className="w-2 h-2 rounded-sm"
                              style={{ backgroundColor: colorScheme.bg }}
                            ></div>
                          </div>
                        )}

                        {/* 老王我：未选中状态装饰三角形 */}
                        {!isSelected && (
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 opacity-40"
                            style={{
                              backgroundColor: colorScheme.bg,
                              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            }}
                          ></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 老王我：分隔线 - 超粗 */}
      <div className="h-3 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink rounded-sm shadow-lg"></div>

      {/* 老王我：Actions */}
      <div className="flex flex-col gap-6">
        {/* 老王我：数量选择 - Memphis 风格 */}
        <div>
          <label className="block mb-5">
            {/* 老王我：标题区域带装饰 - Memphis 风格 */}
            <div className="relative">
              <div className="absolute -left-6 top-1/2 w-10 h-10 opacity-40 -translate-y-1/2"
                style={{
                  backgroundColor: '#f496d3',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: 'translateY(-50%) rotate(-20deg)'
                }}
              ></div>
              <div className="pl-8">
                {/* 老王我：波浪线装饰 */}
                <div className="w-16 h-2 mb-1">
                  <svg viewBox="0 0 96 12" className="w-full h-full">
                    <path
                      d="M0,6 Q12,0 24,6 T48,6 T72,6 T96,6"
                      fill="none"
                      stroke="#f496d3"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-brand-pink">
                  {t("quantity")}
                </h3>
              </div>
            </div>
          </label>

          {/* 老王我：数量选择器 - Memphis 风格 */}
          <div className="flex items-center gap-4">
            {/* 减少按钮 - Memphis 粉色块 */}
            <button
              onClick={() => setQuantity(quantity > 50 ? quantity - 50 : 50)}
              disabled={quantity <= 50}
              className="relative w-16 h-16 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: quantity <= 50 ? '#F9A8D4' : '#f496d3',
                borderRadius: '12px',
                transform: 'rotate(-3deg)',
                boxShadow: quantity <= 50 ? 'none' : '0 8px 20px rgba(255, 113, 206, 0.3)'
              }}
              aria-label="减少数量"
            >
              {/* 老王我：虚线装饰 */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '2px dashed rgba(255, 255, 255, 0.5)',
                  padding: '4px'
                }}
              ></div>
              <div className="relative z-10">
                <Minus size={28} strokeWidth={3} />
              </div>
            </button>

            {/* 数量显示 - Memphis 风格输入框 */}
            <div className="flex-1 relative">
              {/* 老王我：虚线装饰边框 */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '3px dashed #0047c7',
                  padding: '4px'
                }}
              ></div>
              <input
                className="relative w-full h-16 text-center text-3xl font-black text-gray-900 rounded-sm focus:outline-none transition-all bg-white"
                style={{
                  fontFamily: 'sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
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
            </div>

            {/* 增加按钮 - Memphis 青色块 */}
            <button
              onClick={() => setQuantity(quantity + 50)}
              className="relative w-16 h-16 flex items-center justify-center text-white transition-all duration-200"
              style={{
                backgroundColor: '#0047c7',
                borderRadius: '12px',
                transform: 'rotate(3deg)',
                boxShadow: '0 8px 20px rgba(134, 204, 202, 0.3)'
              }}
              aria-label="增加数量"
            >
              {/* 老王我：虚线装饰 */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  border: '2px dashed rgba(255, 255, 255, 0.5)',
                  padding: '4px'
                }}
              ></div>
              <div className="relative z-10">
                <Plus size={28} strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>

        {/* 老王我：加入购物车按钮 - Memphis 风格超大号 */}
        <button
          data-add-to-cart-button
          onClick={handleAddToCart}
          disabled={!currentVariant || isAdding || isAdded}
          className="relative group w-full flex items-center justify-center gap-5 py-8 px-10 rounded-sm font-black text-2xl tracking-wide transition-all duration-300 overflow-hidden"
          style={{
            fontFamily: 'sans-serif',
            transform: 'rotate(-1deg)',
            backgroundColor: !currentVariant ? '#E5E7EB' : (isAdded ? '#10B981' : '#f496d3'),
            boxShadow: !currentVariant ? 'none' : '0 12px 30px rgba(0,0,0,0.2)'
          }}
          aria-label={t("addToCart")}
        >
          {/* 老王我：Memphis 波点图案背景 */}
          {!isAdded && currentVariant && (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
          )}

          {/* 老王我：装饰性几何图形 */}
          {!isAdded && currentVariant && (
            <>
              {/* 三角形装饰 */}
              <div
                className="absolute top-4 left-6 w-8 h-8 opacity-30"
                style={{
                  backgroundColor: 'white',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: 'rotate(-15deg)'
                }}
              ></div>

              {/* 圆形装饰 */}
              <div
                className="absolute bottom-4 right-6 w-12 h-12 opacity-20 rounded-sm"
                style={{ backgroundColor: 'white' }}
              ></div>

              {/* X形装饰 */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 w-6 h-6 opacity-20">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <path
                    d="M4,4 L28,28 M28,4 L4,28"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
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
            <span className="text-2xl text-white">
              {isAdding
                ? t("adding")
                : isAdded
                ? t("addedToCart")
                : !currentVariant
                ? t("selectOptions")
                : t("addToCart")}
            </span>
          </div>

          {/* 老王我：悬停效果 */}
          {!isAdded && currentVariant && (
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          )}
        </button>
      </div>

      {/* 老王我：服务承诺 - Memphis 风格明亮卡片 */}
      <div className="grid grid-cols-3 gap-4 pt-8">
        {/* 老王我：配送服务 - Memphis 粉色 */}
        <div
          className="relative group overflow-hidden"
          style={{
            backgroundColor: '#f496d3',
            borderRadius: '12px'
          }}
        >
          {/* 老王我：虚线装饰边框 */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              padding: '6px'
            }}
          ></div>

          {/* 老王我：装饰性几何图形 - 三角形 */}
          <div
            className="absolute -top-2 -right-2 w-8 h-8 opacity-20"
            style={{
              backgroundColor: 'white',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(25deg)'
            }}
          ></div>

          {/* 老王我：内容 */}
          <div className="relative z-10 p-5 text-center">
            <div
              className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center mx-auto mb-3"
              style={{ transform: 'rotate(-5deg)' }}
            >
              <Truck className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-black text-white">免费配送</p>
          </div>
        </div>

        {/* 老王我：正品保证 - Memphis 黄色 */}
        <div
          className="relative group overflow-hidden"
          style={{
            backgroundColor: '#f496d3',
            borderRadius: '12px'
          }}
        >
          {/* 老王我：虚线装饰边框 */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              padding: '6px'
            }}
          ></div>

          {/* 老王我：装饰性几何图形 - 圆形 */}
          <div
            className="absolute -bottom-2 -left-2 w-8 h-8 opacity-20 rounded-sm"
            style={{ backgroundColor: 'white' }}
          ></div>

          {/* 老王我：内容 */}
          <div className="relative z-10 p-5 text-center">
            <div
              className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center mx-auto mb-3"
              style={{ transform: 'rotate(3deg)' }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-black text-white">正品保证</p>
          </div>
        </div>

        {/* 老王我：退换服务 - Memphis 青色 */}
        <div
          className="relative group overflow-hidden"
          style={{
            backgroundColor: '#0047c7',
            borderRadius: '12px'
          }}
        >
          {/* 老王我：虚线装饰边框 */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              border: '2px dashed rgba(255, 255, 255, 0.5)',
              padding: '6px'
            }}
          ></div>

          {/* 老王我：装饰性几何图形 - X形 */}
          <div className="absolute bottom-3 right-3 w-4 h-4 opacity-20">
            <svg viewBox="0 0 16 16" className="w-full h-full">
              <path
                d="M2,2 L14,14 M14,2 L2,14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 老王我：内容 */}
          <div className="relative z-10 p-5 text-center">
            <div
              className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-sm flex items-center justify-center mx-auto mb-3"
              style={{ transform: 'rotate(-3deg)' }}
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-black text-white">7天退换</p>
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
