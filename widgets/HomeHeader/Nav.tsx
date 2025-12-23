import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Box, Zap, Layers, Info, Newspaper, Handshake, UserPlus, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Nav() {
  const t = useTranslations("Navigation");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems = [
    {
      key: "products",
      href: "/shop",
      label: t("products"),
      hasDropdown: true,
      items: [
        {
          href: "/shop?category=close-pod",
          label: t("products_sub.close_pod"),
          icon: Box,
        },
        {
          href: "/shop?category=disposable",
          label: t("products_sub.disposable"),
          icon: Zap,
        },
        {
          href: "/shop?category=open-system",
          label: t("products_sub.open_system"),
          icon: Layers,
        },
      ],
    },
    {
      key: "about",
      href: "/about-us",
      label: t("about"),
      hasDropdown: true,
      items: [
        {
          href: "/about-us",
          label: t("about_sub.about_us"),
          icon: Info,
        },
        {
          href: "/partner",
          label: t("about_sub.partners"),
          icon: Handshake,
        },
      ],
    },
    {
      key: "contact",
      href: "/contact-us",
      label: t("contact"),
      hasDropdown: true,
      items: [
        {
          href: "/register",
          label: t("contact_sub.wholesaler"),
          icon: UserPlus,
        },
      ],
    },
  ];

  return (
    <>
      {/* Home */}
      <li className="menu-item">
        <Link
          href="/"
          className="item-link text-base font-bold hover:text-gray-600 transition-colors whitespace-nowrap"
        >
          {t("home")}
        </Link>
      </li>

      {/* Menu Items with Dropdowns */}
      {menuItems.map((menu) => (
        <li
          key={menu.key}
          className="menu-item relative"
          onMouseEnter={() => setOpenMenu(menu.key)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <Link
            href={menu.href}
            className="item-link text-base font-bold hover:text-gray-600 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            {menu.label}
            {menu.hasDropdown && <ChevronDown className="h-4 w-4" />}
          </Link>

          {/* Dropdown Menu */}
          {menu.hasDropdown && openMenu === menu.key && (
            <div className="sub-menu absolute left-0 top-full mt-2 min-w-[240px] rounded-xl bg-white p-2 shadow-xl border border-gray-100 z-50">
              <ul className="sub-menu_list flex flex-col gap-0.5">
                {menu.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="sub-menu_link flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        <Icon size={16} className="text-gray-900 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </li>
      ))}

      {/* Care */}
      <li className="menu-item">
        <Link
          href="/care"
          className="item-link text-base font-bold hover:text-gray-600 transition-colors whitespace-nowrap"
        >
          {t("care")}
        </Link>
      </li>

      {/* Authentication */}
      <li className="menu-item">
        <Link
          href="/verify-guide"
          className="item-link text-base font-bold hover:text-gray-600 transition-colors whitespace-nowrap"
        >
          {t("authentication")}
        </Link>
      </li>

      {/* Club Button */}
      <li>
        <div className="animated-border-box radius-style-2">
          <Link
            className="tp-btn-gradient sm p-relative inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg text-sm font-medium hover:from-gray-800 hover:to-gray-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            href="/register"
          >
            {t("club")}
          </Link>
        </div>
      </li>
    </>
  );
}
