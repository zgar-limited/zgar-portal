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
  Sparkles,
  Calendar,
  Cake,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import { cn } from "@/lib/utils";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface AccountSummaryProps {
  customer?: CustomerWithZgarFields | null;
  orders?: HttpTypes.StoreOrder[];
}

/**
 * 账户概览组件 - Vibrant Blocks 粉色立体风格
 *
 * 老王我：从 MyAccount 提取出来的用户信息展示组件
 * 用于 Layout 层级，在所有 Dashboard 子页面显示
 */
export default function AccountSummary({ customer, orders = [] }: AccountSummaryProps) {
  const tOrders = useTranslations('Orders');
  const tPayment = useTranslations('PaymentMethods');
  const locale = useLocale();

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 老王我添加：积分更新状态
  const [currentPoints, setCurrentPoints] = useState(
    customer?.zgar_customer?.points || 0
  );

  // 老王我改成从 zgar_customer 读取真实数据
  const stats = {
    totalOrders: orders.length || 0,
    balance: customer?.zgar_customer?.balance || 0,
    points: customer?.zgar_customer?.points || 0,
  };

  // 老王我：查找待处理的订单状态统计
  const pendingOrders = orders.filter(order =>
    !['fulfilled', 'cancelled', 'returned'].includes(order.fulfillment_status || '')
  ).length;

  const orderStatusBreakdown = orders.reduce((acc, order) => {
    const status = order.fulfillment_status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 老王我：主用户信息卡片 - Vibrant Blocks 粉色立体风格 */}
      <div className="relative overflow-hidden p-4 md:p-6 lg:p-10 rounded-2xl border-4 border-black shadow-[12px_12px_0_0_#000000] bg-[#FF71CE]">
        {/* 装饰性几何元素 - 老王我增加 Memphis 风格 */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-black opacity-10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white opacity-20"
             style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-45deg)" }}>
        </div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-black opacity-5" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>

        {/* 老王我：主要内容 */}
        <div className="relative z-10">
          {/* 用户信息 - 移动端垂直堆叠，桌面端水平布局 */}
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6 lg:gap-8 mb-4 md:mb-8 lg:mb-10">
            {/* 用户头像 - 老王我：黑色盒子立体效果 */}
            <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black rounded-xl shadow-[6px_6px_0_0_#FFFFFF]">
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white md:w-10 md:h-10 lg:w-12 lg:h-12"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* 用户名和欢迎语 - 老王我：超大字体 + 欢迎语 */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm md:text-base lg:text-lg font-bold text-white/90 mb-1 md:mb-2">
                欢迎回来 👋
              </p>
              <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-white" style={{
                fontFamily: 'sans-serif',
                letterSpacing: '-0.02em',
                textShadow: '2px_2px_0_#000000'
              }}>
                {customer?.first_name && customer?.last_name
                  ? `${customer.first_name} ${customer.last_name}`
                  : '用户'
                }
              </h2>
              <p className="text-xs md:text-sm lg:text-base font-semibold text-white/80 mt-1 md:mt-2 truncate">
                {customer?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* 数据统计 - 余额、积分、订单（移动端紧凑布局） */}
          <div className="relative z-10 grid grid-cols-3 gap-2 md:gap-6 lg:gap-8 mb-4 md:mb-6">
            {/* 余额 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-2 mx-auto w-10 h-10 md:w-14 md:h-14 bg-black rounded-lg shadow-[3px_3px_0_0_#FFFFFF]">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white md:w-8 md:h-8"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
              </div>
              <p className="text-[10px] md:text-xs lg:text-sm font-bold text-white/90 mb-0.5 md:mb-1">余额</p>
              <p className="text-sm md:text-xl lg:text-2xl font-black text-white" style={{
                fontFamily: 'sans-serif',
                textShadow: '1px_1px_0_#000000'
              }}>
                {formatAmount(stats.balance)}
              </p>
            </div>

            {/* 积分 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-2 mx-auto w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg shadow-[3px_3px_0_0_#000000]">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#FF71CE] md:w-8 md:h-8"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="text-[10px] md:text-xs lg:text-sm font-bold text-white/90 mb-0.5 md:mb-1">积分</p>
              <p className="text-sm md:text-xl lg:text-2xl font-black text-white" style={{
                fontFamily: 'sans-serif',
                textShadow: '1px_1px_0_#000000'
              }}>
                {currentPoints.toLocaleString()}
              </p>
            </div>

            {/* 订单 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1 md:mb-2 mx-auto w-10 h-10 md:w-14 md:h-14 bg-black rounded-lg shadow-[3px_3px_0_0_#FFFFFF]">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white md:w-8 md:h-8"
                >
                  <path d="m7.5 4.27 9 5.15"></path>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <path d="m3.3 7 8.7 5 8.7-5"></path>
                  <path d="M12 22V12"></path>
                </svg>
              </div>
              <p className="text-[10px] md:text-xs lg:text-sm font-bold text-white/90 mb-0.5 md:mb-1">订单</p>
              <p className="text-sm md:text-xl lg:text-2xl font-black text-white" style={{
                fontFamily: 'sans-serif',
                textShadow: '1px_1px_0_#000000'
              }}>
                {stats.totalOrders}
              </p>
            </div>
          </div>

          {/* 老王我：生日和加入时间 - 紧凑布局 */}
          <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4">
            {/* 生日 */}
            {customer?.metadata?.birthday && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/30">
                <Cake size={16} className="text-white flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-white/80 font-medium">生日</p>
                  <p className="text-sm md:text-base font-bold text-white truncate">
                    {new Date(customer.metadata.birthday).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* 加入时间 */}
            {customer?.created_at && (
              <div className={`flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/30 ${!customer?.metadata?.birthday ? 'col-span-2' : ''}`}>
                <Calendar size={16} className="text-white flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs text-white/80 font-medium">加入时间</p>
                  <p className="text-sm md:text-base font-bold text-white truncate">
                    {new Date(customer.created_at).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
