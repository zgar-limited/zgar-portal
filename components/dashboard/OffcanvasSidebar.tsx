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
  Wallet,
  Star,
  ChevronRight,
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/useMobileSidebar";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface OffcanvasSidebarProps {
  customer?: CustomerWithZgarFields | null;
  orders?: HttpTypes.StoreOrder[];
}

/**
 * 移动端抽屉侧边栏 - Vibrant Blocks 粉色立体风格
 *
 * 老王我：跟桌面Sidebar保持一致的粉色立体风格
 */
export default function OffcanvasSidebar({ customer, orders }: OffcanvasSidebarProps) {
  const { open, setOpen } = useMobileSidebar();
  const pathname = usePathname();

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[320px] bg-gray-50 p-6 overflow-y-auto">
        {/* 老王我：用户信息区 - Vibrant Blocks 粉色立体风格 */}
        <div className="relative overflow-hidden p-5 rounded-xl border-4 border-black shadow-[8px_8px_0_0_#000000] bg-[#FF71CE] mb-4">
          {/* 装饰性几何元素 */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-black opacity-20 rounded-full"></div>
          <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-white opacity-30" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-30deg)" }}></div>

          {/* 用户信息 */}
          <div className="relative z-10">
            {/* 头像 */}
            <div className="flex items-center justify-center mb-4 mx-auto w-16 h-16 bg-black rounded-lg shadow-[4px_4px_0_0_#FFFFFF]">
              <User size={32} className="text-white" />
            </div>

            {/* 用户名和邮箱 */}
            <h3 className="text-xl font-black text-white mb-1 text-center" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
              {customer?.first_name && customer?.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : '用户'
              }
            </h3>
            <p className="text-sm font-semibold text-white/90 text-center truncate">{customer?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* 老王我：数据统计区 - 粉底黑边立体 */}
        <div className="relative overflow-hidden p-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-[#FF71CE] mb-4">
          <div className="relative z-10 grid grid-cols-3 gap-3">
            {/* 余额 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2 mx-auto w-10 h-10 bg-black rounded-lg shadow-[2px_2px_0_0_#FFFFFF]">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
              </div>
              <p className="text-[10px] font-bold text-white/90 mb-1">余额</p>
              <p className="text-sm font-black text-white" style={{ fontFamily: 'sans-serif' }}>
                {formatAmount(customer?.zgar_customer?.balance)}
              </p>
            </div>

            {/* 积分 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2 mx-auto w-10 h-10 bg-white rounded-lg shadow-[2px_2px_0_0_#000000]">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF71CE]">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="text-[10px] font-bold text-white/90 mb-1">积分</p>
              <p className="text-sm font-black text-white" style={{ fontFamily: 'sans-serif' }}>
                {customer?.zgar_customer?.points || 0}
              </p>
            </div>

            {/* 订单 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-2 mx-auto w-10 h-10 bg-black rounded-lg shadow-[2px_2px_0_0_#FFFFFF]">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="m7.5 4.27 9 5.15"></path>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <path d="m3.3 7 8.7 5 8.7-5"></path>
                  <path d="M12 22V12"></path>
                </svg>
              </div>
              <p className="text-[10px] font-bold text-white/90 mb-1">订单</p>
              <p className="text-sm font-black text-white" style={{ fontFamily: 'sans-serif' }}>
                {orders?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* 老王我：导航菜单 - 粉底黑边立体 */}
        <nav className="space-y-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.endsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 transition-all group overflow-hidden
                  ${isActive ? 'text-white' : 'text-gray-700 hover:text-gray-900'}
                `}
                style={{
                  borderRadius: '8px',
                  ...(isActive ? {
                    border: '3px solid #000000',
                    backgroundColor: '#FF71CE',
                    boxShadow: '4px_4px_0_0_#000000'
                  } : {
                    border: '3px solid #000000',
                    backgroundColor: 'white',
                    boxShadow: '4px_4px_0_0_#000000'
                  })
                }}
              >
                {/* 图标盒子 */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.95)' : '#f0f0f0',
                    ...(isActive ? {
                      boxShadow: '2px_2px_0_0_#000000'
                    } : {
                      boxShadow: '2px_2px_0_0_#000000'
                    })
                  }}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-[#FF71CE]' : 'text-gray-600 group-hover:text-gray-900'}
                  />
                </div>

                {/* 文字 */}
                <span className="flex-1 text-sm font-black" style={{ fontFamily: 'sans-serif' }}>
                  {label}
                </span>

                {/* 右箭头 - 选中时显示 */}
                {isActive && (
                  <ChevronRight size={18} className="text-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 老王我：退出登录 - 粉底黑边立体 */}
        <div className="pt-4">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 transition-all group rounded-xl"
            style={{
              border: '3px solid #000000',
              backgroundColor: '#FF71CE',
              boxShadow: '4px_4px_0_0_#000000'
            }}
            onClick={() => {
              // TODO: 实现退出登录逻辑
              setOpen(false);
            }}
          >
            <LogOut size={18} className="text-white" />
            <span className="text-sm font-black text-white" style={{ fontFamily: 'sans-serif' }}>
              退出登录
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
