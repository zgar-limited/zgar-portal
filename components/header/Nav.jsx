import {
  bannerItems,
  blogMenuItems,
  demoItems,
  infoPages,
  productMenuColumns,
  shopPages,
} from "@/data/menu";
import { recentProducts } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Nav() {
  return (
    <>
      <li className="menu-item">
        <a href="/" className="item-link">
          HOME
          {/* <i className="icon icon-caret-down" /> */}
        </a>
        {/* <div className="sub-menu mega-menu mega-home">
          <div className="container">
            <div className="row-demo">
              {demoItems.slice(0, 12).map((item, index) => (
                <div className="demo-item" key={index}>
                  <Link href={item.href} className="demo-img">
                    <Image
                      alt="Demo"
                      src={item.src}
                      width={item.width || 401}
                      height={item.height || 520}
                      className="lazyload"
                    />
                    {item.isNew && (
                      <div className="demo-label">
                        <span>New</span>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={item.href}
                    className={`demo-name ${item.isNew ? "link" : ""}`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="#modalDemo"
                data-bs-toggle="modal"
                className="tf-btn animate-btn"
              >
                View all demos (20)
              </a>
            </div>
          </div>
        </div> */}
      </li>
      <li className="menu-item">
        <a href="/shop" className="item-link">
          PRODUCTS
          {/* <i className="icon icon-caret-down" /> */}
        </a>
        {/* <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row">
              {shopPages.map((col, index) => (
                <div className="col-2" key={index}>
                  <div className="mega-menu-item">
                    <h4 className="menu-heading">{col.heading}</h4>
                    <ul className="sub-menu_list">
                      {col.items.map((item, i) => (
                        <li key={i}>
                          <Link href={item.href} className="sub-menu_link">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="col-6">
                <ul className="list-hor">
                  {bannerItems.map((banner, i) => (
                    <li className="wg-cls hover-img" key={i}>
                      <Link href={banner.href} className="image img-style">
                        <Image
                          src={banner.imgSrc}
                          alt="Collection"
                          className="lazyload"
                          width={672}
                          height={952}
                        />
                      </Link>
                      <div className="cls-content">
                        <h4 className="tag_cls">{banner.tag}</h4>
                        <span className="br-line type-vertical" />
                        <Link href={banner.href} className="tf-btn-line">
                          Shop now
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </li>
      <li className="menu-item">
        <a href="#" className="item-link">
          ABOUT
          {/* <i className="icon icon-caret-down" /> */}
        </a>
      </li>
      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          PARTNERS
          {/* <i className="icon icon-caret-down" /> */}
        </a>
      </li>
      <li className="menu-item position-relative">
        <a href="#" className="item-link">
          CARE
          {/* <i className="icon icon-caret-down" /> */}
        </a>
        {/* <div className="sub-menu">
          <ul className="sub-menu_list">
            {blogMenuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="sub-menu_link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div> */}
      </li>
      <li className="menu-item">
        <a href="/verify-guide" className="item-link">
          AUTHENTICATION
        </a>
      </li>
      <li className="menu-item">
        <a href="#" className="item-link">
          CLUB
        </a>
      </li>
    </>
  );
}
