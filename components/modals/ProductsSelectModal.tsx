"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  AlertCircle,
  Filter,
  Grid3X3,
  List,
  X,
  GripVertical
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { InputNumber } from "@/components/ui/input-number";

// Import other components
import Image from "next/image";
import { StoreCart, StoreProduct } from "@medusajs/types";

// 老王我：导入 server actions
import { batchAddCartItems, getOrSetCart } from "@/data/cart";

// 老王我：导入多语言翻译工具
import { getLocalizedVariantOptions } from "@/utils/product-localization";

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

  // State management
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
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
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8">
      {/* 老王我：Skeuomorphism 背景 - 暗色模糊遮罩 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onHide}
      />

      {/* 老王我：Soft UI + Gradient Bottom Sheet - 现代简洁风格 */}
      {/* 移动端：95vh 高度 Bottom Sheet，PC端：85vh 高度宽面板 */}
      <div
        ref={sheetRef}
        className="relative w-full lg:w-[900px] xl:w-[1100px] h-[95vh] lg:h-[85vh] flex flex-col transition-all duration-200 ease-out rounded-t-3xl lg:rounded-3xl bg-gradient-to-br from-white to-gray-50/30 shadow-xl"
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
        {/* 老王我：拖拽手柄 - 简约灰色（移动端显示，PC端隐藏） */}
        <div className="flex justify-center py-4 cursor-grab active:cursor-grabbing lg:hidden">
          <div className="w-16 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* 老王我：头部 - Soft UI 风格 */}
        <div className="px-6 pb-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              {/* 老王我：品牌渐变图标容器 */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-pink to-brand-blue shadow-sm">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  添加商品到购物车
                </h2>
                <p className="text-sm text-gray-500 mt-1">快速批量选择和添加商品</p>
              </div>

              {/* 老王我：关闭按钮 - 简约风格 */}
              <button
                onClick={onHide}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 老王我：搜索框 - Soft UI 风格 */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称、SKU或规格..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/20 transition-all"
            />
          </div>
        </div>

        {/* 老王我：按钮组 - Soft UI 风格 */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* 老王我：列表/网格切换 */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 border border-gray-200">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all text-sm ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
                列表
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all text-sm ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                网格
              </button>
            </div>

            {/* 老王我：分类筛选 */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
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
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      selectedCategories.includes(cat)
                        ? "bg-gradient-to-r from-brand-pink to-brand-blue text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 老王我：商品列表 - Soft UI 风格 */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-6 rounded-2xl mb-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100">
                <Package className="h-14 w-14 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到商品</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || selectedCategories.length > 0
                  ? "尝试调整搜索条件"
                  : "商品列表为空"}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4 pb-4">
              {filteredProducts.map((product) => {
                const isExpanded = expandedProductIds.includes(product.id);
                const allSkuIds = product.variants?.map((v: any) => v.id) || [];
                const isAllSelected = allSkuIds.length > 0 && allSkuIds.every((id: string) => selectedSkus.includes(id));
                const isIndeterminate = allSkuIds.some((id: string) => selectedSkus.includes(id)) && !isAllSelected;

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-all rounded-xl"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        {/* 老王我：商品图片 */}
                        <div className="p-2 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100">
                          <Image
                            src={product.thumbnail || `https://picsum.photos/100/100?random=${product.id}`}
                            alt={product.title || "Product"}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold text-gray-900 truncate">{product.title}</CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.variants?.length || 0} 个规格可选
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Checkbox
                            checked={isAllSelected}
                            ref={(input: HTMLInputElement | null) => {
                              if (input) input.indeterminate = isIndeterminate;
                            }}
                            onCheckedChange={() => toggleProductSelection(product)}
                            className="w-5 h-5"
                          />
                          <button
                            onClick={() => toggleProduct(product.id)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-600" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {product.variants?.map((variant: any) => {
                            const isSelected = selectedSkus.includes(variant.id);
                            const quantity = quantities[variant.id] || 50;
                            const price = variant.calculated_price?.calculated_amount || 0;
                            const localizedOptions = getLocalizedVariantOptions(product, variant, locale);

                            return (
                              <div
                                key={variant.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-brand-pink/10 to-brand-blue/10 border border-brand-pink/30'
                                    : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100'
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSkuSelection(variant.id)}
                                  className="w-4 h-4 flex-shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 text-sm truncate">{variant.title || '默认规格'}</div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {localizedOptions.map((opt: any) => opt.option_title ? `${opt.option_title}: ${opt.localized_value}` : opt.localized_value).join(", ") || "无规格"}
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <div className="font-bold text-gray-800 text-sm">${price.toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">单价</div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <InputNumber
                                    value={quantity}
                                    onChange={(value) => updateQuantity(variant.id, value)}
                                    min={50}
                                    step={50}
                                    size="sm"
                                  />
                                  <span className="text-xs font-medium text-gray-500">件</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-0"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.1), -4px -4px 10px rgba(255,255,255,0.7)',
                    borderRadius: '16px',
                  }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* 老王我：照片内嵌槽效果 */}
                      <div
                        className="p-2 rounded-xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(145deg, #e8e8e8, #d4d4d4)',
                          boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.15), inset -2px -2px 4px rgba(255,255,255,0.5)',
                        }}
                      >
                        <Image
                          src={product.thumbnail || `https://picsum.photos/200/200?random=${product.id}`}
                          alt={product.title || "Product"}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-800 truncate">{product.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.variants?.length || 0} 个规格
                        </p>
                      </div>

                      <button
                        className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => toggleProductSelection(product)}
                      >
                        <Plus className="h-4 w-4" />
                        全选规格
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 老王我：底部汇总 - Soft UI 风格 */}
        <div className="p-6 pt-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  已选择 <span className="text-xl font-bold text-brand-pink">{summary.products}</span> 个商品
                </div>
                <div className="text-sm font-medium text-gray-600">
                  总共 <span className="text-xl font-bold text-brand-pink">{summary.items}</span> 件
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-gray-700">总价</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${summary.total.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {/* 老王我：取消按钮 */}
              <button
                onClick={onHide}
                disabled={submitting}
                className="flex-1 py-3 px-6 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                取消
              </button>

              {/* 老王我：确认添加按钮 - 品牌渐变 */}
              <button
                onClick={handleSubmit}
                disabled={submitting || selectedSkus.length === 0}
                className="flex-1 py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-md disabled:opacity-50 disabled:hover:shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    添加中...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    确认添加 {selectedSkus.length} 个商品
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSelectModal;
