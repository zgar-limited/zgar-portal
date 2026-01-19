"use client";

import React from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HttpTypes } from "@medusajs/types";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface OffcanvasSidebarProps {
  customer?: CustomerWithZgarFields | null;
}

export default function OffcanvasSidebar({ customer }: OffcanvasSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/account-page",
      label: "Dashboard",
      iconClass: "icon-circle-four",
    },
    {
      href: "/account-orders",
      label: "Orders",
      iconClass: "icon-box-arrow-down",
    },
    {
      href: "/account-addresses",
      label: "My address",
      iconClass: "icon-address-book",
    },
    {
      href: "/account-setting",
      label: "Setting",
      iconClass: "icon-setting",
    },
    {
      href: "/",
      label: "Log out",
      iconClass: "icon-sign-out",
    },
  ];

  return (
    <div className="offcanvas offcanvas-start canvas-sidebar" id="mbSidebar">
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <span className="title h5 fw-bold">My Account</span>
          <span
            className="icon-close link icon-close-popup"
            data-bs-dismiss="offcanvas"
          />
        </div>
        <div className="canvas-body sidebar-mobile-append sidebar-account">
          <div className="account-author">
            <div className="author_avatar">
              <div className="image">
                <Image
                  className="lazyload imgDash"
                  src="/images/avatar/avatar-4.jpg"
                  alt="Avatar"
                  width={400}
                  height={400}
                />
              </div>
              <div className="btn-change_img box-icon changeImgDash">
                <i className="icon icon-camera" />
              </div>
            </div>
            <h4 className="author_name">
              {customer?.first_name && customer?.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : customer?.first_name || "User"}
            </h4>
            <p className="author_email h6">
              {customer?.email || "user@example.com"}
            </p>
          </div>

          <ul className="my_account-nav">
            {navItems.map(({ href, label, iconClass }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`my-account-nav_item h5 ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <i className={`icon ${iconClass}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
