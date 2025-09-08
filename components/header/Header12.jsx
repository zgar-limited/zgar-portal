import Link from "next/link";
import Image from "next/image";
import React from "react";
import Nav from "./Nav";
import CartLength from "./CartLength";

export default function Header12() {
  return (
    <header className="tf-header style-7 header-fix">
      <div className="container-full">
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
          <div className="col-xl-5 d-none d-xl-block">
            <nav className="box-navigation">
              <ul className="box-nav-menu justify-content-start">
                <Nav />
              </ul>
            </nav>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <div className="d-flex justify-content-center">
              <Link href={`/`} className="logo-site">
                <Image
                  alt="Product"
                  src="/images/logo/logo.svg"
                  width={133}
                  height={53}
                />
              </Link>
            </div>
          </div>
          <div className="col-xl-5 col-md-4 col-3">
            <ul className="nav-icon-list">
              <li className="d-none d-lg-flex">
                <Link className="nav-icon-item link" href={`/login`}>
                  <i className="icon icon-user" />
                </Link>
              </li>
              <li className="d-none d-md-flex">
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
    </header>
  );
}
