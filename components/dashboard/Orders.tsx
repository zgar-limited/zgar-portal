"use client";

import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useState } from "react";
import { useTranslations } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import { ShoppingBag, ChevronRight, ChevronLeft, Upload, FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrdersProps {
  customer: HttpTypes.StoreCustomer;
  orders: { orders: HttpTypes.StoreOrder[]; count: number } | null;
  currentPage: number;
  totalPages: number;
  orderStats: {
    unpaidVoucherCount: number;
    pendingClosingCount: number;
  };
}

/**
 * 订单列表组件 - 商务极简风格
 *
 * 与订单详情页一致的设计语言：
 * - 极简白色背景，淡灰边框 (gray-100)
 * - 轻盈字体 (font-light)
 * - 无阴影，靠留白分隔
 * - 紧凑布局
 */
export default function Orders({ customer, orders: initialOrders, currentPage: initialPage, totalPages, orderStats }: OrdersProps) {
  const t = useTranslations('Pagination');
  const tOrders = useTranslations('Orders');
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const orderList = orders?.orders || [];
  const count = orders?.count || 0;

  /**
   * 订单状态配置 - 商务极简风格
   */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "fulfilled":
        return {
          label: tOrders('completed'),
          textColor: 'text-gray-900'
        };
      case "not_fulfilled":
      case "partially_fulfilled":
        return {
          label: tOrders('pending'),
          textColor: 'text-gray-400'
        };
      case "returned":
        return {
          label: tOrders('returned'),
          textColor: 'text-gray-500'
        };
      case "canceled":
        return {
          label: tOrders('canceled'),
          textColor: 'text-red-500'
        };
      default:
        return {
          label: status,
          textColor: 'text-gray-400'
        };
    }
  };

  /**
   * 支付方式显示
   */
  const getPaymentText = (paymentMethod: string) => {
    const method = paymentMethod || 'manual';
    switch (method) {
      case 'balance': return tOrders('methods.balance');
      case 'points': return tOrders('methods.points');
      case 'credit': return tOrders('methods.credit');
      default: return tOrders('methods.manual');
    }
  };

  /**
   * 格式化金额
   */
  const formatAmount = (amount: string | number | undefined) => {
    if (!amount) return '$0.00';
    const numStr = String(amount).replace(/[^0-9.-]/g, '');
    const num = parseFloat(numStr);
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  };

  /**
   * 分页处理
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      window.location.href = `${pathname}?${params.toString()}`;
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <main>
        {/* 页面标题 */}
        <div className="pb-6 mb-6 border-b border-gray-100">
          <h1 className="text-2xl font-light text-gray-900 mb-1">{tOrders('title')}</h1>
          <p className="text-sm text-gray-400">{tOrders('totalOrders')}: {count}</p>
        </div>

        {/* 统计摘要 - 极简行内统计 */}
        <div className="mb-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-900" />
            <span className="text-gray-400">{tOrders('completed')}</span>
            <span className="text-gray-900 font-medium">
              {orderList.filter(o => o.fulfillment_status === 'fulfilled').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-gray-400">{tOrders('inProgress')}</span>
            <span className="text-gray-900 font-medium">
              {orderList.filter(o => o.fulfillment_status !== 'fulfilled' && o.fulfillment_status !== 'returned').length}
            </span>
          </div>
          {orderStats.unpaidVoucherCount > 0 && (
            <div className="flex items-center gap-2">
              <Upload size={14} className="text-gray-400" />
              <span className="text-gray-400">{tOrders('unpaidVoucher')}</span>
              <span className="text-gray-900 font-medium">{orderStats.unpaidVoucherCount}</span>
            </div>
          )}
          {orderStats.pendingClosingCount > 0 && (
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400" />
              <span className="text-gray-400">{tOrders('pendingClosing')}</span>
              <span className="text-gray-900 font-medium">{orderStats.pendingClosingCount}</span>
            </div>
          )}
        </div>

        {/* 订单列表 */}
        {orderList.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-light text-gray-900 mb-2">{tOrders('noOrders')}</h3>
            <p className="text-sm text-gray-400 mb-6">{tOrders('noOrdersDesc')}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {tOrders('goToShop')}
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {orderList.map((order, index) => {
              const statusConfig = getStatusConfig(order.fulfillment_status || '');
              const paymentMethod = (order as any).zgar_order?.payment_method || 'manual';

              return (
                <div
                  key={order.id}
                  className={cn(
                    "py-4",
                    index !== orderList.length - 1 && "border-b border-gray-100"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    {/* 左侧：订单信息 */}
                    <div className="flex-1">
                      {/* 订单号 */}
                      <Link
                        href={`/account-orders-detail/${order.id}`}
                        className="text-gray-900 hover:text-gray-500 transition-colors font-light text-lg"
                      >
                        #{order.id}
                      </Link>
                      {/* 日期和状态 */}
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>{formatDate(order.created_at)}</span>
                        <span className={statusConfig.textColor}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* 右侧：金额 */}
                    <div className="text-right">
                      <div className="text-lg font-light text-gray-900">
                        {formatAmount(order.total)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {getPaymentText(paymentMethod)}
                      </div>
                    </div>
                  </div>

                  {/* 商品信息 */}
                  <div className="flex items-center gap-4">
                    {/* 商品图片 */}
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={item.id}
                          className="w-10 h-10 bg-gray-50 flex items-center justify-center overflow-hidden"
                          style={{ zIndex: 10 - idx }}
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag size={16} className="text-gray-300" />
                          )}
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <div
                          className="w-10 h-10 bg-gray-50 flex items-center justify-center text-xs text-gray-400"
                          style={{ zIndex: 0 }}
                        >
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* 商品标题和规格 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">
                        {order.items?.[0]?.variant_title || order.items?.[0]?.title}
                      </p>
                      {/* 商品选项 */}
                      {order.items?.[0]?.variant?.options && order.items[0].variant.options.length > 0 && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {order.items[0].variant.options.map((opt: any) => {
                            const optionTitle = typeof opt.option === 'string' ? opt.option : (opt.option?.title || '');
                            return optionTitle ? `${optionTitle}: ${opt.value}` : opt.value;
                          }).join(' / ')}
                        </p>
                      )}
                      {order.items && order.items.length > 1 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {tOrders('moreItems', { n: order.items.length })}
                        </p>
                      )}
                    </div>

                    {/* 查看详情 */}
                    <Link
                      href={`/account-orders-detail/${order.id}`}
                      className="text-sm text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                      <Eye size={14} />
                      {tOrders('viewDetails')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 分页器 - 极简风格 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-100 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "text-gray-400 hover:text-gray-900"
              )}
            >
              <ChevronLeft size={16} />
            </button>

            {(() => {
              const pages = [];
              pages.push(1);
              if (currentPage > 4) pages.push('...');
              const start = Math.max(2, currentPage - 2);
              const end = Math.min(totalPages - 1, currentPage + 2);
              for (let i = start; i <= end; i++) pages.push(i);
              if (currentPage < totalPages - 3) pages.push('...');
              if (totalPages > 1) pages.push(totalPages);

              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-xs text-gray-300"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={cn(
                      "w-8 h-8 text-sm flex items-center justify-center transition-colors",
                      currentPage === page
                        ? "text-gray-900 font-medium"
                        : "text-gray-400 hover:text-gray-900"
                    )}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "w-10 h-10 flex items-center justify-center transition-colors",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "text-gray-400 hover:text-gray-900"
              )}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
