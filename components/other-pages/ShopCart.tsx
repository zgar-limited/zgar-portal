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
  const locale = useLocale(); // 老王我：获取当前语言
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  // 老王我：支付方式相关状态
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>("");  // 改为 provider_id
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
      // 老王我：获取产品对象用于翻译
      const product = products.find((p) => p.id === item.product_id);

      // 老王我：从 product.variants 中找到完整的 variant（包含 options）
      const fullVariant = product?.variants?.find((v: any) => v.id === item.variant_id);

      // 老王我：使用完整的 variant（包含 options）进行翻译
      const variantToUse = fullVariant || item.variant;
      const localizedOptions = getLocalizedVariantOptions(product, variantToUse, locale);

      // 老王我：从 product metadata 获取重量（kg 单位）
      const productWeight = product?.metadata?.package_spec_product_weight;
      const weightInKg = productWeight ? parseFloat(productWeight) : 0;

      return {
        id: item.id,
        variantId: item.variant_id,
        productId: item.product_id,
        title: item.variant?.title || item.product?.title || item.product_title || `Product ${index + 1}`, // 老王我：优先显示 variant title
        variantTitle: item.product?.title || item.product_title || "", // 老王我：显示产品标题作为副标题
        price: item.unit_price || item.price || item.total || 0,
        quantity: item.quantity || 1,
        imgSrc: item.thumbnail ||
                 item.product?.thumbnail ||
                 item.product?.images?.[0]?.url ||
                 `https://picsum.photos/100/100?random=${item.id}`,
        // 老王我：使用翻译后的 options
        localizedOptions: localizedOptions,
        options: variantToUse?.options || [],
        metadata: item.metadata || {},
        // 老王我：存储 kg 和格式化后的重量
        weight: weightInKg,  // 存储为 kg（不是g）
        formattedWeight: formatWeight(productWeight, locale),  // 格式化显示
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

  // 老王我：计算整个购物车的总价（不管是否选中）
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

  // 老王我：获取支付提供商列表（购物车结算使用 normal 类型）
  useEffect(() => {
    const fetchPaymentProviders = async () => {
      setLoadingPaymentProviders(true);
      try {
        // 老王我：传递 type=normal 参数获取普通订单的支付方式
        const providers = await getPaymentProviders("normal");
        setPaymentProviders(providers);

        // 选择默认支付方式（优先选择余额支付，新格式：pp_zgar_balance_payment_zgar）
        const defaultProvider = providers.find((p) => p.id.includes("zgar_balance")) || providers[0];
        if (defaultProvider) {
          setSelectedPaymentProvider(defaultProvider.id);
        }
      } catch (error) {
        console.error("获取支付方式列表失败:", error);
        // 降级：使用硬编码的支付方式（新格式）
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

  // 老王我：Intersection Observer监听移动端Order Summary，进入视口时隐藏底部固定栏
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 老王我：当Order Summary进入视口时，隐藏底部固定栏
        setShowMobileBottomBar(!entry.isIntersecting);
      },
      {
        // 老王我：当Order Summary顶部进入视口10%时触发
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
      // 使用 server action - 老王我这个方法能读到登录信息
      // server action内部会调用 updateTag，React Suspense会自动重新获取数据
      await deleteLineItem(lineId);
      // 不需要 router.refresh() 了，updateTag 会自动触发更新
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    try {
      // 使用 server action - 老王我这个方法能读到登录信息
      // server action内部会调用 updateTag，React Suspense会自动重新获取数据
      await updateLineItem({ lineId, quantity });
      // 不需要 router.refresh() 了，updateTag 会自动触发更新
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
      // 老王我：调用 server action 进行批量删除
      await batchDeleteCartItems(cart.id, selectedItems);

      // 老王我：清空选中项并刷新页面
      setSelectedItems([]);
      router.refresh();
    } catch (error) {
      console.error("Error deleting items:", error);
      // 可以在这里添加 toast 错误提示
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

  // 老王我拆分成两个函数：一个显示确认框，一个执行实际结算
  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) return;
    // 显示确认对话框
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

      // 老王我：使用新的统一下单接口
      // POST /store/zgar/orders/complete
      const { submitOrder } = await import("@/data/cart");

      // 调用统一下单接口，传递选中的支付方式
      const result = await submitOrder(itemsToCheckout, selectedPaymentProvider);

      const orderId = result.order.id;

      // 清空选中商品
      setSelectedItems([]);

      // 根据支付方式显示不同提示
      if (selectedPaymentProvider === "pp_zgar_balance_payment_zgar") {
        toast.success("✅ 订单创建成功！余额支付已完成");
      } else if (selectedPaymentProvider === "pp_zgar_manual_payment_zgar") {
        toast.success("✅ 订单创建成功！请上传转账凭证");
      } else {
        toast.success("✅ 订单创建成功！");
      }

      // 跳转到订单详情
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
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 老王我：全新设计 - 现代柔和风格移动端 */}
        <div className="lg:hidden">
          {/* 老王我：移动端头部 - 品牌色清新风格 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-pink/90 to-brand-blue/90 backdrop-blur-sm shadow-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Shopping Cart</h1>
                <p className="text-white/80 text-sm font-medium">
                  {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-md">
                <p className="text-xs text-gray-600 font-medium mb-0.5">Cart Total</p>
                <p className="text-lg font-bold text-brand-pink" style={{ fontFamily: 'monospace' }}>
                  ${cartTotalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {cartProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-pink/10 to-brand-blue/10 rounded-full mb-4">
                <ShoppingCart className="h-10 w-10 text-brand-pink" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6 text-sm">Add some products to get started!</p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setShowModal(true)}
                  className="h-11 bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-lg transition-all rounded-xl"
                >
                  <PackagePlus className="h-4 w-4 mr-2" />
                  Add Products
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-2 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 全选卡片 */}
              <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-900">Select All ({cartProducts.length})</span>
                </div>
              </div>

              {/* 老王我：移动端商品卡片 - 品牌色清新风格 */}
              {currentItems.map((product) => {
                const itemTotal = product.quantity * product.price;
                const isSelected = selectedItems.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 border ${
                      isSelected ? 'border-brand-pink/50 ring-2 ring-brand-pink/10' : 'border-gray-100/80'
                    }`}
                  >
                    <div className="p-4">
                      {/* 老王我：第一行 - 图片、复选框、删除按钮 */}
                      <div className="flex gap-3 mb-3">
                        {/* 老王我：复选框 - 增大触摸区域 */}
                        <div className="flex items-start pt-1">
                          <div className="relative">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                              disabled={updatingItems.includes(product.id)}
                              className="w-5 h-5"
                              style={{
                                '--checkbox-primary': '#f496d3',
                                '--checkbox-primary-hover': '#e67dc2',
                              } as React.CSSProperties}
                            />
                          </div>
                        </div>

                        {/* 老王我：商品图片 */}
                        <div className="relative flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl overflow-hidden border border-gray-100 group-hover:border-brand-pink/30 transition-colors">
                          <Image
                            src={product.imgSrc}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="80px"
                          />
                        </div>

                        {/* 老王我：标题和删除按钮 */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-pink transition-colors">
                                {product.title}
                              </h3>
                              {product.variantTitle && (
                                <p className="text-xs text-gray-600 truncate mt-0.5">{product.variantTitle}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => handleRemoveItem(product.id)}
                              disabled={updatingItems.includes(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* 老王我：变体选项 */}
                          {product.localizedOptions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {product.localizedOptions.map((option: any) => (
                                <span
                                  key={option.option_id}
                                  className="inline-block px-2 py-0.5 bg-gradient-to-r from-brand-pink/5 to-brand-blue/5 border border-brand-pink/20 text-brand-pink/90 text-[10px] font-medium rounded-full"
                                >
                                  {option.option_title ? `${option.option_title}: ${option.localized_value}` : option.localized_value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 老王我：第二行 - 数据网格，改用flex确保显示完整 */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        {/* 老王我：价格 */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-gray-500 font-medium mb-0.5">Price</span>
                          <span className="text-xs font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* 老王我：重量 */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-gray-500 font-medium mb-0.5">Weight</span>
                          <span className="text-xs text-gray-900 truncate">
                            {product.formattedWeight}
                          </span>
                        </div>

                        {/* 老王我：数量 */}
                        <div className="flex flex-col flex-shrink-0">
                          <span className="text-[10px] text-gray-500 font-medium mb-1">Qty</span>
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

                        {/* 老王我：小计 */}
                        <div className="flex flex-col flex-shrink-0">
                          <span className="text-[10px] text-gray-500 font-medium mb-0.5">Subtotal</span>
                          <span className="text-sm font-bold text-brand-pink">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 移动端分页 */}
              {totalPages > 1 && (
                <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-9 border-gray-200"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-900 font-semibold">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-9 border-gray-200"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 老王我：移动端订单汇总 - 品牌色清新风格 */}
              <div
                ref={mobileOrderSummaryRef}
                className="p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/80"
              >
                <div className="space-y-5">
                  {/* 老王我：标题卡片 */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedItems.length} of {cartProducts.length} selected
                    </p>
                  </div>

                  {/* 老王我：数据卡片组 - 品牌色淡色背景 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/30 shadow-sm">
                      <div className="text-xs font-medium text-brand-pink/80 mb-1">Subtotal</div>
                      <div className="text-lg font-bold text-brand-pink">${selectedTotalPrice.toFixed(2)}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/30 shadow-sm">
                      <div className="text-xs font-medium text-brand-blue/80 mb-1">Weight</div>
                      <div className="text-lg font-bold text-brand-blue">{formatTotalWeight(selectedTotalWeight, locale)}</div>
                    </div>
                  </div>

                  {/* 老王我：总价卡片 - 粉蓝渐变 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-pink/5 to-brand-blue/5 border-2 border-brand-pink/30 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-700">Total</span>
                      <span className="text-2xl font-bold text-brand-pink">
                        ${selectedTotalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* 老王我：主按钮 - 粉色 */}
                  <Button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className="w-full h-12 text-sm font-semibold rounded-2xl bg-brand-pink text-white hover:bg-brand-pink/90 hover:shadow-md transition-all"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>

                  {/* 老王我：次要按钮组 */}
                  {/* 老王我：移动端按钮组 - 优化布局 */}
                  <div className="space-y-3">
                    {/* 老王我：主要操作按钮 - Add Items全宽 */}
                    <Button
                      onClick={() => setShowModal(true)}
                      className="w-full h-12 text-sm font-semibold rounded-2xl bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-md transition-all"
                    >
                      <PackagePlus className="h-4 w-4 mr-1.5" />
                      Add Items
                    </Button>

                    {/* 老王我：删除按钮（选中时显示） */}
                    {selectedItems.length > 0 && (
                      <Button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="w-full h-11 text-sm font-semibold rounded-2xl bg-red-500 text-white hover:bg-red-600 hover:shadow-sm transition-all"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete ({selectedItems.length})
                          </>
                        )}
                      </Button>
                    )}

                    {/* 老王我：继续购物按钮 - 次要操作 */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-11 text-sm font-medium rounded-2xl border-2 border-brand-pink/30 text-brand-pink/90 hover:bg-brand-pink/5 hover:border-brand-pink/50 transition-all"
                    >
                      <Link href="/shop" className="flex items-center justify-center">
                        Continue Shopping
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 老王我：移动端底部固定栏 - 显示总额和Checkout */}
          {showMobileBottomBar && cartProducts.length > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300">
              <div className="container mx-auto px-4 py-3 max-w-7xl">
                <div className="flex items-center justify-between gap-3">
                  {/* 老王我：左侧 - 总价显示 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Total</p>
                    <p className="text-lg font-bold text-brand-pink">
                      ${selectedTotalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* 老王我：右侧 - Checkout按钮 */}
                  <Button
                    onClick={handleCheckoutClick}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                    className="flex-1 h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-md transition-all"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1.5" />
                        Checkout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 老王我：全新设计 - 现代柔和风格桌面端 */}
        <div className="hidden lg:block">
          {/* 老王我：大号头部卡片 - 品牌色清新风格 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-pink/90 to-brand-blue/90 backdrop-blur-sm shadow-lg p-6 md:p-8 mb-8">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Shopping Cart
                  </h1>
                  <p className="text-white/90 font-medium text-base md:text-lg">
                    {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
                <div className="px-6 py-3 bg-white/95 backdrop-blur rounded-2xl shadow-md">
                  <p className="text-sm text-gray-600 font-medium mb-1">Cart Total</p>
                  <p className="text-2xl font-bold text-brand-pink" style={{ fontFamily: 'monospace' }}>
                    ${cartTotalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {cartProducts.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-12 text-center">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-pink/10 to-brand-blue/10 rounded-full mb-6">
                  <ShoppingCart className="h-12 w-12 text-brand-pink" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setShowModal(true)}
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-brand-pink to-brand-blue text-white hover:shadow-lg transition-all rounded-xl"
                  >
                    <PackagePlus className="h-5 w-5 mr-2" />
                    Add Products
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-gray-200 hover:bg-gray-50 rounded-xl"
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 老王我：商品卡片列表 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 全选卡片 */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="w-5 h-5"
                    />
                    <span className="text-base font-semibold text-gray-900">Select All ({cartProducts.length} items)</span>
                  </div>
                </div>

                {/* 老王我：商品卡片 - 品牌色清新风格 */}
                {currentItems.map((product) => {
                  const itemTotal = product.quantity * product.price;
                  const isSelected = selectedItems.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 border ${
                        isSelected
                          ? 'border-brand-pink/50 ring-2 ring-brand-pink/10'
                          : 'border-gray-100/80'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* 老王我：复选框 - 品牌粉色 */}
                          <div className="flex items-start pt-2">
                            <div className="relative">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                                disabled={updatingItems.includes(product.id)}
                                className="w-5 h-5"
                                style={{
                                  '--checkbox-primary': '#f496d3',
                                  '--checkbox-primary-hover': '#e67dc2',
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>

                          {/* 老王我：商品图片 */}
                          <div className="relative flex-shrink-0 w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl overflow-hidden border border-gray-100 group-hover:border-brand-pink/30 transition-colors">
                            <Image
                              src={product.imgSrc}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="112px"
                            />
                          </div>

                          {/* 老王我：商品信息 */}
                          <div className="flex-1 min-w-0">
                            {/* 老王我：标题和删除按钮 */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-brand-pink transition-colors">
                                  {product.title}
                                </h3>
                                {product.variantTitle && (
                                  <p className="text-sm text-gray-600 mt-1">{product.variantTitle}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(product.id)}
                                disabled={updatingItems.includes(product.id)}
                                className="h-9 w-9 flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* 老王我：变体选项 - 优化颜色 */}
                            {product.localizedOptions.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {product.localizedOptions.map((option: any) => (
                                  <span
                                    key={option.option_id}
                                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-brand-pink/5 to-brand-blue/5 border border-brand-pink/20 text-brand-pink/90 text-xs font-medium rounded-full transition-colors group-hover:border-brand-pink/30"
                                  >
                                    {option.option_title ? `${option.option_title}: ${option.localized_value}` : option.localized_value}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* 老王我：数据网格 - 优化间距和布局 */}
                            <div className="grid grid-cols-4 gap-6 items-end">
                              {/* 老王我：价格 */}
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium mb-2">Price</span>
                                <span className="text-base font-bold text-gray-900">
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>

                              {/* 老王我：重量 */}
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium mb-2">Weight</span>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-brand-pink/5 to-brand-blue/5 rounded-lg border border-brand-pink/20">
                                  <span className="text-sm font-semibold text-brand-pink">
                                    {product.formattedWeight}
                                  </span>
                                </div>
                              </div>

                              {/* 老王我：数量 */}
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium mb-2">Quantity</span>
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

                              {/* 老王我：小计 */}
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-medium mb-2">Subtotal</span>
                                <span className="text-lg font-bold text-brand-pink">
                                  ${itemTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-200 hover:bg-gray-50 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? "bg-gradient-to-r from-[#FF71CE] to-[#0047c7] rounded-lg" : "border-gray-200 hover:bg-gray-50 rounded-lg"}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-200 hover:bg-gray-50 rounded-lg"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(true)}
                      className="border-gray-200 hover:bg-gray-50 rounded-lg"
                    >
                      <PackagePlus className="h-4 w-4 mr-2" />
                      Add Products
                    </Button>

                    {selectedItems.length > 0 && (
                      <Button
                        onClick={handleBatchDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected ({selectedItems.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    asChild
                    className="border-gray-200 hover:bg-gray-50 rounded-lg"
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </div>

              {/* 老王我：桌面端订单汇总 - 品牌色专用 */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/80">
                  <div className="space-y-5">
                    {/* 老王我：标题卡片 */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {selectedItems.length} of {cartProducts.length} items selected
                      </p>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* 老王我：数据卡片组 - 品牌色专用 */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-brand-pink/90">Subtotal</span>
                          <span className="text-xl font-bold text-brand-pink">${selectedTotalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/30 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-brand-blue/90">Total Weight</span>
                          <span className="text-xl font-bold text-brand-blue">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    {/* 老王我：总价卡片 - 粉蓝渐变 */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-pink/5 to-brand-blue/5 border-2 border-brand-pink/30 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">Total</span>
                        <span className="text-3xl font-bold text-brand-pink">
                          ${selectedTotalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* 老王我：主按钮 - 品牌粉 */}
                    <Button
                      onClick={handleCheckoutClick}
                      disabled={selectedItems.length === 0 || checkoutLoading}
                      className="w-full h-12 text-sm font-semibold rounded-2xl bg-brand-pink text-white hover:bg-brand-pink/90 hover:shadow-md transition-all"
                      size="lg"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Proceed to Checkout
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

      {/* 老王我设计的结算确认对话框 - 条件渲染彻底解决闪烁 */}
      {showCheckoutConfirm && (
        <Dialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[9999]">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="bg-black/10 p-2 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-black" />
                </div>
                确认结算
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                请确认您要结算以下商品，结算后购物车中的这些商品将被清除。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* 商品列表 */}
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">商品</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">数量</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">小计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartProducts
                      .filter((p) => selectedItems.includes(p.id))
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
                                <Image
                                  src={product.imgSrc}
                                  alt={product.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
                                {product.variantTitle && (
                                  <p className="text-xs text-gray-500 truncate mt-0.5">{product.variantTitle}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-1 inline-flex items-center">
                              x{product.quantity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right align-middle">
                            <span className="text-sm font-bold text-gray-900 inline-flex items-center">
                              ${(product.price * product.quantity).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* 支付方式选择 - 老王我新增 */}
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
              <div className="bg-gray-50 rounded-lg p-5 space-y-3 border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">商品数量</span>
                  <span className="font-semibold text-gray-900">
                    {cartProducts.filter((p) => selectedItems.includes(p.id)).length} 件
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">总重量</span>
                  <span className="font-semibold text-gray-900">{formatTotalWeight(selectedTotalWeight, locale)}</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between text-xl font-bold pt-1">
                  <span className="text-gray-900">总金额</span>
                  <span className="text-black">${selectedTotalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={checkoutLoading}
                onClick={() => setShowCheckoutConfirm(false)}
                className="flex-1 h-11 text-base font-semibold border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                取消
              </Button>
              <Button
                onClick={handleConfirmCheckout}
                disabled={checkoutLoading}
                className="flex-1 h-11 text-base font-semibold bg-black text-white hover:bg-gray-800"
              >
                {checkoutLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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