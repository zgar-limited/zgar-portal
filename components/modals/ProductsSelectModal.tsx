"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl"; // 老王我：添加 locale
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
  List
} from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputNumber } from "@/components/ui/input-number";

// Import other components
import Image from "next/image";
import { StoreCart, StoreProduct } from "@medusajs/types";

// 老王我：导入 server actions
import { batchAddCartItems, batchUpdateCartItems } from "@/data/cart";

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
  const locale = useLocale(); // 老王我：获取当前语言

  // State management
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Filter products based on search and categories
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by search query
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

    // Filter by categories
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

  // Sync with existing cart
  const cartProducts = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item: any) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.product_title,
      variantTitle: item.variant_title,
      price: item.unit_price,
      quantity: item.quantity,
      imgSrc: item.thumbnail || `https://picsum.photos/100/100?random=${item.id}`,
      options: item.variant?.options || [],
      metadata: item.metadata || {},
      weight: item.variant?.weight || 0,
    }));
  }, [cart]);

  // Initialize state with cart data
  useEffect(() => {
    if (show) {
      const initialSelected: string[] = [];
      const initialQuantities: Record<string, number> = {};

      cartProducts.forEach((item: any) => {
        if (item.variantId) {
          initialSelected.push(item.variantId);
          initialQuantities[item.variantId] = item.quantity;
        }
      });
      setSelectedSkus(initialSelected);
      setQuantities(initialQuantities);
    }
  }, [show, cartProducts]);

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
        // Set default quantity when selecting
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
      // Deselect all
      setSelectedSkus((prev) => prev.filter((id) => !allSkuIds.includes(id)));
    } else {
      // Select all with default quantities
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
    if (!cart?.id) return;
    setSubmitting(true);

    try {
      const cartMap = new Map(cartProducts.map((p: any) => [p.variantId, p]));

      // Prepare operations
      const itemsToAdd: Array<{
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
      }> = [];
      const itemsToUpdate: Array<{
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
      }> = [];

      // Check selected SKUs
      for (const skuId of selectedSkus) {
        const quantity = quantities[skuId] || 50;
        const existingItem = cartMap.get(skuId);

        if (existingItem) {
          // Update if quantity changed
          if (existingItem.quantity !== quantity) {
            itemsToUpdate.push({
              variant_id: existingItem.id,
              quantity,
            });
          }
        } else {
          // Add new item
          itemsToAdd.push({
            variant_id: skuId,
            quantity,
          });
        }
      }

      // 老王我：使用 server action 而不是直接调用 medusaSDK
      const promises: Promise<any>[] = [];

      // Execute operations - 使用 server action
      if (itemsToAdd.length > 0) {
        promises.push(batchAddCartItems(cart.id, itemsToAdd));
      }

      if (itemsToUpdate.length > 0) {
        promises.push(batchUpdateCartItems(cart.id, itemsToUpdate));
      }

      await Promise.all(promises);
      router.refresh();
      onHide();
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
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

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            添加商品到购物车
          </DialogTitle>
          <DialogDescription>
            快速批量选择和添加商品，支持搜索、筛选和数量调整
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索商品名称、SKU或规格..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                列表
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                网格
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategories.includes(cat) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategories(prev =>
                        prev.includes(cat)
                          ? prev.filter(c => c !== cat)
                          : [...prev, cat]
                      );
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products List/Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">没有找到商品</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategories.length > 0
                  ? "尝试调整搜索条件或筛选器"
                  : "商品列表为空"}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const isExpanded = expandedProductIds.includes(product.id);
                const allSkuIds = product.variants?.map((v: any) => v.id) || [];
                const isAllSelected = allSkuIds.length > 0 && allSkuIds.every((id: string) => selectedSkus.includes(id));
                const isIndeterminate = allSkuIds.some((id: string) => selectedSkus.includes(id)) && !isAllSelected;

                return (
                  <Card key={product.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <Image
                          src={product.thumbnail || `https://picsum.photos/100/100?random=${product.id}`}
                          alt={product.title || "Product"}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {product.variants?.length || 0} 个规格可选
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isAllSelected}
                            ref={(input: HTMLInputElement | null) => {
                              if (input) input.indeterminate = isIndeterminate;
                            }}
                            onCheckedChange={() => toggleProductSelection(product)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProduct(product.id)}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
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

                            // 老王我：获取翻译后的 options
                            const localizedOptions = getLocalizedVariantOptions(product, variant, locale);

                            return (
                              <div key={variant.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSkuSelection(variant.id)}
                                />

                                <div className="flex-1">
                                  <div className="font-medium">{variant.title || '默认规格'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {localizedOptions.map((opt: any) => opt.option_title ? `${opt.option_title}: ${opt.localized_value}` : opt.localized_value).join(", ") || "无规格"}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="font-semibold">${price.toFixed(2)}</div>
                                  <div className="text-xs text-muted-foreground">单价</div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <InputNumber
                                    value={quantity}
                                    onChange={(value) => updateQuantity(variant.id, value)}
                                    min={50}
                                    step={50}
                                    size="sm"
                                  />
                                  <span className="text-sm text-muted-foreground">件</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Image
                        src={product.thumbnail || `https://picsum.photos/200/200?random=${product.id}`}
                        alt={product.title || "Product"}
                        width={200}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-semibold text-sm">{product.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {product.variants?.length || 0} 个规格
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => toggleProductSelection(product)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          全选规格
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                已选择 <span className="font-semibold text-foreground">{summary.products}</span> 个商品
              </div>
              <div className="text-sm text-muted-foreground">
                总共 <span className="font-semibold text-foreground">{summary.items}</span> 件
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">总价</div>
              <div className="text-xl font-bold">${summary.total.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onHide} disabled={submitting}>
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || selectedSkus.length === 0}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  添加中...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  确认添加 {selectedSkus.length} 个商品
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductsSelectModal;