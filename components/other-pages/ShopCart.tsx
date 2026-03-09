"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from "next-intl";
import {
  PackagePlus,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import ProductsSelectModal from "../modals/ProductsSelectModal";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import { deleteLineItem, updateLineItem, batchDeleteCartItems } from "@/data/cart";
import { getPaymentProviders } from "@/data/payments";
import { toast } from "@/hooks/use-toast";
import {
  StoreCartResponse,
  StorePaymentCollectionResponse,
  StoreCart,
  StoreProduct,
  CartLineItemDTO,
  HttpTypes,
} from "@medusajs/types";

// 老王我：导入多语言翻译工具
import { getLocalizedVariantOptions } from "@/utils/product-localization";
// 老王我：导入重量格式化工具
import { formatWeight, formatTotalWeight } from "@/utils/weight-utils";
import { PaymentProvider } from "@/types/payment";
import { medusaSDK } from "@/utils/medusa";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { InputNumber } from "@/components/ui/input-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 老王我：导入苹果风格 B2B 样式常量
import {
  b2bButton,
  b2bCard,
  b2bText,
  b2bBadge,
  b2bShadow,
} from "@/lib/b2b-styles";

export default function ShopCart({
  cart,
  products,
  customer,
}: {
  cart: StoreCart | null;
  products: StoreProduct[];
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
}) {
  return <ShopCartContent cart={cart} products={products} customer={customer} />;
}

function ShopCartContent({
  cart,
  products,
  customer,
}: {
  cart: StoreCart | null;
  products: StoreProduct[];
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
}) {
  const locale = useLocale();
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  // 数量输入临时状态 - 用于管理输入框的值
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 老王我：支付方式相关状态
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>("");
  const [loadingPaymentProviders, setLoadingPaymentProviders] = useState(false);

  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const [selectedTotalWeight, setSelectedTotalWeight] = useState(0);

  // 老王我：移动端底部固定栏显示状态
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(true);
  const mobileOrderSummaryRef = React.useRef<HTMLDivElement>(null);

  const itemsPerPage = 5;

  const cartProducts = React.useMemo(() => {
    if (!cart?.items || cart.items.length === 0) {
      return [];
    }

    return cart.items.map((item: any, index: number) => {
      const product = products.find((p) => p.id === item.product_id);
      const fullVariant = product?.variants?.find((v: any) => v.id === item.variant_id);
      const variantToUse = fullVariant || item.variant;
      const localizedOptions = getLocalizedVariantOptions(product, variantToUse, locale);
      const productWeight = product?.metadata?.package_spec_product_weight;
      const weightInKg = productWeight ? parseFloat(productWeight) : 0;

      return {
        id: item.id,
        variantId: item.variant_id,
        productId: item.product_id,
        title: item.variant?.title || item.product?.title || item.product_title || `Product ${index + 1}`,
        variantTitle: item.product?.title || item.product_title || "",
        price: item.unit_price || item.price || item.total || 0,
        quantity: item.quantity || 1,
        imgSrc: item.thumbnail ||
                 item.product?.thumbnail ||
                 item.product?.images?.[0]?.url ||
                 `https://picsum.photos/100/100?random=${item.id}`,
        localizedOptions: localizedOptions,
        options: variantToUse?.options || [],
        metadata: item.metadata || {},
        weight: weightInKg,
        formattedWeight: formatWeight(productWeight, locale),
      };
    });
  }, [cart, products, locale]);

  useEffect(() => {
    const maxPage = Math.ceil(cartProducts.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }

    setSelectedItems((prev) =>
      prev.filter((id) => cartProducts.some((p) => p.id === id))
    );
  }, [cartProducts, itemsPerPage]);

  const cartTotalPrice = React.useMemo(() => {
    return cartProducts.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
  }, [cartProducts]);

  useEffect(() => {
    const selectedProducts = cartProducts.filter((p) =>
      selectedItems.includes(p.id)
    );

    const newTotalPrice = selectedProducts.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
    setSelectedTotalPrice(newTotalPrice);

    const newTotalWeight = selectedProducts.reduce(
      (acc, product) => acc + product.quantity * product.weight,
      0
    );
    setSelectedTotalWeight(newTotalWeight);
  }, [selectedItems, cartProducts]);

  useEffect(() => {
    const fetchPaymentProviders = async () => {
      setLoadingPaymentProviders(true);
      try {
        const providers = await getPaymentProviders("normal");
        setPaymentProviders(providers);
        const defaultProvider = providers.find((p) => p.id.includes("zgar_balance")) || providers[0];
        if (defaultProvider) {
          setSelectedPaymentProvider(defaultProvider.id);
        }
      } catch (error) {
        console.error("获取支付方式列表失败:", error);
        setPaymentProviders([
          {
            id: "pp_zgar_balance_payment_zgar",
            name: "余额支付",
            description: "使用账户余额直接支付订单",
            icon: "💰",
            supported_order_types: ["normal"],
          },
          {
            id: "pp_zgar_manual_payment_zgar",
            name: "线下转账",
            description: "通过银行转账支付，完成后上传转账凭证",
            icon: "🏦",
            supported_order_types: ["normal"],
          },
        ]);
        setSelectedPaymentProvider("pp_zgar_balance_payment_zgar");
      } finally {
        setLoadingPaymentProviders(false);
      }
    };

    fetchPaymentProviders();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowMobileBottomBar(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px 0px 0px',
      }
    );

    const currentRef = mobileOrderSummaryRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const router = useRouter();

  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return;
    try {
      await deleteLineItem(lineId);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    try {
      await updateLineItem({ lineId, quantity });
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!cart?.id) return;

    setIsDeleting(true);
    try {
      await batchDeleteCartItems(cart.id, selectedItems);
      setSelectedItems([]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting items:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleUpdateQuantity = async (id: string, value: number) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await updateCartItem(id, value);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) return;
    setShowCheckoutConfirm(true);
  };

  const handleConfirmCheckout = async () => {
    if (!cart?.id) return;
    setShowCheckoutConfirm(false);
    setCheckoutLoading(true);

    try {
      const itemsToCheckout: CartLineItemDTO[] = cartProducts
        .filter((p) => selectedItems.includes(p.id))
        .map((p) => ({
          variant_id: p.variantId as string,
          quantity: p.quantity as number,
          metadata: p.metadata as any,
        }));

      const { submitOrder } = await import("@/data/cart");
      const result = await submitOrder(itemsToCheckout, selectedPaymentProvider);
      const orderId = result.order.id;

      setSelectedItems([]);

      if (selectedPaymentProvider === "pp_zgar_balance_payment_zgar") {
        toast.success("订单创建成功！余额支付已完成");
      } else if (selectedPaymentProvider === "pp_zgar_manual_payment_zgar") {
        toast.success("订单创建成功！请上传转账凭证");
      } else {
        toast.success("订单创建成功！");
      }

      setTimeout(() => {
        router.push(`/account-orders-detail/${orderId}`);
      }, 500);

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "提交订单失败，请重试");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* 移动端视图 */}
        <div className="lg:hidden">
          {/* 移动端头部 - 苹果极简风格 */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">购物车</h1>
            <p className="text-sm text-gray-500 mt-1">
              {cartProducts.length} 件商品
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-5">
                <ShoppingCart className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">购物车是空的</h3>
              <p className="text-sm text-gray-500 mb-6">添加一些商品开始购物吧</p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button
                  onClick={() => setShowModal(true)}
                  className="h-11 bg-[#0047c7] hover:bg-[#0039a0] text-white rounded-full text-sm font-medium transition-colors"
                >
                  <PackagePlus className="h-4 w-4 mr-2" />
                  添加商品
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full text-sm font-medium transition-colors"
                >
                  <Link href="/shop">继续购物</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 全选卡片 - 苹果风格 */}
              <div className="bg-white rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="w-5 h-5 border-2 border-gray-300 rounded-md data-[state=checked]:bg-[#0047c7] data-[state=checked]:border-[#0047c7]"
                    />
                    <span className="text-sm text-gray-900">全选 ({cartProducts.length})</span>
                  </label>
                </div>
              </div>

              {/* 移动端商品卡片 - 苹果极简风格 */}
              {currentItems.map((product) => {
                const itemTotal = product.quantity * product.price;
                const isSelected = selectedItems.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (!updatingItems.includes(product.id)) {
                        handleSelectItem(product.id, !isSelected);
                      }
                    }}
                    className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#0047c7] ring-offset-2' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="p-4">
                      {/* 顶部：复选框 + 图片 + 信息 */}
                      <div className="flex items-start gap-3">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0"
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                            disabled={updatingItems.includes(product.id)}
                            className="w-5 h-5 mt-1 border-2 border-gray-300 rounded-md data-[state=checked]:bg-[#0047c7] data-[state=checked]:border-[#0047c7]"
                          />
                        </div>

                        {/* 商品图片 */}
                        <div className="relative w-20 h-20 bg-[#f5f5f7] rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={product.imgSrc}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* 商品信息 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                            {product.title}
                          </h3>
                          {/* 规格标签 */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {product.localizedOptions.slice(0, 2).map((option: any) => (
                              <span
                                key={option.option_id}
                                className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                              >
                                {option.localized_value}
                              </span>
                            ))}
                            {product.localizedOptions.length > 2 && (
                              <span className="text-xs text-gray-400">+{product.localizedOptions.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 底部：价格 + 重量 + 数量 + 小计 */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-gray-400 block">单价</span>
                            <span className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                          </div>
                          <div className="w-px h-8 bg-gray-200" />
                          <div>
                            <span className="text-xs text-gray-400 block">重量</span>
                            <span className="text-sm text-gray-600">{product.formattedWeight}</span>
                          </div>
                        </div>

                        {/* 数量选择器 - 苹果风格 */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`inline-flex items-center border border-gray-200 rounded-lg overflow-hidden ${updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <button
                            onClick={() => handleUpdateQuantity(product.id, Math.max(50, product.quantity - 50))}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="减少数量"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={quantityInputs[product.id] ?? product.quantity}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setQuantityInputs(prev => ({ ...prev, [product.id]: val }));
                            }}
                            onFocus={(e) => {
                              e.target.select();
                              setQuantityInputs(prev => ({ ...prev, [product.id]: String(product.quantity) }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = parseInt(quantityInputs[product.id] || product.quantity) || 50;
                                handleUpdateQuantity(product.id, Math.max(50, val));
                                setQuantityInputs(prev => {
                                  const next = { ...prev };
                                  delete next[product.id];
                                  return next;
                                });
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            onBlur={() => {
                              const val = parseInt(quantityInputs[product.id] || product.quantity) || 50;
                              handleUpdateQuantity(product.id, Math.max(50, val));
                              setQuantityInputs(prev => {
                                const next = { ...prev };
                                delete next[product.id];
                                return next;
                              });
                            }}
                            className="w-12 h-8 text-center text-sm font-semibold text-gray-900 bg-white border-x border-gray-200 focus:outline-none focus:ring-0"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(product.id, product.quantity + 50)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="增加数量"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 小计栏 */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#f5f5f7]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(product.id);
                        }}
                        disabled={updatingItems.includes(product.id)}
                        className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>删除</span>
                      </button>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">小计</span>
                        <span className="text-lg font-semibold text-gray-900">${itemTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 移动端分页 - 苹果风格 */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-1.5 px-4">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#0047c7] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* 移动端订单汇总 - 苹果极简风格 */}
              <div
                ref={mobileOrderSummaryRef}
                className="bg-white rounded-3xl p-6 mt-4 mb-24"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-5">订单汇总</h2>

                {/* 统计卡片 */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#f5f5f7] rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">已选商品</span>
                    <span className="text-xl font-semibold text-gray-900">{selectedItems.length} 件</span>
                  </div>
                  <div className="bg-[#f5f5f7] rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">总重量</span>
                    <span className="text-xl font-semibold text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="h-px bg-gray-200 mb-5" />

                {/* 金额明细 */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">商品金额</span>
                    <span className="text-sm font-semibold text-gray-900">{formatAmount(selectedTotalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">运费</span>
                    <span className="text-sm text-gray-500">结算时计算</span>
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="h-px bg-gray-200 mb-5" />

                {/* 总价 */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base font-semibold text-gray-900">应付金额</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(selectedTotalPrice)}
                  </span>
                </div>

                {/* 操作按钮组 */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className={`w-full h-12 rounded-full text-base font-medium transition-all flex items-center justify-center ${
                      selectedItems.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#0047c7] text-white hover:bg-[#0039a0]'
                    }`}
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>处理中...</span>
                      </span>
                    ) : (
                      <span>去结算</span>
                    )}
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex-1 h-11 rounded-full bg-[#f5f5f7] text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <PackagePlus className="h-4 w-4" />
                      <span>添加商品</span>
                    </button>

                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="flex-1 h-11 rounded-full bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent" />
                            <span>删除中...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>删除 ({selectedItems.length})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <Link
                    href="/shop"
                    className="block text-center text-sm text-gray-600 hover:text-gray-900 py-3 transition-colors"
                  >
                    继续购物 →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 移动端底部固定栏 - 苹果极简风格 */}
          {showMobileBottomBar && cartProducts.length > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <div className="container mx-auto px-4 py-3 max-w-6xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">应付金额</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatAmount(selectedTotalPrice)}
                    </p>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className={`h-11 px-8 rounded-full text-sm font-medium transition-all flex items-center justify-center ${
                      selectedItems.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#0047c7] text-white active:bg-[#0039a0]'
                    }`}
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>处理中</span>
                      </span>
                    ) : (
                      <span>去结算</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 桌面端视图 - 苹果极简风格 */}
        <div className="hidden lg:block">
          {/* 桌面端头部 */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">购物车</h1>
            <p className="text-base text-gray-500 mt-1">
              {cartProducts.length} 件商品
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f5f5f7] rounded-full mb-6">
                <ShoppingCart className="h-9 w-9 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">购物车是空的</h3>
              <p className="text-base text-gray-500 mb-8 max-w-md mx-auto">添加一些商品开始购物吧</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setShowModal(true)}
                  className="h-12 px-8 bg-[#0047c7] hover:bg-[#0039a0] text-white rounded-full text-base font-medium transition-colors"
                >
                  <PackagePlus className="h-5 w-5 mr-2" />
                  添加商品
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full text-base font-medium transition-colors"
                >
                  <Link href="/shop">继续购物</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 商品列表区域 */}
              <div className="lg:col-span-2">
                {/* 全选栏 */}
                <div className="bg-white rounded-2xl px-6 py-4 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="w-5 h-5 border-2 border-gray-300 rounded-md data-[state=checked]:bg-[#0047c7] data-[state=checked]:border-[#0047c7]"
                    />
                    <span className="text-sm text-gray-900">全选 ({cartProducts.length} 件商品)</span>
                  </label>
                </div>

                {/* 商品卡片列表 */}
                <div className="space-y-3">
                  {currentItems.map((product) => {
                    const itemTotal = product.quantity * product.price;
                    const isSelected = selectedItems.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          if (!updatingItems.includes(product.id)) {
                            handleSelectItem(product.id, !isSelected);
                          }
                        }}
                        className={`bg-white rounded-2xl p-6 transition-all duration-200 cursor-pointer ${
                          isSelected ? 'ring-2 ring-[#0047c7]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-5">
                          {/* 复选框 */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0"
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                              disabled={updatingItems.includes(product.id)}
                              className="w-5 h-5 mt-1 border-2 border-gray-300 rounded-md data-[state=checked]:bg-[#0047c7] data-[state=checked]:border-[#0047c7]"
                            />
                          </div>

                          {/* 商品图片 */}
                          <div className="relative w-24 h-24 bg-[#f5f5f7] rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={product.imgSrc}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>

                          {/* 商品信息 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-snug">
                              {product.title}
                            </h3>
                            {/* 规格标签 */}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {product.localizedOptions.slice(0, 3).map((option: any) => (
                                <span
                                  key={option.option_id}
                                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                                >
                                  {option.localized_value}
                                </span>
                              ))}
                              {product.localizedOptions.length > 3 && (
                                <span className="text-xs text-gray-400">+{product.localizedOptions.length - 3}</span>
                              )}
                            </div>

                            {/* 价格和重量 */}
                            <div className="flex items-center gap-6 mt-4">
                              <div>
                                <span className="text-xs text-gray-400 block">单价</span>
                                <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                              </div>
                              <div className="w-px h-8 bg-gray-200" />
                              <div>
                                <span className="text-xs text-gray-400 block">重量</span>
                                <span className="text-base text-gray-600">{product.formattedWeight}</span>
                              </div>
                            </div>
                          </div>

                          {/* 数量和小计 */}
                          <div className="flex flex-col items-end gap-4">
                            {/* 数量选择器 - 苹果风格 */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`inline-flex items-center border border-gray-200 rounded-lg overflow-hidden ${updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}`}
                            >
                              <button
                                onClick={() => handleUpdateQuantity(product.id, Math.max(50, product.quantity - 50))}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                aria-label="减少数量"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="text"
                                value={quantityInputs[product.id] ?? product.quantity}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  setQuantityInputs(prev => ({ ...prev, [product.id]: val }));
                                }}
                                onFocus={(e) => {
                                  e.target.select();
                                  setQuantityInputs(prev => ({ ...prev, [product.id]: String(product.quantity) }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = parseInt(quantityInputs[product.id] || product.quantity) || 50;
                                    handleUpdateQuantity(product.id, Math.max(50, val));
                                    setQuantityInputs(prev => {
                                      const next = { ...prev };
                                      delete next[product.id];
                                      return next;
                                    });
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                onBlur={() => {
                                  const val = parseInt(quantityInputs[product.id] || product.quantity) || 50;
                                  handleUpdateQuantity(product.id, Math.max(50, val));
                                  setQuantityInputs(prev => {
                                    const next = { ...prev };
                                    delete next[product.id];
                                    return next;
                                  });
                                }}
                                className="w-14 h-9 text-center text-base font-semibold text-gray-900 bg-white border-x border-gray-200 focus:outline-none focus:ring-0"
                              />
                              <button
                                onClick={() => handleUpdateQuantity(product.id, product.quantity + 50)}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                aria-label="增加数量"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* 小计 */}
                            <div className="text-right">
                              <span className="text-xs text-gray-400 block">小计</span>
                              <span className="text-xl font-semibold text-gray-900">${itemTotal.toFixed(2)}</span>
                            </div>

                            {/* 删除按钮 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(product.id);
                              }}
                              disabled={updatingItems.includes(product.id)}
                              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>删除</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 分页 - 苹果风格 */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl p-4 mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <div className="flex items-center gap-1.5 px-4">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-[#0047c7] text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 底部操作按钮 */}
                <div className="flex items-center justify-between mt-6 pt-6 pb-8">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="h-10 px-5 rounded-full bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <PackagePlus className="h-4 w-4" />
                      <span>添加商品</span>
                    </button>

                    {selectedItems.length > 0 && (
                      <button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="h-10 px-5 rounded-full bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                            <span>删除中...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>删除选中 ({selectedItems.length})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <Link
                    href="/shop"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    继续购物 →
                  </Link>
                </div>
              </div>

              {/* 桌面端订单汇总 - 苹果极简风格 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 sticky top-28">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">订单汇总</h2>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#f5f5f7] rounded-2xl p-4">
                      <span className="text-xs text-gray-600 block mb-1">已选商品</span>
                      <span className="text-xl font-semibold text-gray-900">{selectedItems.length} 件</span>
                    </div>
                    <div className="bg-[#f5f5f7] rounded-2xl p-4">
                      <span className="text-xs text-gray-600 block mb-1">总重量</span>
                      <span className="text-xl font-semibold text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                    </div>
                  </div>

                  {/* 分隔线 */}
                  <div className="h-px bg-gray-200 mb-6" />

                  {/* 金额明细 */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">商品金额</span>
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(selectedTotalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">运费</span>
                      <span className="text-sm text-gray-500">结算时计算</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">税费</span>
                      <span className="text-sm text-gray-500">结算时计算</span>
                    </div>
                  </div>

                  {/* 分隔线 */}
                  <div className="h-px bg-gray-200 mb-6" />

                  {/* 总价 */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-base font-semibold text-gray-900">应付金额</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatAmount(selectedTotalPrice)}
                    </span>
                  </div>

                  {/* 结算按钮 */}
                  <button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className={`w-full h-14 rounded-full text-base font-medium transition-all flex items-center justify-center ${
                      selectedItems.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#0047c7] text-white hover:bg-[#0039a0]'
                    }`}
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>处理中...</span>
                      </span>
                    ) : (
                      <span>去结算</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Select Modal */}
      <ProductsSelectModal
        show={showModal}
        onHide={() => setShowModal(false)}
        cart={cart}
        products={products}
      />

      {/* 结算确认对话框 - 苹果极简风格 */}
      {showCheckoutConfirm && (
        <Dialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
          <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header - 苹果极简风格 */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
                订单确认
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* 商品列表 - 完整显示，包含图片和重量 */}
              <div className="bg-[#f5f5f7] rounded-2xl p-4 space-y-3">
                <div className="flex items-center text-xs text-gray-500 pb-2 border-b border-gray-200/50">
                  <span className="w-16"></span>
                  <span className="flex-1">商品信息</span>
                  <span className="w-24 text-center">重量</span>
                  <span className="w-28 text-right">金额</span>
                </div>
                {cartProducts
                  .filter((p) => selectedItems.includes(p.id))
                  .map((product) => (
                    <div key={product.id} className="flex items-center gap-4 py-3 border-b border-gray-200/30 last:border-0">
                      {/* 商品图片 */}
                      <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={product.imgSrc}
                          alt={product.title}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 商品名称和规格 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-medium line-clamp-2 leading-snug">{product.title}</p>
                        {/* 规格标签 */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {product.localizedOptions?.slice(0, 3).map((option: any) => (
                            <span
                              key={option.option_id}
                              className="text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded-full"
                            >
                              {option.localized_value}
                            </span>
                          ))}
                          {product.localizedOptions?.length > 3 && (
                            <span className="text-xs text-gray-400">+{product.localizedOptions.length - 3}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">× {product.quantity}</span>
                        </div>
                      </div>
                      {/* 重量 */}
                      <div className="w-24 text-center">
                        <span className="text-sm text-gray-600">
                          {product.formattedWeight || '-'}
                        </span>
                      </div>
                      {/* 金额 */}
                      <div className="w-28 text-right">
                        <span className="text-gray-900 text-sm font-semibold">
                          {formatAmount(product.price * product.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                {/* 总重量 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                  <span className="text-sm text-gray-500">总重量</span>
                  <span className="text-sm text-gray-700 font-medium">
                    {formatTotalWeight(selectedTotalWeight, locale)}
                  </span>
                </div>
              </div>

              {/* 支付方式选择 - 苹果风格 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium mb-2">支付方式</div>
                {paymentProviders.map((provider) => {
                  const isSelected = selectedPaymentProvider === provider.id;
                  return (
                    <div
                      key={provider.id}
                      onClick={() => setSelectedPaymentProvider(provider.id)}
                      className={`
                        relative rounded-xl p-3.5 cursor-pointer transition-all duration-200
                        ${isSelected
                          ? "ring-2 ring-[#0047c7] bg-blue-50/30"
                          : "bg-[#f5f5f7] hover:bg-gray-100"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{provider.icon}</span>
                          <div>
                            <span className="text-gray-900 text-sm">{provider.name}</span>
                            <p className="text-xs text-gray-400 mt-0.5">{provider.description}</p>
                          </div>
                        </div>
                        <div
                          className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${isSelected ? "border-[#0047c7] bg-[#0047c7]" : "border-gray-300"}
                          `}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 价格明细 - 苹果结算单风格 */}
              <div className="bg-[#f5f5f7] rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">商品金额</span>
                  <span className="text-gray-900">{formatAmount(selectedTotalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">运费</span>
                  <span className="text-gray-400">结算时计算</span>
                </div>
                <div className="h-px bg-gray-200/70 my-2" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-gray-500 text-sm">应付金额</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatAmount(selectedTotalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* 底部按钮 - 固定在底部 */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={checkoutLoading}
                  onClick={() => setShowCheckoutConfirm(false)}
                  className="flex-1 h-11 text-sm font-medium text-gray-700 bg-[#f5f5f7] hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  disabled={checkoutLoading}
                  className="flex-1 h-11 text-sm font-medium text-white bg-[#0047c7] hover:bg-[#0039a0] rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>处理中...</span>
                    </>
                  ) : (
                    "确认支付"
                  )}
                </button>
              </div>

              {/* 安全提示 */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>安全加密支付</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
