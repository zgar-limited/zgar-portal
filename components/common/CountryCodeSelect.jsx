"use client";

import React, { useState, useEffect, useRef } from "react";

const countryCodes = [
  { code: "+86", country: "CN", label: "China" },
  { code: "+1", country: "US", label: "USA" },
  { code: "+44", country: "UK", label: "UK" },
  { code: "+81", country: "JP", label: "Japan" },
  { code: "+49", country: "DE", label: "Germany" },
  { code: "+33", country: "FR", label: "France" },
  { code: "+7", country: "RU", label: "Russia" },
  { code: "+91", country: "IN", label: "India" },
  { code: "+61", country: "AU", label: "Australia" },
  { code: "+82", country: "KR", label: "Korea" },
];

export default function CountryCodeSelect({ onSelect, initialCode = "+86" }) {
  const [selected, setSelected] = useState(
    countryCodes.find((c) => c.code === initialCode) || countryCodes[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (onSelect) {
      onSelect(selected.code);
    }
  }, [selected, onSelect]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="country-code-select" ref={dropdownRef} style={{ position: "relative", minWidth: "100px" }}>
      <div
        className="selected-code"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 12px",
          border: "1px solid var(--line)",
          borderRadius: "8px", // Rounded corners
          cursor: "pointer",
          backgroundColor: "var(--white)",
          height: "100%",
        }}
      >
        <span style={{ fontWeight: "500" }}>{selected.code}</span>
        <i className={`icon-arrow-down ${isOpen ? "rotate-180" : ""}`} style={{ fontSize: "10px", marginLeft: "8px", transition: "transform 0.2s" }}>▼</i>
      </div>

      {isOpen && (
        <ul
          className="dropdown-list"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            minWidth: "160px",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 100,
            marginTop: "4px",
            padding: "0",
            listStyle: "none",
          }}
        >
          {countryCodes.map((item) => (
            <li
              key={item.country}
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--line-light)",
                backgroundColor: selected.code === item.code ? "var(--bg-light)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected.code === item.code ? "var(--bg-light)" : "transparent"}
            >
              <span>{item.label}</span>
              <span style={{ color: "var(--text-light)", fontSize: "0.9em" }}>{item.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}