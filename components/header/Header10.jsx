import Link from "next/link";
import Image from "next/image";
import React from "react";
import Nav from "./Nav";
import CartLength from "./CartLength";
import CartTotal from "./CartTotal";
import WishlistLength from "./WishlistLength";
import HeaderCategorySelect from "./HeaderCategorySelect";
import CategoryDropdown from "./CategoryDropdown";

export default function Header10() {
  return (
    <header className="tf-header style-5 bg-white primary-2 mb-24">
      <div className="header-top">
        <div className="container-full-2">
          <div className="row align-items-center">
            <div className="col-md-4 col-3 d-xl-none">
              <a
                href="#mobileMenu"
                data-bs-toggle="offcanvas"
                className="btn-mobile-menu"
              >
                <span />
              </a>
            </div>
            <div className="col-xl-2 col-md-4 col-6 text-center text-xl-start">
              <Link
                href={`/`}
                className="logo-site justify-content-center justify-content-xl-start"
              >
                <Image
                  alt="LOGO"
                  src="/images/logo/logo-2.svg"
                  width={131}
                  height={28}
                />
              </Link>
            </div>
            <div className="col-xl-10 col-md-4 col-3">
              <div className="header-right">
                <HeaderCategorySelect parentClass="form_search-product style-search-2 style-search-3 d-none d-xl-flex" />
                <ul className="nav-icon-list text-nowrap">
                  <li className="d-none d-lg-flex">
                    <Link
                      className="nav-icon-item-2 text-black link"
                      href={`/login`}
                    >
                      <i className="icon icon-user" />
                      <div className="nav-icon-item_sub">
                        <span className="text-sub text-main-6 text-small-2">
                          Hello, sign in
                        </span>
                        <span className="h6">Your account</span>
                      </div>
                    </Link>
                  </li>
                  <li className="d-none d-sm-flex">
                    <Link
                      className="nav-icon-item-2 text-black link"
                      href={`/wishlist`}
                    >
                      <i className="icon icon-heart" />
                      <span className="count">
                        {" "}
                        <WishlistLength />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <a
                      className="nav-icon-item-2 text-black link"
                      href="#shoppingCart"
                      data-bs-toggle="offcanvas"
                    >
                      <div className="position-relative d-flex">
                        <i className="icon icon-shopping-cart-simple" />
                        <span className="count">
                          <CartLength />
                        </span>
                      </div>
                      <div className="nav-icon-item_sub d-none d-sm-grid">
                        <span className="text-sub text-main-6 text-small-2">
                          Your cart
                        </span>
                        <span className="h6">
                          <CartTotal />
                        </span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-inner d-none d-xl-block bg-white outline">
        <div className="container-full-2">
          <div className="header-inner_wrap">
            <div className="col-left">
              <CategoryDropdown />
              <span className="br-line type-vertical h-24" />
              <nav className="box-navigation">
                <ul className="box-nav-menu">
                  <Nav />
                </ul>
              </nav>
            </div>
            <div className="col-right">
              <i className="icon icon-gift" />
              <p className="h6 text-black text-line-clamp-1">
                Get a <span className="fw-bold text-primary">15%</span> discount
                code instantly for your first online order!
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
