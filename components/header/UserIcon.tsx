"use client";
import React, { useState, useRef } from "react";
import { Link, useRouter } from '@/i18n/routing';
import { User, LogOut } from "lucide-react";
import { StoreCustomer } from "@medusajs/types";
import { signout } from "@/data/customer";
import { useTranslations } from "next-intl";

export default function UserIcon({ customer }: { customer: StoreCustomer }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const t = useTranslations("UserIcon");

  // 老王我添加延迟关闭，防止鼠标稍微移动就关闭菜单
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // 200ms延迟，给用户足够时间移动鼠标
  };

  // 老王我在客户端处理logout，使用i18n router跳转
  const handleLogout = async () => {
    await signout();
    router.push("/login");
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={customer ? "/account-page" : "/login"}
        className="p-2.5 -m-2.5 link text-gray-600 hover:text-brand-pink transition-colors rounded-xl hover:bg-gray-100 group/icon"
      >
        <User className="h-5 w-5 transition-transform group-hover/icon:scale-110" />
      </Link>

      {/* Dropdown Menu - 简约白色 */}
      {isOpen && (
        <div
          className="absolute right-0 top-10 w-48 py-2 bg-white rounded-xl shadow-lg z-50 border border-gray-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45" />

          {customer ? (
            <>
              <Link
                href="/account-page"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg mx-1 group/item"
              >
                <User size={18} className="text-gray-500 group-hover/item:text-brand-pink transition-colors" />
                <span className="font-medium">{t("myAccount")}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full text-left bg-transparent border-0 rounded-lg mx-1 group/item"
              >
                <LogOut size={18} className="text-gray-500 group-hover/item:text-brand-pink transition-colors" />
                <span className="font-medium">{t("logout")}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg mx-1 group/item"
              >
                <User size={18} className="text-gray-500 group-hover/item:text-brand-pink transition-colors" />
                <span className="font-medium">{t("login")}</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg mx-1 group/item"
              >
                <User size={18} className="text-gray-500 group-hover/item:text-brand-pink transition-colors" />
                <span className="font-medium">{t("register")}</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
