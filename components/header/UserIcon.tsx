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
        className="p-0 link text-gray-900 hover:text-gray-600 transition-colors"
      >
        <User className="h-6 w-6" />
      </Link>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-8 w-40 py-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div className="absolute -top-2 right-3 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45" />

          {customer ? (
            <>
              <Link
                href="/account-page"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-gray-500" />
                <span>{t("myAccount")}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left bg-transparent border-0"
              >
                <LogOut size={16} className="text-gray-500" />
                <span>{t("logout")}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-gray-500" />
                <span>{t("login")}</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-gray-500" />
                <span>{t("register")}</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
