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

  const itemsPerPage = 5;

  const cartProducts = React.useMemo(() => {
    if (!cart?.items || cart.items.length === 0) {
      return [];
    }

    return cart.items.map((item: any, index: number) => {
      // 老王我：获取产品对象用于翻译
      const product = products.find((p) => p.id === item.product_id);

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
        localizedOptions: getLocalizedVariantOptions(product, item.variant, locale),
        options: item.variant?.options || [], // 保留原始 options 用于调试
        metadata: item.metadata || {},
        weight: item.variant?.weight || 0,
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
        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Add Items
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium">Select All ({cartProducts.length} items)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Cart Items */}
              {currentItems.map((product) => (
                <Card key={product.id} className={`transition-opacity ${updatingItems.includes(product.id) ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                        disabled={updatingItems.includes(product.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex space-x-3">
                          <div className="relative">
                            <Image
                              src={product.imgSrc}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md"
                              onClick={() => handleRemoveItem(product.id)}
                              disabled={updatingItems.includes(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.title}
                            </h3>
                            {product.variantTitle && (
                              <p className="text-sm text-gray-600 mt-1">{product.variantTitle}</p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.localizedOptions.map((option: any) => (
                                <Badge key={option.option_id} variant="secondary" className="text-xs">
                                  {option.option_title}: {option.localized_value}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">/pcs</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <div
                                  className={updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}
                                >
                                  <InputNumber
                                    value={product.quantity}
                                    onChange={(value) => handleUpdateQuantity(product.id, value)}
                                    step={50}
                                    min={50}
                                    size="sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Order Summary */}
              <Card className="lg:hidden">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Selected Items</span>
                    <span>{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">${selectedTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Weight</span>
                    <span>{selectedTotalWeight} g</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">${selectedTotalPrice.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={handleCheckoutClick}
                      disabled={selectedItems.length === 0 || checkoutLoading}
                      className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(true)}
                        className="w-full"
                      >
                        <PackagePlus className="h-4 w-4 mr-1" />
                        Add Items
                      </Button>

                      {selectedItems.length > 0 && (
                        <Button
                          onClick={handleBatchDelete}
                          disabled={isDeleting}
                          className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete ({selectedItems.length})
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => setShowModal(true)} size="lg">
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Add Products
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Cart Items ({cartProducts.length})</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((product) => (
                          <TableRow
                            key={product.id}
                            className={`transition-opacity ${updatingItems.includes(product.id) ? 'opacity-50' : ''}`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(product.id)}
                                onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                                disabled={updatingItems.includes(product.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Image
                                    src={product.imgSrc}
                                    alt={product.title}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">
                                    {product.title}
                                  </div>
                                  {product.variantTitle && (
                                    <div className="text-sm text-gray-600 mt-1">{product.variantTitle}</div>
                                  )}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {product.localizedOptions.map((option: any) => (
                                      <Badge key={option.option_id} variant="secondary" className="text-xs">
                                        {option.option_title}: {option.localized_value}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">${product.price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="text-sm">{product.weight} g</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className={updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}>
                                <InputNumber
                                  value={product.quantity}
                                  onChange={(value) => handleUpdateQuantity(product.id, value)}
                                  step={50}
                                  min={50}
                                  size="sm"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-bold">
                                ${(product.quantity * product.price).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(product.id)}
                                disabled={updatingItems.includes(product.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Desktop Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <div className="flex items-center space-x-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}

                    {/* Desktop Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowModal(true)}
                        >
                          <PackagePlus className="h-4 w-4 mr-2" />
                          Add Products
                        </Button>

                        {selectedItems.length > 0 && (
                          <Button
                            onClick={handleBatchDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
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

                      <Button variant="outline" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary - Desktop */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      {selectedItems.length} of {cartProducts.length} items selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">${selectedTotalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Weight</span>
                      <span>{selectedTotalWeight} g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">${selectedTotalPrice.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleCheckoutClick}
                        disabled={selectedItems.length === 0 || checkoutLoading}
                        className="w-full h-12 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                        size="lg"
                      >
                        {checkoutLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
          <DialogContent className="max-w-3xl">
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

          {/* 商品列表 */}
          <div className="my-6 max-h-80 overflow-y-auto border border-gray-200 rounded-lg bg-white">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0 shadow-sm">
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
          <PaymentMethodSelector
            paymentProviders={paymentProviders}
            mode="selection"
            orderAmount={selectedTotalPrice}
            customer={customer}
            onPaymentMethodChange={setSelectedPaymentProvider}
          />

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
              <span className="font-semibold text-gray-900">{selectedTotalWeight.toFixed(2)} g</span>
            </div>
            <Separator className="bg-gray-200" />
            <div className="flex justify-between text-xl font-bold pt-1">
              <span className="text-gray-900">总金额</span>
              <span className="text-black">${selectedTotalPrice.toFixed(2)}</span>
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