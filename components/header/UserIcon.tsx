"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserIcon() {
  const { customer, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!customer) {
    return (
      <Link href="/login" className="nav-icon-item link text-dark">
        <User />
      </Link>
    );
  }

  return (
    <div
      className="position-relative d-flex align-items-center h-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href="/account-page" className="nav-icon-item link text-dark">
        <User />
      </Link>

      {/* Dropdown Menu */}
      {isHovered && (
        <div
          className="py-2 bg-white border shadow-lg position-absolute end-0 top-100 rounded-3 dropdown-menu-custom"
          style={{ width: "200px", zIndex: 1000, marginTop: "10px" }}
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

          <div className="px-3 py-2 mb-2 border-bottom">
            <p className="mb-0 small fw-bold text-truncate">
              {customer.first_name || "User"} {customer.last_name || ""}
            </p>
            <p className="mb-0 x-small text-muted text-truncate">
              {customer.email}
            </p>
          </div>

          <Link
            href="/account-page"
            className="gap-2 px-3 py-2 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small"
          >
            <User size={16} />
            <span>My Account</span>
          </Link>
          
          <Link
             href="/account-orders"
             className="gap-2 px-3 py-2 dropdown-item d-flex align-items-center hover-bg-light text-dark text-decoration-none small"
          >
             <FileText size={16} />
             <span>My Orders</span>
          </Link>

          <div className="my-2 border-top"></div>

          <button
            onClick={() => logout()}
            className="gap-2 px-3 py-2 bg-transparent border-0 dropdown-item d-flex align-items-center hover-bg-light text-danger w-100 text-start small"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      
      <style jsx>{`
        .hover-bg-light:hover {
            background-color: #f8f9fa;
        }
        .dropdown-menu-custom::before {
            content: '';
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