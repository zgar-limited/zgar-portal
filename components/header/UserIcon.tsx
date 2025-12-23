"use client";
import React, { useState } from "react";
import { Link } from '@/i18n/routing';
import { User, LogOut } from "lucide-react";
import { StoreCustomer } from "@medusajs/types";
import { signout } from "@/data/customer";
import { useTranslations } from "next-intl";

export default function UserIcon({ customer }: { customer: StoreCustomer }) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("UserIcon");

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={customer ? "/account-page" : "/login"}
        className="p-0 link text-gray-900 hover:text-gray-600 transition-colors"
      >
        <User className="h-6 w-6" />
      </Link>

      {/* Dropdown Menu */}
      {isHovered && (
        <div className="absolute right-0 top-8 w-40 py-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50">
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
                onClick={signout}
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
