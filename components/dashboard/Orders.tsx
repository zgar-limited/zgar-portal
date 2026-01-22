"use client";
import { Link, useRouter, usePathname } from '@/i18n/routing';
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
// 老王我移除 Sidebar import，因为已经在 layout 中了
import OrderCard from "./OrderCard";
import { HttpTypes } from "@medusajs/types";
import { retrieveOrders } from "@/data/orders"; // 老王我添加：导入获取订单数据的函数
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Eye, Upload, Package, ShoppingBag, Star, Wallet, CreditCard, Landmark } from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import PackingRequirementsModal from "../modals/PackingRequirementsModal";
import { cn } from "@/lib/utils";

interface OrdersProps {
  customer: HttpTypes.StoreCustomer;
  orders: { orders: HttpTypes.StoreOrder[]; count: number } | null;
  currentPage: number;
  totalPages: number;
}

export default function Orders({ customer, orders: initialOrders, currentPage: initialPage, totalPages }: OrdersProps) {
  const t = useTranslations('Pagination'); // 老王我添加：分页多语言
  const tOrders = useTranslations('Orders'); // 老王我添加：订单多语言
  const tPayment = useTranslations('PaymentMethods'); // 老王我添加：支付方式多语言
  const router = useRouter();
  const pathname = usePathname(); // 老王我添加：使用 next-intl 的 pathname，不包含语言前缀
  const locale = useLocale(); // 老王我获取当前语言，用于多语言翻译

  // 老王我添加：客户端状态管理订单数据、加载状态、当前页码
  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(initialPage); // 老王我修复：管理当前页码的本地状态
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false); // 老王我改成 PackingRequirementsModal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<HttpTypes.StoreOrder | null>(null); // 老王我添加：存储完整订单对象
  const [selectedOrderVouchers, setSelectedOrderVouchers] = useState<string[]>([]);

  const orderList = orders?.orders || [];
  const count = orders?.count || 0;

  // 订单状态颜色映射
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // 老王我添加：支付方式图标映射 - 黑白简洁风格
  const getPaymentIcon = (paymentMethod: string) => {
    const method = paymentMethod || 'manual';
    switch (method) {
      case 'balance':
        return <Wallet size={14} className="text-gray-700" />;
      case 'points':
        return <Star size={14} className="text-gray-700" />;
      case 'credit':
        return <CreditCard size={14} className="text-gray-700" />;
      case 'manual':
        return <Landmark size={14} className="text-gray-700" />;
      default:
        return <Wallet size={14} className="text-gray-700" />;
    }
  };

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoadingPage) {
      // 老王我修复：客户端请求数据，不刷新页面
      setIsLoadingPage(true);
      const limit = 10;
      const offset = (page - 1) * limit;

      try {
        const newOrders = await retrieveOrders(limit, offset, "-created_at");
        setOrders(newOrders);
        setCurrentPage(page); // 老王我修复：更新当前页码状态

        // 更新 URL，但不刷新页面
        router.push(`${pathname}?page=${page}`, {
          scroll: false // 老王我添加：不滚动到顶部，保持用户位置
        });
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoadingPage(false);
      }
    }
  };

  // 处理订单操作 - 老王我用router.push代替硬编码跳转
  const handleViewDetails = (orderId: string) => {
    router.push(`/account-orders-detail/${orderId}`);
  };

  const handleUploadVoucher = (order: HttpTypes.StoreOrder) => {
    setSelectedOrderId(order.id);
    const vouchers = (order as any).zgar_order?.payment_voucher_url;
    let voucherList: string[] = [];
    if (typeof vouchers === "string") {
      voucherList = vouchers
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
    }
    setSelectedOrderVouchers(voucherList);
    setShowVoucherModal(true);
  };

  const handleUploadPacking = (order: HttpTypes.StoreOrder) => {
    // 老王我改成：设置 orderId、完整订单对象和 initialData（shipping_marks）
    setSelectedOrderId(order.id);
    setSelectedOrder(order); // 老王我添加：存储完整订单对象
    setShowPackingModal(true);
  };

  return (
    /* 老王我移除外层布局和 Sidebar，因为 layout 已经提供了 */
    <div className="space-y-6">
              {/* 页面标题 */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">{tOrders('title')}</h1>
                <p className="text-muted-foreground">{tOrders('subtitle')}</p>
              </div>

              {/* 订单列表 */}
              <div className="space-y-4 relative">
                {/* 老王我添加：loading 状态遮罩 - 半透明遮罩覆盖在订单列表上 */}
                {isLoadingPage && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</span>
                    </div>
                  </div>
                )}

                {/* 桌面端表格布局 - 老王我重构：现代化设计 */}
                <div className="hidden md:block">
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                          <TableHead className="w-[140px] text-xs font-bold text-gray-600 uppercase tracking-wide">{tOrders('orderNumber')}</TableHead>
                          <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wide">{tOrders('product')}</TableHead>
                          <TableHead className="w-[120px] text-xs font-bold text-gray-600 uppercase tracking-wide">{tOrders('paymentMethod')}</TableHead>
                          <TableHead className="w-[120px] text-right text-xs font-bold text-gray-600 uppercase tracking-wide">{tOrders('amount')}</TableHead>
                          <TableHead className="w-[100px] text-center text-xs font-bold text-gray-600 uppercase tracking-wide">{tOrders('status')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-96 text-center">
                              <div className="flex flex-col items-center gap-6 text-muted-foreground">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink/10 to-brand-blue/10 flex items-center justify-center">
                                  <ShoppingBag size={40} className="text-brand-gradient" />
                                </div>
                                <div className="space-y-2">
                                  <p className="font-semibold text-lg">{tOrders('noOrders')}</p>
                                  <p className="text-sm text-gray-500">{tOrders('noOrdersDesc')}</p>
                                </div>
                                <Button asChild variant="outline" className="rounded-full mt-2 border-2 hover:bg-brand-gradient hover:text-white hover:border-transparent transition-all duration-300">
                                  <Link href="/shop">{tOrders('startShopping')}</Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          orderList.map((order) => (
                            <TableRow
                              key={order.id}
                              className="group hover:bg-gradient-to-r hover:from-brand-pink/5 hover:to-brand-blue/5 transition-all duration-300 border-b border-gray-100 last:border-b-0 cursor-pointer"
                              onClick={() => handleViewDetails(order.id)}
                            >
                              {/* 老王我优化：订单号 + 类型图标一体化 - 使用品牌统一色 */}
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {/* 老王我个性设计：积分订单星星图标 - 品牌粉蓝渐变圆形 */}
                                  {(order as any).zgar_order?.payment_method === 'points' ? (
                                    <div className="relative group/icon">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-md group-hover/icon:shadow-lg group-hover/icon:scale-110 transition-all duration-300">
                                        <Star size={16} className="text-white fill-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    /* 老王我个性设计：付款订单钱包图标 - 品牌粉蓝渐变圆形 */
                                    <div className="relative group/icon">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-md group-hover/icon:shadow-lg group-hover/icon:scale-110 transition-all duration-300">
                                        <Wallet size={16} className="text-white" />
                                      </div>
                                    </div>
                                  )}
                                  <span className="text-sm font-bold text-gray-900">#{order.display_id}</span>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {/* 老王我优化：产品缩略图带悬浮效果 */}
                                  <Link
                                    href={`/product-detail/${
                                      order.items?.[0]?.product_id ||
                                      order.items?.[0]?.variant?.product_id ||
                                      ""
                                    }`}
                                    className="flex-shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-brand-pink/50 shadow-sm group-hover:shadow-md transition-all duration-300">
                                      <Image
                                        src={
                                          order.items?.[0]?.thumbnail ||
                                          "https://placehold.co/100"
                                        }
                                        alt={order.items?.[0]?.title || "商品"}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                      />
                                    </div>
                                  </Link>
                                  {/* 老王我优化：商品信息更清晰 */}
                                  <div className="flex-1 min-w-0">
                                    {order.items && order.items.length > 0 && (
                                      <>
                                        <h6 className="text-sm font-semibold text-gray-900 truncate mb-1 group-hover:text-brand-pink transition-colors">
                                          {order.items.length === 1
                                            ? (
                                              <Link
                                                href={`/product-detail/${
                                                  order.items[0].product_id ||
                                                  order.items[0].variant?.product_id ||
                                                  ""
                                                }`}
                                                className="hover:text-brand-pink transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                {order.items[0].variant_title || order.items[0].title}
                                              </Link>
                                            )
                                            : (
                                              <Link
                                                href={`/account-orders-detail/${order.id}`}
                                                className="hover:text-brand-pink transition-colors"
                                              >
                                                {order.items.slice(0, 2).map(item => item.variant_title || item.title).join(", ")}
                                                {order.items.length > 2 && ` 等${order.items.length}件商品`}
                                              </Link>
                                            )
                                          }
                                        </h6>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          {order.items[0]?.variant?.options && (order.items[0].variant.options as any[]).length > 0 ? (
                                            (order.items[0].variant.options as any[]).map((option: any, idx: number) => {
                                              const localeUnderscore = locale.replace('-', '_').toLowerCase();
                                              const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                                              const productMetadata = (order.items[0] as any).product?.metadata || {};
                                              const localizedValue = productMetadata[optionValueKey] || option.value;

                                              return (
                                                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border-0">
                                                  {localizedValue}
                                                </Badge>
                                              );
                                            })
                                          ) : order.items[0]?.variant_title && (
                                            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border-0">
                                              {order.items[0].variant_title}
                                            </Badge>
                                          )}
                                          <span className="font-medium text-gray-700">共{order.items.reduce((sum, item) => sum + item.quantity, 0)}{tOrders('pieces')}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              {/* 老王我优化：支付方式图标化 - 黑白简洁风格圆形 */}
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                    {getPaymentIcon((order as any).zgar_order?.payment_method)}
                                  </div>
                                  <span className="text-xs font-semibold text-gray-700">
                                    {tPayment('zgar_' + ((order as any).zgar_order?.payment_method || 'manual'))}
                                  </span>
                                </div>
                              </TableCell>

                              {/* 老王我优化：金额显示更突出 */}
                              {(order as any).zgar_order?.payment_method !== 'points' && (
                              <TableCell className="text-right">
                                <span className="text-sm font-bold text-gray-900">
                                  {order.currency_code?.toUpperCase() === 'USD' ? '$' : order.currency_code?.toUpperCase() + ' '}
                                  {order.total?.toFixed(2) || "0.00"}
                                </span>
                              </TableCell>
                              )}

                              {/* 老王我优化：积分订单显示 */}
                              {(order as any).zgar_order?.payment_method === 'points' && (
                              <TableCell className="text-right">
                                <span className="text-sm font-medium text-gray-400">-</span>
                              </TableCell>
                              )}

                              {/* 老王我优化：状态标签更醒目 */}
                              <TableCell className="text-center">
                                <Badge
                                  variant={getStatusVariant(order.status)}
                                  className={cn(
                                    "text-xs font-bold px-3 py-1.5 rounded-full border-0 shadow-sm",
                                    order.status === "completed" && "bg-gradient-to-r from-green-400 to-green-500 text-white",
                                    order.status === "pending" && "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
                                    order.status === "canceled" && "bg-gradient-to-r from-red-400 to-red-500 text-white"
                                  )}
                                >
                                  {order.status === "completed" ? tOrders('completed') :
                                   order.status === "pending" ? tOrders('pending') : tOrders('canceled')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 移动端卡片布局 */}
                <div className="md:hidden space-y-4">
                  {orderList.length === 0 ? (
                    <Card className="p-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ShoppingBag size={32} className="opacity-50" />
                        <span>暂无订单</span>
                      </div>
                    </Card>
                  ) : (
                    orderList.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={() => handleViewDetails(order.id)}
                        onUploadVoucher={() => handleUploadVoucher(order)}
                        onUploadPacking={() => handleUploadPacking(order)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-6">
                  <div className="flex items-center gap-2">
                    {/* 上一页按钮 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoadingPage}
                      className={cn(
                        "gap-1.5 rounded-lg bg-white text-gray-900 border-gray-300 hover:bg-gray-100",
                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white",
                        "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
                        "transition-all duration-200"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
                        {t('previous')}
                      </span>
                    </Button>

                    {/* 页码按钮 */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // 智能显示：只显示第一页、最后一页、当前页前后各1页
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage) {
                          // 显示省略号
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span
                                key={page}
                                className="flex items-center justify-center w-9 h-9 text-gray-400 text-sm"
                              >
                                ...
                              </span>
                              );
                            }
                          return null;
                        }

                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            disabled={isLoadingPage}
                            className={cn(
                              "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200",
                              page === currentPage
                                ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:border-white dark:hover:bg-gray-100"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800",
                              "disabled:opacity-40 disabled:cursor-not-allowed"
                            )}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    {/* 移动端简化显示 */}
                    <div className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-xs">{t('page')}</span>
                      <span className="text-base font-bold">{currentPage}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">/</span>
                      <span className="text-xs">{totalPages}</span>
                    </div>

                    {/* 下一页按钮 */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoadingPage}
                      className={cn(
                        "gap-1.5 rounded-lg bg-white text-gray-900 border-gray-300 hover:bg-gray-100",
                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white",
                        "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
                        "transition-all duration-200"
                      )}
                    >
                      <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">
                        {t('next')}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

            {/* 模态框 */}
            <UploadVoucherModal
              show={showVoucherModal}
              onHide={() => {
                setShowVoucherModal(false);
                setSelectedOrderId(null);
                setSelectedOrderVouchers([]);
              }}
              orderId={selectedOrderId}
              initialVouchers={selectedOrderVouchers}
            />
            {/* 老王我改成：使用 PackingRequirementsModal 替代 UploadPackingModal */}
            <PackingRequirementsModal
              show={showPackingModal}
              onHide={() => {
                setShowPackingModal(false);
                setSelectedOrderId(null);
                setSelectedOrder(null);
              }}
              orderId={selectedOrderId}
              order={selectedOrder}
              initialData={(selectedOrder as any)?.zgar_order?.packing_requirement?.shipping_marks || []}
            />
            </div>
          );
        }