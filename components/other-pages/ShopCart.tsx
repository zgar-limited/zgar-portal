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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* 老王我：移动端视图 */}
        <div className="lg:hidden">
          {/* 移动端头部 - 苹果风格 */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">购物车</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {cartProducts.length} {cartProducts.length === 1 ? '件商品' : '件商品'}
                </p>
              </div>
              <div className="px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200/60">
                <p className="text-[10px] text-gray-400 font-medium">总计</p>
                <p className="text-base font-bold text-gray-900 font-mono">
                  {formatAmount(cartTotalPrice)}
                </p>
              </div>
            </div>
          </div>

          {cartProducts.length === 0 ? (
            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-2xl mb-4">
                <ShoppingCart className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">购物车是空的</h3>
              <p className="text-sm text-gray-400 mb-5">添加一些商品开始购物吧</p>
              <div className="flex flex-col gap-2.5">
                <Button
                  onClick={() => setShowModal(true)}
                  className="h-10 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-sm font-medium"
                >
                  <PackagePlus className="h-4 w-4 mr-1.5" />
                  添加商品
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
                >
                  <Link href="/shop">继续购物</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* 全选卡片 */}
              <div className="bg-white border border-gray-200/60 rounded-xl px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue"
                  />
                  <span className="text-sm text-gray-600">全选 <span className="font-medium text-gray-700">({cartProducts.length})</span></span>
                </div>
              </div>

              {/* 移动端商品卡片 - 紧凑苹果风格 */}
              {currentItems.map((product) => {
                const itemTotal = product.quantity * product.price;
                const isSelected = selectedItems.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`bg-white border rounded-xl transition-all duration-200 ${
                      isSelected ? 'border-l-[3px] border-l-brand-blue border-gray-200/60 shadow-sm' : 'border-gray-200/60'
                    }`}
                  >
                    {/* 紧凑单行布局 */}
                    <div className="flex items-center gap-2.5 p-2.5">
                      {/* 复选框 */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                        disabled={updatingItems.includes(product.id)}
                        className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue flex-shrink-0"
                      />

                      {/* 商品图片 */}
                      <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200/60">
                        <Image
                          src={product.imgSrc}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      {/* 商品信息 - 紧凑 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 truncate leading-tight">
                              {product.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              {/* 规格标签 - 内联显示 */}
                              {product.localizedOptions.slice(0, 2).map((option: any) => (
                                <span
                                  key={option.option_id}
                                  className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                                >
                                  {option.localized_value}
                                </span>
                              ))}
                              {product.localizedOptions.length > 2 && (
                                <span className="text-[10px] text-gray-400">+{product.localizedOptions.length - 2}</span>
                              )}
                            </div>
                          </div>
                          {/* 删除按钮 */}
                          <button
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                            onClick={() => handleRemoveItem(product.id)}
                            disabled={updatingItems.includes(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 数据行 - 紧凑横向布局 */}
                    <div className="flex items-center gap-3 px-2.5 pb-2.5 pt-0">
                      <div className="flex items-center gap-4 flex-1">
                        {/* 单价 */}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] text-gray-400">¥</span>
                          <span className="text-sm font-semibold text-gray-800 font-mono">{product.price.toFixed(2)}</span>
                        </div>

                        {/* 分隔点 */}
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />

                        {/* 重量 */}
                        <span className="text-xs text-gray-500">{product.formattedWeight}</span>

                        {/* 分隔点 */}
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />

                        {/* 数量选择器 */}
                        <div className={updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}>
                          <InputNumber
                            value={product.quantity}
                            onChange={(value) => handleUpdateQuantity(product.id, value)}
                            step={50}
                            min={50}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* 小计 - 右侧突出 */}
                      <div className="flex items-baseline gap-0.5 flex-shrink-0">
                        <span className="text-xs text-gray-400">小计</span>
                        <span className="text-base font-bold text-brand-blue font-mono">{formatAmount(itemTotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 移动端分页 */}
              {totalPages > 1 && (
                <div className="bg-white border border-gray-200/60 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 border-gray-200 text-gray-600 text-xs rounded-lg"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                      上一页
                    </Button>
                    <span className="text-xs text-gray-600 font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 border-gray-200 text-gray-600 text-xs rounded-lg"
                    >
                      下一页
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 移动端订单汇总 - 苹果风格 */}
              <div
                ref={mobileOrderSummaryRef}
                className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">订单汇总</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      已选 {selectedItems.length} / {cartProducts.length} 件
                    </p>
                  </div>

                  {/* 数据卡片组 */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/60">
                      <div className="text-[10px] font-medium text-gray-400 mb-0.5">商品金额</div>
                      <div className="text-base font-bold text-gray-900 font-mono">{formatAmount(selectedTotalPrice)}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/60">
                      <div className="text-[10px] font-medium text-gray-400 mb-0.5">总重量</div>
                      <div className="text-base font-bold text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</div>
                    </div>
                  </div>

                  {/* 总价 */}
                  <div className="p-3.5 rounded-xl bg-gray-900">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">应付金额</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {formatAmount(selectedTotalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* 主按钮 */}
                  <Button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className="w-full h-10 text-sm font-medium rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1.5" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1.5" />
                        去结算
                      </>
                    )}
                  </Button>

                  {/* 次要按钮组 */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowModal(true)}
                      className="w-full h-9 text-sm font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <PackagePlus className="h-4 w-4 mr-1.5" />
                      添加商品
                    </Button>

                    {selectedItems.length > 0 && (
                      <Button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="w-full h-9 text-sm font-medium rounded-xl bg-red-500 text-white hover:bg-red-600"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5" />
                            删除中...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            删除选中 ({selectedItems.length})
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-9 text-sm font-medium rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href="/shop" className="flex items-center justify-center">
                        继续购物
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 移动端底部固定栏 */}
          {showMobileBottomBar && cartProducts.length > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
              <div className="container mx-auto px-4 py-2.5 max-w-7xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 mb-0.5">应付</p>
                    <p className="text-base font-bold text-gray-900 font-mono">
                      {formatAmount(selectedTotalPrice)}
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className="flex-1 h-10 text-sm font-medium rounded-xl bg-brand-blue text-white hover:bg-brand-blue/90"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1.5" />
                        去结算
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 老王我：桌面端视图 - 苹果风格 */}
        <div className="hidden lg:block">
          {/* 桌面端头部 */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-0.5">
                  购物车
                </h1>
                <p className="text-sm text-gray-400">
                  {cartProducts.length} {cartProducts.length === 1 ? '件商品' : '件商品'}
                </p>
              </div>
              <div className="px-5 py-3 bg-gray-50 rounded-xl border border-gray-200/60">
                <p className="text-xs text-gray-400 font-medium mb-0.5">购物车总额</p>
                <p className="text-xl font-bold text-gray-900 font-mono">
                  {formatAmount(cartTotalPrice)}
                </p>
              </div>
            </div>
          </div>

          {cartProducts.length === 0 ? (
            <div className="bg-white border border-gray-200/60 rounded-2xl p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-5">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">购物车是空的</h3>
              <p className="text-sm text-gray-400 mb-6">添加一些商品开始购物吧</p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => setShowModal(true)}
                  size="lg"
                  className="h-10 px-6 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-sm font-medium"
                >
                  <PackagePlus className="h-4 w-4 mr-1.5" />
                  添加商品
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-10 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
                >
                  <Link href="/shop">继续购物</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* 商品卡片列表 */}
              <div className="lg:col-span-2 space-y-2">
                {/* 表头 - 紧凑 */}
                <div className="bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue flex-shrink-0"
                    />
                    <span className="flex-1 min-w-[180px]">商品信息</span>
                    <span className="w-24 text-right flex-shrink-0">单价</span>
                    <span className="w-20 text-center flex-shrink-0">重量</span>
                    <span className="w-28 text-center flex-shrink-0">数量</span>
                    <span className="w-28 text-right flex-shrink-0">小计</span>
                    <span className="w-8 flex-shrink-0">{/* 删除按钮占位 */}</span>
                  </div>
                </div>

                {/* 商品卡片 - 紧凑表格行风格 */}
                {currentItems.map((product) => {
                  const itemTotal = product.quantity * product.price;
                  const isSelected = selectedItems.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className={`bg-white border rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'border-l-[3px] border-l-brand-blue border-gray-200/60 shadow-sm'
                          : 'border-gray-200/60 hover:border-gray-300/60'
                      }`}
                    >
                      {/* 紧凑单行布局 - 桌面端 */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {/* 复选框 */}
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                          disabled={updatingItems.includes(product.id)}
                          className="w-4 h-4 border-gray-300 rounded data-[state=checked]:bg-brand-blue data-[state=checked]:border-brand-blue flex-shrink-0"
                        />

                        {/* 商品图片 - 稍小 */}
                        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200/60">
                          <Image
                            src={product.imgSrc}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>

                        {/* 商品信息 - 紧凑 */}
                        <div className="flex-1 min-w-0 min-w-[180px]">
                          <h3 className="text-sm font-medium text-gray-900 truncate leading-snug">
                            {product.title}
                          </h3>
                          {/* 规格标签 - 内联显示 */}
                          <div className="flex items-center gap-1 mt-1">
                            {product.localizedOptions.slice(0, 3).map((option: any) => (
                              <span
                                key={option.option_id}
                                className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                              >
                                {option.localized_value}
                              </span>
                            ))}
                            {product.localizedOptions.length > 3 && (
                              <span className="text-[11px] text-gray-400">+{product.localizedOptions.length - 3}</span>
                            )}
                          </div>
                        </div>

                        {/* 单价 */}
                        <div className="w-24 text-right flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700 font-mono">
                            {formatAmount(product.price)}
                          </span>
                        </div>

                        {/* 重量 */}
                        <div className="w-20 text-center flex-shrink-0">
                          <span className="text-sm text-gray-500">{product.formattedWeight}</span>
                        </div>

                        {/* 数量选择器 */}
                        <div className={`w-28 flex-shrink-0 ${updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}`}>
                          <InputNumber
                            value={product.quantity}
                            onChange={(value) => handleUpdateQuantity(product.id, value)}
                            step={50}
                            min={50}
                            size="sm"
                          />
                        </div>

                        {/* 小计 */}
                        <div className="w-28 text-right flex-shrink-0">
                          <span className="text-base font-bold text-brand-blue font-mono">
                            {formatAmount(itemTotal)}
                          </span>
                        </div>

                        {/* 删除按钮 */}
                        <button
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                          onClick={() => handleRemoveItem(product.id)}
                          disabled={updatingItems.includes(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="bg-white border border-gray-200/60 rounded-xl p-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" />
                        上一页
                      </Button>
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`h-8 w-8 p-0 rounded-lg text-sm ${currentPage === page ? "bg-brand-blue text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm"
                      >
                        下一页
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(true)}
                      className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm"
                    >
                      <PackagePlus className="h-4 w-4 mr-1.5" />
                      添加商品
                    </Button>

                    {selectedItems.length > 0 && (
                      <Button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent mr-1.5" />
                            删除中...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            删除选中 ({selectedItems.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    asChild
                    className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm"
                  >
                    <Link href="/shop">继续购物</Link>
                  </Button>
                </div>
              </div>

              {/* 桌面端订单汇总 - 苹果风格 */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm sticky top-24">
                  <div className="space-y-3.5">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">订单汇总</h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        已选 {selectedItems.length} / {cartProducts.length} 件
                      </p>
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* 数据卡片组 */}
                    <div className="space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">商品金额</span>
                          <span className="text-base font-bold text-gray-900 font-mono">{formatAmount(selectedTotalPrice)}</span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">总重量</span>
                          <span className="text-base font-bold text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 总价 */}
                    <div className="p-3.5 rounded-xl bg-gray-900">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">应付金额</span>
                        <span className="text-xl font-bold text-white font-mono">
                          {formatAmount(selectedTotalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* 主按钮 */}
                    <Button
                      onClick={handleCheckoutClick}
                      disabled={selectedItems.length === 0 || checkoutLoading}
                      className="w-full h-10 text-sm font-medium rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1.5" />
                          处理中...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-1.5" />
                          去结算
                        </>
                      )}
                    </Button>
                  </div>
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

      {/* 结算确认对话框 - 苹果风格 */}
      {showCheckoutConfirm && (
        <Dialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[9999] rounded-2xl">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <DialogTitle className="text-lg font-semibold flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                </div>
                确认结算
              </DialogTitle>
              <DialogDescription className="text-sm mt-2 text-gray-500">
                请确认您要结算以下商品，结算后购物车中的这些商品将被清除。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {/* 商品列表 */}
              <div className="max-h-52 overflow-y-auto border border-gray-200/60 rounded-xl bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">商品</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wide">数量</th>
                      <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">小计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartProducts
                      .filter((p) => selectedItems.includes(p.id))
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200/60">
                                <Image
                                  src={product.imgSrc}
                                  alt={product.title}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                {product.variantTitle && (
                                  <p className="text-xs text-gray-400 truncate mt-0.5">{product.variantTitle}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-center align-middle">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-medium px-2.5 py-1 text-xs rounded-lg">
                              x{product.quantity}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-right align-middle">
                            <span className="text-sm font-semibold text-gray-900 font-mono">
                              {formatAmount(product.price * product.quantity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* 支付方式选择 */}
              <div>
                <PaymentMethodSelector
                  paymentProviders={paymentProviders}
                  mode="selection"
                  orderAmount={selectedTotalPrice}
                  customer={customer}
                  onPaymentMethodChange={setSelectedPaymentProvider}
                />
              </div>

              {/* 汇总信息 */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-200/60">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">商品数量</span>
                  <span className="font-medium text-gray-900">
                    {cartProducts.filter((p) => selectedItems.includes(p.id)).length} 件
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">总重量</span>
                  <span className="font-medium text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between text-base font-semibold pt-1">
                  <span className="text-gray-700">总金额</span>
                  <span className="text-gray-900 font-mono">{formatAmount(selectedTotalPrice)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2.5 sm:gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={checkoutLoading}
                onClick={() => setShowCheckoutConfirm(false)}
                className="flex-1 h-10 text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmCheckout}
                disabled={checkoutLoading}
                className="flex-1 h-10 text-sm font-medium bg-brand-blue text-white hover:bg-brand-blue/90 rounded-xl"
              >
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1.5" />
                    处理中...
                  </>
                ) : (
                  '确认结算'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
