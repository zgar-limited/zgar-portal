"use client";
import React, { useState, useRef, useEffect } from "react";
import Departments from "./Departments";
import { usePathname } from "next/navigation";
import DepartmentsOrganic from "./DepartmentsOrganic";

export default function CategoryDropdown() {
  const [showCategories, setShowCategories] = useState(false);
  const wrapperRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      // if wrapper exists AND click target is not inside it
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="nav-category-wrap main-action-active">
      <div
        className={`btn-nav-drop btn-active ${showCategories ? "active" : ""}`}
        onClick={() => setShowCategories((prev) => !prev)}
      >
        <span className="btn-mobile-menu type-small">
          <span />
        </span>
        <h6 className="name-category fw-semibold">All Departments</h6>
        <i className="icon icon-caret-down" />
      </div>

      <ul
        className={`box-nav-category active-item ${
          showCategories ? "active" : ""
        }`}
      >
        {pathname == "/home-organic" ? <DepartmentsOrganic /> : <Departments />}
      </ul>
    </div>
  );
}
