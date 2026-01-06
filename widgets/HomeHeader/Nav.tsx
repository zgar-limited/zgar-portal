import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Box, Zap, Layers, Info, Newspaper, Handshake, UserPlus, ChevronDown, Home, Heart, Shield, Star } from "lucide-react";
import { useState, useRef } from "react";

export default function Nav() {
  const t = useTranslations("Navigation");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 老王我添加延迟关闭，防止鼠标稍微移动就关闭菜单
  const handleMouseEnter = (menuKey: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenMenu(menuKey);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 350); // 350ms延迟，给用户足够时间移动鼠标到下拉菜单
  };

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
          className="item-link relative text-sm font-semibold text-gray-700 hover:text-brand-pink transition-all duration-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 group"
        >
          <Home size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />
          <span>{t("home")}</span>
        </Link>
      </li>

      {/* Menu Items with Dropdowns */}
      {menuItems.map((menu) => (
        <li
          key={menu.key}
          className="menu-item relative"
        >
          {/* 包装整个菜单区域 - 包括菜单项和下拉菜单 */}
          <div
            onMouseEnter={() => handleMouseEnter(menu.key)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={menu.href}
              className="item-link relative text-sm font-semibold text-gray-700 hover:text-brand-pink transition-all duration-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 group"
            >
              {menu.key === 'products' && <Box size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />}
              {menu.key === 'about' && <Info size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />}
              {menu.key === 'contact' && <Handshake size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />}
              <span>{menu.label}</span>
              {menu.hasDropdown && <ChevronDown className="h-4 w-4 ml-0.5 text-gray-400 group-hover:text-brand-pink transition-transform group-hover:rotate-180" />}
            </Link>

            {/* Dropdown Menu - 简约白色 */}
            {menu.hasDropdown && openMenu === menu.key && (
              <div className="sub-menu absolute left-0 top-full mt-2 min-w-[240px] rounded-xl bg-white shadow-lg p-2 z-50 border border-gray-200">
                <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                <ul className="sub-menu_list flex flex-col gap-1">
                  {menu.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="sub-menu_link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover/item:bg-brand-pink flex items-center justify-center transition-colors">
                            <Icon size={16} className="text-gray-600 group-hover/item:text-white transition-colors" />
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </li>
      ))}

      {/* Care */}
      <li className="menu-item">
        <Link
          href="/care"
          className="item-link relative text-sm font-semibold text-gray-700 hover:text-brand-pink transition-all duration-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 group"
        >
          <Heart size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />
          <span>{t("care")}</span>
        </Link>
      </li>

      {/* Authentication */}
      <li className="menu-item">
        <Link
          href="/verify-guide"
          className="item-link relative text-sm font-semibold text-gray-700 hover:text-brand-pink transition-all duration-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 group"
        >
          <Shield size={18} className="text-gray-500 group-hover:text-brand-pink transition-colors" />
          <span>{t("authentication")}</span>
        </Link>
      </li>

      {/* Club Button - 简约风格 */}
      <li>
        <div>
          <Link
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-brand-pink to-brand-blue text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all duration-200 whitespace-nowrap"
            href="/club"
          >
            <Star size={16} className="mr-1.5 fill-current" />
            {t("club")}
          </Link>
        </div>
      </li>
    </>
  );
}
