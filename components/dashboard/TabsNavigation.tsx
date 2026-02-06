"use client";

import React from "react";
import { Link } from '@/i18n/routing';
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
} from "lucide-react";

/**
 * 老王我：简洁粉蓝导航 - 移动端友好
 *
 * 设计理念：
 * - 桌面端：水平导航，粉蓝配色
 * - 移动端：垂直堆叠，紧凑布局
 * - 激活状态：品牌色渐变背景
 */
export default function TabsNavigation() {
  const pathname = usePathname();

  const tabs = [
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
    <div className="mb-8">
      {/* 桌面端：水平导航 */}
      <div className="hidden md:flex gap-3">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.endsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex items-center gap-3 px-6 py-4 transition-all
                ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}
              `}
              style={{
                borderRadius: '8px',
                flex: 1,
                ...(isActive ? {
                  background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
                  boxShadow: '0 4px 12px rgba(244, 150, 211, 0.3)'
                } : {
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb'
                })
              }}
            >
              {/* 图标 */}
              <Icon
                size={20}
                className={isActive ? 'text-white' : 'text-gray-600'}
              />

              {/* 文字 */}
              <span className="text-base font-black" style={{ fontFamily: 'sans-serif' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 移动端：垂直网格导航 */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.endsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex flex-col items-center gap-2 px-4 py-5 transition-all
                ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}
              `}
              style={{
                borderRadius: '8px',
                ...(isActive ? {
                  background: 'linear-gradient(135deg, #f496d3 0%, #0047c7 100%)',
                  boxShadow: '0 4px 12px rgba(244, 150, 211, 0.3)'
                } : {
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb'
                })
              }}
            >
              {/* 图标 */}
              <Icon
                size={24}
                className={isActive ? 'text-white' : 'text-gray-600'}
              />

              {/* 文字 */}
              <span className="text-sm font-black" style={{ fontFamily: 'sans-serif' }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
