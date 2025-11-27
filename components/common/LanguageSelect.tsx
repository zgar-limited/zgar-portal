"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

const languages = ["English", "繁體中文"];

export default function LanguageSelect({
  placement = "bottom-end",
  textBlack = false,
  textColor = "var(--black)",
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleSelect = (lang) => {
    setSelectedLanguage(lang);
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="p-0 btn btn-link text-decoration-none d-flex align-items-center nav-icon-item"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ color: textBlack ? "black" : textColor }}
      >
        <Globe size={24} strokeWidth={1.5} />
      </button>

      <ul
        className={`dropdown-menu ${
          placement === "bottom-end" ? "dropdown-menu-end" : ""
        }`}
        style={{ minWidth: "auto" }}
      >
        {languages.map((lang, index) => (
          <li key={index}>
            <button
              className={`dropdown-item ${selectedLanguage === lang ? "active" : ""}`}
              type="button"
              onClick={() => handleSelect(lang)}
            >
              {lang}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
