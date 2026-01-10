"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import LanguageSelect from "@/components/common/LanguageSelect";
import CartIcon from "@/components/header/CartIcon";
import UserIcon from "@/components/header/UserIcon";
import MobileMenu from "@/components/modals/MobileMenu";
import { StoreCart, StoreCustomer } from "@medusajs/types";

export default function HomeHeader({
  containerFull = true,
  parentClass = "tf-header header-fix header-abs-1",
  cart,
  customer,
}: {
  containerFull?: boolean;
  parentClass?: string;
  cart?: StoreCart;
  customer?: StoreCustomer;
}) {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrollingUp(currentScrollY < lastScrollY);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`${parentClass} transition-all duration-300 relative bg-white border-b border-gray-200 ${
        lastScrollY > 100 ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="relative px-[6%]">
        <div className="flex items-center gap-4 py-2">
          {/* Mobile Menu */}
          <div className="xl:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="logo-site inline-block hover:scale-105 transition-transform duration-300">
              <Image
                alt="Logo"
                src="/images/logo/logo-zgar.png"
                width={133}
                height={53}
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden xl:block flex-1 ml-8">
            <nav className="box-navigation">
              <ul className="box-nav-menu flex items-center gap-2">
                <Nav />
              </ul>
            </nav>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            <UserIcon customer={customer} />
            <LanguageSelect />
            <div className="hidden lg:flex">
              <CartIcon cart={cart} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
