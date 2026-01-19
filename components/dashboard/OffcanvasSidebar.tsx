"use client";

import React from "react";
import { Link } from '@/i18n/routing';
import { HttpTypes } from "@medusajs/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
}

export default function OffcanvasSidebar({ customer }: OffcanvasSidebarProps) {
  const { open, setOpen } = useMobileSidebar();

  const navItems = [
    {
      href: "/account-page",
      label: "Dashboard",
      iconClass: "icon-circle-four",
    },
    {
      href: "/account-orders",
      label: "Orders",
      iconClass: "icon-box-arrow-down",
    },
    {
      href: "/account-addresses",
      label: "My address",
      iconClass: "icon-address-book",
    },
    {
      href: "/account-setting",
      label: "Setting",
      iconClass: "icon-setting",
    },
    {
      href: "/",
      label: "Log out",
      iconClass: "icon-sign-out",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[280px] p-0 bg-white dark:bg-[#191818]">
        {/* 老王我：Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#ededed] dark:border-[#ffffff1a]">
          <SheetTitle className="text-lg font-bold text-black dark:text-white">
            My Account
          </SheetTitle>
        </SheetHeader>

        {/* 老王我：用户信息 */}
        <div className="px-6 py-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <i className="icon icon-user text-white dark:text-black text-2xl" />
            </div>
            <div>
              <h4 className="font-semibold text-black dark:text-white text-sm mb-1">
                {customer?.first_name && customer?.last_name
                  ? `${customer.first_name} ${customer.last_name}`
                  : customer?.first_name || "User"}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {customer?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* 老王我：导航菜单 */}
        <nav className="px-6 py-4">
          <ul className="space-y-2">
            {navItems.map(({ href, label, iconClass }) => {
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)} // 老王我：点击后关闭菜单
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <i className={`icon ${iconClass}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
