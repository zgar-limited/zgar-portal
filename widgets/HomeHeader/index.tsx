"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import LanguageSelect from "@/components/common/LanguageSelect";
import CartIcon from "@/components/header/CartIcon";
import UserIcon from "@/components/header/UserIcon";
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
      className={`${parentClass} ${
        lastScrollY > 200 && isScrollingUp ? "header-sticky" : ""
      } ${lastScrollY > 100 ? "will-sticky" : ""}`}
    >
      <div className="px-[6%]">
        <div className="row align-items-center ">
          <div className="col-md-4 col-3 d-xl-none">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              className="btn-mobile-menu"
            >
              <span />
            </a>
          </div>
          <div className="col-xl-3 col-md-4 col-6 d-flex justify-content-center justify-content-xl-start">
            <Link href={`/`} className="py-2 logo-site">
              <Image
                alt="Logo"
                src="/images/logo/logo-zgar.png"
                width={133}
                height={53}
              />
            </Link>
          </div>
          <div className="col-xl-6 d-none d-xl-block">
            <nav className="box-navigation">
              <ul className="box-nav-menu">
                <Nav />
              </ul>
            </nav>
          </div>
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon-list">
              <li className="d-flex">
                <UserIcon customer={customer} />
              </li>
              {/* <li className="d-none d-md-flex">
                <a
                  className="nav-icon-item link"
                  href="#search"
                  data-bs-toggle="modal"
                >
                  <i className="icon icon-magnifying-glass" />
                </a>
              </li> */}
              {/* <li className="d-none d-sm-flex">
                <Link className="nav-icon-item link" href={`/wishlist`}>
                  <i className="icon icon-translate" />
                </Link>
              </li> */}
              <LanguageSelect />
              <li className="d-none d-lg-flex align-items-center ms">
                <CartIcon cart={cart} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
