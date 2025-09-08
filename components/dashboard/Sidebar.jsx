"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
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
    <div className="sidebar-account sidebar-content-wrap sticky-top">
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
        <h4 className="author_name">Themesflat</h4>
        <p className="author_email h6">support@ochaka.com</p>
      </div>

      <ul className="my-account-nav">
        {navItems.map(({ href, label, iconClass }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`my-account-nav_item h5 ${isActive ? "active" : ""}`}
              >
                <i className={`icon ${iconClass}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
