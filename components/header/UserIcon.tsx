"use client";
import React, { useState } from "react";
import { Link } from '@/i18n/routing';
import { User } from "lucide-react";
import { StoreCustomer } from "@medusajs/types";
import { signout } from "@/data/customer";
import { useTranslations } from "next-intl";

export default function UserIcon({ customer }: { customer: StoreCustomer }) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("UserIcon");

  return (
    <div
      className="position-relative d-flex align-items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={customer ? "/account-page" : "/login"}
        className="p-0 link text-dark"
      >
        <User />
      </Link>

      {/* Dropdown Menu */}
      {isHovered && (
        <div
          className="py-2 bg-white border shadow-lg position-absolute end-0 rounded-3 dropdown-menu-custom"
          style={{ width: "200px", zIndex: 1000, top: "25px" }}
        >
          {/* Arrow/Triangle */}
          <div
            className="bg-white position-absolute border-top border-start"
            style={{
              width: "12px",
              height: "12px",
              top: "-7px",
              right: "10px",
              transform: "rotate(45deg)",
            }}
          ></div>

          {customer ? (
            <>
              <Link
                href="/account-page"
                className="gap-2 px-3 py-2 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small"
              >
                <User size={16} />
                <span>{t("myAccount")}</span>
              </Link>
              <button
                onClick={signout}
                className="gap-2 px-3 py-2 bg-transparent border-0 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small w-100 text-start"
              >
                <User size={16} />
                <span>{t("logout")}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="gap-2 px-3 py-2 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small"
              >
                <User size={16} />
                <span>{t("login")}</span>
              </Link>

              <Link
                href="/login"
                className="gap-2 px-3 py-2 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small"
              >
                <User size={16} />
                <span>{t("register")}</span>
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }
        .dropdown-menu-custom::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 20px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
