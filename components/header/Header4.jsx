import Link from "next/link";
import Image from "next/image";
import React from "react";
import Nav from "./Nav";
import CartLength from "./CartLength";
import HeaderProductSearch from "./HeaderProductSearch";

export default function Header4() {
  return (
    <header className="tf-header style-3">
      <div className="header-top">
        <div className="container">
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
            <div className="col-xl-4 d-none d-xl-block">
              <HeaderProductSearch parentClass="form_search-product" />
            </div>
            <div className="col-xl-4 col-md-4 col-6">
              <Link href={`/`} className="logo-site justify-content-center">
                <Image
                  alt="Logo"
                  src="/images/logo/logo.svg"
                  width={133}
                  height={53}
                />
              </Link>
            </div>
            <div className="col-xl-4 col-md-4 col-3">
              <ul className="nav-icon-list">
                <li className="d-none d-lg-flex">
                  <Link className="nav-icon-item link" href={`/login`}>
                    <i className="icon icon-user" />
                  </Link>
                </li>
                <li className="d-none none">
                  <a
                    className="nav-icon-item link"
                    href="#search"
                    data-bs-toggle="modal"
                  >
                    <i className="icon icon-magnifying-glass" />
                  </a>
                </li>
                <li className="d-none d-sm-flex">
                  <Link className="nav-icon-item link" href={`/wishlist`}>
                    <i className="icon icon-heart" />
                  </Link>
                </li>
                <li
                  className="shop-cart"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#shoppingCart"
                >
                  <a
                    className="nav-icon-item link"
                    href="#shoppingCart"
                    data-bs-toggle="offcanvas"
                  >
                    <i className="icon icon-shopping-cart-simple" />
                  </a>
                  <span className="count">
                    <CartLength />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header-inner d-none d-xl-block">
        <div className="container">
          <span className="br-line d-block" />
          <nav className="box-navigation">
            <ul className="box-nav-menu">
              <Nav />
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
