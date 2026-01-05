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
import { ChevronLeft, ChevronRight, Eye, Upload, Package, ShoppingBag } from "lucide-react";
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
                <h1 className="text-2xl font-bold tracking-tight">我的订单</h1>
                <p className="text-muted-foreground">查看和管理您的所有订单</p>
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

                {/* 桌面端表格布局 */}
                <Card className="hidden md:block shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                          <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">订单号</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">商品</TableHead>
                          <TableHead className="w-[120px] text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">金额</TableHead>
                          <TableHead className="w-[100px] text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-64 text-center">
                              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                  <ShoppingBag size={32} className="opacity-50" />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium">暂无订单</p>
                                  <p className="text-sm">快去选购心仪的商品吧</p>
                                </div>
                                <Button asChild variant="outline" className="rounded-full mt-2">
                                  <Link href="/shop">开始购物</Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          orderList.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-b-0">
                              <TableCell className="font-medium">
                                <span className="text-sm">#{order.display_id}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {/* 老王我改成：只显示第一个商品的缩略图 */}
                                  <Link
                                    href={`/product-detail/${
                                      order.items?.[0]?.product_id ||
                                      order.items?.[0]?.variant?.product_id ||
                                      ""
                                    }`}
                                    className="flex-shrink-0"
                                  >
                                    <div className="relative w-9 h-9 rounded-md overflow-hidden border border-border shadow-sm">
                                      <Image
                                        src={
                                          order.items?.[0]?.thumbnail ||
                                          "https://placehold.co/100"
                                        }
                                        alt={order.items?.[0]?.title || "商品"}
                                        fill
                                        sizes="36px"
                                        className="object-cover hover:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                  </Link>
                                  {/* 老王我改成：显示商品列表摘要，避免行高过高 */}
                                  <div className="flex-1 min-w-0">
                                    {order.items && order.items.length > 0 && (
                                      <>
                                        <h6 className="text-sm font-medium truncate mb-1">
                                          {order.items.length === 1
                                            ? (
                                              <Link
                                                href={`/product-detail/${
                                                  order.items[0].product_id ||
                                                  order.items[0].variant?.product_id ||
                                                  ""
                                                }`}
                                                className="hover:text-primary transition-colors"
                                              >
                                                {/* 老王我修改：显示 variant_title 而不是 title */}
                                                {order.items[0].variant_title || order.items[0].title}
                                              </Link>
                                            )
                                            : (
                                              <Link
                                                href={`/account-orders-detail/${order.id}`}
                                                className="hover:text-primary transition-colors"
                                              >
                                                {/* 老王我修改：多商品时也显示 variant_title */}
                                                {order.items.slice(0, 2).map(item => item.variant_title || item.title).join(", ")}
                                                {order.items.length > 2 && ` 等${order.items.length}件商品`}
                                              </Link>
                                            )
                                          }
                                        </h6>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          {/* 老王我优化：显示商品变体信息（颜色、尺寸等），支持多语言翻译 */}
                                          {order.items[0]?.variant?.options && (order.items[0].variant.options as any[]).length > 0 ? (
                                            (order.items[0].variant.options as any[]).map((option: any, idx: number) => {
                                              // 老王我：locale 需要转成下划线格式（zh-HK -> zh_hk）
                                              const localeUnderscore = locale.replace('-', '_').toLowerCase();
                                              const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                                              const productMetadata = (order.items[0] as any).product?.metadata || {};
                                              const localizedValue = productMetadata[optionValueKey] || option.value;

                                              return (
                                                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
                                                  {localizedValue}
                                                </Badge>
                                              );
                                            })
                                          ) : order.items[0]?.variant_title && (
                                            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
                                              {order.items[0].variant_title}
                                            </Badge>
                                          )}
                                          <span className="font-medium">共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm">
                                {order.currency_code?.toUpperCase()}{" "}
                                {order.total?.toFixed(2) || "0.00"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={getStatusVariant(order.status)}
                                  className={cn(
                                    "text-xs font-medium px-2.5 py-1 rounded-md",
                                    order.status === "completed" && "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100",
                                    order.status === "pending" && "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
                                    order.status === "canceled" && "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                  )}
                                >
                                  {order.status === "completed" ? "已完成" :
                                   order.status === "pending" ? "处理中" : "已取消"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

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