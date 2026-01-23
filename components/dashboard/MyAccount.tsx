"use client";

import { useState } from "react";
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from "next-intl";
import {
  Package,
  Star,
  ShoppingBag,
  Eye,
  ChevronRight,
  Wallet,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import Tasks from "./Tasks";
import type { Task } from "@/data/tasks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface MyAccountProps {
  customer?: CustomerWithZgarFields | null;
  orders?: HttpTypes.StoreOrder[];
  tasks?: Task[];
}

export default function MyAccount({ customer, orders = [], tasks = [] }: MyAccountProps) {
  const tOrders = useTranslations('Orders');
  const tPayment = useTranslations('PaymentMethods');
  const locale = useLocale();

  // 老王我添加：积分更新状态
  const [currentPoints, setCurrentPoints] = useState(
    customer?.zgar_customer?.points || 0
  );

  // 老王我改成从 zgar_customer 读取真实数据
  const stats = {
    totalOrders: orders.length || 0,
    balance: customer?.zgar_customer?.balance || 0,
    points: currentPoints,
  };

  // 老王我添加：格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 老王我添加：处理积分更新
  const handlePointsUpdate = (pointsEarned: number) => {
    setCurrentPoints((prev) => prev + pointsEarned);
  };

  // 老王我添加：支付方式图标映射
  const getPaymentIcon = (paymentMethod: string) => {
    const method = paymentMethod || 'manual';
    switch (method) {
      case 'balance':
        return <Wallet size={14} className="text-white" />;
      case 'points':
        return <Star size={14} className="text-white fill-white" />;
      case 'credit':
        return <Eye size={14} className="text-white" />;
      case 'manual':
        return <Wallet size={14} className="text-white" />;
      default:
        return <Wallet size={14} className="text-white" />;
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* 老王我：Vibrant Blocks 主题区 - 热粉色大胆色块（移动端响应式） */}
      <div className="relative overflow-hidden p-4 md:p-6 lg:p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0_0_#000000] bg-[#FF71CE]">
        {/* 装饰性几何元素 - 右上角大圆 */}
        <div className="absolute -top-8 -right-8 w-20 h-20 md:-top-12 md:-right-12 md:w-32 md:h-32 lg:-top-16 lg:-right-16 lg:w-48 lg:h-48 bg-black opacity-30 rounded-full"></div>
        {/* 左下角三角形 - 用CSS clip-path */}
        <div className="absolute -bottom-6 -left-6 w-14 h-14 md:-bottom-8 md:-left-8 md:w-24 md:h-24 lg:-bottom-12 lg:-left-12 lg:w-32 lg:h-32 bg-white opacity-20" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-30deg)" }}></div>

        {/* 用户信息 - 移动端垂直堆叠，桌面端水平布局 */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6 lg:gap-8 mb-4 md:mb-8 lg:mb-10">
          {/* 头像 - 响应式尺寸 */}
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black rounded-xl shadow-[6px_6px_0_0_#FFFFFF]">
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white md:w-10 md:h-10 lg:w-12 lg:h-12">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          {/* 用户信息 - 移动端居中对齐 */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-white mb-1 md:mb-2" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
              {customer?.first_name && customer?.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : '用户'
              }
            </h2>
            <p className="text-xs md:text-base lg:text-lg font-semibold text-white/90 truncate">{customer?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* 数据统计 - 余额、积分、订单（移动端紧凑布局） */}
        <div className="relative z-10 grid grid-cols-3 gap-2 md:gap-6 lg:gap-8">
          {/* 余额 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-3 lg:mb-4 mx-auto w-10 h-10 md:w-14 md:h-14 lg:w-[72px] lg:h-[72px] bg-black rounded-lg shadow-[3px_3px_0_0_#FFFFFF]">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white md:w-7 md:h-7 lg:w-9 lg:h-9">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <p className="text-[10px] md:text-sm lg:text-base font-bold text-white/90 mb-1 md:mb-3">余额</p>
            <p className="text-lg md:text-2xl lg:text-4xl font-black text-white leading-none" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
              ${customer?.zgar_customer?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>

          {/* 积分 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-3 lg:mb-4 mx-auto w-10 h-10 md:w-14 md:h-14 lg:w-[72px] lg:h-[72px] bg-white rounded-lg shadow-[3px_3px_0_0_#000000]">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF71CE] md:w-7 md:h-7 lg:w-9 lg:h-9">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <p className="text-[10px] md:text-sm lg:text-base font-bold text-white/90 mb-1 md:mb-3">积分</p>
            <p className="text-lg md:text-2xl lg:text-4xl font-black text-white leading-none" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
              {customer?.zgar_customer?.points || 0}
            </p>
          </div>

          {/* 订单 */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1 md:mb-3 lg:mb-4 mx-auto w-10 h-10 md:w-14 md:h-14 lg:w-[72px] lg:h-[72px] bg-black rounded-lg shadow-[3px_3px_0_0_#FFFFFF]">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white md:w-7 md:h-7 lg:w-9 lg:h-9">
                <path d="m7.5 4.27 9 5.15"></path>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <path d="m3.3 7 8.7 5 8.7-5"></path>
                <path d="M12 22V12"></path>
              </svg>
            </div>
            <p className="text-[10px] md:text-sm lg:text-base font-bold text-white/90 mb-1 md:mb-3">订单</p>
            <p className="text-lg md:text-2xl lg:text-4xl font-black text-white leading-none" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
              {orders.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* 老王我：余额积分展示区 - 分屏设计【移动端垂直堆叠】 */}
      <div className="relative overflow-hidden flex flex-col md:flex-row rounded-2xl">
        {/* 左50% - 蓝色余额块 */}
        <div className="w-full md:w-1/2 h-auto md:h-40 relative flex items-center justify-between px-6 py-6 md:px-8 md:py-0 bg-[#0047c7]">
          {/* 几何装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-sm"></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300 md:w-7 md:h-7">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
              <span className="text-white/90 text-sm md:text-base font-semibold">账户余额</span>
            </div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-2" style={{ fontFamily: 'sans-serif' }}>
              ${stats.balance.toFixed(2)}
            </div>
            <Link href="/account-balance" className="inline-flex items-center gap-2 text-white/80 text-xs md:text-sm font-semibold hover:text-white transition-colors">
              余额明细
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* 右侧装饰 */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded rotate-3">
            <TrendingUp size={24} className="text-white md:size-8" />
          </div>
        </div>

        {/* 右50% - 粉色积分块 */}
        <div className="w-full md:w-1/2 h-auto md:h-40 relative flex items-center justify-between px-6 py-6 md:px-8 md:py-0 bg-[#f496d3]">
          {/* 几何装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-45deg)" }}></div>
          </div>

          {/* 内容 */}
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300 md:w-7 md:h-7">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="text-white/90 text-sm md:text-base font-semibold">可用积分</span>
            </div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-2" style={{ fontFamily: 'sans-serif' }}>
              {stats.points.toLocaleString()}
            </div>
            <Link href="/club" className="inline-flex items-center gap-2 text-white/80 text-xs md:text-sm font-semibold hover:text-white transition-colors">
              积分商城
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* 右侧装饰 */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 rounded -rotate-3">
            <Sparkles size={24} className="text-white md:size-8" />
          </div>
        </div>
      </div>

      {/* 老王我：任务系统 */}
      <Tasks initialTasks={tasks} onPointsUpdate={handlePointsUpdate} />

      {/* 老王我：最近订单 - Memphis 风格蓝色渐变 */}
      <div className="relative overflow-hidden rounded-lg border-3 border-[#0047c7]" style={{ borderWidth: '3px' }}>
        {/* 标题区（Memphis 风格） */}
        <div className="px-4 py-3 relative overflow-hidden bg-[#0047c7]" style={{ background: 'repeating-linear-gradient(-45deg, #0047c7, #0047c7 10px, #1a5fd3 10px, #1a5fd3 20px)' }}>
          {/* Memphis 几何装饰 */}
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-1 right-10 w-6 h-6 bg-white/15 rounded-full"></div>

          {/* 波浪线装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 opacity-30" style={{ background: 'radial-gradient(circle at 10px 5px, white 2px, transparent 2.5px)', backgroundSize: '20px 10px' }}></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* 图标背景 - 白色方块 */}
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]">
                <Package size={18} className="text-[#0047c7]" />
              </div>

              {/* 标题 */}
              <h2 className="text-sm font-black text-white" style={{ fontFamily: 'sans-serif', textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
                最近订单
              </h2>
            </div>

            {/* 查看全部按钮 */}
            <Link
              href="/account-orders"
              className="px-3 py-2 bg-white text-gray-900 text-sm font-bold rounded hover:bg-white/90 transition-colors flex items-center gap-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]"
            >
              查看全部
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="p-12 md:p-16 text-center bg-white">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gray-100 rounded-lg">
              <Package size={32} className="text-gray-400 md:size-10" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 md:mb-3" style={{ fontFamily: 'sans-serif' }}>
              还没有订单
            </h3>
            <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">快去选购心仪的商品吧</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 text-white font-black text-sm md:text-base hover:shadow-xl transition-all duration-300 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)' }}
            >
              <ShoppingBag size={18} />
              开始购物
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 bg-white">
            {orders.slice(0, 5).map((order, index) => {
              const isPointsOrder = (order as any).zgar_order?.payment_method === 'points';
              return (
                <div
                  key={order.id}
                  className="group p-4 md:p-6 hover:from-brand-pink/5 hover:to-brand-blue/5 transition-all duration-300 relative"
                >
                  {/* 老王我：左侧装饰条 */}
                  <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: index % 2 === 0 ? '#f496d3' : '#0047c7' }}></div>

                  <div className="flex items-start gap-3 md:gap-4 pl-4">
                    {/* 订单类型图标 */}
                    <div className="flex-shrink-0">
                      {isPointsOrder ? (
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#f496d3] rounded-lg">
                          <Star size={20} className="text-white fill-white md:size-6" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#0047c7] rounded-lg">
                          <Wallet size={20} className="text-white md:size-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 订单号 + 日期 + 状态 */}
                      <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <span className="text-base md:text-lg font-black text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                          #{order.display_id}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar size={14} />
                          <span className="text-xs md:text-sm">{formatDate(order.created_at)}</span>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs font-bold px-2 md:px-3 py-1 border-0",
                            order.status === "completed" && "bg-green-500 text-white",
                            order.status === "pending" && "bg-orange-500 text-white",
                            order.status === "canceled" && "bg-red-500 text-white"
                          )}
                          style={{ borderRadius: '2px' }}
                        >
                          {order.status === "completed" ? tOrders('completed') :
                           order.status === "pending" ? tOrders('pending') : tOrders('canceled')}
                        </Badge>
                      </div>

                      {/* 商品名称 */}
                      {order.items && order.items.length > 0 && (
                        <div className="mb-2">
                          {order.items.length === 1 ? (
                            <span className="text-xs md:text-sm font-medium text-gray-900">
                              {order.items[0].variant_title || order.items[0].title}
                            </span>
                          ) : (
                            <span className="text-xs md:text-sm font-medium text-gray-900">
                              {order.items.slice(0, 2).map(item => item.variant_title || item.title).join(", ")}
                              {order.items.length > 2 && ` 等${order.items.length}件商品`}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 商品规格 + 数量 */}
                      {order.items[0]?.variant?.options && (order.items[0].variant.options as any[]).length > 0 && (
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {(order.items[0].variant.options as any[]).slice(0, 2).map((option: any, idx: number) => {
                            const localeUnderscore = locale.replace('-', '_').toLowerCase();
                            const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                            const productMetadata = (order.items[0] as any).product?.metadata || {};
                            const localizedValue = productMetadata[optionValueKey] || option.value;

                            return (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded"
                              >
                                {localizedValue}
                              </span>
                            );
                          })}
                          <span className="text-xs md:text-sm text-gray-500">
                            共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件
                          </span>
                        </div>
                      )}

                      {/* 支付方式 + 金额 */}
                      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-gray-100 rounded">
                          <div className="w-5 h-5 flex items-center justify-center bg-[#0047c7] rounded">
                            {getPaymentIcon((order as any).zgar_order?.payment_method)}
                          </div>
                          <span className="text-xs text-gray-700 font-semibold">
                            {tPayment('zgar_' + ((order as any).zgar_order?.payment_method || 'manual'))}
                          </span>
                        </div>

                        {!isPointsOrder ? (
                          <span className="text-sm md:text-base font-black text-gray-900">
                            {order.currency_code?.toUpperCase() === 'USD' ? '$' : order.currency_code?.toUpperCase() + ' '}
                            {order.total?.toFixed(2) || "0.00"}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-gray-600 fill-gray-600" />
                            <span className="text-sm md:text-base font-black text-gray-900">
                              {(order as any).zgar_order?.points_used || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 查看详情按钮 */}
                    <Link
                      href={`/account-orders-detail/${order.id}`}
                      className="flex-shrink-0 p-2 md:p-3 transition-all hover:scale-110 bg-gray-100 rounded-lg"
                    >
                      <Eye size={18} className="text-gray-600" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
