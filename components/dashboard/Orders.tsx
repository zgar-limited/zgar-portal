"use client";

import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useState } from "react";
import { useTranslations } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import { ShoppingBag, Star, Wallet, CreditCard, Landmark, ChevronRight, ChevronLeft, Upload, FileText, Eye } from "lucide-react";
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
 * 订单列表组件 - 清爽和谐风格
 *
 * 老王我重新设计：简洁、清爽、与 Vibrant Blocks 和谐统一
 * - 轻量边框（1px gray-200）
 * - 微阴影（shadow-sm）
 * - 保留 Vibrant Blocks 配色
 * - 圆角卡片（rounded-xl）
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
   * 订单状态配置 - Vibrant Blocks 配色
   *
   * 老王我修复：fulfillment_status 的实际值是：
   * - fulfilled: 已完成/已发货
   * - not_fulfilled: 未发货
   * - partially_fulfilled: 部分发货
   * - returned: 已退货
   * - canceled: 已取消
   */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "fulfilled":
        return {
          label: tOrders('completed'),
          bgColor: 'bg-[#0047c7]/10',      // 淡蓝色背景
          textColor: 'text-[#0047c7]',      // 蓝色文字
          dotColor: 'bg-[#0047c7]'         // 蓝色圆点
        };
      case "not_fulfilled":
      case "partially_fulfilled":
        return {
          label: tOrders('pending'),
          bgColor: 'bg-[#FF71CE]/10',       // 淡粉色背景
          textColor: 'text-[#FF71CE]',      // 粉色文字
          dotColor: 'bg-[#FF71CE]'         // 粉色圆点
        };
      case "returned":
        return {
          label: tOrders('returned'),
          bgColor: 'bg-[#FFFB00]/10',      // 淡黄色背景
          textColor: 'text-[#FFFB00]',      // 黄色文字
          dotColor: 'bg-[#FFFB00]'         // 黄色圆点
        };
      case "canceled":
        return {
          label: tOrders('canceled'),
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          dotColor: 'bg-gray-400'
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          dotColor: 'bg-gray-400'
        };
    }
  };

  /**
   * 支付方式图标和文字
   */
  const getPaymentDisplay = (paymentMethod: string) => {
    const method = paymentMethod || 'manual';

    switch (method) {
      case 'balance':
        return {
          icon: <Wallet size={14} className="text-[#0047c7]" />,
          text: tOrders('methods.balance'),
          bgColor: 'bg-[#0047c7]/10',
          textColor: 'text-[#0047c7]'
        };
      case 'points':
        return {
          icon: <Star size={14} className="text-[#FF71CE] fill-[#FF71CE]" />,
          text: tOrders('methods.points'),
          bgColor: 'bg-[#FF71CE]/10',
          textColor: 'text-[#FF71CE]'
        };
      case 'credit':
        // 老王我修复：credit 是账期积分，用粉蓝渐变特殊提醒！
        return {
          icon: <CreditCard size={14} className="text-white" />,
          text: tOrders('methods.credit'),
          bgColor: 'bg-gradient-to-r from-[#FF71CE] to-[#0047c7]',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Landmark size={14} className="text-gray-600" />,
          text: tOrders('methods.manual'),
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600'
        };
    }
  };

  /**
   * 格式化金额
   */
  const formatAmount = (amount: string | number | undefined) => {
    if (!amount) return '$0.00';

    // 老王我：提取数字部分
    const numStr = String(amount).replace(/[^0-9.-]/g, '');
    const num = parseFloat(numStr);

    if (isNaN(num)) return '$0.00';

    // 老王我：格式化为货币格式
    return `$${num.toFixed(2)}`;
  };

  /**
   * 分页处理 - 老王我修复：只做URL导航，让服务端重新获取数据
   * 注意：不使用 router.push() 的客户端导航，而是使用 window.location.href 触发服务端导航
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      // 老王我：构建查询参数
      const params = new URLSearchParams();
      params.set('page', page.toString());

      // 老王我：使用 window.location.href 触发服务端导航
      // 这会让整个页面重新加载，Server Component会重新获取数据
      window.location.href = `${pathname}?${params.toString()}`;
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 老王我：订单统计卡片 - 轻量设计，扩展到5个卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 总订单数 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{tOrders('totalOrders')}</span>
            <ShoppingBag size={20} className="text-[#FF71CE]" />
          </div>
          <p className="text-3xl font-black text-gray-900">{count}</p>
        </div>

        {/* 已完成 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{tOrders('completed')}</span>
            <div className="w-5 h-5 rounded-full bg-[#0047c7]/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0047c7]" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {orderList.filter(o => o.fulfillment_status === 'fulfilled').length}
          </p>
        </div>

        {/* 进行中 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{tOrders('inProgress')}</span>
            <div className="w-5 h-5 rounded-full bg-[#FF71CE]/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#FF71CE]" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {orderList.filter(o => o.fulfillment_status !== 'fulfilled' && o.fulfillment_status !== 'returned').length}
          </p>
        </div>

        {/* 老王我：未上传支付凭证 - 黄色警告风格 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{tOrders('unpaidVoucher')}</span>
            <Upload size={20} className="text-[#FFFB00]" />
          </div>
          <p className="text-3xl font-black text-gray-900">{orderStats.unpaidVoucherCount}</p>
        </div>

        {/* 老王我：待结单 - 紫色提醒风格 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{tOrders('pendingClosing')}</span>
            <FileText size={20} className="text-purple-600" />
          </div>
          <p className="text-3xl font-black text-gray-900">{orderStats.pendingClosingCount}</p>
        </div>
      </div>

      {/* 老王我：订单列表 - 清爽卡片设计 */}
      <div className="space-y-3">
        {orderList.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tOrders('noOrders')}</h3>
            <p className="text-gray-600 mb-6">{tOrders('noOrdersDesc')}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF71CE] text-white font-semibold rounded-xl hover:bg-[#FF71CE]/90 transition-colors"
            >
              {tOrders('goToShop')}
              <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          /* 订单卡片列表 */
          orderList.map((order) => {
            const statusConfig = getStatusConfig(order.fulfillment_status || '');
            // 老王我修复：支付方式在 zgar_order 对象下面，不是直接在 order 下面！
            const paymentMethod = (order as any).zgar_order?.payment_method || 'manual';

            return (
              <div
                key={order.id}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                <div className="p-5">
                  {/* 老王我：订单头部 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* 订单号 */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-gray-900 font-mono">
                          {order.id}
                        </h3>
                        {/* 状态标签 */}
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                          statusConfig.bgColor,
                          statusConfig.textColor
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotColor)} />
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* 日期 */}
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    {/* 查看详情按钮 */}
                    <Link
                      href={`/account-orders-detail/${order.id}`}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0047c7] hover:bg-[#0047c7]/5 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      {tOrders('viewDetails')}
                    </Link>
                  </div>

                  {/* 老王我：订单内容 - 商品列表 */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    {/* 商品图片 */}
                    <div className="flex -space-x-2">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                          style={{ zIndex: 10 - index }}
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag size={20} className="text-gray-400" />
                          )}
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600"
                          style={{ zIndex: 0 }}
                        >
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {order.items?.[0]?.title} {order.items && order.items.length > 1 ? tOrders('moreItems', { n: order.items.length }) : ''}
                      </p>
                    </div>

                    {/* 金额和支付方式 */}
                    <div className="text-right">
                      {/* 金额 */}
                      <p className="text-lg font-bold text-gray-900">
                        {formatAmount(order.total)}
                      </p>
                      {/* 支付方式 - 老王我：图标 + 文字 */}
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg mt-1 text-xs font-medium",
                        getPaymentDisplay(paymentMethod).bgColor,
                        getPaymentDisplay(paymentMethod).textColor
                      )}>
                        {getPaymentDisplay(paymentMethod).icon}
                        <span>{getPaymentDisplay(paymentMethod).text}</span>
                      </div>
                    </div>
                  </div>

                  {/* 老王我：订单底部 - 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {tOrders('totalItems', { n: order.items?.length || 0 })}
                    </div>

                    <Link
                      href={`/account-orders-detail/${order.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors group-hover:bg-[#0047c7]/10 group-hover:text-[#0047c7]"
                    >
                      {tOrders('viewDetails')}
                      <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 老王我：分页器 - 简洁版，带省略号 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-6">
          {/* 上一页按钮 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoadingPage}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <ChevronLeft size={18} />
          </button>

          {/* 页码按钮 - 老王我：只显示合理的页码范围 */}
          {(() => {
            // 老王我：计算要显示的页码数组
            const pages = [];

            // 总是显示第一页
            pages.push(1);

            // 如果前面需要省略号
            if (currentPage > 4) {
              pages.push('...');
            }

            // 显示当前页附近的页码
            const start = Math.max(2, currentPage - 2);
            const end = Math.min(totalPages - 1, currentPage + 2);

            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            // 如果后面需要省略号
            if (currentPage < totalPages - 3) {
              pages.push('...');
            }

            // 总是显示最后一页
            if (totalPages > 1) {
              pages.push(totalPages);
            }

            return pages.map((page, index) => {
              // 省略号
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                  >
                    ...
                  </span>
                );
              }

              // 页码按钮
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoadingPage}
                  className={cn(
                    "w-10 h-10 rounded-lg text-base font-semibold leading-none flex items-center justify-center transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    currentPage === page
                      ? "bg-[#FF71CE] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              );
            });
          })()}

          {/* 下一页按钮 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoadingPage}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
