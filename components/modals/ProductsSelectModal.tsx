"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  X,
} from "lucide-react";

// Import shadcn components
import { Checkbox } from "@/components/ui/checkbox";
import { InputNumber } from "@/components/ui/input-number";

// Import other components
import Image from "next/image";
import { StoreCart, StoreProduct } from "@medusajs/types";

// 老王我：导入 server actions
import { batchAddCartItems, getOrSetCart } from "@/data/cart";

// 老王我：导入多语言翻译工具
import { getLocalizedVariantOptions } from "@/utils/product-localization";

// 老王我：导入苹果风格 B2B 样式常量
import {
  b2bButton,
  b2bCard,
  b2bInput,
  b2bText,
  b2bBadge,
  b2bShadow,
  b2bAnimation,
} from "@/lib/b2b-styles";

type Props = {
  show: boolean;
  onHide: () => void;
  cart: StoreCart | null;
  products: StoreProduct[];
};

const ProductsSelectModal = ({ show, onHide, cart, products }: Props) => {
  const router = useRouter();
  const locale = useLocale();
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // State management
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  // Filter products based on search and categories
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.variants?.some((v: any) =>
          v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.options?.some((opt: any) =>
            opt.value?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.collection?.title || 'Uncategorized')
      );
    }

    return result;
  }, [products, searchQuery, selectedCategories]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.collection?.title || 'Uncategorized');
    return Array.from(new Set(cats));
  }, [products]);

  // Initialize state
  useEffect(() => {
    if (show) {
      setSelectedSkus([]);
      setQuantities({});
      setCurrentY(0);
    }
  }, [show]);

  // Handle drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartY('touches' in e ? e.touches[0].clientY : e.clientY);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = y - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // 老王我：如果拖动超过 150px，关闭 Bottom Sheet
    if (currentY > 150) {
      onHide();
    }
    setCurrentY(0);
  };

  // Toggle functions
  const toggleProduct = (productId: string) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSkuSelection = (skuId: string) => {
    setSelectedSkus((prev) => {
      const isSelected = prev.includes(skuId);
      if (!isSelected) {
        if (!quantities[skuId]) {
          setQuantities((q) => ({ ...q, [skuId]: 50 }));
        }
        return [...prev, skuId];
      }
      return prev.filter((id) => id !== skuId);
    });
  };

  const updateQuantity = (skuId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [skuId]: qty }));
  };

  const toggleProductSelection = (product: any) => {
    const allSkuIds = product.variants?.map((v: any) => v.id) || [];
    const isAllSelected = allSkuIds.every((id: string) => selectedSkus.includes(id));

    if (isAllSelected) {
      setSelectedSkus((prev) => prev.filter((id) => !allSkuIds.includes(id)));
    } else {
      setSelectedSkus((prev) => {
        const newSelected = [...prev];
        const newQuantities = { ...quantities };

        allSkuIds.forEach((id: string) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
            if (!newQuantities[id]) {
              newQuantities[id] = 50;
            }
          }
        });

        setQuantities(newQuantities);
        return newSelected;
      });
    }
  };

  // Submit selection
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // 老王我修复：当购物车为空时，先获取或创建购物车（就像 addToCart 那样）
      const currentCart = await getOrSetCart();
      if (!currentCart) {
        throw new Error("Error retrieving or creating cart");
      }

      const itemsToAdd: Array<{
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
      }> = [];

      for (const skuId of selectedSkus) {
        const quantity = quantities[skuId] || 50;
        itemsToAdd.push({
          variant_id: skuId,
          quantity,
        });
      }

      if (itemsToAdd.length > 0) {
        await batchAddCartItems(currentCart.id, itemsToAdd);
      }

      setSubmitting(false);
      router.refresh();
      onHide();
    } catch (error) {
      console.error("Error updating cart:", error);
      setSubmitting(false);
    }
  };

  // Calculate summary
  const summary = useMemo(() => {
    const selectedProducts = products
      .flatMap(p => p.variants || [])
      .filter(v => selectedSkus.includes(v.id));

    const totalItems = selectedProducts.reduce((sum, variant) => {
      return sum + (quantities[variant.id] || 50);
    }, 0);

    const totalPrice = selectedProducts.reduce((sum, variant) => {
      const price = variant.calculated_price?.calculated_amount || 0;
      const quantity = quantities[variant.id] || 50;
      return sum + (price * quantity);
    }, 0);

    return {
      products: selectedProducts.length,
      items: totalItems,
      total: totalPrice
    };
  }, [products, selectedSkus, quantities]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-6">
      {/* 老王我：苹果风格遮罩层 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onHide}
      />

      {/* 老王我：苹果风格 Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full lg:w-[880px] xl:w-[1040px] h-[92vh] lg:h-[82vh] flex flex-col bg-white rounded-t-3xl lg:rounded-3xl ${b2bShadow.lg} transition-all duration-300 ease-out`}
        style={{
          transform: currentY > 0 ? `translateY(${currentY}px)` : 'translateY(0)',
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* 老王我：拖拽手柄（移动端） */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing lg:hidden">
          <div className="w-9 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 老王我：头部 - 苹果风格 */}
        <div className="px-5 lg:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            {/* 图标 */}
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                添加商品
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">选择商品并添加到购物车</p>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onHide}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 老王我：搜索框 - 苹果风格 */}
        <div className="px-5 lg:px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称或规格..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 text-sm text-gray-900 ${b2bInput.search}`}
            />
          </div>
        </div>

        {/* 老王我：分类筛选 - 苹果风格 */}
        {categories.length > 1 && (
          <div className="px-5 lg:px-6 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategories(prev =>
                      prev.includes(cat)
                        ? prev.filter(c => c !== cat)
                        : [...prev, cat]
                    );
                  }}
                  className={
                    selectedCategories.includes(cat)
                      ? b2bBadge.primary + " cursor-pointer transition-all duration-200"
                      : b2bBadge.default + " cursor-pointer hover:bg-gray-200 transition-all duration-200"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 老王我：商品列表 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">没有找到商品</h3>
              <p className="text-sm text-gray-400">
                {searchQuery || selectedCategories.length > 0
                  ? "尝试调整搜索条件"
                  : "商品列表为空"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const isExpanded = expandedProductIds.includes(product.id);
                const allSkuIds = product.variants?.map((v: any) => v.id) || [];
                const isAllSelected = allSkuIds.length > 0 && allSkuIds.every((id: string) => selectedSkus.includes(id));
                const isIndeterminate = allSkuIds.some((id: string) => selectedSkus.includes(id)) && !isAllSelected;
                const selectedCount = allSkuIds.filter((id: string) => selectedSkus.includes(id)).length;

                return (
                  <div key={product.id}>
                    {/* 老王我：商品行 - 苹果风格 */}
                    <div className="flex items-center gap-3.5 px-5 lg:px-6 py-3.5 hover:bg-gray-50 transition-colors duration-150">
                      {/* 商品图片 */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200/60">
                        <Image
                          src={product.thumbnail || `https://picsum.photos/100/100?random=${product.id}`}
                          alt={product.title || "Product"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {product.variants?.length || 0} 个规格
                          {selectedCount > 0 && (
                            <span className="text-brand-blue ml-1.5 font-medium">
                              已选 {selectedCount}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(input: HTMLInputElement | null) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onCheckedChange={() => toggleProductSelection(product)}
                          className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
                        />
                        <button
                          onClick={() => toggleProduct(product.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 老王我：SKU 列表 - 苹果风格 */}
                    {isExpanded && (
                      <div className="bg-gray-50/80 px-5 lg:px-6 py-3">
                        <div className="space-y-2">
                          {product.variants?.map((variant: any) => {
                            const isSelected = selectedSkus.includes(variant.id);
                            const quantity = quantities[variant.id] || 50;
                            const price = variant.calculated_price?.calculated_amount || 0;
                            const localizedOptions = getLocalizedVariantOptions(product, variant, locale);

                            return (
                              <div
                                key={variant.id}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-blue-50/70 border-l-[3px] border-l-brand-blue'
                                    : 'bg-white border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm'
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSkuSelection(variant.id)}
                                  className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-800 truncate">
                                    {variant.title || '默认规格'}
                                  </div>
                                  <div className="text-xs text-gray-400 truncate mt-0.5">
                                    {localizedOptions.map((opt: any) =>
                                      opt.option_title ? `${opt.option_title}: ${opt.localized_value}` : opt.localized_value
                                    ).join(" · ") || "无规格"}
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0 min-w-[70px]">
                                  <div className="text-sm font-semibold text-gray-900 font-mono">
                                    {formatAmount(price)}
                                  </div>
                                  <div className="text-[10px] text-gray-400">单价</div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <InputNumber
                                    value={quantity}
                                    onChange={(value) => updateQuantity(variant.id, value)}
                                    min={50}
                                    step={50}
                                    size="sm"
                                  />
                                  <span className="text-xs font-medium text-gray-400">件</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 老王我：底部汇总 - 苹果风格 */}
        <div className="border-t border-gray-100 bg-white px-5 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-5">
              <div className="text-sm">
                <span className="text-gray-400">已选</span>
                <span className="text-base font-semibold text-gray-900 ml-1">{summary.products}</span>
                <span className="text-gray-400 ml-0.5">款</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">共</span>
                <span className="text-base font-semibold text-gray-900 ml-1">{summary.items}</span>
                <span className="text-gray-400 ml-0.5">件</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-0.5">预估总价</div>
              <div className="text-xl font-bold text-gray-900 font-mono">
                {formatAmount(summary.total)}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {/* 取消按钮 */}
            <button
              onClick={onHide}
              disabled={submitting}
              className={`${b2bButton.secondary} flex-1 h-10`}
            >
              取消
            </button>

            {/* 确认添加按钮 */}
            <button
              onClick={handleSubmit}
              disabled={submitting || selectedSkus.length === 0}
              className={`${b2bButton.primary} flex-1 h-10 flex items-center justify-center gap-2`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  添加中...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  添加 {selectedSkus.length} 个商品
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSelectModal;
