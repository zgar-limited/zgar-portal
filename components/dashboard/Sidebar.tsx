"use client";

import React from "react";
import { Link } from '@/i18n/routing';
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  User,
  LogOut,
  CreditCard,
  Star
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface SidebarProps {
  customer?: CustomerWithZgarFields | null;
  orders?: HttpTypes.StoreOrder[];  // 老王我添加：显示真实订单数量
}

export default function Sidebar({ customer, orders }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/account-page",
      label: "账户概览",
      icon: LayoutDashboard,
    },
    {
      href: "/account-orders",
      label: "我的订单",
      icon: Package,
    },
    {
      href: "/account-addresses",
      label: "地址管理",
      icon: MapPin,
    },
    {
      href: "/account-setting",
      label: "账户设置",
      icon: Settings,
    },
  ];

  return (
    <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] p-4 bg-white dark:bg-[#191818]">
      {/* 用户信息 */}
      <div className="text-center mb-6 pb-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
        <div className="w-20 h-20 mx-auto mb-4 bg-black dark:bg-white rounded-full flex items-center justify-center">
          <User size={32} className="text-white dark:text-black" />
        </div>
        <h3 className="font-semibold text-black dark:text-white text-sm mb-1">
          {customer?.first_name && customer?.last_name
            ? `${customer.first_name} ${customer.last_name}`
            : '用户'
          }
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{customer?.email || 'user@example.com'}</p>
        <div className="mt-2 inline-flex items-center gap-1 bg-black/5 dark:bg-white/10 text-black dark:text-white px-2 py-1 rounded-full text-xs font-medium">
          金牌会员
        </div>
      </div>

      {/* 快捷数据 - 老王我改成使用真实数据 */}
      <div className="grid grid-cols-3 gap-2 mb-6 pb-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">余额</p>
          <p className="text-sm font-semibold text-black dark:text-white">
            ${customer?.zgar_customer?.balance?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">积分</p>
          <p className="text-sm font-semibold text-black dark:text-white">
            {customer?.zgar_customer?.points || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">订单</p>
          <p className="text-sm font-semibold text-black dark:text-white">
            {orders?.length || 0}
          </p>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="space-y-1 mb-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-black dark:bg-white text-white dark:text-black border border-[#ededed] dark:border-[#ffffff1a]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
                }
              `}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 积分快捷入口 */}
      <Link
        href="/account-points"
        className="w-full flex items-center justify-center gap-2 mb-6 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
      >
        <Star size={16} />
        积分任务
      </Link>

      {/* 退出登录 */}
      <div className="pt-4 border-t border-[#ededed] dark:border-[#ffffff1a]">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors">
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </div>
  );
}