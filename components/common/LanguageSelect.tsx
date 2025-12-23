"use client";

import React, { useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSelect({
  placement = "bottom-end",
  textBlack = false,
  textColor = "var(--black)",
}) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleSelect = (nextLocale) => {
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
      setIsOpen(false);
    });
  };

  const languages = [
    { code: 'en-us', label: t('en-us'), flag: '🇺🇸' },
    { code: 'zh-hk', label: t('zh-hk'), flag: '🇭🇰' },
  ];

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-0 text-gray-900 hover:text-gray-600 transition-colors bg-transparent border-0"
      >
        <Globe size={24} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <ul className={`absolute right-0 top-8 z-50 min-w-[110px] py-1 bg-white border border-gray-100 rounded-lg shadow-lg ${
            placement === "bottom-end" ? "right-0" : ""
          }`}>
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors ${
                    locale === lang.code
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  disabled={isPending}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="whitespace-nowrap">{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
