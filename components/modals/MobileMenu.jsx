import Link from "next/link";
import Image from "next/image";
import React from "react";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import {
  blogMenuItems,
  demoItems,
  infoPages,
  productMenuColumns,
  shopPages,
} from "@/data/menu";
export default function MobileMenu() {
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span className="icon-close-popup" data-bs-dismiss="offcanvas">
        <i className="icon-close" />
      </span>
      <div className="canvas-header">
        <p className="text-logo-mb">Zgar</p>
        {/* <Link href={`/login`} className="tf-btn type-small style-2">
          Login
          <i className="icon icon-user" />
        </Link> */}
        <span className="br-line" />
      </div>
      <div className="canvas-body">
        <div className="mb-content-top">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">
            <li className="nav-mb-item">
              <a
                href="/"
                className="mb-menu-link collapsed"
                // data-bs-toggle="collapse"
                // aria-expanded="false"
                // aria-controls="dropdown-menu-0"
              >
                <span>HOME</span>
              </a>
            </li>
            <li className="nav-mb-item">
              <a
                href="/shop"
                className="mb-menu-link collapsed"
                // data-bs-toggle="collapse"
                // aria-expanded="false"
                // aria-controls="dropdown-menu-0"
              >
                <span>PRODUCTS</span>
              </a>
            </li>
            <li className="nav-mb-item">
              <a
                href="/verify-guide"
                className="mb-menu-link collapsed"
                // data-bs-toggle="collapse"
                // aria-expanded="false"
                // aria-controls="dropdown-menu-0"
              >
                <span>AUTHENTICATION</span>
              </a>
            </li>
            <li className="nav-mb-item">
              <a href="/view-cart" className="mb-menu-link collapsed">
                <span>VIEW CART</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="group-btn">
          <Link href={`/shop`} className="tf-btn type-small style-2">
            PRODUCTS
            {/* <i className="icon icon-heart" /> */}
          </Link>
        </div>

        <div className="flow-us-wrap">
          <h5 className="title">Follow us on</h5>
          <ul className="tf-social-icon">
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="social-facebook"
              >
                <span className="icon">
                  <i className="icon-fb" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="social-instagram"
              >
                <span className="icon">
                  <i className="icon-instagram-logo" />
                </span>
              </a>
            </li>
            <li>
              <a href="https://x.com/" target="_blank" className="social-x">
                <span className="icon">
                  <i className="icon-x" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                className="social-tiktok"
              >
                <span className="icon">
                  <i className="icon-tiktok" />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="canvas-footer">
        {/* <div className="tf-currencies">
          <CurrencySelect textBlack />
        </div> */}
        <span className="br-line" />
        <div className="tf-languages">
          <LanguageSelect textBlack />
        </div>
      </div>
    </div>
  );
}
