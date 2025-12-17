"use client";

import React, { useTransition } from "react";
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
  const pathname = usePathname();

  const handleSelect = (nextLocale) => {
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="p-0 btn btn-link text-decoration-none d-flex align-items-center nav-icon-item"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ color: textBlack ? "black" : textColor }}
      >
        <Globe size={24} strokeWidth={1.5} />
      </button>

      <ul
        className={`dropdown-menu ${
          placement === "bottom-end" ? "dropdown-menu-end" : ""
        }`}
        style={{ minWidth: "auto" }}
      >
        {['en-us', 'zh-hk'].map((cur) => (
          <li key={cur}>
            <button
              className={`dropdown-item ${locale === cur ? "active" : ""}`}
              type="button"
              onClick={() => handleSelect(cur)}
              disabled={isPending}
            >
              {t(cur)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
